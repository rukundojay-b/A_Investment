















const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @route POST /api/transactions/deposits
// @desc Create a deposit request
// @access Private
router.post('/deposits', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;
    const userId = req.user._id;

    console.log(`\n💰 ========================================`);
    console.log(`💰 NEW DEPOSIT REQUEST`);
    console.log(`💰 ========================================`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`💵 Amount: ${amount} FRW`);
    console.log(`💳 Payment Method: ${paymentMethod}`);
    console.log(`📱 Phone: ${phoneNumber}`);
    console.log(`📝 Description: ${description}`);

    // Validation
    if (!amount || amount <= 0) {
      console.error(`❌ Invalid amount: ${amount}`);
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (amount < 1000) {
      console.error(`❌ Minimum deposit not met: ${amount}`);
      return res.status(400).json({ success: false, message: 'Minimum deposit is 1,000 FRW' });
    }

    if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
      console.error(`❌ Invalid payment method: ${paymentMethod}`);
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      console.error(`❌ Invalid phone number: ${phoneNumber}`);
      return res.status(400).json({ success: false, message: 'Valid phone number required' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`👤 User Found: ${user.izina_ryogukoresha}`);
    console.log(`📱 User Phone: ${user.nimero_yatelefone}`);
    console.log(`💰 Current Balance: ${user.wallets.main.toLocaleString()} FRW`);

    // Create deposit request using updated method
    const transaction = await user.createDepositRequest(
      amount,
      paymentMethod,
      phoneNumber,
      description || `Deposit request via ${paymentMethod}`
    );

    console.log(`✅ Deposit request created`);
    console.log(`🆔 Transaction ID: ${transaction._id}`);
    console.log(`🆔 Reference: ${transaction.reference}`);
    console.log(`📊 Status: ${transaction.status}`);

    // Add notification
    await user.addNotification(
      `Deposit request of ${amount.toLocaleString()} FRW submitted. Awaiting admin approval.`,
      'info'
    );

    console.log(`📨 Notification sent to user`);
    console.log(`💰 ========================================\n`);

    res.json({
      success: true,
      message: 'Deposit request submitted successfully!',
      transaction: {
        id: transaction._id,
        reference: transaction.reference,
        amount: transaction.amount,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        phoneNumber: transaction.phoneNumber,
        description: transaction.description,
        createdAt: transaction.createdAt
      },
      instructions: {
        step1: `Send ${amount.toLocaleString()} FRW to agent number: 0781234567`,
        step2: `Include reference: ${transaction.reference}`,
        step3: 'Wait for admin verification (1-3 hours)',
        note: 'You will receive a notification when your deposit is approved.'
      }
    });

  } catch (error) {
    console.error(`\n❌ ========================================`);
    console.error(`❌ DEPOSIT REQUEST ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create deposit request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/transactions/withdrawals
// @desc Create a withdrawal request
// @access Private
router.post('/withdrawals', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;
    const userId = req.user._id;

    console.log(`\n💸 ========================================`);
    console.log(`💸 NEW WITHDRAWAL REQUEST`);
    console.log(`💸 ========================================`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`💵 Amount: ${amount} FRW`);
    console.log(`💳 Payment Method: ${paymentMethod}`);
    console.log(`📱 Phone: ${phoneNumber}`);
    console.log(`📝 Description: ${description}`);

    // Validation
    if (!amount || amount <= 0) {
      console.error(`❌ Invalid amount: ${amount}`);
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (amount < 5000) {
      console.error(`❌ Minimum withdrawal not met: ${amount}`);
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is 5,000 FRW' });
    }

    if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
      console.error(`❌ Invalid payment method: ${paymentMethod}`);
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      console.error(`❌ Invalid phone number: ${phoneNumber}`);
      return res.status(400).json({ success: false, message: 'Valid phone number required' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`👤 User Found: ${user.izina_ryogukoresha}`);
    console.log(`💰 Current Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
    console.log(`🔒 Current Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);

    // Check if user has enough available earnings
    if (user.wallets.earning < amount) {
      console.error(`❌ Insufficient earnings!`);
      console.error(`💸 Available: ${user.wallets.earning.toLocaleString()} FRW`);
      console.error(`💸 Requested: ${amount.toLocaleString()} FRW`);
      console.error(`💸 ========================================\n`);
      
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient earnings balance. Available: ${user.wallets.earning.toLocaleString()} FRW` 
      });
    }

    // Create withdrawal request using updated method
    const transaction = await user.createWithdrawalRequest(
      amount,
      paymentMethod,
      phoneNumber,
      description || `Withdrawal request to ${paymentMethod}`
    );

    console.log(`✅ Withdrawal request created`);
    console.log(`🆔 Transaction ID: ${transaction._id}`);
    console.log(`🆔 Reference: ${transaction.reference}`);
    console.log(`📊 Status: ${transaction.status}`);
    console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);

    // Add notification
    await user.addNotification(
      `Withdrawal request of ${amount.toLocaleString()} FRW submitted. Awaiting admin approval.`,
      'info'
    );

    console.log(`📨 Notification sent to user`);
    console.log(`💸 ========================================\n`);

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully!',
      transaction: {
        id: transaction._id,
        reference: transaction.reference,
        amount: transaction.amount,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        phoneNumber: transaction.phoneNumber,
        description: transaction.description,
        createdAt: transaction.createdAt
      },
      note: 'Your request will be processed within 1-3 business days. You will receive a notification when approved.'
    });

  } catch (error) {
    console.error(`\n❌ ========================================`);
    console.error(`❌ WITHDRAWAL REQUEST ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create withdrawal request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route GET /api/transactions
// @desc Get user's transactions
// @access Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, type } = req.query;
    const userId = req.user._id;

    console.log(`\n📊 ========================================`);
    console.log(`📊 GETTING USER TRANSACTIONS`);
    console.log(`📊 ========================================`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`📄 Type filter: ${type || 'All'}`);
    console.log(`📏 Limit: ${limit}`);

    // Get transactions from Transaction collection
    const query = { user: userId };
    if (type) query.type = type;

    const mainTransactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    console.log(`✅ Found ${mainTransactions.length} transactions`);

    // Calculate totals
    const totals = {
      deposits: mainTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      withdrawals: mainTransactions
        .filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      pending: mainTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      rejected: mainTransactions
        .filter(t => t.status === 'rejected')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    };

    // Format transactions for response
    const formattedTransactions = mainTransactions.map(transaction => ({
      id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      phoneNumber: transaction.phoneNumber,
      reference: transaction.reference,
      description: transaction.description,
      adminNote: transaction.adminNote,
      createdAt: transaction.createdAt,
      processedAt: transaction.processedAt
    }));

    console.log(`📊 Transaction Summary:`);
    console.log(`   💰 Total Deposits: ${totals.deposits.toLocaleString()} FRW`);
    console.log(`   💸 Total Withdrawals: ${totals.withdrawals.toLocaleString()} FRW`);
    console.log(`   ⏳ Total Pending: ${totals.pending.toLocaleString()} FRW`);
    console.log(`   ❌ Total Rejected: ${totals.rejected.toLocaleString()} FRW`);
    console.log(`📊 ========================================\n`);

    res.json({
      success: true,
      transactions: formattedTransactions,
      count: mainTransactions.length,
      totals: totals,
      pendingCount: mainTransactions.filter(t => t.status === 'pending').length
    });

  } catch (error) {
    console.error(`\n❌ ========================================`);
    console.error(`❌ GET TRANSACTIONS ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

// @route GET /api/transactions/pending
// @desc Get user's pending transactions
// @access Private
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(`\n⏳ ========================================`);
    console.log(`⏳ GETTING PENDING TRANSACTIONS`);
    console.log(`⏳ ========================================`);
    console.log(`👤 User ID: ${userId}`);

    // Get pending transactions from Transaction collection
    const pendingTransactions = await Transaction.find({
      user: userId,
      status: 'pending'
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${pendingTransactions.length} pending transactions`);

    const pendingAmount = pendingTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Format transactions for response
    const formattedTransactions = pendingTransactions.map(transaction => ({
      id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      phoneNumber: transaction.phoneNumber,
      reference: transaction.reference,
      description: transaction.description,
      createdAt: transaction.createdAt
    }));

    console.log(`💰 Total Pending Amount: ${pendingAmount.toLocaleString()} FRW`);
    console.log(`⏳ ========================================\n`);

    res.json({
      success: true,
      transactions: formattedTransactions,
      count: pendingTransactions.length,
      totalAmount: pendingAmount,
      pendingDeposits: pendingTransactions.filter(t => t.type === 'deposit').length,
      pendingWithdrawals: pendingTransactions.filter(t => t.type === 'withdraw').length
    });

  } catch (error) {
    console.error(`\n❌ ========================================`);
    console.error(`❌ GET PENDING TRANSACTIONS ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ success: false, message: 'Failed to fetch pending transactions' });
  }
});

// @route GET /api/transactions/:id
// @desc Get specific transaction details
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log(`\n🔍 ========================================`);
    console.log(`🔍 GETTING TRANSACTION DETAILS`);
    console.log(`🔍 ========================================`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`📝 Transaction ID: ${id}`);

    // Get transaction from Transaction collection
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId
    });

    if (!transaction) {
      console.error(`❌ Transaction not found or unauthorized`);
      console.error(`🔍 ========================================\n`);
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    console.log(`✅ Transaction found:`);
    console.log(`   💰 Type: ${transaction.type}`);
    console.log(`   💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
    console.log(`   📊 Status: ${transaction.status}`);
    console.log(`   🆔 Reference: ${transaction.reference}`);
    console.log(`   📅 Created: ${transaction.createdAt}`);
    console.log(`🔍 ========================================\n`);

    res.json({
      success: true,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        phoneNumber: transaction.phoneNumber,
        reference: transaction.reference,
        description: transaction.description,
        adminNote: transaction.adminNote,
        processedBy: transaction.processedBy,
        createdAt: transaction.createdAt,
        processedAt: transaction.processedAt
      }
    });

  } catch (error) {
    console.error(`\n❌ ========================================`);
    console.error(`❌ GET TRANSACTION ERROR`);
    console.error(`❌ ========================================`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error(`❌ ========================================\n`);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transaction details' 
    });
  }
});

module.exports = router;