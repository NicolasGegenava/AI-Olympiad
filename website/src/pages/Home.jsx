import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';

const STATS = [
  { value: '4+', label: 'Research Papers' },
  { value: '6+', label: 'AI Contests' },
  { value: '100%', label: 'Free Access' },
];

const Home = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger stagger animation after paint
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`home-wrapper ${visible ? 'home-visible' : ''}`}>
      <div className="home-inner container">

        <div className="home-eyebrow">AI Olympiad</div>

        <h1 className="home-heading">
          Where serious AI<br />learners come to grow.
        </h1>

        <p className="home-sub">
          Study past contest solutions, read breakdowns of field-defining research,
          and find everything in one place — built for people who want to actually
          understand the work.
        </p>

        <div className="home-actions">
          <Link to="/papers">
            <button className="btn-primary">
              Browse Research <ArrowRight size={15} />
            </button>
          </Link>
          <Link to="/contests">
            <button className="btn-secondary">
              View Solutions
            </button>
          </Link>
        </div>

        <div className="home-stats">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
