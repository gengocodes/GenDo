import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Settings.css';

const API_BASE_URL = '/api';

interface ConnectedAccount {
  provider: string;
  connected: boolean;
  email?: string;
}

export const Settings: React.FC = () => {
  return (
    <div className="dashboard" style={{ minHeight: '100vh', paddingTop: '75px', background: '#d6d6d6' }}>
      <div className="dashboard-content">
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          margin: '2rem auto',
          maxWidth: '600px',
        }}>
          <h2 style={{ color: '#e53935', fontWeight: 700, fontSize: '2rem', textAlign: 'center', margin: 0 }}>Coming Soon</h2>
        </div>
      </div>
    </div>
  );
}; 