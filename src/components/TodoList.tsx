import React, { useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { Todo, TodoStatus, TodoPriority } from '../types/todo';
import { useTodo } from '../context/TodoContext';
import './TodoList.css';

export const TodoList: React.FC = () => {
  const { todos, createTodo, updateTodo, deleteTodo } = useTodo();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<TodoStatus>('active');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      createTodo({
        title: newTodoTitle.trim(),
        status: 'active',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewTodoTitle('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = todo.status === filter;
    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="todo-list">
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as TodoStatus)}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority:</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as TodoPriority | 'all')}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="todos">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}; 