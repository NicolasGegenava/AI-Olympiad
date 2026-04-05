import React, { useState } from 'react';
import { Search, ExternalLink, ChevronDown } from 'lucide-react';
import './ResearchPapers.css';

import defaultPapersData from '../../../Research Papers/list.json';
import heroImageFallback from '../../../Research Papers/assets/image.png';

const ResearchPapers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [papers] = useState(defaultPapersData || []);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paper.category && paper.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paper.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paper.problem && paper.problem.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (paper["ELI5 problem"] && paper["ELI5 problem"].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="page-wrapper container">

      <div className="hero-image-container">
        <img
          src={heroImageFallback}
          alt="Research Papers"
          className="hero-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop";
          }}
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Research Archive</h1>
          <p className="hero-subtitle">Distilling complex AI breakthroughs into clear insights</p>
        </div>
      </div>

      <div className="papers-header">
        <p className="papers-count">
          <strong>{filteredPapers.length}</strong> of {papers.length} papers
        </p>
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPapers.length === 0 ? (
        <div className="no-results">
          <p>No papers found for "{searchTerm}"</p>
        </div>
      ) : (
        <div className="papers-list-container">
          {filteredPapers.map((paper, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className={`paper-list-item ${isExpanded ? 'expanded' : ''}`}
              >
                <div className="paper-header-row" onClick={() => toggleExpand(index)}>
                  <div className="paper-main-info">
                    <div className="paper-title-row">
                      <h2 className="paper-list-title">{paper.title}</h2>
                      {paper.category && (
                        <span className="paper-category">{paper.category}</span>
                      )}
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
                          <p className="eli5-text">{paper["ELI5 problem"]}</p>
                        </div>
                      </div>

                    </div>

                    <div className="paper-footer">
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-paper-btn"
                      >
                        Read paper <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResearchPapers;
