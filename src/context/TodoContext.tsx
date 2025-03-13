import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  getTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Configure axios with auth token
  const configureAxios = () => {
    if (!user) return null;
    
    return {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
  };

  const getTodos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const config = configureAxios();
      if (!config) return;
      
      const response = await axios.get('http://localhost:5000/api/todos', config);
      setTodos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const config = configureAxios();
      if (!config) return;
      
      const response = await axios.post(
        'http://localhost:5000/api/todos',
        { text },
        config
      );
      
      setTodos([response.data, ...todos]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const config = configureAxios();
      if (!config) return;
      
      const response = await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        updates,
        config
      );
      
      setTodos(
        todos.map((todo) => (todo._id === id ? response.data : todo))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const config = configureAxios();
      if (!config) return;
      
      await axios.delete(`http://localhost:5000/api/todos/${id}`, config);
      
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Load todos when user changes
  useEffect(() => {
    if (user) {
      getTodos();
    } else {
      setTodos([]);
    }
  }, [user]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        getTodos,
        addTodo,
        updateTodo,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext; 