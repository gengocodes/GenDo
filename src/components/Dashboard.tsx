import React from 'react';
import { useAuth } from '../context/AuthContext';
import TodoList from './TodoList';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>GenDo</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <TodoList />
      </main>
    </div>
  );
};

export default Dashboard; 