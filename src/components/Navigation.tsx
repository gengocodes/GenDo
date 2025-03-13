import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span role="img" aria-label="check mark">✓</span>
        Gendo
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/about" className={`nav-link ${isActive('/about')}`}>
          About
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <button onClick={logout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${isActive('/login')}`}>
              Login
            </Link>
            <Link to="/register" className={`nav-link ${isActive('/register')}`}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 