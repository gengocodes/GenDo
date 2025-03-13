import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Settings.css';

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

  useEffect(() => {
    checkConnectedAccounts();
  }, []);

  const checkConnectedAccounts = async () => {
    try {
      const response = await axios.get('/api/auth/connected-accounts', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to fetch connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      const response = await axios.get(`/api/auth/${provider.toLowerCase()}/connect`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      // Open the OAuth consent screen in a new window
      const authWindow = window.open(
        response.data.authUrl,
        'Connect Account',
        'width=600,height=700'
      );

      // Listen for the OAuth callback
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'oauth-callback') {
          if (authWindow) authWindow.close();
          await checkConnectedAccounts();
        }
      });
    } catch (error) {
      console.error(`Failed to connect ${provider}:`, error);
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      await axios.post(
        `/api/auth/${provider.toLowerCase()}/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      await checkConnectedAccounts();
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
    }
  };

  if (loading) {
    return <div className="settings-loading">Loading...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
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