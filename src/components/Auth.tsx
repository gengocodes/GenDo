'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Auth: React.FC = () => {
  const router = useRouter();
  const { login, register, loading, error: authError, isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (isRegistering) {
        await register(formData.name, formData.email, formData.password);
        // Registration successful - switch to login mode
        setIsRegistering(false);
        setFormData({
          name: "",
          email: formData.email, // Keep email for convenience
          password: ""
        });
        setSuccessMessage("Registration successful! Please login with your credentials.");
        setError(null);
      } else {
        const loginSuccess = await login(formData.email, formData.password);
        // If login was successful, redirect to dashboard
        if (loginSuccess) {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      // Handle registration errors
      if (err.response?.status === 409) {
        setError("Email is already taken. Please use a different email or try logging in.");
      } else if (err.response?.status === 400) {
        setError("Please check your input and try again.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
      }
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setSuccessMessage(null);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  // Show auth error from context if available
  const displayError = authError || error;

  return (
    <div className="auth-section">
      <button className="back-button" onClick={() => router.push("/")}>
        ← Back to Home
      </button>
      <div className="auth-form-container">
        <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
        <p className="auth-subtitle">
          {isRegistering
            ? "Create your account to start managing tasks efficiently"
            : "Sign in to continue managing your tasks"}
        </p>

        {displayError && <div className="error-message">{displayError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={isRegistering}
                className="text-black"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-black"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-black"
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading 
              ? (isRegistering ? "Creating Account..." : "Signing In...") 
              : (isRegistering ? "Create Account" : "Sign In")
            }
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>
          <button className="toggle-button" onClick={toggleMode}>
            {isRegistering ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
