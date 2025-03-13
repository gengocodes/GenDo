const Todo = require('../models/Todo');

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate: dueDate || null,
      tags: tags || [],
      userId: req.user._id
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, tags, completedAt } = req.body;
    
    // Validate the todo exists and belongs to user
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update fields if provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (priority !== undefined) todo.priority = priority;
    if (status !== undefined) {
      todo.status = status;
      if (status === 'completed' && !todo.completedAt) {
        todo.completedAt = new Date();
      } else if (status !== 'completed') {
        todo.completedAt = null;
      }
    }
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (tags !== undefined) todo.tags = tags;
    if (completedAt !== undefined) todo.completedAt = completedAt;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating todo' });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Todo ID is required' });
    }

    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user._id 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Delete todo error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID format' });
    }
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
}; 