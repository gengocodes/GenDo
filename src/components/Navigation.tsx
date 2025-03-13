import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span role="img" aria-label="check mark">✓</span>
        Gendo
      </Link>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger"></span>
      </button>

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <button 
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }} 
              className="nav-link" 
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 