// backend/routes/referral.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get referral info
router.get('/info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get referred users
    const referredUsers = await User.find({ referredBy: user._id })
      .select('izina_ryogukoresha nimero_yatelefone createdAt wallets.main')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      referralCode: user.referralCode,
      referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?ref=${user.referralCode}`,
      stats: {
        totalReferrals: user.stats?.totalReferrals || 0,
        referralEarnings: user.stats?.referralEarnings || 0,
        activeReferrals: referredUsers.length
      },
      referredUsers,
      commissionRate: 10 // 10% commission on referrals' investments
    });
  } catch (error) {
    console.error('Referral info error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get referral leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topReferrers = await User.find()
      .sort({ 'stats.totalReferrals': -1, 'stats.referralEarnings': -1 })
      .limit(10)
      .select('izina_ryogukoresha referralCode stats.totalReferrals stats.referralEarnings');
    
    res.json({ 
      success: true, 
      leaderboard: topReferrers,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;