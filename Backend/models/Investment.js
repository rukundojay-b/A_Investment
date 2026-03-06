// // // const mongoose = require('mongoose');

// // // const investmentSchema = new mongoose.Schema({
// // //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// // //   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
// // //   amount: { type: Number, required: true },
// // //   lastProfitDate: { type: Date, default: Date.now },
// // //   active: { type: Boolean, default: true },
// // //   createdAt: { type: Date, default: Date.now }


// // // });
// // // module.exports = mongoose.model('Investment', investmentSchema);



// // // backend/models/Investment.js
// // const mongoose = require('mongoose');

// // const investmentSchema = new mongoose.Schema({
// //   user: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: 'User', 
// //     required: true 
// //   },
// //   product: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: 'Product', 
// //     required: true 
// //   },
// //   productName: { 
// //     type: String, 
// //     required: true 
// //   },
// //   amount: { 
// //     type: Number, 
// //     required: true 
// //   },
// //   dailyEarning: { 
// //     type: Number, 
// //     required: true 
// //   },
// //   totalReturn: { 
// //     type: Number, 
// //     required: true 
// //   },
// //   status: { 
// //     type: String, 
// //     enum: ['active', 'completed', 'cancelled'], 
// //     default: 'active' 
// //   },
// //   purchaseDate: { 
// //     type: Date, 
// //     default: Date.now 
// //   },
// //   endDate: { 
// //     type: Date, 
// //     required: true 
// //   },
// //   lastProfitDate: { 
// //     type: Date, 
// //     default: Date.now 
// //   },
// //   totalEarnedSoFar: { 
// //     type: Number, 
// //     default: 0 
// //   },
// //   active: { 
// //     type: Boolean, 
// //     default: true 
// //   },
// //   createdAt: { 
// //     type: Date, 
// //     default: Date.now 
// //   }
// // });

// // // Calculate end date before saving (30 days from purchase)
// // investmentSchema.pre('save', function(next) {
// //   if (this.isNew && !this.endDate) {
// //     const endDate = new Date(this.purchaseDate);
// //     endDate.setDate(endDate.getDate() + 30);
// //     this.endDate = endDate;
// //   }
// //   next();
// // });

// // // Method to check if investment is still active
// // investmentSchema.methods.isActive = function() {
// //   const now = new Date();
// //   return this.status === 'active' && now < this.endDate;
// // };

// // // Method to get remaining days
// // investmentSchema.methods.getRemainingDays = function() {
// //   const now = new Date();
// //   const diffTime = this.endDate - now;
// //   return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
// // };

// // // Method to get progress percentage
// // investmentSchema.methods.getProgress = function() {
// //   const total = 30; // 30 days
// //   const elapsed = Math.min(30, 30 - this.getRemainingDays());
// //   return (elapsed / total) * 100;
// // };

// // module.exports = mongoose.model('Investment', investmentSchema);



// // backend/models/Investment.js
// const mongoose = require('mongoose');

// const investmentSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   product: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Product', 
//     required: true 
//   },
//   productName: { 
//     type: String, 
//     required: true 
//   },
//   amount: { 
//     type: Number, 
//     required: true 
//   },
//   dailyEarning: { 
//     type: Number, 
//     required: true 
//   },
//   totalReturn: { 
//     type: Number, 
//     required: true 
//   },
//   status: { 
//     type: String, 
//     enum: ['active', 'completed', 'cancelled'], 
//     default: 'active' 
//   },
//   purchaseDate: { 
//     type: Date, 
//     default: Date.now 
//   },
//   endDate: { 
//     type: Date, 
//     required: true 
//   },
//   lastProfitDate: { 
//     type: Date, 
//     default: Date.now 
//   },
//   totalEarnedSoFar: { 
//     type: Number, 
//     default: 0 
//   },
//   active: { 
//     type: Boolean, 
//     default: true 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Calculate end date before saving (30 days from purchase)
// investmentSchema.pre('save', function(next) {
//   if (this.isNew && !this.endDate) {
//     const endDate = new Date(this.purchaseDate);
//     endDate.setDate(endDate.getDate() + 30);
//     this.endDate = endDate;
//   }
//   next();
// });

// // Method to check if investment is still active
// investmentSchema.methods.isActive = function() {
//   const now = new Date();
//   return this.status === 'active' && now < this.endDate;
// };

// // Method to get remaining days
// investmentSchema.methods.getRemainingDays = function() {
//   const now = new Date();
//   const diffTime = this.endDate - now;
//   return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
// };

// // Method to get progress percentage
// investmentSchema.methods.getProgress = function() {
//   const total = 30; // 30 days
//   const elapsed = Math.min(30, 30 - this.getRemainingDays());
//   return (elapsed / total) * 100;
// };

// // Safe export - check if model already exists
// const Investment = mongoose.models.Investment || mongoose.model('Investment', investmentSchema);
// module.exports = Investment;















// backend/models/Investment.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  dailyEarning: { 
    type: Number, 
    required: true 
  },
  totalReturn: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  purchaseDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  lastProfitDate: { 
    type: Date, 
    default: Date.now 
  },
  totalEarnedSoFar: { 
    type: Number, 
    default: 0 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // NEW FIELDS for better tracking
  earningsHistory: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  }],
  profitPercentage: {
    type: Number,
    default: 0
  },
  daysCompleted: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Calculate end date before saving (30 days from purchase)
investmentSchema.pre('save', function(next) {
  if (this.isNew && !this.endDate) {
    const endDate = new Date(this.purchaseDate);
    endDate.setDate(endDate.getDate() + 30);
    this.endDate = endDate;
  }
  
  // Update profit percentage whenever totalEarnedSoFar changes
  if (this.amount > 0) {
    this.profitPercentage = Number(((this.totalEarnedSoFar / this.amount) * 100).toFixed(2));
  }
  
  next();
});

// Method to check if investment is still active
investmentSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && now < this.endDate;
};

// Method to get remaining days
investmentSchema.methods.getRemainingDays = function() {
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// Method to get progress percentage
investmentSchema.methods.getProgress = function() {
  const total = 30; // 30 days
  const elapsed = Math.min(30, 30 - this.getRemainingDays());
  return (elapsed / total) * 100;
};

// Method to add earning to history
investmentSchema.methods.addEarning = async function(amount, transactionId) {
  this.totalEarnedSoFar += amount;
  this.lastProfitDate = new Date();
  this.daysCompleted += 1;
  this.profitPercentage = Number(((this.totalEarnedSoFar / this.amount) * 100).toFixed(2));
  
  this.earningsHistory.push({
    amount,
    date: new Date(),
    transactionId
  });
  
  return this.save();
};

// Method to calculate expected daily return
investmentSchema.methods.getExpectedDailyReturn = function() {
  return this.dailyEarning;
};

// Method to check if investment is completed
investmentSchema.methods.isCompleted = function() {
  return this.status === 'completed' || new Date() >= this.endDate;
};

// Virtual for days since purchase
investmentSchema.virtual('daysSincePurchase').get(function() {
  const now = new Date();
  const diffTime = now - this.purchaseDate;
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
});

// Virtual for total expected earnings
investmentSchema.virtual('totalExpectedEarnings').get(function() {
  return this.dailyEarning * 30;
});

// Virtual for remaining earnings
investmentSchema.virtual('remainingEarnings').get(function() {
  return this.totalReturn - this.totalEarnedSoFar;
});

// Ensure virtuals are included when converting to JSON
investmentSchema.set('toJSON', { virtuals: true });
investmentSchema.set('toObject', { virtuals: true });

// Safe export - check if model already exists
const Investment = mongoose.models.Investment || mongoose.model('Investment', investmentSchema);
module.exports = Investment;