import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <NavLink to="/" className="nav-logo">
          AI Olympiad
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/contests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Contests
          </NavLink>
          <NavLink to="/papers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Research Papers
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Blogs
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
