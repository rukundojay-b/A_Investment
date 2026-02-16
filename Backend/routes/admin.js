













const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const adminAuth = require('../middleware/adminAuth');

// ==================================================
// USER MANAGEMENT
// ==================================================

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('izina_ryogukoresha nimero_yatelefone email referralCode wallets stats status createdAt lastLogin')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      users: users.map(user => ({
        id: user._id,
        username: user.izina_ryogukoresha,
        phone: user.nimero_yatelefone,
        email: user.email,
        referralCode: user.referralCode,
        wallets: user.wallets,
        stats: user.stats,
        status: user.status,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      })),
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get user by ID
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-ijambo_banga');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get user's transactions from Transaction collection
    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.izina_ryogukoresha,
        phone: user.nimero_yatelefone,
        email: user.email,
        referralCode: user.referralCode,
        wallets: user.wallets,
        stats: user.stats,
        status: user.status,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      activeInvestments: user.activeInvestments || [],
      transactions: transactions
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Update user status
router.put('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    user.status = status;
    await user.save();
    
    res.json({ 
      success: true, 
      message: `User status updated to ${status}`,
      user: {
        id: user._id,
        username: user.izina_ryogukoresha,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ==================================================
// TRANSACTION MANAGEMENT
// ==================================================

// Get all transactions (admin view)
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 50, userId } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (userId) query.user = userId;
    
    const transactions = await Transaction.find(query)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
      .populate('processedBy', 'izina_ryogukoresha')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Transaction.countDocuments(query);
    
    // Get summary stats
    const summary = {
      totalDeposits: await Transaction.countDocuments({ type: 'deposit' }),
      totalWithdrawals: await Transaction.countDocuments({ type: 'withdraw' }),
      pendingDeposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
      pendingWithdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
      totalAmount: await Transaction.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0)
    };
    
    res.json({ 
      success: true, 
      transactions,
      summary,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get admin transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get all pending transactions
router.get('/transactions/pending', adminAuth, async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { status: 'pending' };
    if (type) query.type = type;
    
    const transactions = await Transaction.find(query)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
      .sort({ createdAt: 1 }) // Oldest first
      .limit(100);
    
    // Get counts for each type
    const counts = {
      deposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
      withdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
      total: await Transaction.countDocuments({ status: 'pending' })
    };
    
    // Calculate total amounts
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const depositAmount = transactions
      .filter(tx => tx.type === 'deposit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const withdrawalAmount = transactions
      .filter(tx => tx.type === 'withdraw')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    res.json({ 
      success: true, 
      transactions,
      counts,
      total: transactions.length,
      amounts: {
        total: totalAmount,
        deposits: depositAmount,
        withdrawals: withdrawalAmount
      }
    });
  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get transaction by ID with full details
router.get('/transactions/:id', adminAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
      .populate('processedBy', 'izina_ryogukoresha email');
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    res.json({ 
      success: true, 
      transaction 
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Approve transaction
router.post('/transactions/:id/approve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const adminId = req.user._id;
    
    console.log(`\n🚀 ========================================`);
    console.log(`🚀 ADMIN TRANSACTION APPROVAL REQUEST`);
    console.log(`🚀 ========================================`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`👤 Admin ID: ${adminId}`);
    console.log(`📝 Transaction ID: ${id}`);
    console.log(`🗒️  Note: ${note || 'No note provided'}`);
    console.log(`📁 Request Body:`, req.body);
    console.log(`🚀 ========================================\n`);
    
    // Find transaction in Transaction collection
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      console.error(`❌ Transaction not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found in database' 
      });
    }
    
    // Populate user details
    await transaction.populate('user');
    
    console.log(`📋 ========================================`);
    console.log(`📋 TRANSACTION DETAILS`);
    console.log(`📋 ========================================`);
    console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
    console.log(`📱 Phone: ${transaction.user.nimero_yatelefone}`);
    console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
    console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
    console.log(`📞 Payment Method: ${transaction.paymentMethod}`);
    console.log(`📱 Receiver Phone: ${transaction.phoneNumber}`);
    console.log(`📄 Description: ${transaction.description}`);
    console.log(`🆔 Reference: ${transaction.reference}`);
    console.log(`📊 Current Status: ${transaction.status}`);
    console.log(`📅 Created: ${transaction.createdAt}`);
    console.log(`📋 ========================================\n`);
    
    // Update transaction status
    transaction.status = 'completed';
    transaction.adminNote = note || 'Transaction approved by admin';
    transaction.processedBy = adminId;
    transaction.processedAt = new Date();
    
    // Get user to update wallet
    const user = await User.findById(transaction.user._id);
    
    if (!user) {
      console.error(`❌ User not found: ${transaction.user._id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (transaction.type === 'deposit') {
      console.log(`💰 ========================================`);
      console.log(`💰 PROCESSING DEPOSIT`);
      console.log(`💰 ========================================`);
      
      // Add to user's main wallet
      const oldBalance = user.wallets.main;
      user.wallets.main += transaction.amount;
      user.stats.totalDeposits += transaction.amount;
      user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
      console.log(`💰 Old Balance: ${oldBalance.toLocaleString()} FRW`);
      console.log(`💰 Deposit Amount: ${transaction.amount.toLocaleString()} FRW`);
      console.log(`💰 New Balance: ${user.wallets.main.toLocaleString()} FRW`);
      console.log(`💰 Total Deposits: ${user.stats.totalDeposits.toLocaleString()} FRW`);
      
      // Update embedded transaction in user document
      const userTransaction = user.transactions.id(id);
      if (userTransaction) {
        userTransaction.status = 'completed';
        userTransaction.processedBy = adminId;
        userTransaction.processedAt = new Date();
        userTransaction.adminNote = note || 'Deposit approved';
      }
      
      // Add notification to user
      await user.addNotification(
        `Your deposit of ${transaction.amount.toLocaleString()} FRW has been approved and added to your account.`,
        'success'
      );
      
      console.log(`✅ Deposit added to user's wallet`);
      console.log(`💰 ========================================\n`);
    }
    
    if (transaction.type === 'withdraw') {
      console.log(`💸 ========================================`);
      console.log(`💸 PROCESSING WITHDRAWAL`);
      console.log(`💸 ========================================`);
      
      // Check if user has enough earnings
      if (user.wallets.earning < transaction.amount) {
        console.error(`❌ Insufficient earnings!`);
        console.error(`💸 User Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
        console.error(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
        
        // Reject transaction automatically
        transaction.status = 'rejected';
        transaction.adminNote = 'Insufficient earnings balance';
        await transaction.save();
        
        return res.status(400).json({
          success: false,
          message: `User has insufficient earnings for this withdrawal. Available: ${user.wallets.earning.toLocaleString()} FRW`
        });
      }
      
      // Deduct from user's earnings and reserved
      const oldEarnings = user.wallets.earning;
      const oldReserved = user.wallets.reserved;
      
      user.wallets.earning -= transaction.amount;
      user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
      user.stats.totalWithdrawn += transaction.amount;
      user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
      console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
      console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
      console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
      console.log(`💸 New Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
      console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
      console.log(`💸 Total Withdrawn: ${user.stats.totalWithdrawn.toLocaleString()} FRW`);
      
      // Update embedded transaction in user document
      const userTransaction = user.transactions.id(id);
      if (userTransaction) {
        userTransaction.status = 'completed';
        userTransaction.processedBy = adminId;
        userTransaction.processedAt = new Date();
        userTransaction.adminNote = note || 'Withdrawal approved';
      }
      
      // Add notification to user
      await user.addNotification(
        `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been approved. Funds will be sent to ${transaction.phoneNumber} via ${transaction.paymentMethod}.`,
        'success'
      );
      
      console.log(`✅ Withdrawal processed successfully`);
      console.log(`💸 ========================================\n`);
    }
    
    // Save all changes
    await transaction.save();
    await user.save();
    
    console.log(`✅ ========================================`);
    console.log(`✅ TRANSACTION APPROVED SUCCESSFULLY!`);
    console.log(`✅ ========================================`);
    console.log(`📝 Transaction ID: ${transaction._id}`);
    console.log(`💰 Amount: ${transaction.amount.toLocaleString()} FRW`);
    console.log(`👤 User: ${user.izina_ryogukoresha}`);
    console.log(`📱 Phone: ${user.nimero_yatelefone}`);
    console.log(`📊 New Wallet Status:`);
    console.log(`   💰 Main: ${user.wallets.main.toLocaleString()} FRW`);
    console.log(`   💸 Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
    console.log(`   🔒 Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
    console.log(`✅ ========================================\n`);
    
    res.json({ 
      success: true, 
      message: 'Transaction approved successfully',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        adminNote: transaction.adminNote,
        reference: transaction.reference
      },
      user: {
        id: user._id,
        name: user.izina_ryogukoresha,
        email: user.email,
        phone: user.nimero_yatelefone,
        wallets: user.wallets
      }
    });
  } catch (error) {
    console.error(`❌ ========================================`);
    console.error(`❌ APPROVAL ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reject transaction
router.post('/transactions/:id/reject', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const adminId = req.user._id;
    
    console.log(`\n❌ ========================================`);
    console.log(`❌ ADMIN TRANSACTION REJECTION REQUEST`);
    console.log(`❌ ========================================`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`👤 Admin ID: ${adminId}`);
    console.log(`📝 Transaction ID: ${id}`);
    console.log(`🗒️  Reason: ${note || 'No reason provided'}`);
    console.log(`📁 Request Body:`, req.body);
    
    if (!note || note.trim() === '') {
      console.error(`❌ Rejection reason is required`);
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    // Find transaction in Transaction collection
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      console.error(`❌ Transaction not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    // Populate user details
    await transaction.populate('user');
    
    console.log(`📋 ========================================`);
    console.log(`📋 TRANSACTION DETAILS`);
    console.log(`📋 ========================================`);
    console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
    console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
    console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
    console.log(`📄 Description: ${transaction.description}`);
    console.log(`🆔 Reference: ${transaction.reference}`);
    console.log(`📊 Current Status: ${transaction.status}`);
    console.log(`📋 ========================================\n`);
    
    // Update transaction
    transaction.status = 'rejected';
    transaction.adminNote = note;
    transaction.processedBy = adminId;
    transaction.processedAt = new Date();
    
    // Get user to update
    const user = await User.findById(transaction.user._id);
    
    if (!user) {
      console.error(`❌ User not found: ${transaction.user._id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (transaction.type === 'withdraw') {
      console.log(`💸 ========================================`);
      console.log(`💸 RELEASING RESERVED FUNDS`);
      console.log(`💸 ========================================`);
      
      // Release reserved funds back to main wallet
      const oldReserved = user.wallets.reserved;
      user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
      user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
      console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
      console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
      console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
      console.log(`💸 ========================================\n`);
    } else if (transaction.type === 'deposit') {
      user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
    }
    
    // Update embedded transaction in user document
    const userTransaction = user.transactions.id(id);
    if (userTransaction) {
      userTransaction.status = 'rejected';
      userTransaction.processedBy = adminId;
      userTransaction.processedAt = new Date();
      userTransaction.adminNote = note;
    }
    
    // Add notification to user
    await user.addNotification(
      `Your ${transaction.type} of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}`,
      'warning'
    );
    
    // Save changes
    await transaction.save();
    await user.save();
    
    console.log(`✅ ========================================`);
    console.log(`✅ TRANSACTION REJECTED SUCCESSFULLY!`);
    console.log(`✅ ========================================`);
    console.log(`📝 Transaction ID: ${transaction._id}`);
    console.log(`🗒️  Reason: ${note}`);
    console.log(`👤 User Notified: ${user.izina_ryogukoresha}`);
    console.log(`✅ ========================================\n`);
    
    res.json({ 
      success: true, 
      message: 'Transaction rejected',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        adminNote: transaction.adminNote
      }
    });
  } catch (error) {
    console.error(`❌ ========================================`);
    console.error(`❌ REJECTION ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==================================================
// SYSTEM STATISTICS
// ==================================================

// Get system statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    const products = await Product.find();
    const transactions = await Transaction.find();
    
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      users: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        today: users.filter(u => 
          new Date(u.createdAt) >= today
        ).length
      },
      
      finances: {
        totalMain: users.reduce((sum, u) => sum + (u.wallets?.main || 0), 0),
        totalEarning: users.reduce((sum, u) => sum + (u.wallets?.earning || 0), 0),
        totalReserved: users.reduce((sum, u) => sum + (u.wallets?.reserved || 0), 0),
        totalDeposits: await Transaction.aggregate([
          { $match: { type: 'deposit', status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(result => result[0]?.total || 0),
        totalWithdrawals: await Transaction.aggregate([
          { $match: { type: 'withdraw', status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(result => result[0]?.total || 0),
        pendingDeposits: await Transaction.aggregate([
          { $match: { type: 'deposit', status: 'pending' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(result => result[0]?.total || 0),
        pendingWithdrawals: await Transaction.aggregate([
          { $match: { type: 'withdraw', status: 'pending' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(result => result[0]?.total || 0)
      },
      
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length
      },
      
      transactions: {
        total: transactions.length,
        pending: transactions.filter(t => t.status === 'pending').length,
        completed: transactions.filter(t => t.status === 'completed').length,
        rejected: transactions.filter(t => t.status === 'rejected').length,
        deposits: transactions.filter(t => t.type === 'deposit').length,
        withdrawals: transactions.filter(t => t.type === 'withdraw').length
      }
    };
    
    res.json({ 
      success: true, 
      stats 
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;