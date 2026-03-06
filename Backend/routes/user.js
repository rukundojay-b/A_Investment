// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
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

// @route POST /api/user/withdraw
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;

    console.log("🔍 WITHDRAWAL REQUEST - START");
    console.log("Amount requested:", amount);
    console.log("Payment method:", paymentMethod);
    console.log("Phone number:", phoneNumber);

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

    const hasPendingWithdrawal = user.transactions.some(t => 
      t.type === 'withdraw' && t.status === 'pending'
    );
    
    if (hasPendingWithdrawal) {
      return res.status(400).json({
        success: false,
        message: 'You have a pending withdrawal request. Please wait for it to be processed.'
      });
    }

    const transaction = await user.createWithdrawalRequest(
      amount,
      paymentMethod,
      phoneNumber,
      description || `Withdrawal request via ${paymentMethod}`
    );

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
    
    if (error.message.includes('Insufficient earnings balance')) {
      try {
        const userCheck = await User.findById(req.user._id);
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient earnings balance. Available: ${userCheck.wallets.earning} FRW`
        });
      } catch (e) {}
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

// @route POST /api/user/purchase - UPDATED with Investment model
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { productId, productName, amount } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const availableBalance = user.wallets.main - user.wallets.reserved;
    if (availableBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${availableBalance.toLocaleString()} FRW`
      });
    }

    const dailyEarning = Math.round(amount * 0.1429); // 14.29% daily return
    const totalReturn = amount + (dailyEarning * 30);

    const isFirstInvestment = !user.activeInvestments || user.activeInvestments.length === 0;

    // Create investment in Investment collection
    const result = await user.createInvestment(
      productId,
      productName,
      amount,
      dailyEarning,
      '30 days',
      '14.29%'
    );

    await notifyUser.investmentSuccess(
      user._id,
      productName,
      amount,
      result.investmentId
    );

    // Referral commission on first investment
    if (isFirstInvestment && user.referredBy) {
      try {
        const referrer = await User.findById(user.referredBy);
        
        if (referrer) {
          const commission = Math.round(amount * 0.1); // 10% commission
          
          referrer.wallets.earning += commission;
          referrer.stats.referralEarnings = (referrer.stats.referralEarnings || 0) + commission;
          
          await referrer.addNotification(
            `🎉 You earned ${commission.toLocaleString()} FRW commission from ${user.izina_ryogukoresha}'s first investment of ${amount.toLocaleString()} FRW!`,
            'success'
          );
          
          await notifyUser.referralBonus(
            referrer._id,
            commission,
            user.izina_ryogukoresha
          );
          
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
          
          console.log(`💰 Referral commission: ${commission} FRW paid to ${referrer.izina_ryogukoresha}`);
        }
      } catch (refError) {
        console.error('Error processing referral commission:', refError);
      }
    }

    // Get investment with end date
    const investmentDoc = await Investment.findById(result.investmentId);

    res.json({
      success: true,
      message: `Successfully purchased ${productName} for ${amount.toLocaleString()} FRW`,
      investment: result.investment,
      transaction: result.transaction,
      wallets: user.wallets,
      dailyEarning,
      isFirstInvestment,
      endDate: investmentDoc.endDate
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Purchase failed'
    });
  }
});

// @route GET /api/user/active-investments - UPDATED to use Investment model
router.get('/active-investments', authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({ 
      user: req.user._id,
      status: 'active'
    }).sort({ purchaseDate: -1 });

    const investmentsWithDetails = investments.map(inv => {
      const purchaseDate = new Date(inv.purchaseDate);
      const today = new Date();
      const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
      const earningsSoFar = inv.dailyEarning * Math.min(daysSincePurchase, 30);
      const remainingDays = Math.max(0, 30 - daysSincePurchase);
      const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
      return {
        ...inv.toObject(),
        daysSincePurchase: Math.max(0, daysSincePurchase),
        earningsSoFar: Math.max(0, earningsSoFar),
        remainingDays,
        progress,
        isToday: purchaseDate.toDateString() === today.toDateString()
      };
    });

    res.json({
      success: true,
      activeInvestments: investmentsWithDetails
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

// @route POST /api/user/test-process-day - TEST ENDPOINT for daily earnings
router.post('/test-process-day', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const investments = await Investment.find({ 
      user: user._id,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (investments.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No active investments found',
        investments: 0
      });
    }

    let totalEarned = 0;
    let processedCount = 0;

    for (const inv of investments) {
      const lastProfitDate = inv.lastProfitDate;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (lastProfitDate && new Date(lastProfitDate).setHours(0, 0, 0, 0) >= today) {
        continue;
      }

      const earning = inv.dailyEarning;
      
      const transaction = new Transaction({
        user: user._id,
        type: 'earning',
        amount: earning,
        status: 'completed',
        description: `Test earning from ${inv.productName}`,
        paymentMethod: 'system',
        metadata: {
          investmentId: inv._id,
          productName: inv.productName
        }
      });
      await transaction.save();
      
      inv.totalEarnedSoFar += earning;
      inv.lastProfitDate = new Date();
      await inv.save();
      
      user.wallets.earning += earning;
      user.stats.totalEarned += earning;
      
      totalEarned += earning;
      processedCount++;
    }

    await user.save();

    res.json({
      success: true,
      message: `Processed ${processedCount} investments. Added ${totalEarned.toLocaleString()} FRW to your wallet.`,
      data: {
        processed: processedCount,
        totalEarned,
        newBalance: user.wallets.earning
      }
    });

  } catch (error) {
    console.error('Test processing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;