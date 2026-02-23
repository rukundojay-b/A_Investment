


// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // FIXED: Changed 'type' to 'Types'
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    enum: ['deposit', 'withdraw', 'investment', 'referral', 'system', 'other'],
    default: 'other'
  },
  actionId: {
    type: mongoose.Schema.Types.ObjectId  // FIXED: Also here
  },
  data: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);