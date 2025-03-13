const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

module.exports = generateToken; 