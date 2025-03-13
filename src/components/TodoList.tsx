import React, { useState } from 'react';
import { Todo, TodoStatus, TodoPriority } from '../types/todo';
import { useTodo } from '../context/TodoContext';
import { IconType } from 'react-icons';
import { FaTrash, FaClock, FaExclamationCircle } from 'react-icons/fa';
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
    const newStatus = todo.status === 'completed' ? 'in_progress' : 'completed';
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
    const statusMatch = todo.status === filter;
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
    const iconProps = {
      className: `priority-icon ${priority}`,
      'aria-hidden': 'true'
    };
    
    return <FaExclamationCircle {...iconProps} />;
  };

  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.status === 'completed') return false;
    return new Date(todo.dueDate) < new Date();
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <div className="header-top">
          <button className="add-button" onClick={() => setShowForm(true)}>
            Add New Task
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
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
          <motion.div 
            className="todo-form"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
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
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Create Task</button>
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
                <th>Actions</th>
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
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <input
                        type="checkbox"
                        checked={todo.status === 'completed'}
                        onChange={() => handleStatusChange(todo)}
                      />
                    </motion.div>
                  </td>
                  <td>
                    <div className="todo-title-cell">
                      <span className="todo-title">{todo.title}</span>
                      {isOverdue(todo) && (
                        <span className="overdue-badge">
                          <FaClock aria-hidden="true" /> Overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="priority-badge">
                      {getPriorityIcon(todo.priority)}
                      {todo.priority}
                    </span>
                  </td>
                  <td>{todo.description || '-'}</td>
                  <td>{todo.dueDate ? formatDate(todo.dueDate) : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(todo)}
                        className="delete-button"
                      >
                        <FaTrash aria-hidden="true" />
                      </motion.button>
                    </div>
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