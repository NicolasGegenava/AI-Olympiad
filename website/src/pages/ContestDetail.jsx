import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import contests from '../data/contests';
import './ContestDetail.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop';

const ContestDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contest = contests.find((c) => c.slug === slug);

  if (!contest) {
    return (
      <div className="page-wrapper container cd-not-found">
        <h1 className="cd-not-found__title">Contest not found</h1>
        <p className="cd-not-found__sub">
          The contest "{slug}" doesn't exist yet.
        </p>
        <button
          className="cd-back-btn"
          onClick={() => navigate('/contests')}
        >
          ← Back to Contests
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper container">

      {/* Back */}
      <button
        className="cd-back-btn"
        onClick={() => navigate('/contests')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Contests
      </button>

      {/* Hero */}
      <div className="cd-hero">
        <img
          src={contest.image}
          alt={contest.name}
          className="cd-hero__img"
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />

        <div className="cd-hero__overlay">
          <span className="cd-hero__category">{contest.category}</span>
          <h1 className="cd-hero__title">{contest.name}</h1>
          {contest.year && (
            <span className="cd-hero__year">{contest.year}</span>
          )}
        </div>
      </div>

      {/* Tasks Grid or Coming soon */}
      {contest.tasks && contest.tasks.length > 0 ? (
        <div className="cd-tasks">
          <h2 className="cd-tasks__heading">Tasks & Problem Statements</h2>
          <div className="cd-tasks__grid">
            {contest.tasks.map((task) => (
              <div
                key={task.id} 
                className="cd-task-card"
              >
                <div className="cd-task-card__body">
                  <div className="cd-task__category-wrapper">
                    <span className="cd-task__category">{task.category}</span>
                  </div>
                  <h3 className="cd-task__name">{task.name}</h3>
                  <div className="cd-task__actions">
                    <Link to={`/contests/${contest.slug}/task/${task.id}/problem`} className="cd-btn-outline">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      Problem Statement
                    </Link>
                    <Link to={`/contests/${contest.slug}/task/${task.id}/solution`} className="cd-btn-solid">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      View Solution
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="cd-coming-soon">
          <div className="cd-coming-soon__icon">🚀</div>
          <h2 className="cd-coming-soon__title">
            Solutions Coming Soon
          </h2>
          <p className="cd-coming-soon__text">
            We're working on a comprehensive walkthrough of every problem from{" "}
            <strong>{contest.name}</strong>.
            Check back soon!
          </p>
        </div>
      )}

    </div>
  );
};

export default ContestDetail;