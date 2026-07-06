import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : 'bg-transparent'}`} style={{ transition: 'all 0.3s ease' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-cpu me-2" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
          <span className="accent-font fw-bold" style={{ fontSize: '1.5rem' }}>Alchemist</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
            <li className="nav-item"><a className="nav-link" href="#how-it-works">How it Works</a></li>
            <li className="nav-item"><a className="nav-link" href="#quick-start">Quick Start</a></li>
            <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Sign In</Link></li>
            <li className="nav-item"><Link className="btn btn-primary ms-2" to="/register">Get Started</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
