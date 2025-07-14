"use client";

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
  }, [user, fetchTodos]);

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <TodoList />
      </main>
    </div>
  );
};

export default Dashboard;
