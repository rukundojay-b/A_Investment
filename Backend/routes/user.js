
// // // // routes/user.js
// // // const express = require('express');
// // // const router = express.Router();
// // // const authMiddleware = require('../middleware/authMiddleware');
// // // const User = require('../models/User');

// // // // @route GET /api/user/dashboard
// // // router.get('/dashboard', authMiddleware, async (req, res) => {
// // //   try { 
// // //     const fullUser = await User.findById(req.user._id).select('-ijambo_banga');
    
// // //     if (!fullUser) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     fullUser.lastLogin = new Date();
// // //     await fullUser.save();

// // //     const dashboardData = fullUser.getDashboardData();
// // //     res.json(dashboardData);

// // //   } catch (error) {
// // //     console.error('Dashboard error:', error);
// // //     res.status(500).json({ success: false, message: 'Server error' });
// // //   }
// // // });

// // // // @route POST /api/user/withdraw - FIXED
// // // router.post('/withdraw', authMiddleware, async (req, res) => {
// // //   try {
// // //     const { amount, paymentMethod, phoneNumber, description } = req.body;

// // //     // Validation
// // //     if (!amount || amount <= 0) {
// // //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// // //     }
// // //     if (amount < 5000) {
// // //       return res.status(400).json({ success: false, message: 'Minimum withdrawal is 5,000 FRW' });
// // //     }
// // //     if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
// // //       return res.status(400).json({ success: false, message: 'Invalid payment method' });
// // //     }
// // //     if (!phoneNumber || phoneNumber.length < 10) {
// // //       return res.status(400).json({ success: false, message: 'Valid phone number required' });
// // //     }

// // //     const user = await User.findById(req.user._id);
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     // This will deduct from earning and add to reserved
// // //     const transaction = await user.createWithdrawalRequest(
// // //       amount,
// // //       paymentMethod,
// // //       phoneNumber,
// // //       description || `Withdrawal request via ${paymentMethod}`
// // //     );

// // //     res.json({
// // //       success: true,
// // //       message: 'Withdrawal request submitted successfully!',
// // //       transaction: {
// // //         id: transaction._id,
// // //         reference: transaction.reference,
// // //         amount: transaction.amount,
// // //         status: transaction.status,
// // //         paymentMethod: transaction.paymentMethod,
// // //         phoneNumber: transaction.phoneNumber,
// // //         createdAt: transaction.createdAt
// // //       },
// // //       wallets: {
// // //         earning: user.wallets.earning,
// // //         reserved: user.wallets.reserved,
// // //         main: user.wallets.main
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Withdrawal error:', error);
// // //     res.status(400).json({ 
// // //       success: false, 
// // //       message: error.message || 'Failed to create withdrawal request'
// // //     });
// // //   }
// // // });

// // // // @route POST /api/user/deposit
// // // router.post('/deposit', authMiddleware, async (req, res) => {
// // //   try {
// // //     const { amount, paymentMethod, phoneNumber, description } = req.body;

// // //     if (!amount || amount <= 0) {
// // //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// // //     }
// // //     if (amount < 1000) {
// // //       return res.status(400).json({ success: false, message: 'Minimum deposit is 1,000 FRW' });
// // //     }
// // //     if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
// // //       return res.status(400).json({ success: false, message: 'Invalid payment method' });
// // //     }
// // //     if (!phoneNumber || phoneNumber.length < 10) {
// // //       return res.status(400).json({ success: false, message: 'Valid phone number required' });
// // //     }

// // //     const user = await User.findById(req.user._id);
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     const transaction = await user.createDepositRequest(
// // //       amount,
// // //       paymentMethod,
// // //       phoneNumber,
// // //       description || `Deposit request via ${paymentMethod}`
// // //     );

// // //     res.json({
// // //       success: true,
// // //       message: 'Deposit request submitted successfully!',
// // //       transaction: {
// // //         id: transaction._id,
// // //         reference: transaction.reference,
// // //         amount: transaction.amount,
// // //         status: transaction.status,
// // //         paymentMethod: transaction.paymentMethod,
// // //         phoneNumber: transaction.phoneNumber,
// // //         createdAt: transaction.createdAt
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Deposit error:', error);
// // //     res.status(400).json({ 
// // //       success: false, 
// // //       message: error.message || 'Failed to create deposit request'
// // //     });
// // //   }
// // // });

// // // // @route POST /api/user/purchase
// // // router.post('/purchase', authMiddleware, async (req, res) => {
// // //   try {
// // //     const { productId, productName, amount } = req.body;
    
// // //     const user = await User.findById(req.user._id);
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     const dailyEarning = Math.round(amount * 0.25);

// // //     const result = await user.createInvestment(
// // //       productId,
// // //       productName,
// // //       amount,
// // //       dailyEarning,
// // //       '30 days',
// // //       '25%'
// // //     );

// // //     res.json({
// // //       success: true,
// // //       message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
// // //       investment: result.investment,
// // //       transaction: result.transaction,
// // //       wallets: user.wallets,
// // //       dailyEarning
// // //     });

// // //   } catch (error) {
// // //     console.error('Purchase error:', error);
// // //     res.status(400).json({ 
// // //       success: false, 
// // //       message: error.message || 'Purchase failed'
// // //     });
// // //   }
// // // });

// // // // @route GET /api/user/active-investments
// // // router.get('/active-investments', authMiddleware, async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.user._id).select('activeInvestments');
    
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       activeInvestments: user.activeInvestments || []
// // //     });

// // //   } catch (error) {
// // //     console.error('Get active investments error:', error);
// // //     res.status(500).json({ success: false, message: 'Server error' });
// // //   }
// // // });

// // // // @route GET /api/user/transactions
// // // router.get('/transactions', authMiddleware, async (req, res) => {
// // //   try {
// // //     const { limit = 50, type } = req.query;
// // //     const user = await User.findById(req.user._id).select('transactions');
    
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     let transactions = user.transactions || [];
    
// // //     if (type) {
// // //       transactions = transactions.filter(t => t.type === type);
// // //     }

// // //     transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// // //     transactions = transactions.slice(0, parseInt(limit));

// // //     res.json({
// // //       success: true,
// // //       transactions: transactions,
// // //       count: transactions.length
// // //     });

// // //   } catch (error) {
// // //     console.error('Get transactions error:', error);
// // //     res.status(500).json({ success: false, message: 'Server error' });
// // //   }
// // // });

// // // // @route POST /api/user/transfer-earnings
// // // router.post('/transfer-earnings', authMiddleware, async (req, res) => {
// // //   try {
// // //     const { amount } = req.body;

// // //     if (!amount || amount <= 0) {
// // //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// // //     }

// // //     const user = await User.findById(req.user._id);
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     const transaction = await user.transferEarnings(amount);

// // //     res.json({
// // //       success: true,
// // //       message: `Successfully transferred ${amount.toLocaleString()} FRW to main wallet`,
// // //       wallets: user.wallets,
// // //       transaction
// // //     });

// // //   } catch (error) {
// // //     console.error('Transfer earnings error:', error);
// // //     res.status(400).json({ 
// // //       success: false, 
// // //       message: error.message || 'Server error' 
// // //     });
// // //   }
// // // });

// // // // @route GET /api/user/profile
// // // router.get('/profile', authMiddleware, async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.user._id).select('-ijambo_banga');
    
// // //     if (!user) {
// // //       return res.status(404).json({ success: false, message: 'User not found' });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       user: {
// // //         _id: user._id,
// // //         izina_ryogukoresha: user.izina_ryogukoresha,
// // //         nimero_yatelefone: user.nimero_yatelefone,
// // //         email: user.email,
// // //         referralCode: user.referralCode,
// // //         referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?ref=${user.referralCode}`,
// // //         wallets: user.wallets,
// // //         stats: user.stats,
// // //         status: user.status,
// // //         createdAt: user.createdAt,
// // //         lastLogin: user.lastLogin,
// // //         activeInvestments: user.activeInvestments || []
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Get profile error:', error);
// // //     res.status(500).json({ success: false, message: 'Server error' });
// // //   }
// // // });

// // // // @route PUT /api/user/profile
// // // router.put('/profile', authMiddleware, async (req, res) => {
// // //   try {
// // //     const { izina_ryogukoresha, nimero_yatelefone, email, imyaka, igitsina } = req.body;

// // //     const updateData = {};
// // //     if (izina_ryogukoresha) updateData.izina_ryogukoresha = izina_ryogukoresha;
// // //     if (nimero_yatelefone) updateData.nimero_yatelefone = nimero_yatelefone;
// // //     if (email) updateData.email = email;
// // //     if (imyaka) updateData.imyaka = imyaka;
// // //     if (igitsina) updateData.igitsina = igitsina;

// // //     const user = await User.findByIdAndUpdate(
// // //       req.user._id,
// // //       updateData,
// // //       { new: true, select: '-ijambo_banga' }
// // //     );

// // //     res.json({
// // //       success: true,
// // //       message: 'Profile updated successfully',
// // //       user
// // //     });

// // //   } catch (error) {
// // //     console.error('Update profile error:', error);
    
// // //     if (error.code === 11000) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Username or phone number already exists'
// // //       });
// // //     }
    
// // //     res.status(500).json({ success: false, message: 'Server error' });
// // //   }
// // // });

// // // module.exports = router;











// // // routes/user.js
// // const express = require('express');
// // const router = express.Router();
// // const authMiddleware = require('../middleware/authMiddleware');
// // const User = require('../models/User');

// // // @route GET /api/user/dashboard
// // router.get('/dashboard', authMiddleware, async (req, res) => {
// //   try { 
// //     const fullUser = await User.findById(req.user._id).select('-ijambo_banga');
    
// //     if (!fullUser) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     fullUser.lastLogin = new Date();
// //     await fullUser.save();

// //     const dashboardData = fullUser.getDashboardData();
// //     res.json(dashboardData);

// //   } catch (error) {
// //     console.error('Dashboard error:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // @route POST /api/user/withdraw
// // router.post('/withdraw', authMiddleware, async (req, res) => {
// //   try {
// //     const { amount, paymentMethod, phoneNumber, description } = req.body;

// //     // Validation
// //     if (!amount || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// //     }
// //     if (amount < 5000) {
// //       return res.status(400).json({ success: false, message: 'Minimum withdrawal is 5,000 FRW' });
// //     }
// //     if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
// //       return res.status(400).json({ success: false, message: 'Invalid payment method' });
// //     }
// //     if (!phoneNumber || phoneNumber.length < 10) {
// //       return res.status(400).json({ success: false, message: 'Valid phone number required' });
// //     }

// //     const user = await User.findById(req.user._id);
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     const transaction = await user.createWithdrawalRequest(
// //       amount,
// //       paymentMethod,
// //       phoneNumber,
// //       description || `Withdrawal request via ${paymentMethod}`
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Withdrawal request submitted successfully!',
// //       transaction: {
// //         id: transaction._id,
// //         reference: transaction.reference,
// //         amount: transaction.amount,
// //         status: transaction.status,
// //         paymentMethod: transaction.paymentMethod,
// //         phoneNumber: transaction.phoneNumber,
// //         createdAt: transaction.createdAt
// //       },
// //       wallets: {
// //         earning: user.wallets.earning,
// //         reserved: user.wallets.reserved,
// //         main: user.wallets.main
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Withdrawal error:', error);
// //     res.status(400).json({ 
// //       success: false, 
// //       message: error.message || 'Failed to create withdrawal request'
// //     });
// //   }
// // });

// // // @route POST /api/user/deposit
// // router.post('/deposit', authMiddleware, async (req, res) => {
// //   try {
// //     const { amount, paymentMethod, phoneNumber, description } = req.body;

// //     if (!amount || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// //     }
// //     if (amount < 1000) {
// //       return res.status(400).json({ success: false, message: 'Minimum deposit is 1,000 FRW' });
// //     }
// //     if (!paymentMethod || !['mtn', 'airtel', 'bank'].includes(paymentMethod)) {
// //       return res.status(400).json({ success: false, message: 'Invalid payment method' });
// //     }
// //     if (!phoneNumber || phoneNumber.length < 10) {
// //       return res.status(400).json({ success: false, message: 'Valid phone number required' });
// //     }

// //     const user = await User.findById(req.user._id);
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     const transaction = await user.createDepositRequest(
// //       amount,
// //       paymentMethod,
// //       phoneNumber,
// //       description || `Deposit request via ${paymentMethod}`
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Deposit request submitted successfully!',
// //       transaction: {
// //         id: transaction._id,
// //         reference: transaction.reference,
// //         amount: transaction.amount,
// //         status: transaction.status,
// //         paymentMethod: transaction.paymentMethod,
// //         phoneNumber: transaction.phoneNumber,
// //         createdAt: transaction.createdAt
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Deposit error:', error);
// //     res.status(400).json({ 
// //       success: false, 
// //       message: error.message || 'Failed to create deposit request'
// //     });
// //   }
// // });

// // // @route POST /api/user/purchase - UPDATED with referral commission
// // router.post('/purchase', authMiddleware, async (req, res) => {
// //   try {
// //     const { productId, productName, amount } = req.body;
    
// //     const user = await User.findById(req.user._id);
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     // Check if user has enough balance
// //     const availableBalance = user.wallets.main - user.wallets.reserved;
// //     if (availableBalance < amount) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `Insufficient balance. Available: ${availableBalance.toLocaleString()} FRW`
// //       });
// //     }

// //     const dailyEarning = Math.round(amount * 0.25);

// //     // Check if this is user's first investment
// //     const isFirstInvestment = !user.activeInvestments || user.activeInvestments.length === 0;

// //     // Create investment
// //     const result = await user.createInvestment(
// //       productId,
// //       productName,
// //       amount,
// //       dailyEarning,
// //       '30 days',
// //       '25%'
// //     );

// //     // ✅ REFERRAL COMMISSION LOGIC - Only on first investment
// //     if (isFirstInvestment && user.referredBy) {
// //       try {
// //         // Find the referrer
// //         const referrer = await User.findById(user.referredBy);
        
// //         if (referrer) {
// //           const commission = Math.round(amount * 0.1); // 10% commission
          
// //           // Add commission to referrer's earning wallet
// //           referrer.wallets.earning += commission;
// //           referrer.stats.referralEarnings = (referrer.stats.referralEarnings || 0) + commission;
          
// //           // Add notification for referrer
// //           await referrer.addNotification(
// //             `🎉 You earned ${commission.toLocaleString()} FRW commission from ${user.izina_ryogukoresha}'s first investment of ${amount.toLocaleString()} FRW!`,
// //             'success'
// //           );
          
// //           // Create transaction record for referrer
// //           referrer.transactions.push({
// //             type: 'referral',
// //             amount: commission,
// //             status: 'completed',
// //             description: `10% commission from ${user.izina_ryogukoresha}'s first investment`,
// //             paymentMethod: 'system',
// //             reference: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
// //             createdAt: new Date()
// //           });
          
// //           await referrer.save();
          
// //           console.log(`💰 Referral commission: ${commission} FRW paid to ${referrer.izina_ryogukoresha} for ${user.izina_ryogukoresha}'s first investment`);
// //         }
// //       } catch (refError) {
// //         console.error('Error processing referral commission:', refError);
// //         // Don't fail the purchase if referral commission fails
// //       }
// //     }

// //     res.json({
// //       success: true,
// //       message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
// //       investment: result.investment,
// //       transaction: result.transaction,
// //       wallets: user.wallets,
// //       dailyEarning,
// //       isFirstInvestment
// //     });

// //   } catch (error) {
// //     console.error('Purchase error:', error);
// //     res.status(400).json({ 
// //       success: false, 
// //       message: error.message || 'Purchase failed'
// //     });
// //   }
// // });

// // // @route GET /api/user/active-investments
// // router.get('/active-investments', authMiddleware, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id).select('activeInvestments');
    
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
// // router.get('/transactions', authMiddleware, async (req, res) => {
// //   try {
// //     const { limit = 50, type } = req.query;
// //     const user = await User.findById(req.user._id).select('transactions');
    
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     let transactions = user.transactions || [];
    
// //     if (type) {
// //       transactions = transactions.filter(t => t.type === type);
// //     }

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
// // router.post('/transfer-earnings', authMiddleware, async (req, res) => {
// //   try {
// //     const { amount } = req.body;

// //     if (!amount || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Invalid amount' });
// //     }

// //     const user = await User.findById(req.user._id);
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }

// //     const transaction = await user.transferEarnings(amount);

// //     res.json({
// //       success: true,
// //       message: `Successfully transferred ${amount.toLocaleString()} FRW to main wallet`,
// //       wallets: user.wallets,
// //       transaction
// //     });

// //   } catch (error) {
// //     console.error('Transfer earnings error:', error);
// //     res.status(400).json({ 
// //       success: false, 
// //       message: error.message || 'Server error' 
// //     });
// //   }
// // });

// // // @route GET /api/user/profile
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
// //         email: user.email,
// //         referralCode: user.referralCode,
// //         referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signup?ref=${user.referralCode}`,
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
// // router.put('/profile', authMiddleware, async (req, res) => {
// //   try {
// //     const { izina_ryogukoresha, nimero_yatelefone, email, imyaka, igitsina } = req.body;

// //     const updateData = {};
// //     if (izina_ryogukoresha) updateData.izina_ryogukoresha = izina_ryogukoresha;
// //     if (nimero_yatelefone) updateData.nimero_yatelefone = nimero_yatelefone;
// //     if (email) updateData.email = email;
// //     if (imyaka) updateData.imyaka = imyaka;
// //     if (igitsina) updateData.igitsina = igitsina;

// //     const user = await User.findByIdAndUpdate(
// //       req.user._id,
// //       updateData,
// //       { new: true, select: '-ijambo_banga' }
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Profile updated successfully',
// //       user
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


// // routes/user.js
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const User = require('../models/User');

// // @route GET /api/user/dashboard
// router.get('/dashboard', authMiddleware, async (req, res) => {
//   try { 
//     const fullUser = await User.findById(req.user._id).select('-ijambo_banga');
    
//     if (!fullUser) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     fullUser.lastLogin = new Date();
//     await fullUser.save();

//     const dashboardData = fullUser.getDashboardData();
//     res.json(dashboardData);

//   } catch (error) {
//     console.error('Dashboard error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // @route POST /api/user/withdraw - UPDATED WITH DEBUGGING
// router.post('/withdraw', authMiddleware, async (req, res) => {
//   try {
//     const { amount, paymentMethod, phoneNumber, description } = req.body;

//     console.log("🔍 WITHDRAWAL REQUEST - START");
//     console.log("Amount requested:", amount);
//     console.log("Payment method:", paymentMethod);
//     console.log("Phone number:", phoneNumber);

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

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     console.log("✅ User found:", user.izina_ryogukoresha);
//     console.log("💰 BEFORE - Wallets:", {
//       main: user.wallets.main,
//       earning: user.wallets.earning,
//       reserved: user.wallets.reserved
//     });

//     // Check for pending withdrawals
//     const hasPendingWithdrawal = user.transactions.some(t => 
//       t.type === 'withdraw' && t.status === 'pending'
//     );
    
//     if (hasPendingWithdrawal) {
//       return res.status(400).json({
//         success: false,
//         message: 'You have a pending withdrawal request. Please wait for it to be processed.'
//       });
//     }

//     // Create withdrawal request
//     const transaction = await user.createWithdrawalRequest(
//       amount,
//       paymentMethod,
//       phoneNumber,
//       description || `Withdrawal request via ${paymentMethod}`
//     );

//     console.log("💰 AFTER - Wallets:", {
//       main: user.wallets.main,
//       earning: user.wallets.earning,
//       reserved: user.wallets.reserved
//     });

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
//       }
//     });

//   } catch (error) {
//     console.error('❌ Withdrawal error:', error);
    
//     // Check if this is a balance error
//     if (error.message.includes('Insufficient earnings balance')) {
//       // Let's check what the actual balance is
//       try {
//         const userCheck = await User.findById(req.user._id);
//         console.log("🔍 Current balance in database:", userCheck.wallets.earning);
        
//         return res.status(400).json({ 
//           success: false, 
//           message: `Insufficient earnings balance. Available: ${userCheck.wallets.earning} FRW`
//         });
//       } catch (e) {
//         // Ignore
//       }
//     }
    
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to create withdrawal request'
//     });
//   }
// });

// // @route POST /api/user/deposit
// router.post('/deposit', authMiddleware, async (req, res) => {
//   try {
//     const { amount, paymentMethod, phoneNumber, description } = req.body;

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

//     const user = await User.findById(req.user._id);
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
//     console.error('Deposit error:', error);
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to create deposit request'
//     });
//   }
// });

// // @route POST /api/user/purchase
// router.post('/purchase', authMiddleware, async (req, res) => {
//   try {
//     const { productId, productName, amount } = req.body;
    
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Check if user has enough balance
//     const availableBalance = user.wallets.main - user.wallets.reserved;
//     if (availableBalance < amount) {
//       return res.status(400).json({
//         success: false,
//         message: `Insufficient balance. Available: ${availableBalance.toLocaleString()} FRW`
//       });
//     }

//     const dailyEarning = Math.round(amount * 0.25);

//     // Check if this is user's first investment
//     const isFirstInvestment = !user.activeInvestments || user.activeInvestments.length === 0;

//     // Create investment
//     const result = await user.createInvestment(
//       productId,
//       productName,
//       amount,
//       dailyEarning,
//       '30 days',
//       '25%'
//     );

//     // ✅ REFERRAL COMMISSION LOGIC - Only on first investment
//     if (isFirstInvestment && user.referredBy) {
//       try {
//         // Find the referrer
//         const referrer = await User.findById(user.referredBy);
        
//         if (referrer) {
//           const commission = Math.round(amount * 0.1); // 10% commission
          
//           // Add commission to referrer's earning wallet
//           referrer.wallets.earning += commission;
//           referrer.stats.referralEarnings = (referrer.stats.referralEarnings || 0) + commission;
          
//           // Add notification for referrer
//           await referrer.addNotification(
//             `🎉 You earned ${commission.toLocaleString()} FRW commission from ${user.izina_ryogukoresha}'s first investment of ${amount.toLocaleString()} FRW!`,
//             'success'
//           );
          
//           // Create transaction record for referrer
//           referrer.transactions.push({
//             type: 'referral',
//             amount: commission,
//             status: 'completed',
//             description: `10% commission from ${user.izina_ryogukoresha}'s first investment`,
//             paymentMethod: 'system',
//             reference: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
//             createdAt: new Date()
//           });
          
//           await referrer.save();
          
//           console.log(`💰 Referral commission: ${commission} FRW paid to ${referrer.izina_ryogukoresha} for ${user.izina_ryogukoresha}'s first investment`);
//         }
//       } catch (refError) {
//         console.error('Error processing referral commission:', refError);
//         // Don't fail the purchase if referral commission fails
//       }
//     }

//     res.json({
//       success: true,
//       message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
//       investment: result.investment,
//       transaction: result.transaction,
//       wallets: user.wallets,
//       dailyEarning,
//       isFirstInvestment
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
// router.get('/active-investments', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('activeInvestments');
    
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
// router.get('/transactions', authMiddleware, async (req, res) => {
//   try {
//     const { limit = 50, type } = req.query;
//     const user = await User.findById(req.user._id).select('transactions');
    
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
// router.post('/transfer-earnings', authMiddleware, async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ success: false, message: 'Invalid amount' });
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const transaction = await user.transferEarnings(amount);

//     res.json({
//       success: true,
//       message: `Successfully transferred ${amount.toLocaleString()} FRW to main wallet`,
//       wallets: user.wallets,
//       transaction
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
//         email: user.email,
//         referralCode: user.referralCode,
//         referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signup?ref=${user.referralCode}`,
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
// router.put('/profile', authMiddleware, async (req, res) => {
//   try {
//     const { izina_ryogukoresha, nimero_yatelefone, email, imyaka, igitsina } = req.body;

//     const updateData = {};
//     if (izina_ryogukoresha) updateData.izina_ryogukoresha = izina_ryogukoresha;
//     if (nimero_yatelefone) updateData.nimero_yatelefone = nimero_yatelefone;
//     if (email) updateData.email = email;
//     if (imyaka) updateData.imyaka = imyaka;
//     if (igitsina) updateData.igitsina = igitsina;

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       updateData,
//       { new: true, select: '-ijambo_banga' }
//     );

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       user
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

// // @route GET /api/user/debug/wallets - DEBUG ENDPOINT
// router.get('/debug/wallets', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
    
//     // Force a fresh load from database
//     const freshUser = await User.findById(req.user._id).lean();
    
//     res.json({
//       success: true,
//       debug: {
//         current: {
//           wallets: user.wallets,
//           pendingWithdrawals: user.transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').length,
//           hasPendingWithdrawal: user.transactions.some(t => t.type === 'withdraw' && t.status === 'pending')
//         },
//         fresh: {
//           wallets: freshUser.wallets,
//           pendingWithdrawals: freshUser.transactions?.filter(t => t.type === 'withdraw' && t.status === 'pending').length || 0
//         },
//         comparison: {
//           earningMatch: user.wallets.earning === freshUser.wallets.earning,
//           earningCurrent: user.wallets.earning,
//           earningFresh: freshUser.wallets.earning
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const notifyUser = require('../utils/notifications');

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

// @route POST /api/user/withdraw - UPDATED WITH DEBUGGING
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;

    console.log("🔍 WITHDRAWAL REQUEST - START");
    console.log("Amount requested:", amount);
    console.log("Payment method:", paymentMethod);
    console.log("Phone number:", phoneNumber);

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

    console.log("✅ User found:", user.izina_ryogukoresha);
    console.log("💰 BEFORE - Wallets:", {
      main: user.wallets.main,
      earning: user.wallets.earning,
      reserved: user.wallets.reserved
    });

    // Check for pending withdrawals
    const hasPendingWithdrawal = user.transactions.some(t => 
      t.type === 'withdraw' && t.status === 'pending'
    );
    
    if (hasPendingWithdrawal) {
      return res.status(400).json({
        success: false,
        message: 'You have a pending withdrawal request. Please wait for it to be processed.'
      });
    }

    // Create withdrawal request
    const transaction = await user.createWithdrawalRequest(
      amount,
      paymentMethod,
      phoneNumber,
      description || `Withdrawal request via ${paymentMethod}`
    );

    // ✅ NOTIFICATION: Withdrawal request submitted
    await notifyUser.withdrawRequest(
      user._id,
      amount,
      transaction._id
    );

    console.log("💰 AFTER - Wallets:", {
      main: user.wallets.main,
      earning: user.wallets.earning,
      reserved: user.wallets.reserved
    });

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
    console.error('❌ Withdrawal error:', error);
    
    // Check if this is a balance error
    if (error.message.includes('Insufficient earnings balance')) {
      // Let's check what the actual balance is
      try {
        const userCheck = await User.findById(req.user._id);
        console.log("🔍 Current balance in database:", userCheck.wallets.earning);
        
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient earnings balance. Available: ${userCheck.wallets.earning} FRW`
        });
      } catch (e) {
        // Ignore
      }
    }
    
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

    // ✅ NOTIFICATION: Deposit request submitted
    await notifyUser.depositRequest(
      user._id,
      amount,
      transaction._id
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

    // Check if user has enough balance
    const availableBalance = user.wallets.main - user.wallets.reserved;
    if (availableBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${availableBalance.toLocaleString()} FRW`
      });
    }

    const dailyEarning = Math.round(amount * 0.25);

    // Check if this is user's first investment
    const isFirstInvestment = !user.activeInvestments || user.activeInvestments.length === 0;

    // Create investment
    const result = await user.createInvestment(
      productId,
      productName,
      amount,
      dailyEarning,
      '30 days',
      '25%'
    );

    // ✅ NOTIFICATION: Investment successful
    await notifyUser.investmentSuccess(
      user._id,
      productName,
      amount,
      result.investment._id
    );

    // ✅ REFERRAL COMMISSION LOGIC - Only on first investment
    if (isFirstInvestment && user.referredBy) {
      try {
        // Find the referrer
        const referrer = await User.findById(user.referredBy);
        
        if (referrer) {
          const commission = Math.round(amount * 0.1); // 10% commission
          
          // Add commission to referrer's earning wallet
          referrer.wallets.earning += commission;
          referrer.stats.referralEarnings = (referrer.stats.referralEarnings || 0) + commission;
          
          // Add notification for referrer (using existing method)
          await referrer.addNotification(
            `🎉 You earned ${commission.toLocaleString()} FRW commission from ${user.izina_ryogukoresha}'s first investment of ${amount.toLocaleString()} FRW!`,
            'success'
          );
          
          // ✅ NOTIFICATION: Referral bonus using new system
          await notifyUser.referralBonus(
            referrer._id,
            commission,
            user.izina_ryogukoresha
          );
          
          // Create transaction record for referrer
          referrer.transactions.push({
            type: 'referral',
            amount: commission,
            status: 'completed',
            description: `10% commission from ${user.izina_ryogukoresha}'s first investment`,
            paymentMethod: 'system',
            reference: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            createdAt: new Date()
          });
          
          await referrer.save();
          
          console.log(`💰 Referral commission: ${commission} FRW paid to ${referrer.izina_ryogukoresha} for ${user.izina_ryogukoresha}'s first investment`);
        }
      } catch (refError) {
        console.error('Error processing referral commission:', refError);
        // Don't fail the purchase if referral commission fails
      }
    }

    res.json({
      success: true,
      message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
      investment: result.investment,
      transaction: result.transaction,
      wallets: user.wallets,
      dailyEarning,
      isFirstInvestment
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

    // ✅ NOTIFICATION: Transfer successful
    await notifyUser.transferSuccess(
      user._id,
      amount,
      transaction._id
    );

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
        referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signup?ref=${user.referralCode}`,
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

// @route GET /api/user/debug/wallets - DEBUG ENDPOINT
router.get('/debug/wallets', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Force a fresh load from database
    const freshUser = await User.findById(req.user._id).lean();
    
    res.json({
      success: true,
      debug: {
        current: {
          wallets: user.wallets,
          pendingWithdrawals: user.transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').length,
          hasPendingWithdrawal: user.transactions.some(t => t.type === 'withdraw' && t.status === 'pending')
        },
        fresh: {
          wallets: freshUser.wallets,
          pendingWithdrawals: freshUser.transactions?.filter(t => t.type === 'withdraw' && t.status === 'pending').length || 0
        },
        comparison: {
          earningMatch: user.wallets.earning === freshUser.wallets.earning,
          earningCurrent: user.wallets.earning,
          earningFresh: freshUser.wallets.earning
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;