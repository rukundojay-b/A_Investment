// // backend/routes/wallet.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const auth = require('../middleware/auth');

// // Get wallet balance
// router.get('/balance', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
//     res.json({ 
//       success: true, 
//       wallets: user.wallets,
//       available: user.wallets.main - user.wallets.reserved,
//       stats: {
//         totalEarned: user.stats?.totalEarned || 0,
//         totalSpent: user.stats?.totalSpent || 0,
//         totalDeposits: user.stats?.totalDeposits || 0,
//         totalWithdrawn: user.stats?.totalWithdrawn || 0
//       }
//     });
//   } catch (error) {
//     console.error('Get balance error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Transfer from earning to main wallet
// router.post('/transfer', auth, async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (!amount || amount <= 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid amount' 
//       });
//     }
    
//     if (user.wallets.earning < amount) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Insufficient earnings balance. Available: ${user.wallets.earning} FRW` 
//       });
//     }
    
//     // Transfer
//     user.wallets.earning -= amount;
//     user.wallets.main += amount;
    
//     // Update stats
//     user.stats.totalEarned = (user.stats.totalEarned || 0) - amount;
    
//     // Add transaction record
//     const transaction = {
//       type: 'earning',
//       amount: amount,
//       status: 'completed',
//       description: `Transferred earnings to main wallet`,
//       paymentMethod: 'system',
//       reference: `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
//       createdAt: new Date()
//     };
    
//     user.transactions.push(transaction);
    
//     await user.save();
    
//     res.json({ 
//       success: true, 
//       message: `Successfully transferred ${amount} FRW to main wallet`,
//       wallets: user.wallets,
//       transaction: transaction
//     });
//   } catch (error) {
//     console.error('Transfer error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// module.exports = router;











// backend/routes/wallet.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // ← FIXED: changed from 'auth' to 'authMiddleware'

// Get wallet balance
router.get('/balance', authMiddleware, async (req, res) => { // ← FIXED: changed from 'auth' to 'authMiddleware'
  try {
    const user = await User.findById(req.user._id); // ← FIXED: req.user.id → req.user._id
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.json({ 
      success: true, 
      wallets: user.wallets,
      available: user.wallets.main - user.wallets.reserved,
      stats: {
        totalEarned: user.stats?.totalEarned || 0,
        totalSpent: user.stats?.totalSpent || 0,
        totalDeposits: user.stats?.totalDeposits || 0,
        totalWithdrawn: user.stats?.totalWithdrawn || 0
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Transfer from earning to main wallet
router.post('/transfer', authMiddleware, async (req, res) => { // ← FIXED: changed from 'auth' to 'authMiddleware'
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id); // ← FIXED: req.user.id → req.user._id
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }
    
    if (user.wallets.earning < amount) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient earnings balance. Available: ${user.wallets.earning} FRW` 
      });
    }
    
    // Transfer
    user.wallets.earning -= amount;
    user.wallets.main += amount;
    
    // Update stats
    user.stats.totalEarned = (user.stats.totalEarned || 0) - amount;
    
    // Add transaction record
    const transaction = {
      type: 'transfer', // ← FIXED: changed from 'earning' to 'transfer' to match schema
      amount: amount,
      status: 'completed',
      description: `Transferred earnings to main wallet`,
      paymentMethod: 'system',
      reference: `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      createdAt: new Date()
    };
    
    user.transactions.push(transaction);
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: `Successfully transferred ${amount} FRW to main wallet`,
      wallets: user.wallets,
      transaction: transaction
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;