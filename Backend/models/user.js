



// // models/User.js
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); 

// // ==================================================
// // ADD THIS IMPORT AT THE TOP
// // ==================================================
// const Transaction = require('./Transaction');

// const userSchema = new mongoose.Schema({
//   izina_ryogukoresha: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },

//   nimero_yatelefone: {
//     type: String,
//     required: true,
//     unique: true
//   },

//   ijambo_banga: {
//     type: String,
//     required: true
//   },

//   // =====================
//   // ADDED: PROFILE FIELDS
//   // =====================
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true
//   },

//   imyaka: {
//     type: Number,
//     default: 0
//   },

//   igitsina: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     default: 'male'
//   },

//   // =====================
//   // REFERRAL SYSTEM
//   // =====================
//   referralCode: {
//     type: String,
//     unique: true,
//     sparse: true
//   },

//   referredBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null
//   },

//   // =====================
//   // WALLETS
//   // =====================
//   wallets: {
//     main: {
//       type: Number,
//       default: 400
//     },
//     earning: {
//       type: Number,
//       default: 0
//     },
//     reserved: {
//       type: Number,
//       default: 0
//     }
//   },

//   // =====================
//   // ACTIVE INVESTMENTS
//   // =====================
//   activeInvestments: [
//     {
//       productId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Product' 
//       },
//       productName: String,
//       quantity: { 
//         type: Number, 
//         default: 1 
//       },
//       purchasePrice: Number,
//       dailyEarning: Number,
//       purchaseDate: { 
//         type: Date, 
//         default: Date.now 
//       },
//       status: {
//         type: String,
//         enum: ['active', 'completed', 'cancelled'],
//         default: 'active'
//       },
//       duration: {
//         type: String,
//         default: '30 days'
//       },
//       returnRate: {
//         type: String,
//         default: '25%'
//       }
//     }
//   ],

//   // =====================
//   // TRANSACTIONS
//   // =====================
//   transactions: [
//     {
//       type: { 
//         type: String, 
//         enum: ['deposit', 'withdraw', 'investment', 'earning', 'transfer', 'referral'] 
//       },
//       amount: Number,
//       status: { 
//         type: String, 
//         enum: ['pending', 'completed', 'rejected', 'failed'], 
//         default: 'pending' 
//       },
//       description: String,
//       paymentMethod: { 
//         type: String, 
//         enum: ['mtn', 'airtel', 'bank', 'system'] 
//       },
//       reference: String,
//       adminNote: String,
//       processedBy: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User' 
//       },
//       phoneNumber: String,
//       createdAt: { 
//         type: Date, 
//         default: Date.now 
//       },
//       processedAt: Date
//     }
//   ],

//   // =====================
//   // STATS
//   // =====================
//   stats: {
//     totalReferrals: { 
//       type: Number, 
//       default: 0 
//     },
//     totalEarned: { 
//       type: Number, 
//       default: 0 
//     },
//     totalSpent: { 
//       type: Number, 
//       default: 0 
//     },
//     totalInvestments: { 
//       type: Number, 
//       default: 0 
//     },
//     totalWithdrawn: { 
//       type: Number, 
//       default: 0 
//     },
//     referralEarnings: { 
//       type: Number, 
//       default: 0 
//     },
//     totalDeposits: { 
//       type: Number, 
//       default: 0 
//     },
//     pendingDeposits: { 
//       type: Number, 
//       default: 0 
//     },
//     pendingWithdrawals: { 
//       type: Number, 
//       default: 0 
//     },
//     dailyEarnings: { 
//       type: Number, 
//       default: 0 
//     }
//   },

//   // =====================
//   // NOTIFICATIONS
//   // =====================
//   notifications: [
//     {
//       message: String,
//       type: {
//         type: String,
//         enum: ['info', 'success', 'warning', 'error'],
//         default: 'info'
//       },
//       read: {
//         type: Boolean,
//         default: false
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now
//       }
//     }
//   ],

//   status: {
//     type: String,
//     default: 'active',
//     enum: ['active', 'inactive', 'suspended']
//   },

//   lastLogin: {
//     type: Date,
//     default: Date.now
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // ==================================================
// // PRE-SAVE HOOK
// // ==================================================
// userSchema.pre('save', async function (next) {
//   // Hash password if modified
//   if (this.isModified('ijambo_banga')) {
//     this.ijambo_banga = await bcrypt.hash(this.ijambo_banga, 10);
//   }

//   // Generate referral code if missing
//   if (!this.referralCode) {
//     let code;
//     let exists = true;

//     while (exists) {
//       code = 'APEX' + Math.random().toString(36).substring(2, 8).toUpperCase();
//       exists = await mongoose.models.User.findOne({ referralCode: code });
//     }

//     this.referralCode = code;
//   }

//   // Ensure wallets object exists
//   if (!this.wallets) {
//     this.wallets = {
//       main: 400,
//       earning: 0,
//       reserved: 0
//     };
//   }

//   // Ensure stats object exists
//   if (!this.stats) {
//     this.stats = {
//       totalReferrals: 0,
//       totalEarned: 0,
//       totalSpent: 0,
//       totalInvestments: 0,
//       totalWithdrawn: 0,
//       referralEarnings: 0,
//       totalDeposits: 0,
//       pendingDeposits: 0,
//       pendingWithdrawals: 0,
//       dailyEarnings: 0
//     };
//   }

//   next();
// });

// // ==================================================
// // AUTH METHODS
// // ==================================================
// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.ijambo_banga);
// };

// userSchema.methods.generateAuthToken = function () {
//   const jwtSecret = process.env.JWT_SECRET || '123456';

//   return jwt.sign(
//     {
//       userId: this._id,
//       phone: this.nimero_yatelefone,
//       username: this.izina_ryogukoresha
//     },
//     jwtSecret,
//     { expiresIn: '7d' }
//   );
// };




// // ==================================================
// // DASHBOARD & FINANCE METHODS - UPDATED
// // ==================================================
// userSchema.methods.getDashboardData = function () {
//   // Calculate total pending deposit/withdraw amounts
//   const pendingTransactions = this.transactions.filter(t => 
//     t.status === 'pending' && (t.type === 'deposit' || t.type === 'withdraw')
//   );
  
//   const pendingDeposits = pendingTransactions
//     .filter(t => t.type === 'deposit')
//     .reduce((sum, t) => sum + (t.amount || 0), 0);
    
//   const pendingWithdrawals = pendingTransactions
//     .filter(t => t.type === 'withdraw')
//     .reduce((sum, t) => sum + (t.amount || 0), 0);

//   // Calculate daily earnings from active investments
//   const totalDailyProfit = this.activeInvestments.reduce(
//     (total, inv) => total + (inv.dailyEarning || 0),
//     0
//   );

//   // Calculate total investment value
//   const totalInvestmentValue = this.activeInvestments.reduce(
//     (total, inv) => total + (inv.purchasePrice || 0),
//     0
//   );

//   // Get user stats with defaults
//   const userStats = this.stats || {};
  
//   // Create dashboard data object
//   const dashboardData = {
//     success: true,
//     id: this._id,
//     _id: this._id,
//     izina_ryogukoresha: this.izina_ryogukoresha,
//     nimero_yatelefone: this.nimero_yatelefone,
//     email: this.email || '',
//     imyaka: this.imyaka || 0,
//     igitsina: this.igitsina || '',
//     referralCode: this.referralCode,
//     referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?ref=${this.referralCode}`,
//     wallets: {
//       main: this.wallets?.main || 0,
//       earning: this.wallets?.earning || 0,
//       reserved: this.wallets?.reserved || 0,
//       available: (this.wallets?.main || 0) - (this.wallets?.reserved || 0)
//     },
//     stats: {
//       totalReferrals: userStats.totalReferrals || 0,
//       totalEarned: userStats.totalEarned || 0,
//       totalSpent: userStats.totalSpent || 0,
//       totalInvestments: userStats.totalInvestments || 0,
//       totalWithdrawn: userStats.totalWithdrawn || 0,
//       referralEarnings: userStats.referralEarnings || 0,
//       totalDeposits: userStats.totalDeposits || 0,
//       pendingDeposits: pendingDeposits,
//       pendingWithdrawals: pendingWithdrawals,
//       dailyEarnings: totalDailyProfit
//     },
//     status: this.status || 'active',
//     createdAt: this.createdAt || new Date(),
//     lastLogin: this.lastLogin || new Date(),
//     activeInvestments: this.activeInvestments || [],
//     activeInvestmentsCount: this.activeInvestments?.length || 0,
//     transactions: this.transactions || [],
//     notifications: this.notifications || [],
//     recentTransactions: (this.transactions || [])
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 5),
    
//     // Dashboard-specific calculations
//     totalDailyProfit: totalDailyProfit,
//     totalInvestmentValue: totalInvestmentValue,
//     availableBalance: (this.wallets?.main || 0) - (this.wallets?.reserved || 0),
    
//     // Referral information
//     referralStats: {
//       totalReferrals: userStats.totalReferrals || 0,
//       totalEarned: userStats.referralEarnings || 0,
//       pendingCommissions: 0 // You can add calculation logic here
//     }
//   };

//   return dashboardData;
// };

// // ✅ Daily earnings calculation
// userSchema.methods.getDailyEarnings = function () {
//   if (!this.activeInvestments || this.activeInvestments.length === 0) {
//     return 0;
//   }

//   return this.activeInvestments.reduce(
//     (total, inv) => total + (inv.dailyEarning || 0),
//     0
//   );
// };

// // ✅ Total investment calculation
// userSchema.methods.getTotalInvestment = function () {
//   if (!this.activeInvestments || this.activeInvestments.length === 0) {
//     return 0;
//   }

//   return this.activeInvestments.reduce(
//     (total, inv) => total + (inv.purchasePrice || 0),
//     0
//   );
// };

// // ✅ Add daily earnings to wallet
// userSchema.methods.addDailyEarnings = async function () {
//   const daily = this.getDailyEarnings();

//   if (daily > 0) {
//     this.wallets.earning += daily;
//     this.stats.totalEarned += daily;
//     this.stats.dailyEarnings = daily;
    
//     // Add transaction record
//     this.transactions.push({
//       type: 'earning',
//       amount: daily,
//       status: 'completed',
//       description: `Daily earnings from investments`,
//       paymentMethod: 'system',
//       reference: `ERN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
//       createdAt: new Date()
//     });
    
//     await this.save();
//   }

//   return daily;
// };

// // ==================================================
// // TRANSACTION METHODS
// // ==================================================

// // ==================================================
// // NEW: TRANSACTION MODEL INTEGRATION METHODS
// // ==================================================

// // ✅ Create transaction record in BOTH collections
// userSchema.methods.createTransactionRecord = async function(transactionData) {
//   try {
//     // Create transaction in Transaction collection
//     const transaction = new Transaction({
//       user: this._id,
//       ...transactionData
//     });
    
//     await transaction.save();
    
//     // Also add to user's embedded transactions array
//     const userTransaction = {
//       _id: transaction._id,
//       type: transaction.type,
//       amount: transaction.amount,
//       status: transaction.status,
//       description: transaction.description,
//       paymentMethod: transaction.paymentMethod,
//       phoneNumber: transaction.phoneNumber,
//       reference: transaction.reference,
//       adminNote: transaction.adminNote,
//       processedBy: transaction.processedBy,
//       createdAt: transaction.createdAt,
//       processedAt: transaction.processedAt
//     };
    
//     this.transactions.push(userTransaction);
//     await this.save();
    
//     return transaction;
//   } catch (error) {
//     console.error('Error creating transaction record:', error);
//     throw error;
//   }
// };

// // ✅ UPDATE: Create deposit request (uses Transaction model)
// userSchema.methods.createDepositRequest = async function (amount, paymentMethod, phoneNumber, description) {
//   try {
//     // Check for minimum deposit
//     if (amount < 1000) {
//       throw new Error('Minimum deposit is 1,000 FRW');
//     }

//     // Create transaction in BOTH collections
//     const transaction = await this.createTransactionRecord({
//       type: 'deposit',
//       amount: amount,
//       status: 'pending',
//       paymentMethod: paymentMethod,
//       phoneNumber: phoneNumber,
//       description: description || `Deposit request via ${paymentMethod}`
//     });

//     // Update user stats
//     this.stats.pendingDeposits += amount;
    
//     // Save user with updated stats
//     await this.save();
    
//     console.log(`\n💰 ========================================`);
//     console.log(`💰 DEPOSIT REQUEST CREATED`);
//     console.log(`💰 ========================================`);
//     console.log(`👤 User: ${this.izina_ryogukoresha}`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`💵 Amount: ${amount.toLocaleString()} FRW`);
//     console.log(`💳 Payment Method: ${paymentMethod}`);
//     console.log(`📱 Phone: ${phoneNumber}`);
//     console.log(`📊 Status: ${transaction.status}`);
//     console.log(`💰 ========================================\n`);
    
//     return transaction;
//   } catch (error) {
//     console.error('Error creating deposit request:', error);
//     throw error;
//   }
// };

// // ✅ UPDATE: Create withdrawal request (uses Transaction model)
// userSchema.methods.createWithdrawalRequest = async function (amount, paymentMethod, phoneNumber, description) {
//   try {
//     // Check for minimum withdrawal
//     if (amount < 5000) {
//       throw new Error('Minimum withdrawal is 5,000 FRW');
//     }

//     // Check if user has sufficient earnings balance
//     if (this.wallets.earning < amount) {
//       throw new Error(`Insufficient earnings balance. Available: ${this.wallets.earning.toLocaleString()} FRW`);
//     }

//     // Reserve the amount
//     this.wallets.reserved += amount;
    
//     // Create transaction in BOTH collections
//     const transaction = await this.createTransactionRecord({
//       type: 'withdraw',
//       amount: amount,
//       status: 'pending',
//       paymentMethod: paymentMethod,
//       phoneNumber: phoneNumber,
//       description: description || `Withdrawal request to ${paymentMethod}`
//     });

//     // Update user stats
//     this.stats.pendingWithdrawals += amount;
    
//     // Save user with reserved amount
//     await this.save();
    
//     console.log(`\n💸 ========================================`);
//     console.log(`💸 WITHDRAWAL REQUEST CREATED`);
//     console.log(`💸 ========================================`);
//     console.log(`👤 User: ${this.izina_ryogukoresha}`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`💵 Amount: ${amount.toLocaleString()} FRW`);
//     console.log(`💳 Payment Method: ${paymentMethod}`);
//     console.log(`📱 Phone: ${phoneNumber}`);
//     console.log(`📊 Status: ${transaction.status}`);
//     console.log(`🔒 Reserved: ${this.wallets.reserved.toLocaleString()} FRW`);
//     console.log(`💸 ========================================\n`);
    
//     return transaction;
//   } catch (error) {
//     console.error('Error creating withdrawal request:', error);
//     throw error;
//   }
// };

// // ✅ Create investment purchase
// userSchema.methods.createInvestment = async function (productId, productName, price, dailyEarning, duration, returnRate) {
//   // Check if user has sufficient available balance
//   const availableBalance = (this.wallets.main || 0) - (this.wallets.reserved || 0);
//   if (availableBalance < price) {
//     throw new Error(`Insufficient balance for investment. Available: ${availableBalance} FRW, Required: ${price} FRW`);
//   }

//   // Deduct from main wallet
//   this.wallets.main -= price;
  
//   // Create investment record
//   const investment = {
//     productId: productId,
//     productName: productName,
//     quantity: 1,
//     purchasePrice: price,
//     dailyEarning: dailyEarning,
//     duration: duration,
//     returnRate: returnRate,
//     purchaseDate: new Date(),
//     status: 'active'
//   };

//   this.activeInvestments.push(investment);
  
//   // Update stats
//   this.stats.totalInvestments = (this.stats.totalInvestments || 0) + 1;
//   this.stats.totalSpent = (this.stats.totalSpent || 0) + price;
//   this.stats.dailyEarnings = (this.stats.dailyEarnings || 0) + dailyEarning;
  
//   // Create transaction record
//   const transaction = {
//     type: 'investment',
//     amount: price,
//     status: 'completed',
//     description: `Purchased ${productName}`,
//     paymentMethod: 'system',
//     reference: `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
//     createdAt: new Date()
//   };

//   this.transactions.push(transaction);
//   await this.save();
  
//   return { investment, transaction };
// };

// // ✅ UPDATE: Admin: Approve deposit (with Transaction model integration)
// userSchema.methods.approveDeposit = async function (transactionId, adminId, note) {
//   try {
//     console.log(`\n💰 ========================================`);
//     console.log(`💰 APPROVING DEPOSIT`);
//     console.log(`💰 ========================================`);
//     console.log(`👤 User: ${this.izina_ryogukoresha}`);
//     console.log(`📱 Phone: ${this.nimero_yatelefone}`);
//     console.log(`📝 Transaction ID: ${transactionId}`);
//     console.log(`👨‍💼 Admin ID: ${adminId}`);
//     console.log(`🗒️  Note: ${note || 'No note provided'}`);
    
//     const transaction = this.transactions.id(transactionId);
    
//     if (!transaction || transaction.type !== 'deposit') {
//       throw new Error('Transaction not found or not a deposit');
//     }

//     if (transaction.status !== 'pending') {
//       throw new Error('Transaction already processed');
//     }

//     console.log(`📋 Transaction Details:`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Old Status: ${transaction.status}`);
    
//     // Also update Transaction collection
//     const mainTransaction = await Transaction.findById(transactionId);
//     if (mainTransaction) {
//       mainTransaction.status = 'completed';
//       mainTransaction.adminNote = note || 'Deposit approved';
//       mainTransaction.processedBy = adminId;
//       mainTransaction.processedAt = new Date();
//       await mainTransaction.save();
//       console.log(`✅ Updated Transaction collection record`);
//     }

//     // Update embedded transaction
//     transaction.status = 'completed';
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
//     transaction.adminNote = note || 'Deposit approved';

//     // Update user wallet and stats
//     const oldBalance = this.wallets.main;
//     this.wallets.main += transaction.amount;
//     this.stats.totalDeposits += transaction.amount;
//     this.stats.pendingDeposits -= transaction.amount;

//     console.log(`💰 Old Balance: ${oldBalance.toLocaleString()} FRW`);
//     console.log(`💰 Deposit Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`💰 New Balance: ${this.wallets.main.toLocaleString()} FRW`);
//     console.log(`📊 Total Deposits: ${this.stats.totalDeposits.toLocaleString()} FRW`);

//     // Add notification
//     await this.addNotification(
//       `Your deposit of ${transaction.amount.toLocaleString()} FRW has been approved and added to your account.`,
//       'success'
//     );

//     await this.save();
    
//     console.log(`✅ Deposit approved successfully!`);
//     console.log(`💰 ========================================\n`);
    
//     return transaction;
//   } catch (error) {
//     console.error('Error approving deposit:', error);
//     throw error;
//   }
// };

// // ✅ UPDATE: Admin: Approve withdrawal (with Transaction model integration)
// userSchema.methods.approveWithdrawal = async function (transactionId, adminId, note) {
//   try {
//     console.log(`\n💸 ========================================`);
//     console.log(`💸 APPROVING WITHDRAWAL`);
//     console.log(`💸 ========================================`);
//     console.log(`👤 User: ${this.izina_ryogukoresha}`);
//     console.log(`📱 Phone: ${this.nimero_yatelefone}`);
//     console.log(`📝 Transaction ID: ${transactionId}`);
//     console.log(`👨‍💼 Admin ID: ${adminId}`);
//     console.log(`🗒️  Note: ${note || 'No note provided'}`);
    
//     const transaction = this.transactions.id(transactionId);
    
//     if (!transaction || transaction.type !== 'withdraw') {
//       throw new Error('Transaction not found or not a withdrawal');
//     }

//     if (transaction.status !== 'pending') {
//       throw new Error('Transaction already processed');
//     }

//     console.log(`📋 Transaction Details:`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Old Status: ${transaction.status}`);
//     console.log(`📱 Withdrawal Phone: ${transaction.phoneNumber}`);
//     console.log(`💳 Payment Method: ${transaction.paymentMethod}`);
    
//     // Also update Transaction collection
//     const mainTransaction = await Transaction.findById(transactionId);
//     if (mainTransaction) {
//       mainTransaction.status = 'completed';
//       mainTransaction.adminNote = note || 'Withdrawal approved';
//       mainTransaction.processedBy = adminId;
//       mainTransaction.processedAt = new Date();
//       await mainTransaction.save();
//       console.log(`✅ Updated Transaction collection record`);
//     }

//     // Update embedded transaction
//     transaction.status = 'completed';
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
//     transaction.adminNote = note || 'Withdrawal approved';

//     // Update user wallet and stats
//     const oldEarnings = this.wallets.earning;
//     const oldReserved = this.wallets.reserved;
    
//     this.wallets.earning -= transaction.amount;
//     this.wallets.reserved -= transaction.amount;
//     this.stats.totalWithdrawn += transaction.amount;
//     this.stats.pendingWithdrawals -= transaction.amount;

//     console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
//     console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//     console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`💸 New Earnings: ${this.wallets.earning.toLocaleString()} FRW`);
//     console.log(`💸 New Reserved: ${this.wallets.reserved.toLocaleString()} FRW`);
//     console.log(`📊 Total Withdrawn: ${this.stats.totalWithdrawn.toLocaleString()} FRW`);

//     // Add notification
//     await this.addNotification(
//       `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been approved. Funds will be sent to ${transaction.phoneNumber} via ${transaction.paymentMethod}.`,
//       'success'
//     );

//     await this.save();
    
//     console.log(`✅ Withdrawal approved successfully!`);
//     console.log(`💸 ========================================\n`);
    
//     return transaction;
//   } catch (error) {
//     console.error('Error approving withdrawal:', error);
//     throw error;
//   }
// };

// // ✅ UPDATE: Admin: Reject transaction (with Transaction model integration)
// userSchema.methods.rejectTransaction = async function (transactionId, adminId, note) {
//   try {
//     console.log(`\n❌ ========================================`);
//     console.log(`❌ REJECTING TRANSACTION`);
//     console.log(`❌ ========================================`);
//     console.log(`👤 User: ${this.izina_ryogukoresha}`);
//     console.log(`📱 Phone: ${this.nimero_yatelefone}`);
//     console.log(`📝 Transaction ID: ${transactionId}`);
//     console.log(`👨‍💼 Admin ID: ${adminId}`);
//     console.log(`🗒️  Reason: ${note || 'No reason provided'}`);
    
//     const transaction = this.transactions.id(transactionId);
    
//     if (!transaction || !['deposit', 'withdraw'].includes(transaction.type)) {
//       throw new Error('Invalid transaction');
//     }

//     if (transaction.status !== 'pending') {
//       throw new Error('Transaction already processed');
//     }

//     console.log(`📋 Transaction Details:`);
//     console.log(`💵 Type: ${transaction.type}`);
//     console.log(`💰 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Old Status: ${transaction.status}`);
    
//     // Also update Transaction collection
//     const mainTransaction = await Transaction.findById(transactionId);
//     if (mainTransaction) {
//       mainTransaction.status = 'rejected';
//       mainTransaction.adminNote = note || 'Transaction rejected';
//       mainTransaction.processedBy = adminId;
//       mainTransaction.processedAt = new Date();
//       await mainTransaction.save();
//       console.log(`✅ Updated Transaction collection record`);
//     }

//     // Update embedded transaction
//     transaction.status = 'rejected';
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
//     transaction.adminNote = note || 'Transaction rejected';
 
//     // If it's a withdrawal, release reserved funds
//     if (transaction.type === 'withdraw') {
//       const oldReserved = this.wallets.reserved;
//       this.wallets.reserved -= transaction.amount;
//       this.stats.pendingWithdrawals -= transaction.amount;
//       console.log(`💸 Released reserved funds: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${this.wallets.reserved.toLocaleString()} FRW`);
//     } else if (transaction.type === 'deposit') {
//       this.stats.pendingDeposits -= transaction.amount;
//       console.log(`💰 Removed pending deposit: ${transaction.amount.toLocaleString()} FRW`);
//     }

//     // Add notification
//     await this.addNotification(
//       `Your ${transaction.type} of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note || 'Transaction rejected'}`,
//       'warning'
//     );

//     await this.save();
    
//     console.log(`✅ Transaction rejected successfully!`);
//     console.log(`❌ ========================================\n`);
    
//     return transaction;
//   } catch (error) {
//     console.error('Error rejecting transaction:', error);
//     throw error;
//   }
// };

// // ✅ Transfer earnings to main wallet
// userSchema.methods.transferEarnings = async function (amount) {
//   if (this.wallets.earning < amount) {
//     throw new Error(`Insufficient earnings. Available: ${this.wallets.earning} FRW`);
//   }

//   // Transfer from earning to main wallet
//   this.wallets.earning -= amount;
//   this.wallets.main += amount;

//   // Create transaction record
//   const transaction = {
//     type: 'transfer',
//     amount: amount,
//     status: 'completed',
//     description: `Transferred ${amount.toLocaleString()} FRW from earnings to main wallet`,
//     paymentMethod: 'system',
//     reference: `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
//     createdAt: new Date()
//   };

//   this.transactions.push(transaction);
//   await this.save();
  
//   return transaction;
// };

// // ✅ Add referral earnings
// userSchema.methods.addReferralEarnings = async function (amount, referrerName) {
//   // Add to earning wallet
//   this.wallets.earning += amount;
//   this.stats.referralEarnings += amount;
//   this.stats.totalEarned += amount;

//   // Create transaction record
//   const transaction = {
//     type: 'referral',
//     amount: amount,
//     status: 'completed',
//     description: `Referral commission from ${referrerName}`,
//     paymentMethod: 'system',
//     reference: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
//     createdAt: new Date()
//   };

//   this.transactions.push(transaction);
  
//   // Add notification
//   this.notifications.push({
//     message: `You earned ${amount.toLocaleString()} FRW from referral commission!`,
//     type: 'success',
//     read: false
//   });
  
//   await this.save();
  
//   return transaction;
// };

// // ✅ UPDATE: Get transaction history (includes both sources)
// userSchema.methods.getTransactionHistory = function (limit = 50) {
//   console.log(`\n📊 ========================================`);
//   console.log(`📊 GETTING TRANSACTION HISTORY`);
//   console.log(`📊 ========================================`);
//   console.log(`👤 User: ${this.izina_ryogukoresha}`);
//   console.log(`📈 Total transactions: ${this.transactions.length}`);
//   console.log(`📏 Limit: ${limit}`);
  
//   // Return combined transactions (embedded ones)
//   const history = this.transactions
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, limit);
  
//   console.log(`📊 Returning ${history.length} transactions`);
//   console.log(`📊 ========================================\n`);
//   return history;
// };

// // ✅ UPDATE: Get pending transactions
// userSchema.methods.getPendingTransactions = function () {
//   const pending = this.transactions.filter(t => t.status === 'pending');
//   console.log(`\n⏳ ========================================`);
//   console.log(`⏳ GETTING PENDING TRANSACTIONS`);
//   console.log(`⏳ ========================================`);
//   console.log(`👤 User: ${this.izina_ryogukoresha}`);
//   console.log(`⏳ Pending transactions: ${pending.length}`);
  
//   // Calculate total pending amount
//   const pendingAmount = pending.reduce((sum, t) => sum + (t.amount || 0), 0);
//   console.log(`💰 Total pending amount: ${pendingAmount.toLocaleString()} FRW`);
//   console.log(`⏳ ========================================\n`);
  
//   return pending;
// };

// // ✅ NEW: Sync transactions from Transaction collection to user document
// userSchema.methods.syncTransactions = async function() {
//   try {
//     console.log(`\n🔄 ========================================`);
//     console.log(`🔄 SYNCING TRANSACTIONS`);
//     console.log(`🔄 ========================================`);
//     console.log(`👤 User: ${this.izina_ryogukoresha}`);
    
//     // Get all transactions from Transaction collection for this user
//     const mainTransactions = await Transaction.find({ user: this._id })
//       .sort({ createdAt: -1 })
//       .limit(100);
    
//     console.log(`📊 Transactions in Transaction collection: ${mainTransactions.length}`);
//     console.log(`📊 Transactions in user document: ${this.transactions.length}`);
    
//     // Create a map of existing transaction IDs in user document
//     const existingIds = new Set(this.transactions.map(t => t._id.toString()));
    
//     // Add missing transactions
//     let addedCount = 0;
//     for (const mainTx of mainTransactions) {
//       if (!existingIds.has(mainTx._id.toString())) {
//         this.transactions.push({
//           _id: mainTx._id,
//           type: mainTx.type,
//           amount: mainTx.amount,
//           status: mainTx.status,
//           description: mainTx.description,
//           paymentMethod: mainTx.paymentMethod,
//           phoneNumber: mainTx.phoneNumber,
//           reference: mainTx.reference,
//           adminNote: mainTx.adminNote,
//           processedBy: mainTx.processedBy,
//           createdAt: mainTx.createdAt,
//           processedAt: mainTx.processedAt
//         });
//         addedCount++;
//       }
//     }
    
//     await this.save();
    
//     console.log(`✅ Synced ${addedCount} new transactions`);
//     console.log(`📊 New total: ${this.transactions.length}`);
//     console.log(`🔄 ========================================\n`);
    
//     return this.transactions;
//   } catch (error) {
//     console.error('Error syncing transactions:', error);
//     throw error;
//   }
// };

// // ✅ Add notification
// userSchema.methods.addNotification = async function (message, type = 'info') {
//   this.notifications.push({
//     message: message,
//     type: type,
//     read: false,
//     createdAt: new Date()
//   });
  
//   await this.save();
  
//   return this.notifications[this.notifications.length - 1];
// };

// // ✅ Mark notifications as read
// userSchema.methods.markNotificationsAsRead = async function () {
//   this.notifications.forEach(notification => {
//     notification.read = true;
//   });
  
//   await this.save();
  
//   return this.notifications;
// };

// // ==================================================
// // EXPORT MODEL
// // ==================================================
// module.exports = mongoose.model('User', userSchema);

















// models/User.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Transaction = require('./Transaction');

const userSchema = new mongoose.Schema({
  izina_ryogukoresha: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  nimero_yatelefone: {
    type: String,
    required: true,
    unique: true
  },

  ijambo_banga: {
    type: String,
    required: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  imyaka: {
    type: Number,
    default: 0
  },

  igitsina: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },

  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },

  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  wallets: {
    main: { type: Number, default: 400 },
    earning: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  },

  activeInvestments: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      quantity: { type: Number, default: 1 },
      purchasePrice: Number,
      dailyEarning: Number,
      purchaseDate: { type: Date, default: Date.now },
      status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
      duration: { type: String, default: '30 days' },
      returnRate: { type: String, default: '25%' }
    }
  ],

  transactions: [
    {
      type: { type: String, enum: ['deposit', 'withdraw', 'investment', 'earning', 'transfer', 'referral'] },
      amount: Number,
      status: { type: String, enum: ['pending', 'completed', 'rejected', 'failed'], default: 'pending' },
      description: String,
      paymentMethod: { type: String, enum: ['mtn', 'airtel', 'bank', 'system'] },
      reference: String,
      adminNote: String,
      processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      phoneNumber: String,
      createdAt: { type: Date, default: Date.now },
      processedAt: Date
    }
  ],

  stats: {
    totalReferrals: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalInvestments: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 },
    totalDeposits: { type: Number, default: 0 },
    pendingDeposits: { type: Number, default: 0 },
    pendingWithdrawals: { type: Number, default: 0 },
    dailyEarnings: { type: Number, default: 0 }
  },

  notifications: [
    {
      message: String,
      type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  status: { type: String, default: 'active', enum: ['active', 'inactive', 'suspended'] },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// ==================================================
// PRE-SAVE HOOK
// ==================================================
userSchema.pre('save', async function (next) {
  if (this.isModified('ijambo_banga')) {
    this.ijambo_banga = await bcrypt.hash(this.ijambo_banga, 10);
  }

  if (!this.referralCode) {
    let code;
    let exists = true;
    while (exists) {
      code = 'APEX' + Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await mongoose.models.User.findOne({ referralCode: code });
    }
    this.referralCode = code;
  }

  if (!this.wallets) {
    this.wallets = { main: 400, earning: 0, reserved: 0 };
  }

  if (!this.stats) {
    this.stats = {
      totalReferrals: 0, totalEarned: 0, totalSpent: 0, totalInvestments: 0,
      totalWithdrawn: 0, referralEarnings: 0, totalDeposits: 0,
      pendingDeposits: 0, pendingWithdrawals: 0, dailyEarnings: 0
    };
  }

  next();
});

// ==================================================
// AUTH METHODS
// ==================================================
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.ijambo_banga);
};

userSchema.methods.generateAuthToken = function () {
  const jwtSecret = process.env.JWT_SECRET || '123456';
  return jwt.sign(
    { userId: this._id, phone: this.nimero_yatelefone, username: this.izina_ryogukoresha },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

// ==================================================
// DASHBOARD & FINANCE METHODS
// ==================================================
userSchema.methods.getDashboardData = function () {
  const pendingTransactions = this.transactions.filter(t => 
    t.status === 'pending' && (t.type === 'deposit' || t.type === 'withdraw')
  );
  
  const pendingDeposits = pendingTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const pendingWithdrawals = pendingTransactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalDailyProfit = this.activeInvestments.reduce(
    (total, inv) => total + (inv.dailyEarning || 0), 0
  );

  const totalInvestmentValue = this.activeInvestments.reduce(
    (total, inv) => total + (inv.purchasePrice || 0), 0
  );

  const userStats = this.stats || {};
  
  return {
    success: true,
    id: this._id,
    _id: this._id,
    izina_ryogukoresha: this.izina_ryogukoresha,
    nimero_yatelefone: this.nimero_yatelefone,
    email: this.email || '',
    imyaka: this.imyaka || 0,
    igitsina: this.igitsina || '',
    referralCode: this.referralCode,
    referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?ref=${this.referralCode}`,
    wallets: {
      main: this.wallets?.main || 0,
      earning: this.wallets?.earning || 0,
      reserved: this.wallets?.reserved || 0,
      available: (this.wallets?.earning || 0) - (this.wallets?.reserved || 0) // FIXED: Show available earnings
    },
    stats: {
      totalReferrals: userStats.totalReferrals || 0,
      totalEarned: userStats.totalEarned || 0,
      totalSpent: userStats.totalSpent || 0,
      totalInvestments: userStats.totalInvestments || 0,
      totalWithdrawn: userStats.totalWithdrawn || 0,
      referralEarnings: userStats.referralEarnings || 0,
      totalDeposits: userStats.totalDeposits || 0,
      pendingDeposits: pendingDeposits,
      pendingWithdrawals: pendingWithdrawals,
      dailyEarnings: totalDailyProfit
    },
    status: this.status || 'active',
    createdAt: this.createdAt || new Date(),
    lastLogin: this.lastLogin || new Date(),
    activeInvestments: this.activeInvestments || [],
    activeInvestmentsCount: this.activeInvestments?.length || 0,
    transactions: this.transactions || [],
    notifications: this.notifications || [],
    recentTransactions: (this.transactions || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    totalDailyProfit: totalDailyProfit,
    totalInvestmentValue: totalInvestmentValue,
    availableBalance: (this.wallets?.earning || 0) - (this.wallets?.reserved || 0),
    referralStats: {
      totalReferrals: userStats.totalReferrals || 0,
      totalEarned: userStats.referralEarnings || 0,
      pendingCommissions: 0
    }
  };
};

userSchema.methods.getDailyEarnings = function () {
  if (!this.activeInvestments || this.activeInvestments.length === 0) return 0;
  return this.activeInvestments.reduce((total, inv) => total + (inv.dailyEarning || 0), 0);
};

userSchema.methods.getTotalInvestment = function () {
  if (!this.activeInvestments || this.activeInvestments.length === 0) return 0;
  return this.activeInvestments.reduce((total, inv) => total + (inv.purchasePrice || 0), 0);
};

userSchema.methods.addDailyEarnings = async function () {
  const daily = this.getDailyEarnings();
  if (daily > 0) {
    this.wallets.earning += daily;
    this.stats.totalEarned += daily;
    this.stats.dailyEarnings = daily;
    
    this.transactions.push({
      type: 'earning',
      amount: daily,
      status: 'completed',
      description: `Daily earnings from investments`,
      paymentMethod: 'system',
      reference: `ERN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      createdAt: new Date()
    });
    
    await this.save();
  }
  return daily;
};

// ==================================================
// TRANSACTION MODEL INTEGRATION METHODS
// ==================================================

userSchema.methods.createTransactionRecord = async function(transactionData) {
  try {
    const transaction = new Transaction({
      user: this._id,
      ...transactionData
    });
    
    await transaction.save();
    
    const userTransaction = {
      _id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      description: transaction.description,
      paymentMethod: transaction.paymentMethod,
      phoneNumber: transaction.phoneNumber,
      reference: transaction.reference,
      adminNote: transaction.adminNote,
      processedBy: transaction.processedBy,
      createdAt: transaction.createdAt,
      processedAt: transaction.processedAt
    };
    
    this.transactions.push(userTransaction);
    await this.save();
    
    return transaction;
  } catch (error) {
    console.error('Error creating transaction record:', error);
    throw error;
  }
};

// ✅ FIXED: Create deposit request
userSchema.methods.createDepositRequest = async function (amount, paymentMethod, phoneNumber, description) {
  try {
    if (amount < 1000) throw new Error('Minimum deposit is 1,000 FRW');

    const transaction = await this.createTransactionRecord({
      type: 'deposit',
      amount: amount,
      status: 'pending',
      paymentMethod: paymentMethod,
      phoneNumber: phoneNumber,
      description: description || `Deposit request via ${paymentMethod}`
    });

    this.stats.pendingDeposits += amount;
    await this.save();
    
    console.log(`\n💰 DEPOSIT REQUEST CREATED: ${amount.toLocaleString()} FRW`);
    
    return transaction;
  } catch (error) {
    console.error('Error creating deposit request:', error);
    throw error;
  }
};

// ✅ FIXED: Create withdrawal request - DEDUCT from EARNING, ADD to RESERVED
userSchema.methods.createWithdrawalRequest = async function (amount, paymentMethod, phoneNumber, description) {
  try {
    if (amount < 5000) throw new Error('Minimum withdrawal is 5,000 FRW');

    // Check EARNING wallet
    if (this.wallets.earning < amount) {
      throw new Error(`Insufficient earnings balance. Available: ${this.wallets.earning.toLocaleString()} FRW`);
    }

    // ✅ CRITICAL FIX: DEDUCT from EARNING and ADD to RESERVED
    this.wallets.earning -= amount;
    this.wallets.reserved += amount;
    
    const transaction = await this.createTransactionRecord({
      type: 'withdraw',
      amount: amount,
      status: 'pending',
      paymentMethod: paymentMethod,
      phoneNumber: phoneNumber,
      description: description || `Withdrawal request to ${paymentMethod}`
    });

    this.stats.pendingWithdrawals += amount;
    await this.save();
    
    console.log(`\n💸 WITHDRAWAL REQUEST CREATED: ${amount.toLocaleString()} FRW`);
    console.log(`💰 Earnings left: ${this.wallets.earning.toLocaleString()} FRW`);
    console.log(`🔒 Reserved: ${this.wallets.reserved.toLocaleString()} FRW`);
    
    return transaction;
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    throw error;
  }
};

// ✅ FIXED: Create investment purchase
userSchema.methods.createInvestment = async function (productId, productName, price, dailyEarning, duration, returnRate) {
  if (this.wallets.main < price) {
    throw new Error(`Insufficient balance. Available: ${this.wallets.main.toLocaleString()} FRW`);
  }

  this.wallets.main -= price;
  
  const investment = {
    productId: productId,
    productName: productName,
    quantity: 1,
    purchasePrice: price,
    dailyEarning: dailyEarning,
    duration: duration,
    returnRate: returnRate,
    purchaseDate: new Date(),
    status: 'active'
  };

  this.activeInvestments.push(investment);
  
  this.stats.totalInvestments = (this.stats.totalInvestments || 0) + 1;
  this.stats.totalSpent = (this.stats.totalSpent || 0) + price;
  this.stats.dailyEarnings = (this.stats.dailyEarnings || 0) + dailyEarning;
  
  const transaction = {
    type: 'investment',
    amount: price,
    status: 'completed',
    description: `Purchased ${productName}`,
    paymentMethod: 'system',
    reference: `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt: new Date()
  };

  this.transactions.push(transaction);
  await this.save();
  
  return { investment, transaction };
};

// ✅ FIXED: Admin approve withdrawal - ONLY remove from RESERVED
userSchema.methods.approveWithdrawal = async function (transactionId, adminId, note) {
  try {
    const transaction = this.transactions.id(transactionId);
    
    if (!transaction || transaction.type !== 'withdraw') {
      throw new Error('Transaction not found or not a withdrawal');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction already processed');
    }

    const mainTransaction = await Transaction.findById(transactionId);
    if (mainTransaction) {
      mainTransaction.status = 'completed';
      mainTransaction.adminNote = note || 'Withdrawal approved';
      mainTransaction.processedBy = adminId;
      mainTransaction.processedAt = new Date();
      await mainTransaction.save();
    }

    transaction.status = 'completed';
    transaction.processedBy = adminId;
    transaction.processedAt = new Date();
    transaction.adminNote = note || 'Withdrawal approved';

    // ✅ ONLY remove from RESERVED (already deducted from EARNING when requested)
    this.wallets.reserved -= transaction.amount;
    this.stats.totalWithdrawn += transaction.amount;
    this.stats.pendingWithdrawals -= transaction.amount;

    await this.addNotification(
      `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been approved.`,
      'success'
    );

    await this.save();
    
    return transaction;
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    throw error;
  }
};

// ✅ FIXED: Admin reject withdrawal - RETURN to EARNING, REMOVE from RESERVED
userSchema.methods.rejectTransaction = async function (transactionId, adminId, note) {
  try {
    const transaction = this.transactions.id(transactionId);
    
    if (!transaction || !['deposit', 'withdraw'].includes(transaction.type)) {
      throw new Error('Invalid transaction');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction already processed');
    }

    const mainTransaction = await Transaction.findById(transactionId);
    if (mainTransaction) {
      mainTransaction.status = 'rejected';
      mainTransaction.adminNote = note || 'Transaction rejected';
      mainTransaction.processedBy = adminId;
      mainTransaction.processedAt = new Date();
      await mainTransaction.save();
    }

    transaction.status = 'rejected';
    transaction.processedBy = adminId;
    transaction.processedAt = new Date();
    transaction.adminNote = note || 'Transaction rejected';
 
    if (transaction.type === 'withdraw') {
      // ✅ RETURN money to EARNING, REMOVE from RESERVED
      this.wallets.earning += transaction.amount;
      this.wallets.reserved -= transaction.amount;
      this.stats.pendingWithdrawals -= transaction.amount;
      
      await this.addNotification(
        `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note || 'Transaction rejected'}. Funds returned to your earnings wallet.`,
        'warning'
      );
      
    } else if (transaction.type === 'deposit') {
      this.stats.pendingDeposits -= transaction.amount;
      
      await this.addNotification(
        `Your deposit of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note || 'Transaction rejected'}.`,
        'warning'
      );
    }

    await this.save();
    
    return transaction;
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    throw error;
  }
};

// ✅ Transfer earnings to main wallet
userSchema.methods.transferEarnings = async function (amount) {
  if (this.wallets.earning < amount) {
    throw new Error(`Insufficient earnings. Available: ${this.wallets.earning} FRW`);
  }

  this.wallets.earning -= amount;
  this.wallets.main += amount;

  const transaction = {
    type: 'transfer',
    amount: amount,
    status: 'completed',
    description: `Transferred ${amount.toLocaleString()} FRW from earnings to main wallet`,
    paymentMethod: 'system',
    reference: `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt: new Date()
  };

  this.transactions.push(transaction);
  await this.save();
  
  return transaction;
};

// ✅ Add referral earnings
userSchema.methods.addReferralEarnings = async function (amount, referrerName) {
  this.wallets.earning += amount;
  this.stats.referralEarnings += amount;
  this.stats.totalEarned += amount;

  const transaction = {
    type: 'referral',
    amount: amount,
    status: 'completed',
    description: `Referral commission from ${referrerName}`,
    paymentMethod: 'system',
    reference: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt: new Date()
  };

  this.transactions.push(transaction);
  
  this.notifications.push({
    message: `You earned ${amount.toLocaleString()} FRW from referral commission!`,
    type: 'success',
    read: false
  });
  
  await this.save();
  
  return transaction;
};

// ✅ Get transaction history
userSchema.methods.getTransactionHistory = function (limit = 50) {
  return this.transactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

// ✅ Get pending transactions
userSchema.methods.getPendingTransactions = function () {
  return this.transactions.filter(t => t.status === 'pending');
};

// ✅ Sync transactions
userSchema.methods.syncTransactions = async function() {
  try {
    const mainTransactions = await Transaction.find({ user: this._id })
      .sort({ createdAt: -1 })
      .limit(100);
    
    const existingIds = new Set(this.transactions.map(t => t._id.toString()));
    
    for (const mainTx of mainTransactions) {
      if (!existingIds.has(mainTx._id.toString())) {
        this.transactions.push({
          _id: mainTx._id,
          type: mainTx.type,
          amount: mainTx.amount,
          status: mainTx.status,
          description: mainTx.description,
          paymentMethod: mainTx.paymentMethod,
          phoneNumber: mainTx.phoneNumber,
          reference: mainTx.reference,
          adminNote: mainTx.adminNote,
          processedBy: mainTx.processedBy,
          createdAt: mainTx.createdAt,
          processedAt: mainTx.processedAt
        });
      }
    }
    
    await this.save();
    return this.transactions;
  } catch (error) {
    console.error('Error syncing transactions:', error);
    throw error;
  }
};

// ✅ Add notification
userSchema.methods.addNotification = async function (message, type = 'info') {
  this.notifications.push({
    message: message,
    type: type,
    read: false,
    createdAt: new Date()
  });
  
  await this.save();
  return this.notifications[this.notifications.length - 1];
};

// ✅ Mark notifications as read
userSchema.methods.markNotificationsAsRead = async function () {
  this.notifications.forEach(notification => { notification.read = true; });
  await this.save();
  return this.notifications;
};

module.exports = mongoose.model('User', userSchema);