import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getUserIdFromRequest } from '../../../../lib/auth';

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

// PUT - Update a todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Access denied. No valid token provided.' },
        { status: 401 }
      );
    }

    const todo = await Todo.findOne({ _id: params.id, user: userId });
    if (!todo) {
      return NextResponse.json(
        { message: 'Todo not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    Object.assign(todo, body);
    const updatedTodo = await todo.save();
    
    return NextResponse.json(updatedTodo);
  } catch (error: any) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Access denied. No valid token provided.' },
        { status: 401 }
      );
    }

    const todo = await Todo.findOneAndDelete({ _id: params.id, user: userId });
    if (!todo) {
      return NextResponse.json(
        { message: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Todo deleted' });
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 