import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, {
  timestamps: true
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Generate JWT token with 10 minutes expiry
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

export async function POST(request: NextRequest) {
  try {
    console.log('Login request received');
    
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
    const { email, password } = body;

    console.log('Login attempt for:', email);

    // Validation
    if (!email || !password) {
      console.log('Missing login credentials');
      return NextResponse.json(
        { message: 'Please provide both email and password' },
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password using bcrypt directly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Login successful for:', email);
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Create response with user data (without token)
    const response = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: 'Login successful'
    });
    
    // Set JWT token as HTTP-only cookie
    response.cookies.set('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      maxAge: 10 * 60, // 10 minutes in seconds
      path: '/'
    });
    
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Server error during login. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 