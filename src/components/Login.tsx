'use client'

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

interface LoginProps {
  onToggleForm: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationError("");
    
    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    // Validate password
    if (!password || password.length < 1) {
      setValidationError('Please enter your password');
      return;
    }
    
    await login(email, password);
  };

  return (
    <div className="auth-form-container">
      <h2>Login to GenDo</h2>
      {error && <div className="error-message">{error}</div>}
      {validationError && <div className="error-message">{validationError}</div>}
      <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="auth-toggle">
        Don&apos;t have an account?{" "}
        <button onClick={onToggleForm} className="toggle-button">
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
