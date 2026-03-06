
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

  // NEW FIELD: Track when user was last paid (for daily earnings)
  lastPaymentDate: {
    type: Date,
    default: null
  },

  // NEW FIELD: Store user's timezone for local-time payments
  timezone: {
    type: String,
    default: 'UTC'
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
      returnRate: { type: String, default: '14.29%' },
      investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment' } // Add reference to Investment document
    }
  ],

  // References to Investment documents
  investmentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }],

  // Investment statistics summary
  investmentStats: {
    totalInvested: { type: Number, default: 0 },
    totalEarnedFromInvestments: { type: Number, default: 0 },
    activeInvestmentCount: { type: Number, default: 0 },
    completedInvestmentCount: { type: Number, default: 0 },
    averageDailyReturn: { type: Number, default: 0 },
    lastInvestmentDate: { type: Date },
    bestInvestment: {
      productName: String,
      amount: Number,
      profit: Number
    },
    totalExpectedReturn: { type: Number, default: 0 }
  },

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
      processedAt: Date,
      metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
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
  try {
    // Hash password if modified
    if (this.isModified('ijambo_banga')) {
      this.ijambo_banga = await bcrypt.hash(this.ijambo_banga, 10);
    }

    // Generate referral code if not exists
    if (!this.referralCode) {
      let code;
      let exists = true;
      while (exists) {
        code = 'APEX' + Math.random().toString(36).substring(2, 8).toUpperCase();
        exists = await mongoose.models.User.findOne({ referralCode: code });
      }
      this.referralCode = code;
    }

    // Initialize investmentStats if not exists
    if (!this.investmentStats) {
      this.investmentStats = {
        totalInvested: 0,
        totalEarnedFromInvestments: 0,
        activeInvestmentCount: 0,
        completedInvestmentCount: 0,
        averageDailyReturn: 0,
        totalExpectedReturn: 0
      };
    }

    // Initialize investmentIds if not exists
    if (!this.investmentIds) {
      this.investmentIds = [];
    }

    // Initialize timezone if not set
    if (!this.timezone) {
      this.timezone = 'UTC';
    }

    // Handle wallets
    if (!this.wallets) {
      this.wallets = { 
        main: 400, 
        earning: 0, 
        reserved: 0 
      };
    } else {
      const currentWallets = this.wallets;
      this.wallets = {
        main: currentWallets.main !== undefined ? currentWallets.main : 400,
        earning: currentWallets.earning !== undefined ? currentWallets.earning : 0,
        reserved: currentWallets.reserved !== undefined ? currentWallets.reserved : 0
      };
    }

    // Handle stats
    if (!this.stats) {
      this.stats = {
        totalReferrals: 0,
        totalEarned: 0,
        totalSpent: 0,
        totalInvestments: 0,
        totalWithdrawn: 0,
        referralEarnings: 0,
        totalDeposits: 0,
        pendingDeposits: 0,
        pendingWithdrawals: 0,
        dailyEarnings: 0
      };
    }

    next();
  } catch (error) {
    next(error);
  }
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
  const invStats = this.investmentStats || {};
  
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
    timezone: this.timezone || 'UTC',
    lastPaymentDate: this.lastPaymentDate,
    wallets: {
      main: this.wallets?.main || 0,
      earning: this.wallets?.earning || 0,
      reserved: this.wallets?.reserved || 0,
      available: (this.wallets?.earning || 0) - (this.wallets?.reserved || 0)
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
    investmentStats: {
      totalInvested: invStats.totalInvested || 0,
      totalEarnedFromInvestments: invStats.totalEarnedFromInvestments || 0,
      activeInvestmentCount: invStats.activeInvestmentCount || 0,
      completedInvestmentCount: invStats.completedInvestmentCount || 0,
      averageDailyReturn: invStats.averageDailyReturn || 0,
      lastInvestmentDate: invStats.lastInvestmentDate,
      totalExpectedReturn: invStats.totalExpectedReturn || 0
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

// UPDATED: Add daily earnings using Investment model
userSchema.methods.addDailyEarnings = async function () {
  const Investment = mongoose.model('Investment');
  
  const activeInvestments = await Investment.find({
    user: this._id,
    status: 'active',
    endDate: { $gt: new Date() }
  });

  if (activeInvestments.length === 0) return 0;

  const dailyTotal = activeInvestments.reduce(
    (sum, inv) => sum + (inv.dailyEarning || 0), 0
  );

  if (dailyTotal > 0) {
    this.wallets.earning = (this.wallets.earning || 0) + dailyTotal;
    this.stats.totalEarned = (this.stats.totalEarned || 0) + dailyTotal;
    this.stats.dailyEarnings = dailyTotal;
    
    // Update investmentStats
    if (!this.investmentStats) this.investmentStats = {};
    this.investmentStats.totalEarnedFromInvestments = (this.investmentStats.totalEarnedFromInvestments || 0) + dailyTotal;
    
    // Update last payment date
    this.lastPaymentDate = new Date();
    
    const transaction = {
      type: 'earning',
      amount: dailyTotal,
      status: 'completed',
      description: `Daily earnings from ${activeInvestments.length} active investments`,
      paymentMethod: 'system',
      reference: `ERN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      createdAt: new Date(),
      metadata: {
        investments: activeInvestments.map(inv => ({
          id: inv._id,
          productName: inv.productName,
          amount: inv.dailyEarning
        })),
        timezone: this.timezone || 'UTC'
      }
    };

    this.transactions.push(transaction);
    await this.save();
    
    console.log(`💰 Added ${dailyTotal} FRW to ${this.izina_ryogukoresha}'s earning wallet`);
    console.log(`📅 Last payment date updated to: ${this.lastPaymentDate}`);
  }
  
  return dailyTotal;
};

// NEW METHOD: Check if user needs to be paid today
userSchema.methods.needsPayment = function () {
  if (!this.lastPaymentDate) return true;
  
  const now = new Date();
  const lastPayment = new Date(this.lastPaymentDate);
  
  // Get user's timezone
  const timezone = this.timezone || 'UTC';
  
  // Convert dates to user's timezone for comparison
  const nowInUserTz = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const lastPaymentInUserTz = new Date(lastPayment.toLocaleString('en-US', { timeZone: timezone }));
  
  // Compare dates (ignoring time)
  return (
    nowInUserTz.getFullYear() !== lastPaymentInUserTz.getFullYear() ||
    nowInUserTz.getMonth() !== lastPaymentInUserTz.getMonth() ||
    nowInUserTz.getDate() !== lastPaymentInUserTz.getDate()
  );
};

// NEW METHOD: Get next payment time in user's timezone
userSchema.methods.getNextPaymentTime = function () {
  const now = new Date();
  const timezone = this.timezone || 'UTC';
  
  // Get tomorrow at 00:01 in user's timezone
  const nowInUserTz = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const nextPayment = new Date(Date.UTC(
    nowInUserTz.getFullYear(),
    nowInUserTz.getMonth(),
    nowInUserTz.getDate() + 1,
    0, 1, 0, 0
  ));
  
  return nextPayment;
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
      processedAt: transaction.processedAt,
      metadata: transaction.metadata
    };
    
    this.transactions.push(userTransaction);
    await this.save();
    
    return transaction;
  } catch (error) {
    console.error('Error creating transaction record:', error);
    throw error;
  }
};

// Create deposit request
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

// Create withdrawal request
userSchema.methods.createWithdrawalRequest = async function (amount, paymentMethod, phoneNumber, description) {
  try {
    console.log("🔍 createWithdrawalRequest - START");
    console.log("- Amount:", amount);
    console.log("- Current wallets BEFORE any operation:", {
      main: this.wallets.main,
      earning: this.wallets.earning,
      reserved: this.wallets.reserved
    });

    if (amount < 5000) throw new Error('Minimum withdrawal is 5,000 FRW');

    // Check for existing pending withdrawals
    const hasPending = this.transactions?.some(t => 
      t.type === 'withdraw' && t.status === 'pending'
    );
    
    if (hasPending) {
      throw new Error('You have a pending withdrawal request. Please wait for it to be processed.');
    }

    const earningBalance = Number(this.wallets.earning) || 0;
    const withdrawAmount = Number(amount);

    console.log("- Balance check:", {
      earningBalance,
      withdrawAmount,
      hasEnough: earningBalance >= withdrawAmount
    });

    if (earningBalance < withdrawAmount) {
      throw new Error(`Insufficient earnings balance. Available: ${earningBalance.toLocaleString()} FRW`);
    }

    // Perform wallet updates
    this.wallets.earning = earningBalance - withdrawAmount;
    this.wallets.reserved = (Number(this.wallets.reserved) || 0) + withdrawAmount;

    console.log("- Wallets AFTER update:", {
      earning: this.wallets.earning,
      reserved: this.wallets.reserved
    });

    // Create transaction
    const transaction = await this.createTransactionRecord({
      type: 'withdraw',
      amount: withdrawAmount,
      status: 'pending',
      paymentMethod: paymentMethod,
      phoneNumber: phoneNumber,
      description: description || `Withdrawal request to ${paymentMethod}`
    });

    // Update stats
    this.stats.pendingWithdrawals = (this.stats.pendingWithdrawals || 0) + withdrawAmount;

    await this.save();
    
    console.log("✅ User saved successfully");
    console.log("- Final wallets:", {
      earning: this.wallets.earning,
      reserved: this.wallets.reserved
    });

    return transaction;

  } catch (error) {
    console.error('❌ Error in createWithdrawalRequest:', error);
    throw error;
  }
};

// ==================================================
// ✅ FIXED: Create investment purchase with Investment model
// ==================================================
userSchema.methods.createInvestment = async function (productId, productName, price, dailyEarning, duration, returnRate) {
  if (this.wallets.main < price) {
    throw new Error(`Insufficient balance. Available: ${this.wallets.main.toLocaleString()} FRW`);
  }

  const Investment = mongoose.model('Investment');
  
  // Deduct from main wallet
  this.wallets.main -= price;
  
  // Calculate end date (30 days from now)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  
  // Create investment in Investment collection - WITH ALL REQUIRED FIELDS
  const investment = new Investment({
    user: this._id,
    product: productId,
    productName: productName,
    amount: price,
    dailyEarning: dailyEarning,
    totalReturn: price + (dailyEarning * 30),
    purchaseDate: new Date(),
    endDate: endDate,
    status: 'active',
    active: true,
    lastProfitDate: new Date(),
    totalEarnedSoFar: 0,
    earningsHistory: [],
    profitPercentage: 0,
    daysCompleted: 0
  });

  await investment.save();

  // Add to user's activeInvestments array with reference to investment
  const userInvestment = {
    productId: productId,
    productName: productName,
    quantity: 1,
    purchasePrice: price,
    dailyEarning: dailyEarning,
    purchaseDate: new Date(),
    status: 'active',
    duration: duration,
    returnRate: returnRate,
    investmentId: investment._id // Add reference to the investment document
  };

  this.activeInvestments.push(userInvestment);
  
  // Add investment ID to investmentIds array
  if (!this.investmentIds) {
    this.investmentIds = [];
  }
  this.investmentIds.push(investment._id);
  
  // Initialize investmentStats if needed
  if (!this.investmentStats) {
    this.investmentStats = {
      totalInvested: 0,
      totalEarnedFromInvestments: 0,
      activeInvestmentCount: 0,
      completedInvestmentCount: 0,
      averageDailyReturn: 0,
      lastInvestmentDate: null,
      bestInvestment: null,
      totalExpectedReturn: 0
    };
  }
  // Update investmentStats
  this.investmentStats.totalInvested = (this.investmentStats.totalInvested || 0) + price;
  this.investmentStats.activeInvestmentCount = (this.investmentStats.activeInvestmentCount || 0) + 1;
  this.investmentStats.totalExpectedReturn = (this.investmentStats.totalExpectedReturn || 0) + (price + (dailyEarning * 30));
  this.investmentStats.lastInvestmentDate = new Date();
  
  // Recalculate average daily return
  const allActiveInvestments = await Investment.find({ user: this._id, status: 'active' });
  const totalDaily = allActiveInvestments.reduce((sum, inv) => sum + inv.dailyEarning, 0);
  this.investmentStats.averageDailyReturn = allActiveInvestments.length > 0 
    ? totalDaily / allActiveInvestments.length 
    : dailyEarning;
  
  // Update regular stats
  this.stats.totalInvestments = (this.stats.totalInvestments || 0) + 1;
  this.stats.totalSpent = (this.stats.totalSpent || 0) + price;
  this.stats.dailyEarnings = (this.stats.dailyEarnings || 0) + dailyEarning;
  
  // Create transaction record
  const transaction = {
    type: 'investment',
    amount: price,
    status: 'completed',
    description: `Purchased ${productName}`,
    paymentMethod: 'system',
    reference: `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt: new Date(),
    metadata: {
      investmentId: investment._id,
      productName: productName,
      dailyEarning: dailyEarning,
      endDate: endDate
    }
  };

  this.transactions.push(transaction);
  await this.save();
  
  console.log(`✅ Investment created: ${productName} - ${price.toLocaleString()} FRW - Ends: ${endDate.toDateString()}`);
  console.log(`📊 Investment Stats Updated: Total Invested: ${this.investmentStats.totalInvested} FRW, Active: ${this.investmentStats.activeInvestmentCount}`);
  console.log(`🔗 Investment linked: ${investment._id} added to investmentIds array`);
  
  return { 
    investment: userInvestment, 
    transaction, 
    investmentId: investment._id,
    investmentDoc: investment 
  };
};

// Method to get all investments with details
userSchema.methods.getAllInvestments = async function() {
  const Investment = mongoose.model('Investment');
  return await Investment.find({ user: this._id }).sort({ purchaseDate: -1 });
};

// Method to get investment summary
userSchema.methods.getInvestmentSummary = async function() {
  const Investment = mongoose.model('Investment');
  
  const active = await Investment.find({ user: this._id, status: 'active' });
  const completed = await Investment.find({ user: this._id, status: 'completed' });
  
  const totalInvested = active.reduce((sum, inv) => sum + inv.amount, 0) + 
                        completed.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarned = active.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0) + 
                      completed.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0);
  const totalExpected = active.reduce((sum, inv) => sum + inv.totalReturn, 0) + 
                        completed.reduce((sum, inv) => sum + inv.totalReturn, 0);
  
  return {
    totalInvested,
    totalEarned,
    totalExpected,
    activeCount: active.length,
    completedCount: completed.length,
    averageROI: totalInvested > 0 ? ((totalEarned / totalInvested) * 100).toFixed(2) : 0,
    dailyEarnings: active.reduce((sum, inv) => sum + inv.dailyEarning, 0)
  };
};

// Admin approve withdrawal
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

// Admin reject withdrawal
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

// Transfer earnings to main wallet
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

// Add referral earnings
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

// Get transaction history
userSchema.methods.getTransactionHistory = function (limit = 50) {
  return this.transactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

// Get pending transactions
userSchema.methods.getPendingTransactions = function () {
  return this.transactions.filter(t => t.status === 'pending');
};

// Sync transactions
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
          processedAt: mainTx.processedAt,
          metadata: mainTx.metadata
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

// Add notification
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

// Mark notifications as read
userSchema.methods.markNotificationsAsRead = async function () {
  this.notifications.forEach(notification => { notification.read = true; });
  await this.save();
  return this.notifications;
};

// Safe export - check if model already exists
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;