import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Extract JWT token from cookies
export const getTokenFromCookies = (request: NextRequest): string | null => {
  const token = request.cookies.get('jwt_token')?.value;
  return token || null;
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user ID from request cookies
export const getUserIdFromRequest = (request: NextRequest): string | null => {
  const token = getTokenFromCookies(request);
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  return decoded?.id || null;
}; 