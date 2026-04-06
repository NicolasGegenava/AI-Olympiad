import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './ResearchPapers.css';
import FilterDropdown from '../components/FilterDropdown';

import defaultPapersData from '../../../Research Papers/list.json';
import heroImageFallback from '../../../Research Papers/assets/image.png';

const PAPERS_PER_PAGE = 20;
const ALL_CATEGORIES  = ['All', ...Array.from(new Set(defaultPapersData.map(p => p.category).filter(Boolean))).sort()];

const ResearchPapers = () => {
  const [searchTerm,     setSearchTerm]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [papers]                            = useState(defaultPapersData || []);
  const [expandedIndex,  setExpandedIndex]  = useState(null);
  const [currentPage,    setCurrentPage]    = useState(1);

  const filteredPapers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return papers.filter((paper) => {
      const matchSearch =
        !q ||
        paper.title.toLowerCase().includes(q) ||
        paper.author.toLowerCase().includes(q) ||
        (paper.category && paper.category.toLowerCase().includes(q)) ||
        paper.summary.toLowerCase().includes(q) ||
        (paper.problem && paper.problem.toLowerCase().includes(q)) ||
        (paper['ELI5 problem'] && paper['ELI5 problem'].toLowerCase().includes(q));
      const matchCat = activeCategory === 'All' || paper.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [papers, searchTerm, activeCategory]);

  const totalPages      = Math.ceil(filteredPapers.length / PAPERS_PER_PAGE);
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * PAPERS_PER_PAGE,
    currentPage * PAPERS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    setExpandedIndex(null);
  }, [searchTerm, activeCategory]);

  const toggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);

  const goToPage = (page) => {
    setCurrentPage(page);
    setExpandedIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages);
    } else {
      pages.push(1, '...', currentPage-1, currentPage, currentPage+1, '...', totalPages);
    }
    return pages;
  };

  const hasActiveFilters = searchTerm || activeCategory !== 'All';
  const clearAll = () => { setSearchTerm(''); setActiveCategory('All'); };

  return (
    <div className="page-wrapper container">

      <div className="hero-image-container">
        <img
          src={heroImageFallback}
          alt="Research Papers"
          className="hero-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Research Archive</h1>
          <p className="hero-subtitle">Distilling complex AI breakthroughs into clear insights</p>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────── */}
      <div className="papers-filterbar">
        {/* Search */}
        <div className="pfb-search">
          <svg className="pfb-search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            id="papers-search"
            type="text"
            className="pfb-search__input"
            placeholder="Search by title, author, or topic…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="pfb-search__clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dropdown + meta */}
        <div className="pfb-controls">
          <div className="pfb-dropdowns">
            <FilterDropdown
              label="Category"
              options={ALL_CATEGORIES}
              value={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          <div className="pfb-results">
            <div className="res-badge">
              <span className="res-badge__label">Found</span>
              <span className="res-badge__count">
                <strong>{filteredPapers.length}</strong>
                <span className="res-badge__sep">/</span>
                {papers.length}
              </span>
            </div>
            {hasActiveFilters && (
              <button className="pfb-clear-text" onClick={clearAll}>
                <X size={14} /> <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ───────────────────────────────── */}
      {filteredPapers.length === 0 ? (
        <div className="no-results">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <p>No papers match your filters.</p>
          <button className="pfb-clear-all" onClick={clearAll} style={{ marginTop: '0.75rem' }}>
            <X size={12} /> Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="papers-list-container">
            {paginatedPapers.map((paper, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div key={index} className={`paper-list-item ${isExpanded ? 'expanded' : ''}`}>
                  <div className="paper-header-row" onClick={() => toggleExpand(index)}>
                    <div className="paper-main-info">
                      <div className="paper-title-row">
                        <h2 className="paper-list-title">{paper.title}</h2>
                        {paper.category && <span className="paper-category">{paper.category}</span>}
                      </div>
                      <span className="paper-list-author">{paper.author}</span>
                    </div>
                    <button className={`expand-btn ${isExpanded ? 'rotated' : ''}`}>
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="paper-details-content">
                      <div className="paper-insight-split">
                        <div className="insight-left">
                          <div className="detail-block">
                            <h4 className="detail-label">Abstract</h4>
                            <p className="detail-text">{paper.summary}</p>
                          </div>
                          {paper.problem && (
                            <div className="detail-block">
                              <h4 className="detail-label">Problem</h4>
                              <p className="detail-text">{paper.problem}</p>
                            </div>
                          )}
                        </div>
                        <div className="insight-right">
                          <div className="eli5-block">
                            <h4 className="detail-label eli5-label">ELI5</h4>
                            <p className="eli5-text">{paper['ELI5 problem']}</p>
                          </div>
                        </div>
                      </div>
                      <div className="paper-footer">
                        <a href={paper.link} target="_blank" rel="noopener noreferrer" className="read-paper-btn">
                          Read paper <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Page navigation">
              <button
                className="page-btn page-btn--arrow"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((num, i) =>
                num === '...' ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={num}
                    className={`page-btn ${currentPage === num ? 'page-btn--active' : ''}`}
                    onClick={() => goToPage(num)}
                    aria-label={`Go to page ${num}`}
                    aria-current={currentPage === num ? 'page' : undefined}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                className="page-btn page-btn--arrow"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ResearchPapers;
