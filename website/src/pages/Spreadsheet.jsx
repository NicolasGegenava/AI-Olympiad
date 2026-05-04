import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Loader2, AlertCircle } from 'lucide-react';
import './Spreadsheet.css';

const Spreadsheet = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              // Extract only columns A-I (indices 0 to 8)
              const filteredRows = rows.map(row => row.slice(0, 9));
              
              // First row is usually headers
              setHeaders(filteredRows[0] || []);
              
              // The rest is data, filter out empty rows at the end if any
              const actualData = filteredRows.slice(1).filter(row => row.some(cell => cell && cell.toString().trim() !== ''));
              setData(actualData);
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

  return (
    <div className="spreadsheet-page">
      <div className="spreadsheet-container">
        <header className="spreadsheet-header">
          <div className="header-content">
            <h1 className="gradient-text">Live Results</h1>
            <p className="subtitle">Real-time updates directly from the official evaluation spreadsheet.</p>
          </div>
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            Live Sync
          </div>
        </header>

        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="empty-state">
              No data available in this spreadsheet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
