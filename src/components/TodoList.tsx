import React, { useState, useEffect } from 'react';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const { todos, loading, error, getTodos, addTodo } = useTodo();

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      await addTodo(newTodo);
      setNewTodo('');
    }
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-list-container">
      <h2>My To-Do List</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
      
      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-list">No tasks yet. Add one above!</div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo._id}
              id={todo._id}
              text={todo.text}
              completed={todo.completed}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 