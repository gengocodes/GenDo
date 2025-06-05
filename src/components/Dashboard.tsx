import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodo } from "../context/TodoContext";
import { TodoList } from "./TodoList";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { fetchTodos } = useTodo();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

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
