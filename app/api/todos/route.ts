import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getUserIdFromRequest } from '../../../lib/auth';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'archived'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

// GET - Get all todos for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Access denied. No valid token provided.' },
        { status: 401 }
      );
    }

    const todos = await Todo.find({ user: userId });
    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new todo
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Access denied. No valid token provided.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const todo = new Todo({
      ...body,
      user: userId
    });
    
    const savedTodo = await todo.save();
    return NextResponse.json(savedTodo, { status: 201 });
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
} 