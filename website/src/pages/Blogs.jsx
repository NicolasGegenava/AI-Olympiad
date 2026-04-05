import React from 'react';
import { FileText } from 'lucide-react';

const Blogs = () => {
  return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
      <FileText size={64} style={{ color: 'var(--secondary)', margin: '0 auto 2rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI Blogs</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
        Read insightful articles about AI Olympiad Problem Solutions and Research Papers
      </p>
    </div>
  );
};

export default Blogs;
