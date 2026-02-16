// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ['deposit', 'withdraw'],
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['mtn', 'airtel', 'bank'],
//     required: true
//   },
//   phoneNumber: {
//     type: String,
//     required: true
//   },
//   description: String,
//   adminNote: String,
//   processedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   processedAt: Date
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Transaction', transactionSchema);
















const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'investment', 'earning', 'transfer', 'referral'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mtn', 'airtel', 'bank', 'system']
  },
  phoneNumber: {
    type: String
  },
  reference: {
    type: String,
    unique: true
  },
  description: String,
  adminNote: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Generate unique reference
transactionSchema.pre('save', async function(next) {
  if (!this.reference) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.reference = `TX-${timestamp}-${random}`;
  }
  next();
});

// Add method to get formatted transaction
transactionSchema.methods.getFormattedTransaction = function() {
  return {
    id: this._id,
    type: this.type,
    amount: this.amount,
    status: this.status,
    paymentMethod: this.paymentMethod,
    phoneNumber: this.phoneNumber,
    reference: this.reference,
    description: this.description,
    adminNote: this.adminNote,
    createdAt: this.createdAt,
    processedAt: this.processedAt,
    metadata: this.metadata || {}
  };
};

module.exports = mongoose.model('Transaction', transactionSchema);