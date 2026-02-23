// backend/services/notificationService.js
const Notification = require('../models/Notification');

const createNotification = async (userId, type, title, message, action = 'other', actionId = null, data = {}) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      action,
      actionId,
      data
    });

    await notification.save();
    console.log(`✅ Notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return null;
  }
};

module.exports = { createNotification };