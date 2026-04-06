import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contests from '../data/contests';
import './ContestDetail.css';

const ContestDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contest = contests.find((c) => c.slug === slug);

  if (!contest) {
    return (
      <div className="page-wrapper container cd-not-found">
        <h1 className="cd-not-found__title">Contest not found</h1>
        <p className="cd-not-found__sub">The contest "{slug}" doesn't exist yet.</p>
        <button className="cd-back-btn" onClick={() => navigate('/contests')}>← Back to Contests</button>
      </div>
    );
  }

  return (
    <div className="page-wrapper container">

      {/* Back link */}
      <button className="cd-back-btn" onClick={() => navigate('/contests')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Contests
      </button>

      {/* Hero */}
      <div className="cd-hero">
        <img
          src={contest.image}
          alt={contest.name}
          className="cd-hero__img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="cd-hero__overlay">
          <span className="cd-hero__category">{contest.category}</span>
          <h1 className="cd-hero__title">{contest.name}</h1>
          {contest.year && <span className="cd-hero__year">{contest.year}</span>}
        </div>
      </div>

      {/* Coming soon body */}
      <div className="cd-coming-soon">
        <div className="cd-coming-soon__icon">🚀</div>
        <h2 className="cd-coming-soon__title">Solutions Coming Soon</h2>
        <p className="cd-coming-soon__text">
          We're working on a comprehensive walkthrough of every problem from <strong>{contest.name}</strong>.
          Check back soon!
        </p>
      </div>

    </div>
  );
};

export default ContestDetail;
