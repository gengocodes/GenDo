import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import './TodoItem.css';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const { updateTodo, deleteTodo } = useTodo();

  const handleToggleComplete = () => {
    updateTodo(id, { completed: !completed });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(id, { text: editText });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(text);
  };

  const handleDelete = () => {
    deleteTodo(id);
  };

  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="todo-edit">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <div className="todo-actions">
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <input
              type="checkbox"
              checked={completed}
              onChange={handleToggleComplete}
            />
            <span className="todo-text">{text}</span>
          </div>
          <div className="todo-actions">
            <button onClick={handleEdit} className="edit-btn">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem; 