

























// // // backend/routes/user.js - UPDATED VERSION
// // const express = require('express');
// // const router = express.Router();
// // const authMiddleware = require('../middleware/authMiddleware');
// // const User = require('../models/User');

// // // @route GET /api/user/dashboard
// // // @desc Get user dashboard data - UPDATED to use getDashboardData method
// // router.get('/dashboard', authMiddleware, async (req, res) => {
// //   try { 
// //     const user = req.user;
 
// //     // Get full user data
// //     const fullUser = await User.findById(user._id)
// //       .select('-ijambo_banga');
    
// //     if (!fullUser) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     // Update last login
// //     fullUser.lastLogin = new Date();
// //     await fullUser.save();

// //     // Use the getDashboardData method from the model
// //     const dashboardData = fullUser.getDashboardData();

// //     // Return the dashboard data
// //     res.json(dashboardData);

// //   } catch (error) {
// //     console.error('User dashboard error:', error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: 'Server error',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // // @route POST /api/user/purchase
// // // @desc Purchase a product
// // router.post('/purchase', authMiddleware, async (req, res) => {
// //   try {
// //     const { productId, productName, amount } = req.body;
// //     const user = req.user;

// //     // Get full user data
// //     const fullUser = await User.findById(user._id);
    
// //     if (!fullUser) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     // Check if user has enough available balance (main - reserved)
// //     const availableBalance = fullUser.wallets.main - fullUser.wallets.reserved;
// //     if (availableBalance < amount) {
// //       return res.status(400).json({ 
// //         success: false, 
// //         message: `Insufficient balance. Available: ${availableBalance.toLocaleString()} FRW, Required: ${amount.toLocaleString()} FRW` 
// //       });
// //     }

// //     // Calculate daily earning (25% of investment amount)
// //     const dailyEarning = Math.round(amount * 0.25);

// //     // Create investment record
// //     const investment = {
// //       productId: productId,
// //       productName: productName,
// //       quantity: 1,
// //       purchasePrice: amount,
// //       dailyEarning: dailyEarning,
// //       purchaseDate: new Date(),
// //       status: 'active'
// //     };

// //     // Add to active investments
// //     fullUser.activeInvestments.push(investment);

// //     // Deduct from main wallet
// //     fullUser.wallets.main -= amount;

// //     // Update stats
// //     fullUser.stats.totalInvestments = (fullUser.stats.totalInvestments || 0) + 1;
// //     fullUser.stats.totalSpent = (fullUser.stats.totalSpent || 0) + amount;

// //     // Create transaction record
// //     const transaction = {
// //       type: 'investment',
// //       amount: amount,
// //       status: 'completed',
// //       description: `Purchased ${productName}`,
// //       paymentMethod: 'system',
// //       reference: `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
// //       createdAt: new Date()
// //     };

// //     fullUser.transactions.push(transaction);

// //     await fullUser.save();

// //     res.json({
// //       success: true,
// //       message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
// //       investment: investment,
// //       wallets: fullUser.wallets,
// //       dailyEarning: dailyEarning
// //     });

// //   } catch (error) {
// //     console.error('Purchase error:', error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: 'Purchase failed',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // // @route GET /api/user/active-investments
// // // @desc Get user's active investments
// // router.get('/active-investments', authMiddleware, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id)
// //       .select('activeInvestments');
    
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     res.json({
// //       success: true,
// //       activeInvestments: user.activeInvestments || []
// //     });

// //   } catch (error) {
// //     console.error('Get active investments error:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // @route GET /api/user/transactions
// // // @desc Get user's transaction history
// // router.get('/transactions', authMiddleware, async (req, res) => {
// //   try {
// //     const { limit = 50, type } = req.query;
// //     const user = await User.findById(req.user._id)
// //       .select('transactions');
    
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     let transactions = user.transactions || [];
    
// //     // Filter by type if provided
// //     if (type) {
// //       transactions = transactions.filter(t => t.type === type);
// //     }

// //     // Sort by date (newest first) and limit
// //     transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// //     transactions = transactions.slice(0, parseInt(limit));

// //     res.json({
// //       success: true,
// //       transactions: transactions,
// //       count: transactions.length
// //     });

// //   } catch (error) {
// //     console.error('Get transactions error:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // @route POST /api/user/transfer-earnings
// // // @desc Transfer earnings to main wallet
// // router.post('/transfer-earnings', authMiddleware, async (req, res) => {
// //   try {
// //     const { amount } = req.body;
// //     const userId = req.user._id;

// //     if (!amount || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// //     }

// //     const user = await User.findById(userId);
    
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     // Check if user has enough in earning wallet
// //     if (user.wallets.earning < amount) {
// //       return res.status(400).json({ 
// //         success: false, 
// //         message: `Insufficient earnings balance. Available: ${user.wallets.earning.toLocaleString()} FRW` 
// //       });
// //     }

// //     // Transfer from earning to main wallet
// //     user.wallets.earning -= amount;
// //     user.wallets.main += amount;

// //     // Create transaction record
// //     const transaction = {
// //       type: 'transfer',
// //       amount: amount,
// //       status: 'completed',
// //       description: `Transferred ${amount.toLocaleString()} FRW from earning to main wallet`,
// //       paymentMethod: 'system',
// //       reference: `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
// //       createdAt: new Date()
// //     };

// //     user.transactions.push(transaction);

// //     // Update user stats
// //     user.stats.totalEarned = (user.stats.totalEarned || 0) - amount;

// //     await user.save();

// //     res.json({
// //       success: true,
// //       message: `Successfully transferred ${amount.toLocaleString()} FRW to main wallet`,
// //       wallets: user.wallets,
// //       transaction: transaction
// //     });

// //   } catch (error) {
// //     console.error('Transfer earnings error:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // @route GET /api/user/profile
// // // @desc Get user profile data
// // router.get('/profile', authMiddleware, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id).select('-ijambo_banga');
    
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     res.json({
// //       success: true,
// //       user: {
// //         _id: user._id,
// //         izina_ryogukoresha: user.izina_ryogukoresha,
// //         nimero_yatelefone: user.nimero_yatelefone,
// //         referralCode: user.referralCode,
// //         referralLink: `http://localhost:3000/signup?ref=${user.referralCode}`,
// //         wallets: user.wallets,
// //         stats: user.stats,
// //         status: user.status,
// //         createdAt: user.createdAt,
// //         lastLogin: user.lastLogin,
// //         activeInvestments: user.activeInvestments || []
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Get profile error:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // @route PUT /api/user/profile
// // // @desc Update user profile
// // router.put('/profile', authMiddleware, async (req, res) => {
// //   try {
// //     const { izina_ryogukoresha, nimero_yatelefone } = req.body;
// //     const userId = req.user._id;

// //     const updateData = {};
// //     if (izina_ryogukoresha) updateData.izina_ryogukoresha = izina_ryogukoresha;
// //     if (nimero_yatelefone) updateData.nimero_yatelefone = nimero_yatelefone;

// //     const user = await User.findByIdAndUpdate(
// //       userId,
// //       updateData,
// //       { new: true, select: '-ijambo_banga' }
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Profile updated successfully',
// //       user: user
// //     });

// //   } catch (error) {
// //     console.error('Update profile error:', error);
    
// //     if (error.code === 11000) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Username or phone number already exists'
// //       });
// //     }
    
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;

















// // backend/routes/user.js - COMPLETELY FIXED VERSION
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const User = require('../models/User');

// // @route GET /api/user/dashboard
// // @desc Get user dashboard data
// router.get('/dashboard', authMiddleware, async (req, res) => {
//   try { 
//     const user = req.user;
 
//     const fullUser = await User.findById(user._id)
//       .select('-ijambo_banga');
    
//     if (!fullUser) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     fullUser.lastLogin = new Date();
//     await fullUser.save();

//     const dashboardData = fullUser.getDashboardData();
//     res.json(dashboardData);

//   } catch (error) {
//     console.error('User dashboard error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ==================================================
// // ✅ FIXED: WITHDRAWAL REQUEST ENDPOINT
// // ==================================================
// // @route POST /api/user/withdraw
// // @desc Create withdrawal request - DEDUCT from EARNING, ADD to RESERVED
// router.post('/withdraw', authMiddleware, async (req, res) => {
//   try {
//     const { amount, paymentMethod, phoneNumber, description } = req.body;
//     const userId = req.user._id;

//     console.log(`\n💸 ========================================`);
//     console.log(`💸 WITHDRAWAL REQUEST RECEIVED`);
//     console.log(`💸 ========================================`);
//     console.log(`👤 User ID: ${userId}`);
//     console.log(`💵 Amount: ${amount} FRW`);
//     console.log(`💳 Payment Method: ${paymentMethod}`);
//     console.log(`📱 Phone: ${phoneNumber}`);

//     // Validation
//     if (!amount || amount <= 0) {
//       return res.status(400).json({ success: false, message: 'Invalid amount' });
//     }

//     if (amount < 5000) {
//       return res.status(400).json({ success: false, message: 'Minimum withdrawal is 5,000 FRW' });
//     }

//     if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
//       return res.status(400).json({ success: false, message: 'Invalid payment method' });
//     }

//     if (!phoneNumber || phoneNumber.length < 10) {
//       return res.status(400).json({ success: false, message: 'Valid phone number required' });
//     }

//     // Get user
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     console.log(`👤 User: ${user.izina_ryogukoresha}`);
//     console.log(`💰 Earnings before: ${user.wallets.earning.toLocaleString()} FRW`);
//     console.log(`🔒 Reserved before: ${user.wallets.reserved.toLocaleString()} FRW`);

//     // ✅ IMPORTANT: This calls the model method that:
//     // 1. Checks earnings balance
//     // 2. DEDUCTS from EARNING wallet
//     // 3. ADDS to RESERVED wallet
//     // 4. Creates transaction record
//     const transaction = await user.createWithdrawalRequest(
//       amount,
//       paymentMethod,
//       phoneNumber,
//       description || `Withdrawal request via ${paymentMethod}`
//     );

//     console.log(`✅ Withdrawal request created successfully!`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`💰 Earnings after: ${user.wallets.earning.toLocaleString()} FRW`);
//     console.log(`🔒 Reserved after: ${user.wallets.reserved.toLocaleString()} FRW`);
//     console.log(`💸 ========================================\n`);

//     res.json({
//       success: true,
//       message: 'Withdrawal request submitted successfully!',
//       transaction: {
//         id: transaction._id,
//         reference: transaction.reference,
//         amount: transaction.amount,
//         status: transaction.status,
//         paymentMethod: transaction.paymentMethod,
//         phoneNumber: transaction.phoneNumber,
//         createdAt: transaction.createdAt
//       },
//       wallets: {
//         earning: user.wallets.earning,
//         reserved: user.wallets.reserved,
//         main: user.wallets.main
//       },
//       note: 'Your request has been submitted and is pending admin approval. Funds have been reserved from your earnings wallet.'
//     });

//   } catch (error) {
//     console.error(`❌ Withdrawal request error:`, error);
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to create withdrawal request'
//     });
//   }
// });

// // ==================================================
// // DEPOSIT REQUEST ENDPOINT
// // ==================================================
// // @route POST /api/user/deposit
// // @desc Create deposit request
// router.post('/deposit', authMiddleware, async (req, res) => {
//   try {
//     const { amount, paymentMethod, phoneNumber, description } = req.body;
//     const userId = req.user._id;

//     console.log(`\n💰 ========================================`);
//     console.log(`💰 DEPOSIT REQUEST RECEIVED`);
//     console.log(`💰 ========================================`);

//     // Validation
//     if (!amount || amount <= 0) {
//       return res.status(400).json({ success: false, message: 'Invalid amount' });
//     }

//     if (amount < 1000) {
//       return res.status(400).json({ success: false, message: 'Minimum deposit is 1,000 FRW' });
//     }

//     if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
//       return res.status(400).json({ success: false, message: 'Invalid payment method' });
//     }

//     if (!phoneNumber || phoneNumber.length < 10) {
//       return res.status(400).json({ success: false, message: 'Valid phone number required' });
//     }

//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const transaction = await user.createDepositRequest(
//       amount,
//       paymentMethod,
//       phoneNumber,
//       description || `Deposit request via ${paymentMethod}`
//     );

//     res.json({
//       success: true,
//       message: 'Deposit request submitted successfully!',
//       transaction: {
//         id: transaction._id,
//         reference: transaction.reference,
//         amount: transaction.amount,
//         status: transaction.status,
//         paymentMethod: transaction.paymentMethod,
//         phoneNumber: transaction.phoneNumber,
//         createdAt: transaction.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('Deposit request error:', error);
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to create deposit request'
//     });
//   }
// });

// // @route POST /api/user/purchase
// // @desc Purchase a product
// router.post('/purchase', authMiddleware, async (req, res) => {
//   try {
//     const { productId, productName, amount } = req.body;
//     const user = req.user;

//     const fullUser = await User.findById(user._id);
    
//     if (!fullUser) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Check if user has enough available balance (main - reserved)
//     const availableBalance = fullUser.wallets.main - fullUser.wallets.reserved;
//     if (availableBalance < amount) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Insufficient balance. Available: ${availableBalance.toLocaleString()} FRW, Required: ${amount.toLocaleString()} FRW` 
//       });
//     }

//     // Calculate daily earning (25% of investment amount)
//     const dailyEarning = Math.round(amount * 0.25);

//     const result = await fullUser.createInvestment(
//       productId,
//       productName,
//       amount,
//       dailyEarning,
//       '30 days',
//       '25%'
//     );

//     res.json({
//       success: true,
//       message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
//       investment: result.investment,
//       transaction: result.transaction,
//       wallets: fullUser.wallets,
//       dailyEarning: dailyEarning
//     });

//   } catch (error) {
//     console.error('Purchase error:', error);
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Purchase failed'
//     });
//   }
// });

// // @route GET /api/user/active-investments
// // @desc Get user's active investments
// router.get('/active-investments', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .select('activeInvestments');
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.json({
//       success: true,
//       activeInvestments: user.activeInvestments || []
//     });

//   } catch (error) {
//     console.error('Get active investments error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // @route GET /api/user/transactions
// // @desc Get user's transaction history
// router.get('/transactions', authMiddleware, async (req, res) => {
//   try {
//     const { limit = 50, type } = req.query;
//     const user = await User.findById(req.user._id)
//       .select('transactions');
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     let transactions = user.transactions || [];
    
//     if (type) {
//       transactions = transactions.filter(t => t.type === type);
//     }

//     transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     transactions = transactions.slice(0, parseInt(limit));

//     res.json({
//       success: true,
//       transactions: transactions,
//       count: transactions.length
//     });

//   } catch (error) {
//     console.error('Get transactions error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // @route POST /api/user/transfer-earnings
// // @desc Transfer earnings to main wallet
// router.post('/transfer-earnings', authMiddleware, async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const userId = req.user._id;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ success: false, message: 'Invalid amount' });
//     }

//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const transaction = await user.transferEarnings(amount);

//     res.json({
//       success: true,
//       message: `Successfully transferred ${amount.toLocaleString()} FRW to main wallet`,
//       wallets: user.wallets,
//       transaction: transaction
//     });

//   } catch (error) {
//     console.error('Transfer earnings error:', error);
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Server error' 
//     });
//   }
// });

// // @route GET /api/user/profile
// // @desc Get user profile data
// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-ijambo_banga');
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.json({
//       success: true,
//       user: {
//         _id: user._id,
//         izina_ryogukoresha: user.izina_ryogukoresha,
//         nimero_yatelefone: user.nimero_yatelefone,
//         referralCode: user.referralCode,
//         referralLink: `http://localhost:3000/signup?ref=${user.referralCode}`,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin,
//         activeInvestments: user.activeInvestments || []
//       }
//     });

//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // @route PUT /api/user/profile
// // @desc Update user profile
// router.put('/profile', authMiddleware, async (req, res) => {
//   try {
//     const { izina_ryogukoresha, nimero_yatelefone } = req.body;
//     const userId = req.user._id;

//     const updateData = {};
//     if (izina_ryogukoresha) updateData.izina_ryogukoresha = izina_ryogukoresha;
//     if (nimero_yatelefone) updateData.nimero_yatelefone = nimero_yatelefone;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       updateData,
//       { new: true, select: '-ijambo_banga' }
//     );

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: user
//     });

//   } catch (error) {
//     console.error('Update profile error:', error);
    
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Username or phone number already exists'
//       });
//     }
    
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;























// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route GET /api/user/dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try { 
    const fullUser = await User.findById(req.user._id).select('-ijambo_banga');
    
    if (!fullUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    fullUser.lastLogin = new Date();
    await fullUser.save();

    const dashboardData = fullUser.getDashboardData();
    res.json(dashboardData);

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route POST /api/user/withdraw - FIXED
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    if (amount < 5000) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is 5,000 FRW' });
    }
    if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ success: false, message: 'Valid phone number required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // This will deduct from earning and add to reserved
    const transaction = await user.createWithdrawalRequest(
      amount,
      paymentMethod,
      phoneNumber,
      description || `Withdrawal request via ${paymentMethod}`
    );

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
        createdAt: transaction.createdAt
      },
      wallets: {
        earning: user.wallets.earning,
        reserved: user.wallets.reserved,
        main: user.wallets.main
      }
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create withdrawal request'
    });
  }
});

// @route POST /api/user/deposit
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    if (amount < 1000) {
      return res.status(400).json({ success: false, message: 'Minimum deposit is 1,000 FRW' });
    }
    if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ success: false, message: 'Valid phone number required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transaction = await user.createDepositRequest(
      amount,
      paymentMethod,
      phoneNumber,
      description || `Deposit request via ${paymentMethod}`
    );

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
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create deposit request'
    });
  }
});

// @route POST /api/user/purchase
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { productId, productName, amount } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const dailyEarning = Math.round(amount * 0.25);

    const result = await user.createInvestment(
      productId,
      productName,
      amount,
      dailyEarning,
      '30 days',
      '25%'
    );

    res.json({
      success: true,
      message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
      investment: result.investment,
      transaction: result.transaction,
      wallets: user.wallets,
      dailyEarning
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Purchase failed'
    });
  }
});

// @route GET /api/user/active-investments
router.get('/active-investments', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('activeInvestments');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      activeInvestments: user.activeInvestments || []
    });

  } catch (error) {
    console.error('Get active investments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route GET /api/user/transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, type } = req.query;
    const user = await User.findById(req.user._id).select('transactions');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let transactions = user.transactions || [];
    
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    transactions = transactions.slice(0, parseInt(limit));

    res.json({
      success: true,
      transactions: transactions,
      count: transactions.length
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route POST /api/user/transfer-earnings
router.post('/transfer-earnings', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transaction = await user.transferEarnings(amount);

    res.json({
      success: true,
      message: `Successfully transferred ${amount.toLocaleString()} FRW to main wallet`,
      wallets: user.wallets,
      transaction
    });

  } catch (error) {
    console.error('Transfer earnings error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
});

// @route GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-ijambo_banga');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        izina_ryogukoresha: user.izina_ryogukoresha,
        nimero_yatelefone: user.nimero_yatelefone,
        email: user.email,
        referralCode: user.referralCode,
        referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?ref=${user.referralCode}`,
        wallets: user.wallets,
        stats: user.stats,
        status: user.status,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        activeInvestments: user.activeInvestments || []
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route PUT /api/user/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { izina_ryogukoresha, nimero_yatelefone, email, imyaka, igitsina } = req.body;

    const updateData = {};
    if (izina_ryogukoresha) updateData.izina_ryogukoresha = izina_ryogukoresha;
    if (nimero_yatelefone) updateData.nimero_yatelefone = nimero_yatelefone;
    if (email) updateData.email = email;
    if (imyaka) updateData.imyaka = imyaka;
    if (igitsina) updateData.igitsina = igitsina;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, select: '-ijambo_banga' }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username or phone number already exists'
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;