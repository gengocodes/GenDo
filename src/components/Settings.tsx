import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Settings.css';

const API_BASE_URL = process.env.RAILWAY_STATIC_URL || 'http://localhost:5000/api';

interface ConnectedAccount {
  provider: string;
  connected: boolean;
  email?: string;
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { provider: 'Google Calendar', connected: false }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnectedAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkConnectedAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/connected-accounts`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAccounts(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch connected accounts:', error);
      setError('Failed to fetch connected accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/auth/${provider.toLowerCase()}/connect`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      const authWindow = window.open(
        response.data.authUrl,
        'Connect Account',
        'width=600,height=700'
      );

      if (!authWindow) {
        throw new Error('Popup blocked. Please enable popups for this site.');
      }

      // Handle the OAuth callback
      const handleMessage = (event: MessageEvent) => {
        // Verify origin
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'oauth-callback') {
          if (event.data.success) {
            checkConnectedAccounts();
          } else {
            setError('Failed to connect account. Please try again.');
          }
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup if window is closed
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);

    } catch (error) {
      console.error(`Failed to connect ${provider}:`, error);
      setError(error instanceof Error ? error.message : 'Failed to connect account');
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      setError(null);
      await axios.post(
        `${API_BASE_URL}/auth/${provider.toLowerCase()}/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      await checkConnectedAccounts();
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
      setError('Failed to disconnect account. Please try again.');
    }
  };

  if (loading) {
    return <div className="settings-loading">Loading...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <section className="connected-accounts">
        <h3>Connected Accounts</h3>
        <div className="accounts-list">
          {accounts.map(account => (
            <div key={account.provider} className="account-item">
              <div className="account-info">
                <h4>{account.provider}</h4>
                {account.connected && account.email && (
                  <p className="account-email">{account.email}</p>
                )}
                <p className="connection-status">
                  Status: <span className={account.connected ? 'connected' : 'disconnected'}>
                    {account.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </p>
              </div>
              <button
                className={account.connected ? 'disconnect-btn' : 'connect-btn'}
                onClick={() => account.connected 
                  ? handleDisconnect(account.provider)
                  : handleConnect(account.provider)
                }
              >
                {account.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}; 