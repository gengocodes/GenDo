const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModel');
const auth = require('../middleware/auth');

// Get all todos for a user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      user: req.user.id
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    Object.assign(todo, req.body);
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 