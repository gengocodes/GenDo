import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    console.log('Test endpoint called');
    
    // Check environment variables
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('Environment check:', envCheck);
    
    // Test database connection
    await connectDB();
    
    return NextResponse.json({
      message: 'Test endpoint working',
      environment: envCheck,
      database: 'Connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      message: 'Test endpoint failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 