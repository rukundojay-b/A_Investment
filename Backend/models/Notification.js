// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   type: { type: String },  // "withdrawal", "message", "referral", "product_update"
//   message: { type: String, required: true },
//   read: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });
// const setting = new mongoose.Schema({

//   user: {type:mongoose.Schema.type.ObjectId,ref:"user",required:truw},
//   type:{type:String}, //Create the evaluation where evry thing's c
//   message:{type:String}
// })

// module.exports = mongoose.model('Notification', notificationSchema);



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