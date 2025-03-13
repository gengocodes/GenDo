import React, { useState } from 'react';
import { Todo, TodoStatus, TodoPriority } from '../types/todo';
import { useTodo } from '../context/TodoContext';
import './TodoList.css';

export const TodoList: React.FC = () => {
  const { todos, createTodo, updateTodo, deleteTodo } = useTodo();
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as TodoPriority,
    dueDate: ''
  });
  const [filter, setFilter] = useState<TodoStatus>('active');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.title.trim()) {
      createTodo({
        ...newTodo,
        title: newTodo.title.trim(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewTodo({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      setShowForm(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({ ...prev, [name]: value }));
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = todo.status === filter;
    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return '#f57c00';
      case 'low': return '#7cb342';
      default: return 'var(--text)';
    }
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New Task
        </button>

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
      </div>

      {showForm && (
        <div className="todo-form-overlay">
          <div className="todo-form">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTodo.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Details (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTodo.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  value={newTodo.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Estimated Completion Date</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={newTodo.dueDate}
                  onChange={handleChange}
                />
                <small>This task will be added to your Google Calendar if a date is set.</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="todo-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Details</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.map(todo => (
                <tr key={todo.id} className={todo.status}>
                  <td>
                    <input
                      type="checkbox"
                      checked={todo.status === 'completed'}
                      onChange={() => updateTodo(todo.id, {
                        status: todo.status === 'completed' ? 'active' : 'completed',
                        completedAt: todo.status === 'completed' ? null : new Date().toISOString()
                      })}
                    />
                  </td>
                  <td>{todo.title}</td>
                  <td>
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(todo.priority) }}
                    >
                      {todo.priority}
                    </span>
                  </td>
                  <td>{todo.description}</td>
                  <td>{todo.dueDate ? formatDate(todo.dueDate) : '-'}</td>
                  <td>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 