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
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Make sure user owns todo
    if (todo.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Make sure user owns todo
    if (todo.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await todo.remove();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
}; 