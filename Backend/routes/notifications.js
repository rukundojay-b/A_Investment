// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// GET user notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({ 
      success: true, 
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST new notification (admin only maybe)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, type, title, message, action } = req.body;
    
    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      action: action || 'system'
    });
    
    await notification.save();
    
    res.json({ 
      success: true, 
      notification 
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}); 

// Mark as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    res.json({ 
      success: true, 
      notification 
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark all as read
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;