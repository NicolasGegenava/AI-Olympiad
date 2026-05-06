import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Loader2, AlertCircle, Search, ExternalLink, ArrowUpDown } from 'lucide-react';
import './Spreadsheet.css';

const getCategoryColor = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('computer vision') || cat.includes('cv')) return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' }; // Blue
  if (cat.includes('natural language') || cat.includes('nlp')) return { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' }; // Green
  if (cat.includes('deep learning') || cat.includes('dl')) return { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' }; // Purple
  if (cat.includes('machine learning') || cat.includes('ml')) return { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' }; // Orange
  if (cat.includes('reinforcement learning') || cat.includes('rl')) return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' }; // Red
  return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' }; // Slate
};

const getDifficultyColor = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return { bg: '#f1f5f9', text: '#475569' };
  if (num <= 3) return { bg: '#dcfce7', text: '#166534' }; // Green
  if (num <= 6) return { bg: '#fef08a', text: '#854d0e' }; // Yellow
  if (num <= 8) return { bg: '#fed7aa', text: '#9a3412' }; // Orange
  return { bg: '#fecaca', text: '#991b1b' }; // Red
};

const getInsightfulDisplay = (val) => {
  const num = parseInt(val, 10);
  if (num === 0) return { label: '🟥 Weak', bg: '#fef2f2', text: '#991b1b', border: '#fecaca' };
  if (num === 1) return { label: '🟨 Modest', bg: '#fefce8', text: '#854d0e', border: '#fef08a' };
  if (num === 2) return { label: '🟩 Very Insightful', bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' };
  if (num === 3) return { label: '🟪 Legendary', bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' };
  return { label: val || '-', bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
};

const LinkButton = ({ href, label }) => {
  if (!href) return <span className="empty-cell">-</span>;
  const isLong = href.length > 15;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="link-button">
      {isLong ? <><ExternalLink size={14} /> <span>{label}</span></> : href}
    </a>
  );
};

const Spreadsheet = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchSheetData = () => {
      try {
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/16LO-nuY7rLx3Ju5kcO8OxWC22-kLSA8mcPO8gMz_rXA/export?format=csv&gid=0';
        
        Papa.parse(sheetUrl, {
          download: true,
          header: false,
          complete: (results) => {
            const rows = results.data;
            if (rows && rows.length > 0) {
              // Row 0: Headers
              // Row 1: Descriptions (we skip this)
              // Row 2+: Actual data
              
              const filteredRows = rows.map(row => row.slice(0, 9)); // Only grab first 9 columns A-I
              const actualDataRows = filteredRows.slice(2).filter(row => row.some(cell => cell && cell.toString().trim() !== ''));
              
              const parsedData = actualDataRows.map(row => ({
                contest: row[0] || '',
                problem: row[1] || '',
                category: row[2] || '',
                topic: row[3] || '',
                insightful: row[4] || '',
                difficulty: row[5] || '',
                link: row[7] || '', // Skipping 6 (To-do)
                solution: row[8] || ''
              }));
              
              setData(parsedData);
            }
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError('Failed to load spreadsheet data. Please try again later.');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = useMemo(() => {
    let filtered = data;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = data.filter(row => 
        row.contest.toLowerCase().includes(term) || 
        row.problem.toLowerCase().includes(term)
      );
    }

    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        // Parse numbers for sorting
        if (sortConfig.key === 'difficulty' || sortConfig.key === 'insightful') {
           valA = parseFloat(valA) || 0;
           valB = parseFloat(valB) || 0;
        } else {
           valA = valA.toString().toLowerCase();
           valB = valB.toString().toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [data, searchTerm, sortConfig]);

  if (loading) {
    return (
      <div className="spreadsheet-page">
        <div className="spreadsheet-container loading">
          <Loader2 className="spinner" size={48} />
          <p>Loading real-time results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spreadsheet-page">
        <div className="spreadsheet-container error">
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '10px', color: '#0f172a' }}>Oops! Something went wrong.</h2>
          <p style={{ color: '#64748b' }}>{error}</p>
        </div>
      </div>
    );
  }

  const SortHeader = ({ label, sortKey }) => (
    <th onClick={() => handleSort(sortKey)} className="sortable-header">
      <div className="header-content-inner">
        {label}
        <ArrowUpDown size={14} className={`sort-icon ${sortConfig.key === sortKey ? 'active' : ''}`} />
      </div>
    </th>
  );

  return (
    <div className="spreadsheet-page">
      <div className="spreadsheet-container">
        <header className="spreadsheet-header">
          <div className="header-left">
            <h1 className="gradient-text">Problem Spreadsheet</h1>
            <p className="subtitle">Real-time updates directly from the official evaluation spreadsheet.</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by Contest or Problem..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              Live Sync
            </div>
          </div>
        </header>

        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <SortHeader label="Contest" sortKey="contest" />
                <SortHeader label="Problem" sortKey="problem" />
                <SortHeader label="Category" sortKey="category" />
                <th>Topic</th>
                <SortHeader label="Insightful" sortKey="insightful" />
                <SortHeader label="Difficulty" sortKey="difficulty" />
                <th>Link</th>
                <th>Solution</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((row, rowIndex) => {
                const catStyles = getCategoryColor(row.category);
                const diffStyles = getDifficultyColor(row.difficulty);
                const insightStyles = getInsightfulDisplay(row.insightful);
                
                return (
                  <tr key={rowIndex}>
                    <td className="fw-600">{row.contest}</td>
                    <td className="fw-700 problem-name">{row.problem}</td>
                    <td>
                      {row.category ? (
                        <span className="pill" style={{ backgroundColor: catStyles.bg, color: catStyles.text, borderColor: catStyles.border }}>
                          {row.category}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="topic-cell" title={row.topic}>{row.topic || '-'}</td>
                    <td className="insightful-cell">
                      {row.insightful !== '' && row.insightful !== undefined ? (
                        <span className="pill" style={{ backgroundColor: insightStyles.bg, color: insightStyles.text, borderColor: insightStyles.border }}>
                          {insightStyles.label}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      {row.difficulty ? (
                        <span className="difficulty-badge" style={{ backgroundColor: diffStyles.bg, color: diffStyles.text }}>
                          {row.difficulty}
                        </span>
                      ) : '-'}
                    </td>
                    <td><LinkButton href={row.link} label="View Link" /></td>
                    <td><LinkButton href={row.solution} label="View Solution" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sortedAndFilteredData.length === 0 && (
            <div className="empty-state">
              No problems found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
