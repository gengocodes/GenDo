import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../../lib/models/User';

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Generate JWT token with 10 minutes expiry
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not set');
      return NextResponse.json(
        { message: 'Database configuration error' },
        { status: 500 }
      );
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set');
      return NextResponse.json(
        { message: 'Authentication configuration error' },
        { status: 500 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    console.log('Registration attempt for:', email);

    // Validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'Please provide all required fields: name, email, and password' },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length < 2) {
      console.log('Name too short');
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'An account with this email already exists. Please use a different email or try logging in.' },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    if (user) {
      console.log('User created successfully:', user._id);
      // Registration successful but no token generated
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Registration successful! Please login to continue.'
      }, { status: 201 });
    } else {
      console.log('Failed to create user');
      return NextResponse.json(
        { message: 'Failed to create account. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json(
        { message: 'An account with this email already exists. Please use a different email or try logging in.' },
        { status: 409 }
      );
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { message: 'An account with this email already exists. Please use a different email or try logging in.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Server error during registration. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 