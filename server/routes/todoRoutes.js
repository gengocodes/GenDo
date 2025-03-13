const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Todo = require('../models/todoModel');

// Get all todos for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
});

// Create a new todo
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({
      title,
      description: description || '',
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate,
      tags: tags || [],
      userId: req.user._id
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid todo data', error: error.message });
    }
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
});

// Update a todo
router.put('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updates = req.body;
    
    // Handle completedAt date based on status
    if (updates.status === 'completed' && todo.status !== 'completed') {
      updates.completedAt = new Date();
    } else if (updates.status !== 'completed') {
      updates.completedAt = null;
    }

    // Update only the fields that are provided
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        todo[key] = updates[key];
      }
    });

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid todo data', error: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID', error: error.message });
    }
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
});

// Delete a todo
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Todo ID is required' });
    }

    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID', error: error.message });
    }
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
});

module.exports = router; 