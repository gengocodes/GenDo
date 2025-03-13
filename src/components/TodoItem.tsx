import React, { useState } from 'react';
import { Todo, TodoStatus } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleToggleComplete = () => {
    onUpdate(todo.id, {
      status: todo.status === 'completed' ? 'in_progress' : 'completed',
      completedAt: todo.status === 'completed' ? null : new Date().toISOString()
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onUpdate(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.status === 'completed' ? 'completed' : ''}`}>
      {isEditing ? (
        <form className="edit-mode" onSubmit={handleSave}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <div className="edit-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="view-mode">
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.status === 'completed'}
              onChange={handleToggleComplete}
            />
            <span className="todo-title">{todo.title}</span>
          </div>
          <div className="todo-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}; 