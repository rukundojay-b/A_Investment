// backend/middleware/adminAuth.js - SIMPLIFIED VERSION (for development)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '123456');
    
    // Find user by id
    const user = await User.findOne({ 
      _id: decoded.userId,
      nimero_yatelefone: decoded.phone
    }).select('-ijambo_banga');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // For development: Allow all authenticated users to access admin routes
    // In production, you should add proper admin checks
    // if (!user.isAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
    //   return res.status(403).json({ 
    //     success: false, 
    //     message: 'Admin access required' 
    //   });
    // }

    // Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

module.exports = adminAuth;