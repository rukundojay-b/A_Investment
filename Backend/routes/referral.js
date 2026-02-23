// // // backend/routes/referral.js
// // const express = require('express');
// // const router = express.Router();
// // const User = require('../models/User');
// // const authMiddleware = require('../middleware/auth');

// // // Get user's team members (people they referred)
// // router.get('/team', authMiddleware, async (req, res) => {
// //   try {
// //     const userId = req.user._id;
    
// //     // Find all users who were referred by this user
// //     const teamMembers = await User.find({ referredBy: userId })
// //       .select('izina_ryogukoresha nimero_yatelefone createdAt activeInvestments stats')
// //       .sort({ createdAt: -1 });
    
// //     // Format the team members data
// //     const formattedTeam = teamMembers.map(member => ({
// //       _id: member._id,
// //       name: member.izina_ryogukoresha,
// //       phone: member.nimero_yatelefone,
// //       joinedAt: member.createdAt,
// //       investment: member.activeInvestments?.reduce((sum, inv) => sum + (inv.purchasePrice || 0), 0) || 0,
// //       earnings: member.stats?.totalEarned || 0,
// //       active: member.status === 'active'
// //     }));

// //     res.json({
// //       success: true,
// //       team: formattedTeam,
// //       total: formattedTeam.length
// //     });

// //   } catch (error) {
// //     console.error('Error fetching team:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Get referral statistics
// // router.get('/stats', authMiddleware, async (req, res) => {
// //   try {
// //     const userId = req.user._id;
// //     const user = await User.findById(userId);
    
// //     res.json({
// //       success: true,
// //       stats: {
// //         totalReferrals: user.stats?.totalReferrals || 0,
// //         referralEarnings: user.stats?.referralEarnings || 0,
// //         referralCode: user.referralCode
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Error fetching referral stats:', error);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;






// // routes/referral.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const authMiddleware = require('../middleware/authMiddleware');

// // Get user's team members (people they referred)
// router.get('/team', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     // Find all users who were referred by this user
//     const teamMembers = await User.find({ referredBy: userId })
//       .select('izina_ryogukoresha nimero_yatelefone createdAt activeInvestments stats status')
//       .sort({ createdAt: -1 });
    
//     // Format the team members data
//     const formattedTeam = teamMembers.map(member => {
//       // Calculate total investment
//       const totalInvestment = member.activeInvestments?.reduce((sum, inv) => sum + (inv.purchasePrice || 0), 0) || 0;
      
//       // Calculate potential commission (10% of first investment)
//       // For display purposes, we'll show based on their current investment
//       const potentialCommission = Math.round(totalInvestment * 0.1);
      
//       return {
//         _id: member._id,
//         name: member.izina_ryogukoresha,
//         phone: member.nimero_yatelefone,
//         joinedAt: member.createdAt,
//         investment: totalInvestment,
//         potentialCommission: potentialCommission,
//         active: member.status === 'active'
//       };
//     });

//     // Get user's referral stats
//     const user = await User.findById(userId).select('stats referralCode');
    
//     res.json({
//       success: true,
//       team: formattedTeam,
//       total: formattedTeam.length,
//       stats: {
//         totalReferrals: user?.stats?.totalReferrals || 0,
//         referralEarnings: user?.stats?.referralEarnings || 0,
//         referralCode: user?.referralCode || ''
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching team:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Get referral statistics
// router.get('/stats', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId).select('stats referralCode');
    
//     // Get count of team members
//     const teamCount = await User.countDocuments({ referredBy: userId });
    
//     res.json({
//       success: true,
//       stats: {
//         totalReferrals: user?.stats?.totalReferrals || teamCount,
//         referralEarnings: user?.stats?.referralEarnings || 0,
//         referralCode: user?.referralCode || ''
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching referral stats:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Get referral leaderboard (optional)
// router.get('/leaderboard', authMiddleware, async (req, res) => {
//   try {
//     const topReferrers = await User.find({ 'stats.totalReferrals': { $gt: 0 } })
//       .select('izina_ryogukoresha stats.totalReferrals stats.referralEarnings')
//       .sort({ 'stats.totalReferrals': -1 })
//       .limit(10);
    
//     res.json({
//       success: true,
//       leaderboard: topReferrers.map(user => ({
//         name: user.izina_ryogukoresha,
//         referrals: user.stats.totalReferrals,
//         earnings: user.stats.referralEarnings || 0
//       }))
//     });

//   } catch (error) {
//     console.error('Error fetching leaderboard:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;











// backend/routes/referral.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get user's team members (people they referred)
router.get('/team', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all users who were referred by this user
    const teamMembers = await User.find({ referredBy: userId })
      .select('izina_ryogukoresha nimero_yatelefone createdAt activeInvestments stats status')
      .sort({ createdAt: -1 });
    
    // Format the team members data
    const formattedTeam = teamMembers.map(member => {
      // Calculate total investment
      const totalInvestment = member.activeInvestments?.reduce((sum, inv) => sum + (inv.purchasePrice || 0), 0) || 0;
      
      // Calculate potential commission (10% of first investment)
      // For display purposes, we'll show based on their current investment
      const potentialCommission = Math.round(totalInvestment * 0.1);
      
      return {
        _id: member._id,
        name: member.izina_ryogukoresha,
        phone: member.nimero_yatelefone,
        joinedAt: member.createdAt,
        investment: totalInvestment,
        potentialCommission: potentialCommission,
        active: member.status === 'active'
      };
    });

    // Get user's referral stats
    const user = await User.findById(userId).select('stats referralCode');
    
    res.json({
      success: true,
      team: formattedTeam,
      total: formattedTeam.length,
      stats: {
        totalReferrals: user?.stats?.totalReferrals || 0,
        referralEarnings: user?.stats?.referralEarnings || 0,
        referralCode: user?.referralCode || ''
      }
    });

  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get referral statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('stats referralCode');
    
    // Get count of team members
    const teamCount = await User.countDocuments({ referredBy: userId });
    
    res.json({
      success: true,
      stats: {
        totalReferrals: user?.stats?.totalReferrals || teamCount,
        referralEarnings: user?.stats?.referralEarnings || 0,
        referralCode: user?.referralCode || ''
      }
    });

  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get referral leaderboard (optional)
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const topReferrers = await User.find({ 'stats.totalReferrals': { $gt: 0 } })
      .select('izina_ryogukoresha stats.totalReferrals stats.referralEarnings')
      .sort({ 'stats.totalReferrals': -1 })
      .limit(10);
    
    res.json({
      success: true,
      leaderboard: topReferrers.map(user => ({
        name: user.izina_ryogukoresha,
        referrals: user.stats.totalReferrals,
        earnings: user.stats.referralEarnings || 0
      }))
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;