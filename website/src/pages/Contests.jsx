import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import './Contests.css';
import FilterDropdown from '../components/FilterDropdown';
import contests from '../data/contests';
import heroImageFallback from '../../../Research Papers/assets/contests.jpg';

const ALL_YEARS      = ['All', ...Array.from(new Set(contests.map(c => c.year))).sort((a,b) => b-a)];
const ALL_CATEGORIES = ['All', ...Array.from(new Set(contests.map(c => c.category))).sort()];

const Contests = () => {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState('');
  const [year,     setYear]     = useState('All');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return contests.filter(c => {
      const matchSearch   = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      const matchYear     = year     === 'All' || c.year === year;
      const matchCategory = category === 'All' || c.category === category;
      return matchSearch && matchYear && matchCategory;
    });
  }, [search, year, category]);

  const hasActiveFilters = search || year !== 'All' || category !== 'All';
  const clearAll = () => { setSearch(''); setYear('All'); setCategory('All'); };

  return (
    <div className="page-wrapper container">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="contests-hero">
        <img
          src={heroImageFallback}
          alt="Contests"
          className="contests-hero__img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="contests-hero__overlay">
          <h1 className="contests-hero__title">Olympiad Solutions</h1>
          <p className="contests-hero__subtitle">
            Every solution to international and national AI olympiad problems in one place
          </p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────── */}
      <div className="contests-filterbar">
        {/* Search */}
        <div className="cfb-search">
          <svg className="cfb-search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            id="contest-search"
            type="text"
            className="cfb-search__input"
            placeholder="Search contests…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="cfb-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dropdowns + meta */}
        <div className="cfb-controls">
          <div className="cfb-dropdowns">
            <FilterDropdown
              label="Year"
              options={ALL_YEARS}
              value={year}
              onChange={setYear}
            />
            <FilterDropdown
              label="Category"
              options={ALL_CATEGORIES}
              value={category}
              onChange={setCategory}
            />
          </div>

          <div className="cfb-results">
            <div className="res-badge">
              <span className="res-badge__label">Showing</span>
              <span className="res-badge__count">
                <strong>{filtered.length}</strong>
                <span className="res-badge__sep">/</span>
                {contests.length}
              </span>
            </div>
            {hasActiveFilters && (
              <button className="cfb-clear-text" onClick={clearAll}>
                <X size={14} /> <span>Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Section header ───────────────────────────── */}
      <div className="contests-section-header">
        <h2 className="contests-section-title">Browse Contests</h2>
        <span className="contests-section-count">{filtered.length} contests</span>
      </div>

      {/* ── Grid / empty ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="contests-empty">
          <div className="contests-empty__icon">🔍</div>
          <p className="contests-empty__text">No contests match your filters.</p>
          <button className="cfb-clear-all" onClick={clearAll}><X size={12} /> Clear filters</button>
        </div>
      ) : (
        <div className="contests-grid">
          {filtered.map((contest) => (
            <article
              key={contest.slug}
              className="contest-card"
              onClick={() => navigate(`/contests/${contest.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/contests/${contest.slug}`)}
              aria-label={`View ${contest.name} solutions`}
            >
              <div className="contest-card__image-wrap">
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="contest-card__image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                {contest.year && <span className="contest-card__year">{contest.year}</span>}
                <div className="contest-card__gradient" />
              </div>
              <div className="contest-card__body">
                <span className="contest-card__category">{contest.category}</span>
                <h3 className="contest-card__name">{contest.name}</h3>
                <p className="contest-card__desc">{contest.description}</p>
                <div className="contest-card__cta">
                  <span>View Solutions</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contests;
