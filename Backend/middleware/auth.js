
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token after "Bearer "
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Use default secret if not set in environment
    const jwtSecret = process.env.JWT_SECRET || 'apex_invest_secret_key_2024_default';
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Find user by id
    const user = await User.findById(decoded.userId).select('-ijambo_banga');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active.'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Different error messages based on error type
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

module.exports = authenticateToken;