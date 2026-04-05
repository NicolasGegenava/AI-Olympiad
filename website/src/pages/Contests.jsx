import React from 'react';
import { Trophy } from 'lucide-react';

const Contests = () => {
  return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
      <Trophy size={64} style={{ color: 'var(--primary)', margin: '0 auto 2rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Contest Solutions</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
        Review detailed solutions, official editorials, and community approaches for past AI Olympiad problems. Elevate your problem-solving skills!
      </p>
    </div>
  );
};

export default Contests;
