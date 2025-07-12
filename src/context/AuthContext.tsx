'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configure axios to include credentials (cookies)
axios.defaults.withCredentials = true;

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 409) {
    return 'Email is already taken. Please use a different email or try logging in.';
  }
  
  if (error.response?.status === 401) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (error.response?.status === 400) {
    return 'Please check your input and try again.';
  }
  
  if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (err) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      // After successful login, check auth status to get user data
      await checkAuthStatus();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Login error:', err);
      // Don't throw the error, just set the error state
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth', {
        name,
        email,
        password
      });
      
      // Registration successful but no token - user needs to login
      setError(null);
      return response.data.message || 'Registration successful. Please login to continue.';
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Registration error:', err);
      throw err; // Still throw for registration to handle in component
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout API fails, clear local state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 