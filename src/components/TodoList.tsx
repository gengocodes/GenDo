import React, { useState } from 'react';
import { Todo, TodoStatus, TodoPriority } from '../types/todo';
import { useTodo } from '../context/TodoContext';
import { IconBaseProps } from 'react-icons';
import { FaTrash, FaClock, FaExclamationCircle, FaCircle, FaCheckCircle, FaPlayCircle, FaArchive } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './TodoList.css';

interface DeleteConfirmationProps {
  todo: Todo;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ todo, onConfirm, onCancel }) => (
  <div className="delete-confirmation-overlay">
    <motion.div 
      className="delete-confirmation"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
    >
      <h3>Delete Task</h3>
      <p>Are you sure you want to delete "{todo.title}"?</p>
      <p className="warning">This action cannot be undone.</p>
      <div className="confirmation-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="delete-btn" onClick={onConfirm}>Delete</button>
      </div>
    </motion.div>
  </div>
);

export const TodoList: React.FC = () => {
  const { todos, createTodo, updateTodo, deleteTodo } = useTodo();
  const [showForm, setShowForm] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as TodoPriority,
    dueDate: ''
  });
  const [filter, setFilter] = useState<TodoStatus>('pending');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.title.trim()) {
      createTodo({
        title: newTodo.title.trim(),
        description: newTodo.description,
        priority: newTodo.priority,
        status: 'pending',
        dueDate: newTodo.dueDate || undefined,
        tags: []
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

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo);
  };

  const handleDeleteConfirm = async () => {
    if (todoToDelete) {
      await deleteTodo(todoToDelete.id);
      setTodoToDelete(null);
    }
  };

  const handleStatusChange = async (todo: Todo) => {
    let newStatus: TodoStatus;
    switch (todo.status) {
      case 'pending':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'in_progress';
        break;
      default:
        newStatus = 'pending';
    }
    
    try {
      await updateTodo(todo.id, {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Failed to update todo status:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = filter === 'in_progress' ? 
      (todo.status === 'pending' || todo.status === 'in_progress') : 
      todo.status === filter;
    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
    const searchMatch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       false;
    return statusMatch && priorityMatch && searchMatch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getPriorityIcon = (priority: TodoPriority): JSX.Element => {
    const iconProps: IconBaseProps = {
      className: `priority-icon ${priority}`,
      'aria-hidden': true
    };
    
    return React.createElement(FaExclamationCircle as React.ComponentType<IconBaseProps>, iconProps);
  };

  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.status === 'completed') return false;
    return new Date(todo.dueDate) < new Date();
  };

  const getStatusIcon = (status: TodoStatus): JSX.Element => {
    const iconProps: IconBaseProps = {
      className: `status-icon ${status}`,
      'aria-hidden': true
    };
    
    switch (status) {
      case 'completed':
        return React.createElement(FaCheckCircle as React.ComponentType<IconBaseProps>, iconProps);
      case 'in_progress':
        return React.createElement(FaPlayCircle as React.ComponentType<IconBaseProps>, iconProps);
      case 'archived':
        return React.createElement(FaArchive as React.ComponentType<IconBaseProps>, iconProps);
      default:
        return React.createElement(FaCircle as React.ComponentType<IconBaseProps>, iconProps);
    }
  };

  const getStatusLabel = (status: TodoStatus): string => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'archived':
        return 'Archived';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <div className="header-top">
          <button className="add-button" onClick={() => setShowForm(true)}>
            + New Task
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as TodoStatus)}>
              <option value="in_progress">Active Tasks</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as TodoPriority | 'all')}>
              <option value="all">ALL</option>
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="todo-form-overlay">
          <motion.div 
            className="todo-form"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <h2>New Task</h2>
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
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Details (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTodo.description}
                  onChange={handleChange}
                  placeholder="Add task details"
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
                  <option value="low">LOW</option>
                  <option value="medium">MEDIUM</option>
                  <option value="high">HIGH</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={newTodo.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="submit-button">Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {todoToDelete && (
          <DeleteConfirmation
            todo={todoToDelete}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setTodoToDelete(null)}
          />
        )}
      </AnimatePresence>

      {filteredTodos.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No tasks found</p>
          {searchTerm && <p>Try adjusting your search or filters</p>}
        </motion.div>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.map(todo => (
                <motion.tr 
                  key={todo.id} 
                  className={`${todo.status} ${isOverdue(todo) ? 'overdue' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <td>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="status-cell"
                      onClick={() => handleStatusChange(todo)}
                    >
                      {getStatusIcon(todo.status)}
                      <span className="status-label">{getStatusLabel(todo.status)}</span>
                    </motion.div>
                  </td>
                  <td>
                    <div className="todo-title-cell">
                      <span className="todo-title">{todo.title}</span>
                      {isOverdue(todo) && (
                        <span className="overdue-badge">
                          {React.createElement(FaClock as React.ComponentType<IconBaseProps>, { 'aria-hidden': true })} Overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="priority-badge">
                      {getPriorityIcon(todo.priority)}
                      {todo.priority.toUpperCase()}
                    </span>
                  </td>
                  <td>{todo.description || '-'}</td>
                  <td>{todo.dueDate ? formatDate(todo.dueDate) : '-'}</td>
                  <td>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteClick(todo)}
                      className="delete-button"
                      title="Delete Task"
                    >
                      {React.createElement(FaTrash as React.ComponentType<IconBaseProps>, { 'aria-hidden': true })}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 