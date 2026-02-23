

// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    console.log('🔐 [Middleware] Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    
    // Use the SAME default as in User.js
    const jwtSecret = process.env.JWT_SECRET || '123456';
    console.log('🔐 [Middleware] Using secret:', jwtSecret);
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log('🔐 [Middleware] Token verified successfully');
    
    // Find user by id
    const user = await User.findById(decoded.userId).select('-ijambo_banga');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
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
    console.error('🔐 Auth middleware error:', error.message);
    console.error('🔐 Error name:', error.name);
    
    // Different error messages based on error type
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - Secret mismatch',
        hint: 'Check if JWT_SECRET matches between token creation and verification'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
      error: error.message
    });
  }
};

module.exports = authMiddleware;


