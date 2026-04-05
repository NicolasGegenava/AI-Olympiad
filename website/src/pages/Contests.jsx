import React from 'react';
import './Contests.css';
import heroImageFallback from '../../../Research Papers/assets/contests.jpg';

const Contests = () => {
  return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
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
          <h1 className="hero-title">Olympiad/Contest Solutions</h1>
          <p className="hero-subtitle">Every solution to international and national AI olympiad problems in one place</p>
        </div>
      </div>
    </div>
  );
};

export default Contests;
