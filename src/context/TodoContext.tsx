'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Todo } from '../types/todo';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (todo: Partial<Todo>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  fetchTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configure axios headers with authentication token
  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${user?.token}`,
      'Content-Type': 'application/json'
    }
  });

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Todo[]>('/api/todos', getAuthHeaders());
      // Map _id to id in the response data
      const todosWithId = response.data.map(todo => ({
        ...todo,
        id: todo._id
      }));
      setTodos(todosWithId);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch todos';
      setError(errorMsg);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]);

  const createTodo = async (todo: Partial<Todo>) => {
    try {
      const response = await axios.post<Todo>(
        '/api/todos', 
        todo,
        getAuthHeaders()
      );
      // Map _id to id in the response data
      const newTodo = {
        ...response.data,
        id: response.data._id
      };
      setTodos(prev => [...prev, newTodo]);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create todo';
      setError(errorMsg);
      console.error('Error creating todo:', err);
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      console.log('Updating todo:', id, updates);
      const response = await axios.put<Todo>(
        `/api/todos/${id}`,
        updates,
        getAuthHeaders()
      );
      console.log('Update response:', response.data);
      // Map _id to id in the response data
      const updatedTodo = {
        ...response.data,
        id: response.data._id
      };
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update todo';
      setError(errorMsg);
      console.error('Error updating todo:', err);
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      console.log('Deleting todo:', id);
      await axios.delete(
        `/api/todos/${id}`,
        getAuthHeaders()
      );
      console.log('Todo deleted successfully');
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete todo';
      setError(errorMsg);
      console.error('Error deleting todo:', err);
      throw err;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        createTodo,
        updateTodo,
        deleteTodo,
        fetchTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}; 