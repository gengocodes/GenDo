'use client'

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

interface RegisterProps {
  onToggleForm: () => void;
}

const Register: React.FC<RegisterProps> = ({ onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setPasswordError('');
    setSuccessMessage('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    // Validate name
    if (name.trim().length < 2) {
      setPasswordError('Name must be at least 2 characters long');
      return;
    }
    
    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setPasswordError('Please enter a valid email address');
      return;
    }
    
    try {
      await register(name, email, password);
      setSuccessMessage('Registration successful! Please login to continue.');
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register for GenDo</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {passwordError && <div className="error-message">{passwordError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-black"
            placeholder="Enter your full name"
            minLength={2}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black"
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black"
            placeholder="Enter your password (min 6 characters)"
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="text-black"
            placeholder="Confirm your password"
            minLength={6}
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="auth-toggle">
        Already have an account?{' '}
        <button onClick={onToggleForm} className="toggle-button">
          Login
        </button>
      </p>
    </div>
  );
};

export default Register; 