// // // // // backend/routes/adminInvestmentRoutes.js
// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const Investment = require('../models/Investment');
// // // // const User = require('../models/User');
// // // // const adminAuth = require('../middleware/adminAuth');

// // // // // Get all investments with filters
// // // // router.get('/investments', adminAuth, async (req, res) => {
// // // //   try {
// // // //     const { dateRange, status } = req.query;
// // // //     const query = {};
    
// // // //     if (status && status !== 'all') {
// // // //       query.status = status;
// // // //     }
    
// // // //     // Date range filtering
// // // //     if (dateRange && dateRange !== 'all') {
// // // //       const today = new Date();
// // // //       today.setHours(0, 0, 0, 0);
      
// // // //       switch(dateRange) {
// // // //         case 'today':
// // // //           query.purchaseDate = { $gte: today };
// // // //           break;
// // // //         case 'week':
// // // //           const weekAgo = new Date(today);
// // // //           weekAgo.setDate(weekAgo.getDate() - 7);
// // // //           query.purchaseDate = { $gte: weekAgo };
// // // //           break;
// // // //         case 'month':
// // // //           const monthAgo = new Date(today);
// // // //           monthAgo.setMonth(monthAgo.getMonth() - 1);
// // // //           query.purchaseDate = { $gte: monthAgo };
// // // //           break;
// // // //       }
// // // //     }
    
// // // //     const investments = await Investment.find(query)
// // // //       .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
// // // //       .sort({ purchaseDate: -1 })
// // // //       .limit(500);
    
// // // //     // Add calculated fields
// // // //     const investmentsWithDetails = investments.map(inv => {
// // // //       const purchaseDate = new Date(inv.purchaseDate);
// // // //       const today = new Date();
// // // //       const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
// // // //       const remainingDays = Math.max(0, 30 - daysSincePurchase);
// // // //       const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
// // // //       return {
// // // //         ...inv.toObject(),
// // // //         _id: inv._id,
// // // //         userName: inv.user?.izina_ryogukoresha || 'Unknown',
// // // //         userPhone: inv.user?.nimero_yatelefone || '',
// // // //         daysSincePurchase: Math.max(0, daysSincePurchase),
// // // //         remainingDays,
// // // //         progress,
// // // //         profitPercentage: inv.amount > 0 ? ((inv.totalEarnedSoFar / inv.amount) * 100).toFixed(2) : 0
// // // //       };
// // // //     });
    
// // // //     // Calculate stats
// // // //     const stats = {
// // // //       totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
// // // //       totalEarned: investments.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0),
// // // //       activeCount: investments.filter(inv => inv.status === 'active').length,
// // // //       completedCount: investments.filter(inv => inv.status === 'completed').length,
// // // //       investorCount: new Set(investments.map(inv => inv.user?._id?.toString()).filter(id => id)).size,
// // // //       averageROI: investments.length > 0 
// // // //         ? (investments.reduce((sum, inv) => sum + (inv.amount > 0 ? (inv.totalEarnedSoFar / inv.amount * 100) : 0), 0) / investments.length).toFixed(2)
// // // //         : 0
// // // //     };
    
// // // //     res.json({
// // // //       success: true,
// // // //       investments: investmentsWithDetails,
// // // //       stats
// // // //     });
    
// // // //   } catch (error) {
// // // //     console.error('❌ Get investments error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to fetch investments',
// // // //       error: error.message
// // // //     });
// // // //   }
// // // // });

// // // // // Get investment by ID
// // // // router.get('/investments/:id', adminAuth, async (req, res) => {
// // // //   try {
// // // //     const investment = await Investment.findById(req.params.id)
// // // //       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets');
    
// // // //     if (!investment) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'Investment not found'
// // // //       });
// // // //     }
    
// // // //     // Add calculated fields
// // // //     const purchaseDate = new Date(investment.purchaseDate);
// // // //     const today = new Date();
// // // //     const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
// // // //     const remainingDays = Math.max(0, 30 - daysSincePurchase);
// // // //     const progress = Math.min(100, (daysSincePurchase / 30) * 100);
    
// // // //     const investmentWithDetails = {
// // // //       ...investment.toObject(),
// // // //       daysSincePurchase: Math.max(0, daysSincePurchase),
// // // //       remainingDays,
// // // //       progress,
// // // //       profitPercentage: investment.amount > 0 ? ((investment.totalEarnedSoFar / investment.amount) * 100).toFixed(2) : 0
// // // //     };
    
// // // //     res.json({
// // // //       success: true,
// // // //       investment: investmentWithDetails
// // // //     });
    
// // // //   } catch (error) {
// // // //     console.error('❌ Get investment error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to fetch investment details',
// // // //       error: error.message
// // // //     });
// // // //   }
// // // // });

// // // // // Get investment statistics summary
// // // // router.get('/investments/stats/summary', adminAuth, async (req, res) => {
// // // //   try {
// // // //     const totalInvestments = await Investment.countDocuments();
// // // //     const activeInvestments = await Investment.countDocuments({ status: 'active' });
// // // //     const completedInvestments = await Investment.countDocuments({ status: 'completed' });
    
// // // //     const totalInvested = await Investment.aggregate([
// // // //       { $group: { _id: null, total: { $sum: '$amount' } } }
// // // //     ]);
    
// // // //     const totalEarned = await Investment.aggregate([
// // // //       { $group: { _id: null, total: { $sum: '$totalEarnedSoFar' } } }
// // // //     ]);
    
// // // //     const today = new Date();
// // // //     today.setHours(0, 0, 0, 0);
    
// // // //     const todayInvestments = await Investment.countDocuments({
// // // //       purchaseDate: { $gte: today }
// // // //     });
    
// // // //     res.json({
// // // //       success: true,
// // // //       stats: {
// // // //         total: totalInvestments,
// // // //         active: activeInvestments,
// // // //         completed: completedInvestments,
// // // //         totalInvested: totalInvested[0]?.total || 0,
// // // //         totalEarned: totalEarned[0]?.total || 0,
// // // //         today: todayInvestments
// // // //       }
// // // //     });
    
// // // //   } catch (error) {
// // // //     console.error('❌ Get investment stats error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to fetch investment statistics'
// // // //     });
// // // //   }
// // // // });

// // // // module.exports = router;











// // // // backend/routes/adminInvestmentRoutes.js
// // // const express = require('express');
// // // const router = express.Router();
// // // const Investment = require('../models/Investment');
// // // const User = require('../models/User');
// // // const adminAuth = require('../middleware/adminAuth');

// // // // Get all investments with filters
// // // router.get('/investments', adminAuth, async (req, res) => {
// // //   try {
// // //     const { dateRange, status, search } = req.query;
// // //     const query = {};
    
// // //     // Status filter
// // //     if (status && status !== 'all') {
// // //       query.status = status;
// // //     }
    
// // //     // Search filter (by product name or username)
// // //     if (search && search.trim() !== '') {
// // //       // First find users matching the search
// // //       const users = await User.find({
// // //         $or: [
// // //           { izina_ryogukoresha: { $regex: search, $options: 'i' } },
// // //           { nimero_yatelefone: { $regex: search, $options: 'i' } }
// // //         ]
// // //       }).select('_id');
      
// // //       const userIds = users.map(u => u._id);
      
// // //       query.$or = [
// // //         { productName: { $regex: search, $options: 'i' } },
// // //         { user: { $in: userIds } }
// // //       ];
// // //     }
    
// // //     // Date range filtering
// // //     if (dateRange && dateRange !== 'all') {
// // //       const today = new Date();
// // //       today.setHours(0, 0, 0, 0);
      
// // //       switch(dateRange) {
// // //         case 'today':
// // //           query.purchaseDate = { $gte: today };
// // //           break;
// // //         case 'week':
// // //           const weekAgo = new Date(today);
// // //           weekAgo.setDate(weekAgo.getDate() - 7);
// // //           query.purchaseDate = { $gte: weekAgo };
// // //           break;
// // //         case 'month':
// // //           const monthAgo = new Date(today);
// // //           monthAgo.setMonth(monthAgo.getMonth() - 1);
// // //           query.purchaseDate = { $gte: monthAgo };
// // //           break;
// // //       }
// // //     }
    
// // //     console.log('Investment query:', JSON.stringify(query, null, 2));
    
// // //     const investments = await Investment.find(query)
// // //       .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
// // //       .sort({ purchaseDate: -1 })
// // //       .limit(500);
    
// // //     // Add calculated fields
// // //     const investmentsWithDetails = investments.map(inv => {
// // //       const purchaseDate = new Date(inv.purchaseDate);
// // //       const today = new Date();
// // //       const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
// // //       const remainingDays = Math.max(0, 30 - daysSincePurchase);
// // //       const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
// // //       // Calculate expected daily return rate
// // //       const returnRate = inv.amount > 0 ? ((inv.dailyEarning / inv.amount) * 100).toFixed(2) : 0;
      
// // //       return {
// // //         _id: inv._id,
// // //         user: inv.user,
// // //         userId: inv.user?._id,
// // //         userName: inv.user?.izina_ryogukoresha || 'Unknown',
// // //         userPhone: inv.user?.nimero_yatelefone || '',
// // //         productId: inv.product,
// // //         productName: inv.productName,
// // //         amount: inv.amount,
// // //         dailyEarning: inv.dailyEarning,
// // //         totalReturn: inv.totalReturn,
// // //         status: inv.status,
// // //         purchaseDate: inv.purchaseDate,
// // //         endDate: inv.endDate,
// // //         lastProfitDate: inv.lastProfitDate,
// // //         totalEarnedSoFar: inv.totalEarnedSoFar,
// // //         active: inv.active,
// // //         createdAt: inv.createdAt,
// // //         earningsHistory: inv.earningsHistory || [],
// // //         profitPercentage: inv.profitPercentage || (inv.amount > 0 ? ((inv.totalEarnedSoFar / inv.amount) * 100).toFixed(2) : 0),
// // //         daysCompleted: inv.daysCompleted || daysSincePurchase,
// // //         daysSincePurchase: Math.max(0, daysSincePurchase),
// // //         remainingDays,
// // //         progress,
// // //         returnRate: returnRate,
// // //         expectedProfit: inv.totalReturn - inv.amount,
// // //         remainingProfit: inv.totalReturn - inv.totalEarnedSoFar
// // //       };
// // //     });
    
// // //     // Calculate stats
// // //     const stats = {
// // //       totalInvested: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
// // //       totalEarned: investments.reduce((sum, inv) => sum + (inv.totalEarnedSoFar || 0), 0),
// // //       activeCount: investments.filter(inv => inv.status === 'active').length,
// // //       completedCount: investments.filter(inv => inv.status === 'completed').length,
// // //       investorCount: new Set(investments.map(inv => inv.user?._id?.toString()).filter(id => id)).size,
// // //       averageROI: investments.length > 0 
// // //         ? (investments.reduce((sum, inv) => sum + (inv.amount > 0 ? (inv.totalEarnedSoFar / inv.amount * 100) : 0), 0) / investments.length).toFixed(2)
// // //         : 0,
// // //       totalExpectedReturn: investments.reduce((sum, inv) => sum + (inv.totalReturn || 0), 0),
// // //       todayCount: investments.filter(inv => {
// // //         const today = new Date();
// // //         today.setHours(0, 0, 0, 0);
// // //         return new Date(inv.purchaseDate) >= today;
// // //       }).length
// // //     };
    
// // //     res.json({
// // //       success: true,
// // //       investments: investmentsWithDetails,
// // //       stats,
// // //       count: investments.length
// // //     });
    
// // //   } catch (error) {
// // //     console.error('❌ Get investments error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch investments',
// // //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// // //     });
// // //   }
// // // });

// // // // Get investment by ID
// // // router.get('/investments/:id', adminAuth, async (req, res) => {
// // //   try {
// // //     const investment = await Investment.findById(req.params.id)
// // //       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets');
    
// // //     if (!investment) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'Investment not found'
// // //       });
// // //     }
    
// // //     // Add calculated fields
// // //     const purchaseDate = new Date(investment.purchaseDate);
// // //     const today = new Date();
// // //     const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
// // //     const remainingDays = Math.max(0, 30 - daysSincePurchase);
// // //     const progress = Math.min(100, (daysSincePurchase / 30) * 100);
// // //     const returnRate = investment.amount > 0 ? ((investment.dailyEarning / investment.amount) * 100).toFixed(2) : 0;
    
// // //     const investmentWithDetails = {
// // //       ...investment.toObject(),
// // //       daysSincePurchase: Math.max(0, daysSincePurchase),
// // //       remainingDays,
// // //       progress,
// // //       returnRate,
// // //       profitPercentage: investment.profitPercentage || (investment.amount > 0 ? ((investment.totalEarnedSoFar / investment.amount) * 100).toFixed(2) : 0),
// // //       expectedProfit: investment.totalReturn - investment.amount,
// // //       remainingProfit: investment.totalReturn - investment.totalEarnedSoFar,
// // //       userName: investment.user?.izina_ryogukoresha || 'Unknown',
// // //       userPhone: investment.user?.nimero_yatelefone || ''
// // //     };
    
// // //     res.json({
// // //       success: true,
// // //       investment: investmentWithDetails
// // //     });
    
// // //   } catch (error) {
// // //     console.error('❌ Get investment error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch investment details',
// // //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// // //     });
// // //   }
// // // });

// // // // Get investment statistics summary
// // // router.get('/investments/stats/summary', adminAuth, async (req, res) => {
// // //   try {
// // //     const totalInvestments = await Investment.countDocuments();
// // //     const activeInvestments = await Investment.countDocuments({ status: 'active' });
// // //     const completedInvestments = await Investment.countDocuments({ status: 'completed' });
    
// // //     const totalInvested = await Investment.aggregate([
// // //       { $group: { _id: null, total: { $sum: '$amount' } } }
// // //     ]);
    
// // //     const totalEarned = await Investment.aggregate([
// // //       { $group: { _id: null, total: { $sum: '$totalEarnedSoFar' } } }
// // //     ]);
    
// // //     const totalExpected = await Investment.aggregate([
// // //       { $group: { _id: null, total: { $sum: '$totalReturn' } } }
// // //     ]);
    
// // //     const today = new Date();
// // //     today.setHours(0, 0, 0, 0);
    
// // //     const todayInvestments = await Investment.countDocuments({
// // //       purchaseDate: { $gte: today }
// // //     });
    
// // //     // Get top investments by amount
// // //     const topInvestments = await Investment.find()
// // //       .sort({ amount: -1 })
// // //       .limit(5)
// // //       .populate('user', 'izina_ryogukoresha')
// // //       .select('productName amount userName');
    
// // //     // Get recent investments
// // //     const recentInvestments = await Investment.find()
// // //       .sort({ purchaseDate: -1 })
// // //       .limit(5)
// // //       .populate('user', 'izina_ryogukoresha')
// // //       .select('productName amount userName purchaseDate');
    
// // //     res.json({
// // //       success: true,
// // //       stats: {
// // //         total: totalInvestments,
// // //         active: activeInvestments,
// // //         completed: completedInvestments,
// // //         totalInvested: totalInvested[0]?.total || 0,
// // //         totalEarned: totalEarned[0]?.total || 0,
// // //         totalExpected: totalExpected[0]?.total || 0,
// // //         today: todayInvestments,
// // //         topInvestments,
// // //         recentInvestments
// // //       }
// // //     });
    
// // //   } catch (error) {
// // //     console.error('❌ Get investment stats error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch investment statistics',
// // //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// // //     });
// // //   }
// // // });

// // // // Get investments by user ID
// // // router.get('/investments/user/:userId', adminAuth, async (req, res) => {
// // //   try {
// // //     const { userId } = req.params;
    
// // //     const investments = await Investment.find({ user: userId })
// // //       .sort({ purchaseDate: -1 })
// // //       .populate('user', 'izina_ryogukoresha nimero_yatelefone');
    
// // //     const user = await User.findById(userId).select('izina_ryogukoresha nimero_yatelefone email wallets');
    
// // //     const summary = {
// // //       totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
// // //       totalEarned: investments.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0),
// // //       activeCount: investments.filter(inv => inv.status === 'active').length,
// // //       completedCount: investments.filter(inv => inv.status === 'completed').length,
// // //       currentDailyEarnings: investments
// // //         .filter(inv => inv.status === 'active')
// // //         .reduce((sum, inv) => sum + inv.dailyEarning, 0)
// // //     };
    
// // //     res.json({
// // //       success: true,
// // //       user,
// // //       investments,
// // //       summary
// // //     });
    
// // //   } catch (error) {
// // //     console.error('❌ Get user investments error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch user investments'
// // //     });
// // //   }
// // // });

// // // // Get investment trends (for charts)
// // // router.get('/investments/trends/daily', adminAuth, async (req, res) => {
// // //   try {
// // //     const { days = 30 } = req.query;
    
// // //     const endDate = new Date();
// // //     const startDate = new Date();
// // //     startDate.setDate(startDate.getDate() - parseInt(days));
    
// // //     const investments = await Investment.find({
// // //       purchaseDate: { $gte: startDate, $lte: endDate }
// // //     }).sort({ purchaseDate: 1 });
    
// // //     // Group by date
// // //     const dailyData = {};
// // //     investments.forEach(inv => {
// // //       const date = inv.purchaseDate.toISOString().split('T')[0];
// // //       if (!dailyData[date]) {
// // //         dailyData[date] = {
// // //           date,
// // //           count: 0,
// // //           amount: 0,
// // //           users: new Set()
// // //         };
// // //       }
// // //       dailyData[date].count += 1;
// // //       dailyData[date].amount += inv.amount;
// // //       dailyData[date].users.add(inv.user.toString());
// // //     });
    
// // //     const trends = Object.values(dailyData).map(day => ({
// // //       ...day,
// // //       users: day.users.size
// // //     }));
    
// // //     res.json({
// // //       success: true,
// // //       trends
// // //     });
    
// // //   } catch (error) {
// // //     console.error('❌ Get investment trends error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch investment trends'
// // //     });
// // //   }
// // // });

// // // module.exports = router;













// // // server.js
// // const express = require('express');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const mongoose = require('mongoose');
// // const path = require('path');

// // dotenv.config();
// // const app = express();

// // // =======================
// // // MIDDLEWARE
// // // =======================
// // app.use(cors({
// //   origin: ['http://localhost:3000', 'http://localhost:5173'],
// //   credentials: true
// // }));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // =======================
// // // DATABASE
// // // =======================
// // mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_invest')
// //   .then(() => console.log('✅ MongoDB connected successfully'))
// //   .catch(err => {
// //     console.error('❌ MongoDB connection error:', err.message);
// //     process.exit(1);
// //   });

// // // =======================
// // // STATIC FILES
// // // =======================
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // =======================
// // // ROUTES
// // // =======================
// // app.use('/api/auth', require('./routes/auth'));
// // app.use('/api/products', require('./routes/product'));
// // app.use('/api/user', require('./routes/user'));
// // app.use('/api/transactions', require('./routes/transactionRoutes'));
// // app.use('/api/admin', require('./routes/adminAuth')); // Admin auth routes FIRST
// // app.use('/api/admin', require('./routes/admin')); // Your existing admin routes
// // app.use('/api/admin', require('./routes/adminInvestmentRoutes')); // Admin investment routes THIRD
// // app.use('/api/referrals', require('./routes/referral'));
// // app.use('/api/wallet', require('./routes/wallet'));
// // app.use('/api/notifications', require('./routes/notifications'));

// // // =======================
// // // HEALTH CHECK
// // // =======================
// // app.get('/api/health', (req, res) => {
// //   const dbState = mongoose.connection.readyState;
// //   const dbStatus = {
// //     0: 'disconnected',
// //     1: 'connected',
// //     2: 'connecting',
// //     3: 'disconnecting'
// //   }[dbState] || 'unknown';

// //   res.json({ 
// //     status: 'OK',
// //     database: dbStatus,
// //     uptime: process.uptime(),
// //     timestamp: new Date().toISOString(),
// //     environment: process.env.NODE_ENV || 'development'
// //   });
// // });

// // // =======================
// // // API INFO
// // // =======================
// // app.get('/api/info', (req, res) => {
// //   res.json({
// //     name: 'Apex Investment Platform',
// //     version: '1.0.0',
// //     endpoints: {
// //       auth: '/api/auth',
// //       products: '/api/products',
// //       user: '/api/user',
// //       transactions: '/api/transactions',
// //       admin: '/api/admin',
// //       referrals: '/api/referrals',
// //       wallet: '/api/wallet',
// //       notifications: '/api/notifications',
// //       health: '/api/health'
// //     }
// //   });
// // });

// // // =======================
// // // ERROR HANDLER
// // // =======================
// // app.use((err, req, res, next) => {
// //   console.error('🔥 Server Error:', {
// //     message: err.message,
// //     stack: err.stack,
// //     path: req.path,
// //     method: req.method
// //   });

// //   const statusCode = err.statusCode || 500;
// //   const message = err.message || 'Internal Server Error';
  
// //   res.status(statusCode).json({
// //     success: false,
// //     message: message,
// //     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
// //   });
// // });

// // // =======================
// // // START SERVER
// // // =======================
// // const PORT = process.env.PORT || 5000;
// // const HOST = process.env.HOST || '0.0.0.0';

// // const server = app.listen(PORT, HOST, () => {
// //   console.log(`
// //   🚀 APEX INVESTMENT PLATFORM
// //   =============================
// //   📍 URL: http://${HOST}:${PORT}
// //   🌍 Environment: ${process.env.NODE_ENV || 'development'}
// //   📊 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
// //   =============================
// //   `);
// // });

// // // =======================
// // // GRACEFUL SHUTDOWN
// // // =======================
// // const gracefulShutdown = (signal) => {
// //   console.log(`\n${signal} received. Starting graceful shutdown...`);
  
// //   server.close(() => {
// //     console.log('🔒 HTTP server closed');
    
// //     mongoose.connection.close(false, () => {
// //       console.log('📊 MongoDB connection closed');
// //       console.log('👋 Graceful shutdown complete');
// //       process.exit(0);
// //     });
// //   });

// //   setTimeout(() => {
// //     console.error('⏰ Could not close connections in time, forcing shutdown');
// //     process.exit(1);
// //   }, 10000);
// // };

// // process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// // process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // process.on('uncaughtException', (error) => {
// //   console.error('💥 Uncaught Exception:', error);
// //   gracefulShutdown('UNCAUGHT_EXCEPTION');
// // });

// // process.on('unhandledRejection', (reason, promise) => {
// //   console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
// //   gracefulShutdown('UNHANDLED_REJECTION');
// // });

// // module.exports = server;











// // server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const path = require('path');

// dotenv.config();
// const app = express();

// // =======================
// // MIDDLEWARE
// // =======================
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:5173'],
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // =======================
// // DATABASE
// // =======================
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_invest')
//   .then(() => console.log('✅ MongoDB connected successfully'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err.message);
//     process.exit(1);
//   });

// // =======================
// // STATIC FILES
// // =======================
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // =======================
// // ROUTES
// // =======================
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/product'));
// app.use('/api/user', require('./routes/user'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));

// // Admin routes - ORDER MATTERS!
// app.use('/api/admin', require('./routes/adminAuth'));        // Login routes FIRST
// app.use('/api/admin', require('./routes/admin'));            // Dashboard routes SECOND
// app.use('/api/admin', require('./routes/adminInvestmentRoutes')); // Investment routes THIRD

// app.use('/api/referrals', require('./routes/referral'));
// app.use('/api/wallet', require('./routes/wallet'));
// app.use('/api/notifications', require('./routes/notifications'));

// // =======================
// // HEALTH CHECK
// // =======================
// app.get('/api/health', (req, res) => {
//   const dbState = mongoose.connection.readyState;
//   const dbStatus = {
//     0: 'disconnected',
//     1: 'connected',
//     2: 'connecting',
//     3: 'disconnecting'
//   }[dbState] || 'unknown';

//   res.json({ 
//     status: 'OK',
//     database: dbStatus,
//     uptime: process.uptime(),
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // =======================
// // API INFO
// // =======================
// app.get('/api/info', (req, res) => {
//   res.json({
//     name: 'Apex Investment Platform',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       products: '/api/products',
//       user: '/api/user',
//       transactions: '/api/transactions',
//       admin: {
//         login: '/api/admin/login',
//         verify: '/api/admin/verify',
//         users: '/api/admin/users',
//         transactions: '/api/admin/transactions',
//         investments: '/api/admin/investments',
//         stats: '/api/admin/stats'
//       },
//       referrals: '/api/referrals',
//       wallet: '/api/wallet',
//       notifications: '/api/notifications',
//       health: '/api/health'
//     }
//   });
// });

// // =======================
// // ERROR HANDLER
// // =======================
// app.use((err, req, res, next) => {
//   console.error('🔥 Server Error:', {
//     message: err.message,
//     stack: err.stack,
//     path: req.path,
//     method: req.method
//   });

//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
  
//   res.status(statusCode).json({
//     success: false,
//     message: message,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// // =======================
// // START SERVER
// // =======================
// const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || '0.0.0.0';

// const server = app.listen(PORT, HOST, () => {
//   console.log(`
//   🚀 APEX INVESTMENT PLATFORM
//   =============================
//   📍 URL: http://${HOST}:${PORT}
//   🌍 Environment: ${process.env.NODE_ENV || 'development'}
//   📊 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
//   =============================
  
//   📋 Available Admin Endpoints:
//      • Login:          POST   /api/admin/login
//      • Verify:         GET    /api/admin/verify
//      • Users:          GET    /api/admin/users
//      • Transactions:   GET    /api/admin/transactions
//      • Investments:    GET    /api/admin/investments
//      • Stats:          GET    /api/admin/stats
//   =============================
//   `);
// });

// // =======================
// // GRACEFUL SHUTDOWN
// // =======================
// const gracefulShutdown = (signal) => {
//   console.log(`\n${signal} received. Starting graceful shutdown...`);
  
//   server.close(() => {
//     console.log('🔒 HTTP server closed');
    
//     mongoose.connection.close(false, () => {
//       console.log('📊 MongoDB connection closed');
//       console.log('👋 Graceful shutdown complete');
//       process.exit(0);
//     });
//   });

//   setTimeout(() => {
//     console.error('⏰ Could not close connections in time, forcing shutdown');
//     process.exit(1);
//   }, 10000);
// };

// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// process.on('uncaughtException', (error) => {
//   console.error('💥 Uncaught Exception:', error);
//   gracefulShutdown('UNCAUGHT_EXCEPTION');
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
//   gracefulShutdown('UNHANDLED_REJECTION');
// });

// module.exports = server;


















// backend/routes/adminInvestmentRoutes.js
const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Test route to verify the file is working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Investment routes are working!' });
});

// Get all investments with filters
router.get('/investments', adminAuth, async (req, res) => {
  try {
    console.log('📊 Fetching all investments...');
    
    const { status, dateRange } = req.query;
    const query = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by date range if provided
    if (dateRange && dateRange !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch(dateRange) {
        case 'today':
          query.purchaseDate = { $gte: today };
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          query.purchaseDate = { $gte: weekAgo };
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          query.purchaseDate = { $gte: monthAgo };
          break;
      }
    }
    
    const investments = await Investment.find(query)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
      .sort({ purchaseDate: -1 })
      .limit(500);
    
    console.log(`✅ Found ${investments.length} investments`);
    
    // Add calculated fields to each investment
    const investmentsWithDetails = investments.map(inv => {
      const purchaseDate = new Date(inv.purchaseDate);
      const today = new Date();
      const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
      const remainingDays = Math.max(0, 30 - daysSincePurchase);
      const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      const profitPercentage = inv.amount > 0 ? ((inv.totalEarnedSoFar / inv.amount) * 100).toFixed(2) : 0;
      
      return {
        _id: inv._id,
        user: inv.user,
        userId: inv.user?._id,
        userName: inv.user?.izina_ryogukoresha || 'Unknown',
        userPhone: inv.user?.nimero_yatelefone || '',
        productId: inv.product,
        productName: inv.productName,
        amount: inv.amount,
        dailyEarning: inv.dailyEarning,
        totalReturn: inv.totalReturn,
        status: inv.status,
        purchaseDate: inv.purchaseDate,
        endDate: inv.endDate,
        lastProfitDate: inv.lastProfitDate,
        totalEarnedSoFar: inv.totalEarnedSoFar,
        active: inv.active,
        createdAt: inv.createdAt,
        earningsHistory: inv.earningsHistory || [],
        profitPercentage: profitPercentage,
        daysSincePurchase: Math.max(0, daysSincePurchase),
        remainingDays,
        progress,
        expectedProfit: inv.totalReturn - inv.amount,
        remainingProfit: inv.totalReturn - inv.totalEarnedSoFar
      };
    });
    
    // Calculate statistics
    const stats = {
      totalInvested: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
      totalEarned: investments.reduce((sum, inv) => sum + (inv.totalEarnedSoFar || 0), 0),
      activeCount: investments.filter(inv => inv.status === 'active').length,
      completedCount: investments.filter(inv => inv.status === 'completed').length,
      totalInvestments: investments.length
    };
    
    res.json({
      success: true,
      investments: investmentsWithDetails,
      stats,
      count: investments.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching investments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investments',
      error: error.message
    });
  }
});

// Get investment by ID
router.get('/investments/:id', adminAuth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets');
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    const purchaseDate = new Date(investment.purchaseDate);
    const today = new Date();
    const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, 30 - daysSincePurchase);
    const progress = Math.min(100, (daysSincePurchase / 30) * 100);
    const profitPercentage = investment.amount > 0 ? ((investment.totalEarnedSoFar / investment.amount) * 100).toFixed(2) : 0;
    
    const investmentWithDetails = {
      ...investment.toObject(),
      daysSincePurchase: Math.max(0, daysSincePurchase),
      remainingDays,
      progress,
      profitPercentage,
      expectedProfit: investment.totalReturn - investment.amount,
      remainingProfit: investment.totalReturn - investment.totalEarnedSoFar,
      userName: investment.user?.izina_ryogukoresha || 'Unknown',
      userPhone: investment.user?.nimero_yatelefone || ''
    };
    
    res.json({
      success: true,
      investment: investmentWithDetails
    });
    
  } catch (error) {
    console.error('❌ Error fetching investment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment details'
    });
  }
});

// Get investments by user ID
router.get('/investments/user/:userId', adminAuth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.params.userId })
      .sort({ purchaseDate: -1 })
      .populate('user', 'izina_ryogukoresha nimero_yatelefone');
    
    const user = await User.findById(req.params.userId).select('izina_ryogukoresha nimero_yatelefone email wallets');
    
    const summary = {
      totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
      totalEarned: investments.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0),
      activeCount: investments.filter(inv => inv.status === 'active').length,
      completedCount: investments.filter(inv => inv.status === 'completed').length
    };
    
    res.json({
      success: true,
      user,
      investments,
      summary
    });
    
  } catch (error) {
    console.error('❌ Error fetching user investments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user investments'
    });
  }
});

// Get investment statistics summary
router.get('/investments/stats/summary', adminAuth, async (req, res) => {
  try {
    const totalInvestments = await Investment.countDocuments();
    const activeInvestments = await Investment.countDocuments({ status: 'active' });
    const completedInvestments = await Investment.countDocuments({ status: 'completed' });
    
    const totalInvested = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalEarned = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarnedSoFar' } } }
    ]);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayInvestments = await Investment.countDocuments({
      purchaseDate: { $gte: today }
    });
    
    res.json({
      success: true,
      stats: {
        total: totalInvestments,
        active: activeInvestments,
        completed: completedInvestments,
        totalInvested: totalInvested[0]?.total || 0,
        totalEarned: totalEarned[0]?.total || 0,
        today: todayInvestments
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching investment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment statistics'
    });
  }
});

module.exports = router;