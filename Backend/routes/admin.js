





















// // backend/routes/admin.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Transaction = require('../models/Transaction');
// const adminAuth = require('../middleware/adminAuth');
// const notifyUser = require('../utils/notifications');

// // ==================================================
// // USER MANAGEMENT
// // ==================================================

// // Get all users
// router.get('/users', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('izina_ryogukoresha nimero_yatelefone email referralCode wallets stats status createdAt lastLogin')
//       .sort({ createdAt: -1 });
    
//     res.json({ 
//       success: true, 
//       users: users.map(user => ({
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         phone: user.nimero_yatelefone,
//         email: user.email,
//         referralCode: user.referralCode,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin
//       })),
//       total: users.length,
//       active: users.filter(u => u.status === 'active').length,
//       suspended: users.filter(u => u.status === 'suspended').length
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get user by ID
// router.get('/users/:id', adminAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select('-ijambo_banga');
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     // Get user's transactions from Transaction collection
//     const transactions = await Transaction.find({ user: user._id })
//       .sort({ createdAt: -1 })
//       .limit(20);
    
//     res.json({ 
//       success: true, 
//       user: {
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         phone: user.nimero_yatelefone,
//         email: user.email,
//         referralCode: user.referralCode,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin
//       },
//       activeInvestments: user.activeInvestments || [],
//       transactions: transactions
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Update user status
// router.put('/users/:id/status', adminAuth, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!['active', 'inactive', 'suspended'].includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid status' 
//       });
//     }
    
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     const oldStatus = user.status;
//     user.status = status;
//     await user.save();
    
//     // ✅ NOTIFICATION: Status change
//     await notifyUser.statusChanged(user._id, status);
    
//     res.json({ 
//       success: true, 
//       message: `User status updated to ${status}`,
//       user: {
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         status: user.status
//       }
//     });
//   } catch (error) {
//     console.error('Update user status error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // ==================================================
// // TRANSACTION MANAGEMENT
// // ==================================================

// // Get all transactions (admin view)
// router.get('/transactions', adminAuth, async (req, res) => {
//   try {
//     const { type, status, page = 1, limit = 50, userId } = req.query;
    
//     const query = {};
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (userId) query.user = userId;
    
//     const transactions = await Transaction.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
//       .populate('processedBy', 'izina_ryogukoresha')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
    
//     const total = await Transaction.countDocuments(query);
    
//     // Get summary stats
//     const summary = {
//       totalDeposits: await Transaction.countDocuments({ type: 'deposit' }),
//       totalWithdrawals: await Transaction.countDocuments({ type: 'withdraw' }),
//       pendingDeposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
//       pendingWithdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
//       totalAmount: await Transaction.aggregate([
//         { $match: query },
//         { $group: { _id: null, total: { $sum: '$amount' } } }
//       ]).then(result => result[0]?.total || 0)
//     };
    
//     res.json({ 
//       success: true, 
//       transactions,
//       summary,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit)
//     });
//   } catch (error) {
//     console.error('Get admin transactions error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get all pending transactions
// router.get('/transactions/pending', adminAuth, async (req, res) => {
//   try {
//     const { type } = req.query;
    
//     const query = { status: 'pending' };
//     if (type) query.type = type;
    
//     const transactions = await Transaction.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
//       .sort({ createdAt: 1 }) // Oldest first
//       .limit(100);
    
//     // Format transactions for frontend
//     const formattedTransactions = transactions.map(tx => ({
//       transactionId: tx._id,
//       userId: tx.user?._id,
//       userName: tx.user?.izina_ryogukoresha || 'Unknown',
//       userPhone: tx.user?.nimero_yatelefone || '',
//       type: tx.type,
//       amount: tx.amount,
//       paymentMethod: tx.paymentMethod,
//       phoneNumber: tx.phoneNumber,
//       reference: tx.reference,
//       description: tx.description,
//       createdAt: tx.createdAt
//     }));
    
//     // Get counts for each type
//     const counts = {
//       deposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
//       withdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
//       total: await Transaction.countDocuments({ status: 'pending' })
//     };
    
//     // Calculate total amounts
//     const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
//     const depositAmount = transactions
//       .filter(tx => tx.type === 'deposit')
//       .reduce((sum, tx) => sum + tx.amount, 0);
//     const withdrawalAmount = transactions
//       .filter(tx => tx.type === 'withdraw')
//       .reduce((sum, tx) => sum + tx.amount, 0);
    
//     res.json({ 
//       success: true, 
//       transactions: formattedTransactions,
//       counts,
//       total: transactions.length,
//       amounts: {
//         total: totalAmount,
//         deposits: depositAmount,
//         withdrawals: withdrawalAmount
//       }
//     });
//   } catch (error) {
//     console.error('Get pending transactions error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get transaction by ID with full details
// router.get('/transactions/:id', adminAuth, async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
//       .populate('processedBy', 'izina_ryogukoresha email');
    
//     if (!transaction) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found' 
//       });
//     }
    
//     res.json({ 
//       success: true, 
//       transaction 
//     });
//   } catch (error) {
//     console.error('Get transaction error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Approve transaction
// router.post('/transactions/:id/approve', adminAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { note } = req.body;
//     const adminId = req.admin._id;
    
//     console.log(`\n🚀 ========================================`);
//     console.log(`🚀 ADMIN TRANSACTION APPROVAL REQUEST`);
//     console.log(`🚀 ========================================`);
//     console.log(`📅 Timestamp: ${new Date().toISOString()}`);
//     console.log(`👤 Admin ID: ${adminId}`);
//     console.log(`📝 Transaction ID: ${id}`);
//     console.log(`🗒️  Note: ${note || 'No note provided'}`);
//     console.log(`🚀 ========================================\n`);
    
//     // Find transaction in Transaction collection
//     const transaction = await Transaction.findById(id);
    
//     if (!transaction) {
//       console.error(`❌ Transaction not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found in database' 
//       });
//     }
    
//     // Populate user details
//     await transaction.populate('user');
    
//     console.log(`📋 ========================================`);
//     console.log(`📋 TRANSACTION DETAILS`);
//     console.log(`📋 ========================================`);
//     console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
//     console.log(`📱 Phone: ${transaction.user.nimero_yatelefone}`);
//     console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📞 Payment Method: ${transaction.paymentMethod}`);
//     console.log(`📱 Receiver Phone: ${transaction.phoneNumber}`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Current Status: ${transaction.status}`);
//     console.log(`📅 Created: ${transaction.createdAt}`);
//     console.log(`📋 ========================================\n`);
    
//     // Update transaction status
//     transaction.status = 'completed';
//     transaction.adminNote = note || 'Transaction approved by admin';
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
    
//     // Get user to update wallet
//     const user = await User.findById(transaction.user._id);
    
//     if (!user) {
//       console.error(`❌ User not found: ${transaction.user._id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (transaction.type === 'deposit') {
//       console.log(`💰 ========================================`);
//       console.log(`💰 PROCESSING DEPOSIT`);
//       console.log(`💰 ========================================`);
      
//       // Add to user's main wallet
//       const oldBalance = user.wallets.main;
//       user.wallets.main += transaction.amount;
//       user.stats.totalDeposits += transaction.amount;
//       user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
//       console.log(`💰 Old Balance: ${oldBalance.toLocaleString()} FRW`);
//       console.log(`💰 Deposit Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💰 New Balance: ${user.wallets.main.toLocaleString()} FRW`);
//       console.log(`💰 Total Deposits: ${user.stats.totalDeposits.toLocaleString()} FRW`);
      
//       // Update embedded transaction in user document
//       const userTransaction = user.transactions.id(id);
//       if (userTransaction) {
//         userTransaction.status = 'completed';
//         userTransaction.processedBy = adminId;
//         userTransaction.processedAt = new Date();
//         userTransaction.adminNote = note || 'Deposit approved';
//       }
      
//       // ✅ NOTIFICATION: Deposit approved
//       await notifyUser.depositApproved(
//         user._id,
//         transaction.amount,
//         transaction._id
//       );
      
//       console.log(`✅ Deposit added to user's wallet`);
//       console.log(`💰 ========================================\n`);
//     }
    
//     if (transaction.type === 'withdraw') {
//       console.log(`💸 ========================================`);
//       console.log(`💸 PROCESSING WITHDRAWAL`);
//       console.log(`💸 ========================================`);
      
//       // Check if user has enough earnings
//       if (user.wallets.earning < transaction.amount) {
//         console.error(`❌ Insufficient earnings!`);
//         console.error(`💸 User Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//         console.error(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
        
//         // Reject transaction automatically
//         transaction.status = 'rejected';
//         transaction.adminNote = 'Insufficient earnings balance';
//         await transaction.save();
        
//         return res.status(400).json({
//           success: false,
//           message: `User has insufficient earnings for this withdrawal. Available: ${user.wallets.earning.toLocaleString()} FRW`
//         });
//       }
      
//       // Deduct from user's earnings and reserved
//       const oldEarnings = user.wallets.earning;
//       const oldReserved = user.wallets.reserved;
      
//       user.wallets.earning -= transaction.amount;
//       user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
//       user.stats.totalWithdrawn += transaction.amount;
//       user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
//       console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 New Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//       console.log(`💸 Total Withdrawn: ${user.stats.totalWithdrawn.toLocaleString()} FRW`);
      
//       // Update embedded transaction in user document
//       const userTransaction = user.transactions.id(id);
//       if (userTransaction) {
//         userTransaction.status = 'completed';
//         userTransaction.processedBy = adminId;
//         userTransaction.processedAt = new Date();
//         userTransaction.adminNote = note || 'Withdrawal approved';
//       }
      
//       // ✅ NOTIFICATION: Withdrawal approved
//       await notifyUser.withdrawApproved(
//         user._id,
//         transaction.amount,
//         transaction.phoneNumber,
//         transaction.paymentMethod,
//         transaction._id
//       );
      
//       console.log(`✅ Withdrawal processed successfully`);
//       console.log(`💸 ========================================\n`);
//     }
    
//     // Save all changes
//     await transaction.save();
//     await user.save();
    
//     console.log(`✅ ========================================`);
//     console.log(`✅ TRANSACTION APPROVED SUCCESSFULLY!`);
//     console.log(`✅ ========================================`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`💰 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`👤 User: ${user.izina_ryogukoresha}`);
//     console.log(`📱 Phone: ${user.nimero_yatelefone}`);
//     console.log(`📊 New Wallet Status:`);
//     console.log(`   💰 Main: ${user.wallets.main.toLocaleString()} FRW`);
//     console.log(`   💸 Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//     console.log(`   🔒 Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//     console.log(`✅ ========================================\n`);
    
//     res.json({ 
//       success: true, 
//       message: 'Transaction approved successfully',
//       transaction: {
//         id: transaction._id,
//         type: transaction.type,
//         amount: transaction.amount,
//         status: transaction.status,
//         adminNote: transaction.adminNote,
//         reference: transaction.reference
//       },
//       user: {
//         id: user._id,
//         name: user.izina_ryogukoresha,
//         email: user.email,
//         phone: user.nimero_yatelefone,
//         wallets: user.wallets
//       }
//     });
//   } catch (error) {
//     console.error(`❌ ========================================`);
//     console.error(`❌ APPROVAL ERROR`);
//     console.error(`❌ ========================================`);
//     console.error(`Error: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
//     console.error(`❌ ========================================\n`);
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to approve transaction',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Reject transaction
// router.post('/transactions/:id/reject', adminAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { note } = req.body;
//     const adminId = req.admin._id;
    
//     console.log(`\n❌ ========================================`);
//     console.log(`❌ ADMIN TRANSACTION REJECTION REQUEST`);
//     console.log(`❌ ========================================`);
//     console.log(`📅 Timestamp: ${new Date().toISOString()}`);
//     console.log(`👤 Admin ID: ${adminId}`);
//     console.log(`📝 Transaction ID: ${id}`);
//     console.log(`🗒️  Reason: ${note || 'No reason provided'}`);
//     console.log(`📁 Request Body:`, req.body);
    
//     if (!note || note.trim() === '') {
//       console.error(`❌ Rejection reason is required`);
//       return res.status(400).json({
//         success: false,
//         message: 'Rejection reason is required'
//       });
//     }
    
//     // Find transaction in Transaction collection
//     const transaction = await Transaction.findById(id);
    
//     if (!transaction) {
//       console.error(`❌ Transaction not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found' 
//       });
//     }
    
//     // Populate user details
//     await transaction.populate('user');
    
//     console.log(`📋 ========================================`);
//     console.log(`📋 TRANSACTION DETAILS`);
//     console.log(`📋 ========================================`);
//     console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
//     console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Current Status: ${transaction.status}`);
//     console.log(`📋 ========================================\n`);
    
//     // Update transaction
//     transaction.status = 'rejected';
//     transaction.adminNote = note;
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
    
//     // Get user to update
//     const user = await User.findById(transaction.user._id);
    
//     if (!user) {
//       console.error(`❌ User not found: ${transaction.user._id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (transaction.type === 'withdraw') {
//       console.log(`💸 ========================================`);
//       console.log(`💸 RELEASING RESERVED FUNDS`);
//       console.log(`💸 ========================================`);
      
//       // Release reserved funds back to earning wallet
//       const oldReserved = user.wallets.reserved;
//       const oldEarnings = user.wallets.earning;
      
//       user.wallets.earning += transaction.amount;
//       user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
//       user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
//       console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//       console.log(`💸 New Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//       console.log(`💸 ========================================\n`);
      
//       // ✅ NOTIFICATION: Withdrawal rejected
//       await notifyUser.withdrawRejected(
//         user._id,
//         transaction.amount,
//         note,
//         transaction._id
//       );
      
//     } else if (transaction.type === 'deposit') {
//       user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
//       // ✅ NOTIFICATION: Deposit rejected
//       await notifyUser.depositRejected(
//         user._id,
//         transaction.amount,
//         note,
//         transaction._id
//       );
//     }
    
//     // Update embedded transaction in user document
//     const userTransaction = user.transactions.id(id);
//     if (userTransaction) {
//       userTransaction.status = 'rejected';
//       userTransaction.processedBy = adminId;
//       userTransaction.processedAt = new Date();
//       userTransaction.adminNote = note;
//     }
    
//     // Add notification to user (using existing method for backward compatibility)
//     await user.addNotification(
//       `Your ${transaction.type} of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}`,
//       'warning'
//     );
    
//     // Save changes
//     await transaction.save();
//     await user.save();
    
//     console.log(`✅ ========================================`);
//     console.log(`✅ TRANSACTION REJECTED SUCCESSFULLY!`);
//     console.log(`✅ ========================================`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`🗒️  Reason: ${note}`);
//     console.log(`👤 User Notified: ${user.izina_ryogukoresha}`);
//     console.log(`✅ ========================================\n`);
    
//     res.json({ 
//       success: true, 
//       message: 'Transaction rejected',
//       transaction: {
//         id: transaction._id,
//         type: transaction.type,
//         amount: transaction.amount,
//         status: transaction.status,
//         adminNote: transaction.adminNote
//       }
//     });
//   } catch (error) {
//     console.error(`❌ ========================================`);
//     console.error(`❌ REJECTION ERROR`);
//     console.error(`❌ ========================================`);
//     console.error(`Error: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
//     console.error(`❌ ========================================\n`);
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to reject transaction',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ==================================================
// // SYSTEM STATISTICS
// // ==================================================

// // Get system statistics
// router.get('/stats', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find();
//     const products = await Product.find();
//     const transactions = await Transaction.find();
    
//     // Get today's date for filtering
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const stats = {
//       users: {
//         total: users.length,
//         active: users.filter(u => u.status === 'active').length,
//         suspended: users.filter(u => u.status === 'suspended').length,
//         today: users.filter(u => 
//           new Date(u.createdAt) >= today
//         ).length
//       },
      
//       finances: {
//         totalMain: users.reduce((sum, u) => sum + (u.wallets?.main || 0), 0),
//         totalEarning: users.reduce((sum, u) => sum + (u.wallets?.earning || 0), 0),
//         totalReserved: users.reduce((sum, u) => sum + (u.wallets?.reserved || 0), 0),
//         totalDeposits: await Transaction.aggregate([
//           { $match: { type: 'deposit', status: 'completed' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         totalWithdrawals: await Transaction.aggregate([
//           { $match: { type: 'withdraw', status: 'completed' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         pendingDeposits: await Transaction.aggregate([
//           { $match: { type: 'deposit', status: 'pending' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         pendingWithdrawals: await Transaction.aggregate([
//           { $match: { type: 'withdraw', status: 'pending' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0)
//       },
      
//       products: {
//         total: products.length,
//         active: products.filter(p => p.status === 'active').length
//       },
      
//       transactions: {
//         total: transactions.length,
//         pending: transactions.filter(t => t.status === 'pending').length,
//         completed: transactions.filter(t => t.status === 'completed').length,
//         rejected: transactions.filter(t => t.status === 'rejected').length,
//         deposits: transactions.filter(t => t.type === 'deposit').length,
//         withdrawals: transactions.filter(t => t.type === 'withdraw').length
//       }
//     };
    
//     res.json({ 
//       success: true, 
//       stats 
//     });
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// module.exports = router;















// // backend/routes/admin.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Transaction = require('../models/Transaction');
// const adminAuth = require('../middleware/adminAuth');
// const notifyUser = require('../utils/notifications');

// // ==================================================
// // USER MANAGEMENT
// // ==================================================

// // Get all users
// router.get('/users', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('izina_ryogukoresha nimero_yatelefone email referralCode wallets stats status createdAt lastLogin')
//       .sort({ createdAt: -1 });
    
//     res.json({ 
//       success: true, 
//       users: users.map(user => ({
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         phone: user.nimero_yatelefone,
//         email: user.email,
//         referralCode: user.referralCode,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin
//       })),
//       total: users.length,
//       active: users.filter(u => u.status === 'active').length,
//       suspended: users.filter(u => u.status === 'suspended').length
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get user by ID
// router.get('/users/:id', adminAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select('-ijambo_banga');
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     // Get user's transactions from Transaction collection
//     const transactions = await Transaction.find({ user: user._id })
//       .sort({ createdAt: -1 })
//       .limit(20);
    
//     res.json({ 
//       success: true, 
//       user: {
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         phone: user.nimero_yatelefone,
//         email: user.email,
//         referralCode: user.referralCode,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin
//       },
//       activeInvestments: user.activeInvestments || [],
//       transactions: transactions
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Update user status
// router.put('/users/:id/status', adminAuth, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!['active', 'inactive', 'suspended'].includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid status' 
//       });
//     }
    
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     user.status = status;
//     await user.save();
    
//     // NOTIFICATION: Status change
//     if (typeof notifyUser?.statusChanged === 'function') {
//       await notifyUser.statusChanged(user._id, status);
//     }
    
//     res.json({ 
//       success: true, 
//       message: `User status updated to ${status}`,
//       user: {
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         status: user.status
//       }
//     });
//   } catch (error) {
//     console.error('Update user status error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // ==================================================
// // TRANSACTION MANAGEMENT
// // ==================================================

// // Get all transactions (admin view)
// router.get('/transactions', adminAuth, async (req, res) => {
//   try {
//     const { type, status, page = 1, limit = 50, userId } = req.query;
    
//     const query = {};
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (userId) query.user = userId;
    
//     const transactions = await Transaction.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
//       .populate('processedBy', 'izina_ryogukoresha')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
    
//     const total = await Transaction.countDocuments(query);
    
//     // Get summary stats
//     const summary = {
//       totalDeposits: await Transaction.countDocuments({ type: 'deposit' }),
//       totalWithdrawals: await Transaction.countDocuments({ type: 'withdraw' }),
//       pendingDeposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
//       pendingWithdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
//       totalAmount: await Transaction.aggregate([
//         { $match: query },
//         { $group: { _id: null, total: { $sum: '$amount' } } }
//       ]).then(result => result[0]?.total || 0)
//     };
    
//     res.json({ 
//       success: true, 
//       transactions,
//       summary,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit)
//     });
//   } catch (error) {
//     console.error('Get admin transactions error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get all pending transactions
// router.get('/transactions/pending', adminAuth, async (req, res) => {
//   try {
//     const { type } = req.query;
    
//     const query = { status: 'pending' };
//     if (type) query.type = type;
    
//     const transactions = await Transaction.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
//       .sort({ createdAt: 1 }) // Oldest first
//       .limit(100);
    
//     // Format transactions for frontend
//     const formattedTransactions = transactions.map(tx => ({
//       transactionId: tx._id,
//       userId: tx.user?._id,
//       userName: tx.user?.izina_ryogukoresha || 'Unknown',
//       userPhone: tx.user?.nimero_yatelefone || '',
//       type: tx.type,
//       amount: tx.amount,
//       paymentMethod: tx.paymentMethod,
//       phoneNumber: tx.phoneNumber,
//       reference: tx.reference,
//       description: tx.description,
//       createdAt: tx.createdAt
//     }));
    
//     // Get counts for each type
//     const counts = {
//       deposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
//       withdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
//       total: await Transaction.countDocuments({ status: 'pending' })
//     };
    
//     // Calculate total amounts
//     const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
//     const depositAmount = transactions
//       .filter(tx => tx.type === 'deposit')
//       .reduce((sum, tx) => sum + tx.amount, 0);
//     const withdrawalAmount = transactions
//       .filter(tx => tx.type === 'withdraw')
//       .reduce((sum, tx) => sum + tx.amount, 0);
    
//     res.json({ 
//       success: true, 
//       transactions: formattedTransactions,
//       counts,
//       total: transactions.length,
//       amounts: {
//         total: totalAmount,
//         deposits: depositAmount,
//         withdrawals: withdrawalAmount
//       }
//     });
//   } catch (error) {
//     console.error('Get pending transactions error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get transaction by ID with full details
// router.get('/transactions/:id', adminAuth, async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
//       .populate('processedBy', 'izina_ryogukoresha email');
    
//     if (!transaction) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found' 
//       });
//     }
    
//     res.json({ 
//       success: true, 
//       transaction 
//     });
//   } catch (error) {
//     console.error('Get transaction error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Approve transaction - FIXED WITHDRAWAL LOGIC
// router.post('/transactions/:id/approve', adminAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { note } = req.body;
//     const adminId = req.admin._id;
    
//     console.log(`\n🚀 ========================================`);
//     console.log(`🚀 ADMIN TRANSACTION APPROVAL REQUEST`);
//     console.log(`🚀 ========================================`);
//     console.log(`📅 Timestamp: ${new Date().toISOString()}`);
//     console.log(`👤 Admin ID: ${adminId}`);
//     console.log(`📝 Transaction ID: ${id}`);
//     console.log(`🗒️  Note: ${note || 'No note provided'}`);
//     console.log(`🚀 ========================================\n`);
    
//     // Find transaction in Transaction collection
//     const transaction = await Transaction.findById(id);
    
//     if (!transaction) {
//       console.error(`❌ Transaction not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found in database' 
//       });
//     }
    
//     // Check if already processed
//     if (transaction.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Transaction already ${transaction.status}`
//       });
//     }
    
//     // Populate user details
//     await transaction.populate('user');
    
//     console.log(`📋 ========================================`);
//     console.log(`📋 TRANSACTION DETAILS`);
//     console.log(`📋 ========================================`);
//     console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
//     console.log(`📱 Phone: ${transaction.user.nimero_yatelefone}`);
//     console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📞 Payment Method: ${transaction.paymentMethod}`);
//     console.log(`📱 Receiver Phone: ${transaction.phoneNumber}`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Current Status: ${transaction.status}`);
//     console.log(`📅 Created: ${transaction.createdAt}`);
//     console.log(`📋 ========================================\n`);
    
//     // Update transaction status
//     transaction.status = 'completed';
//     transaction.adminNote = note || 'Transaction approved by admin';
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
    
//     // Get user to update wallet
//     const user = await User.findById(transaction.user._id);
    
//     if (!user) {
//       console.error(`❌ User not found: ${transaction.user._id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (transaction.type === 'deposit') {
//       console.log(`💰 ========================================`);
//       console.log(`💰 PROCESSING DEPOSIT`);
//       console.log(`💰 ========================================`);
      
//       // Add to user's main wallet
//       const oldBalance = user.wallets.main;
//       user.wallets.main += transaction.amount;
//       user.stats.totalDeposits += transaction.amount;
//       user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
//       console.log(`💰 Old Balance: ${oldBalance.toLocaleString()} FRW`);
//       console.log(`💰 Deposit Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💰 New Balance: ${user.wallets.main.toLocaleString()} FRW`);
//       console.log(`💰 Total Deposits: ${user.stats.totalDeposits.toLocaleString()} FRW`);
      
//       // Update embedded transaction in user document
//       const userTransaction = user.transactions.id(id);
//       if (userTransaction) {
//         userTransaction.status = 'completed';
//         userTransaction.processedBy = adminId;
//         userTransaction.processedAt = new Date();
//         userTransaction.adminNote = note || 'Deposit approved';
//       }
      
//       // NOTIFICATION: Deposit approved
//       if (typeof notifyUser?.depositApproved === 'function') {
//         await notifyUser.depositApproved(
//           user._id,
//           transaction.amount,
//           transaction._id
//         );
//       } else {
//         await user.addNotification(
//           `Your deposit of ${transaction.amount.toLocaleString()} FRW has been approved.`,
//           'success'
//         );
//       }
      
//       console.log(`✅ Deposit added to user's wallet`);
//       console.log(`💰 ========================================\n`);
//     }
    
//     if (transaction.type === 'withdraw') {
//       console.log(`💸 ========================================`);
//       console.log(`💸 PROCESSING WITHDRAWAL APPROVAL`);
//       console.log(`💸 ========================================`);
      
//       // ✅ FIXED: For withdrawal approval, we ONLY remove from RESERVED wallet
//       // The money was already moved from EARNING to RESERVED when the request was created
      
//       // Check if user has enough in reserved wallet
//       if (user.wallets.reserved < transaction.amount) {
//         console.error(`❌ Insufficient reserved funds!`);
//         console.error(`💸 User Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//         console.error(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
        
//         // Reject transaction automatically
//         transaction.status = 'rejected';
//         transaction.adminNote = 'Insufficient reserved funds';
//         await transaction.save();
        
//         return res.status(400).json({
//           success: false,
//           message: `User has insufficient reserved funds for this withdrawal. Available: ${user.wallets.reserved.toLocaleString()} FRW`
//         });
//       }
      
//       // ✅ ONLY remove from RESERVED (money already out of EARNING)
//       const oldReserved = user.wallets.reserved;
      
//       user.wallets.reserved -= transaction.amount;
//       user.stats.totalWithdrawn += transaction.amount;
//       user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//       console.log(`💸 Total Withdrawn: ${user.stats.totalWithdrawn.toLocaleString()} FRW`);
      
//       // Update embedded transaction in user document
//       const userTransaction = user.transactions.id(id);
//       if (userTransaction) {
//         userTransaction.status = 'completed';
//         userTransaction.processedBy = adminId;
//         userTransaction.processedAt = new Date();
//         userTransaction.adminNote = note || 'Withdrawal approved';
//       }
      
//       // NOTIFICATION: Withdrawal approved
//       if (typeof notifyUser?.withdrawApproved === 'function') {
//         await notifyUser.withdrawApproved(
//           user._id,
//           transaction.amount,
//           transaction.phoneNumber,
//           transaction.paymentMethod,
//           transaction._id
//         );
//       } else {
//         await user.addNotification(
//           `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been approved. Funds will be sent to ${transaction.phoneNumber} via ${transaction.paymentMethod}.`,
//           'success'
//         );
//       }
      
//       console.log(`✅ Withdrawal approved successfully`);
//       console.log(`💸 ========================================\n`);
//     }
    
//     // Save all changes
//     await transaction.save();
//     await user.save();
    
//     console.log(`✅ ========================================`);
//     console.log(`✅ TRANSACTION APPROVED SUCCESSFULLY!`);
//     console.log(`✅ ========================================`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`💰 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`👤 User: ${user.izina_ryogukoresha}`);
//     console.log(`📱 Phone: ${user.nimero_yatelefone}`);
//     console.log(`📊 New Wallet Status:`);
//     console.log(`   💰 Main: ${user.wallets.main.toLocaleString()} FRW`);
//     console.log(`   💸 Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//     console.log(`   🔒 Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//     console.log(`✅ ========================================\n`);
    
//     res.json({ 
//       success: true, 
//       message: 'Transaction approved successfully',
//       transaction: {
//         id: transaction._id,
//         type: transaction.type,
//         amount: transaction.amount,
//         status: transaction.status,
//         adminNote: transaction.adminNote,
//         reference: transaction.reference
//       },
//       user: {
//         id: user._id,
//         name: user.izina_ryogukoresha,
//         email: user.email,
//         phone: user.nimero_yatelefone,
//         wallets: user.wallets
//       }
//     });
//   } catch (error) {
//     console.error(`❌ ========================================`);
//     console.error(`❌ APPROVAL ERROR`);
//     console.error(`❌ ========================================`);
//     console.error(`Error: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
//     console.error(`❌ ========================================\n`);
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to approve transaction',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Reject transaction
// router.post('/transactions/:id/reject', adminAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { note } = req.body;
//     const adminId = req.admin._id;
    
//     console.log(`\n❌ ========================================`);
//     console.log(`❌ ADMIN TRANSACTION REJECTION REQUEST`);
//     console.log(`❌ ========================================`);
//     console.log(`📅 Timestamp: ${new Date().toISOString()}`);
//     console.log(`👤 Admin ID: ${adminId}`);
//     console.log(`📝 Transaction ID: ${id}`);
//     console.log(`🗒️  Reason: ${note || 'No reason provided'}`);
//     console.log(`📁 Request Body:`, req.body);
    
//     if (!note || note.trim() === '') {
//       console.error(`❌ Rejection reason is required`);
//       return res.status(400).json({
//         success: false,
//         message: 'Rejection reason is required'
//       });
//     }
    
//     // Find transaction in Transaction collection
//     const transaction = await Transaction.findById(id);
    
//     if (!transaction) {
//       console.error(`❌ Transaction not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found' 
//       });
//     }
    
//     // Check if already processed
//     if (transaction.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Transaction already ${transaction.status}`
//       });
//     }
    
//     // Populate user details
//     await transaction.populate('user');
    
//     console.log(`📋 ========================================`);
//     console.log(`📋 TRANSACTION DETAILS`);
//     console.log(`📋 ========================================`);
//     console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
//     console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Current Status: ${transaction.status}`);
//     console.log(`📋 ========================================\n`);
    
//     // Update transaction
//     transaction.status = 'rejected';
//     transaction.adminNote = note;
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
    
//     // Get user to update
//     const user = await User.findById(transaction.user._id);
    
//     if (!user) {
//       console.error(`❌ User not found: ${transaction.user._id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (transaction.type === 'withdraw') {
//       console.log(`💸 ========================================`);
//       console.log(`💸 RELEASING RESERVED FUNDS BACK TO EARNING`);
//       console.log(`💸 ========================================`);
      
//       // Release reserved funds back to earning wallet
//       const oldReserved = user.wallets.reserved;
//       const oldEarnings = user.wallets.earning;
      
//       user.wallets.earning += transaction.amount;
//       user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
//       user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
//       console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//       console.log(`💸 New Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//       console.log(`💸 ========================================\n`);
      
//       // NOTIFICATION: Withdrawal rejected
//       if (typeof notifyUser?.withdrawRejected === 'function') {
//         await notifyUser.withdrawRejected(
//           user._id,
//           transaction.amount,
//           note,
//           transaction._id
//         );
//       } else {
//         await user.addNotification(
//           `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}. Funds returned to your earnings wallet.`,
//           'warning'
//         );
//       }
      
//     } else if (transaction.type === 'deposit') {
//       user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
//       // NOTIFICATION: Deposit rejected
//       if (typeof notifyUser?.depositRejected === 'function') {
//         await notifyUser.depositRejected(
//           user._id,
//           transaction.amount,
//           note,
//           transaction._id
//         );
//       } else {
//         await user.addNotification(
//           `Your deposit of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}.`,
//           'warning'
//         );
//       }
//     }
    
//     // Update embedded transaction in user document
//     const userTransaction = user.transactions.id(id);
//     if (userTransaction) {
//       userTransaction.status = 'rejected';
//       userTransaction.processedBy = adminId;
//       userTransaction.processedAt = new Date();
//       userTransaction.adminNote = note;
//     }
    
//     // Save changes
//     await transaction.save();
//     await user.save();
    
//     console.log(`✅ ========================================`);
//     console.log(`✅ TRANSACTION REJECTED SUCCESSFULLY!`);
//     console.log(`✅ ========================================`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`🗒️  Reason: ${note}`);
//     console.log(`👤 User Notified: ${user.izina_ryogukoresha}`);
//     console.log(`✅ ========================================\n`);
    
//     res.json({ 
//       success: true, 
//       message: 'Transaction rejected',
//       transaction: {
//         id: transaction._id,
//         type: transaction.type,
//         amount: transaction.amount,
//         status: transaction.status,
//         adminNote: transaction.adminNote
//       }
//     });
//   } catch (error) {
//     console.error(`❌ ========================================`);
//     console.error(`❌ REJECTION ERROR`);
//     console.error(`❌ ========================================`);
//     console.error(`Error: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
//     console.error(`❌ ========================================\n`);
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to reject transaction',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ==================================================
// // SYSTEM STATISTICS
// // ==================================================

// // Get system statistics
// router.get('/stats', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find();
//     const products = await Product.find();
//     const transactions = await Transaction.find();
    
//     // Get today's date for filtering
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const stats = {
//       users: {
//         total: users.length,
//         active: users.filter(u => u.status === 'active').length,
//         suspended: users.filter(u => u.status === 'suspended').length,
//         today: users.filter(u => 
//           new Date(u.createdAt) >= today
//         ).length
//       },
      
//       finances: {
//         totalMain: users.reduce((sum, u) => sum + (u.wallets?.main || 0), 0),
//         totalEarning: users.reduce((sum, u) => sum + (u.wallets?.earning || 0), 0),
//         totalReserved: users.reduce((sum, u) => sum + (u.wallets?.reserved || 0), 0),
//         totalDeposits: await Transaction.aggregate([
//           { $match: { type: 'deposit', status: 'completed' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         totalWithdrawals: await Transaction.aggregate([
//           { $match: { type: 'withdraw', status: 'completed' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         pendingDeposits: await Transaction.aggregate([
//           { $match: { type: 'deposit', status: 'pending' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         pendingWithdrawals: await Transaction.aggregate([
//           { $match: { type: 'withdraw', status: 'pending' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0)
//       },
      
//       products: {
//         total: products.length,
//         active: products.filter(p => p.status === 'active').length
//       },
      
//       transactions: {
//         total: transactions.length,
//         pending: transactions.filter(t => t.status === 'pending').length,
//         completed: transactions.filter(t => t.status === 'completed').length,
//         rejected: transactions.filter(t => t.status === 'rejected').length,
//         deposits: transactions.filter(t => t.type === 'deposit').length,
//         withdrawals: transactions.filter(t => t.type === 'withdraw').length
//       }
//     };
    
//     res.json({ 
//       success: true, 
//       stats 
//     });
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// module.exports = router;












// // backend/routes/admin.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Transaction = require('../models/Transaction');
// const Investment = require('../models/Investment');
// const adminAuth = require('../middleware/adminAuth');
// const notifyUser = require('../utils/notifications');

// // ==================================================
// // USER MANAGEMENT
// // ==================================================

// // Get all users
// router.get('/users', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('izina_ryogukoresha nimero_yatelefone email referralCode wallets stats status createdAt lastLogin bonus activeInvestments')
//       .sort({ createdAt: -1 });
    
//     res.json({ 
//       success: true, 
//       users: users.map(user => ({
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         phone: user.nimero_yatelefone,
//         email: user.email,
//         referralCode: user.referralCode,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin,
//         bonus: user.bonus,
//         activeInvestmentsCount: user.activeInvestments?.length || 0
//       })),
//       total: users.length,
//       active: users.filter(u => u.status === 'active').length,
//       suspended: users.filter(u => u.status === 'suspended').length
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get user by ID
// router.get('/users/:id', adminAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select('-ijambo_banga');
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     // Get user's transactions from Transaction collection
//     const transactions = await Transaction.find({ user: user._id })
//       .sort({ createdAt: -1 })
//       .limit(20);
    
//     // Get user's investments
//     const investments = await Investment.find({ user: user._id })
//       .sort({ purchaseDate: -1 });
    
//     res.json({ 
//       success: true, 
//       user: {
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         phone: user.nimero_yatelefone,
//         email: user.email,
//         referralCode: user.referralCode,
//         wallets: user.wallets,
//         stats: user.stats,
//         status: user.status,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin,
//         bonus: user.bonus
//       },
//       activeInvestments: investments.filter(inv => inv.status === 'active'),
//       completedInvestments: investments.filter(inv => inv.status === 'completed'),
//       transactions: transactions
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Update user status
// router.put('/users/:id/status', adminAuth, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!['active', 'inactive', 'suspended'].includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid status' 
//       });
//     }
    
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     user.status = status;
//     await user.save();
    
//     // NOTIFICATION: Status change
//     if (typeof notifyUser?.statusChanged === 'function') {
//       await notifyUser.statusChanged(user._id, status);
//     }
    
//     res.json({ 
//       success: true, 
//       message: `User status updated to ${status}`,
//       user: {
//         id: user._id,
//         username: user.izina_ryogukoresha,
//         status: user.status
//       }
//     });
//   } catch (error) {
//     console.error('Update user status error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // ==================================================
// // INVESTMENT MANAGEMENT
// // ==================================================

// // Get all investments
// router.get('/investments', adminAuth, async (req, res) => {
//   try {
//     const { dateRange, status } = req.query;
    
//     let query = {};
//     if (status) query.status = status;
    
//     // Date filtering
//     if (dateRange && dateRange !== 'all') {
//       const now = new Date();
//       let startDate = new Date();
      
//       if (dateRange === 'today') {
//         startDate.setHours(0, 0, 0, 0);
//       } else if (dateRange === 'week') {
//         startDate.setDate(now.getDate() - 7);
//       } else if (dateRange === 'month') {
//         startDate.setMonth(now.getMonth() - 1);
//       }
      
//       query.purchaseDate = { $gte: startDate };
//     }
    
//     const investments = await Investment.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
//       .sort({ purchaseDate: -1 });
    
//     const formattedInvestments = investments.map(inv => {
//       const purchaseDate = new Date(inv.purchaseDate);
//       const endDate = new Date(inv.endDate);
//       const today = new Date();
      
//       const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
//       const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
//       const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
//       return {
//         _id: inv._id,
//         userId: inv.user?._id,
//         userName: inv.user?.izina_ryogukoresha || 'Unknown',
//         userPhone: inv.user?.nimero_yatelefone || '',
//         productName: inv.productName,
//         amount: inv.amount,
//         dailyEarning: inv.dailyEarning,
//         totalReturn: inv.totalReturn,
//         totalEarnedSoFar: inv.totalEarnedSoFar,
//         status: inv.status,
//         purchaseDate: inv.purchaseDate,
//         endDate: inv.endDate,
//         daysRemaining,
//         progress,
//         earningsHistory: inv.earningsHistory || []
//       };
//     });
    
//     // Calculate stats
//     const stats = formattedInvestments.reduce((acc, inv) => {
//       acc.totalInvested += inv.amount;
//       acc.totalEarned += inv.totalEarnedSoFar;
//       if (inv.status === 'active') acc.activeCount++;
//       if (inv.status === 'completed') acc.completedCount++;
//       acc.totalExpectedReturn += inv.totalReturn;
//       return acc;
//     }, { totalInvested: 0, totalEarned: 0, activeCount: 0, completedCount: 0, totalExpectedReturn: 0 });
    
//     stats.averageROI = stats.totalInvested > 0 
//       ? ((stats.totalExpectedReturn / stats.totalInvested) * 100).toFixed(1) 
//       : 0;
    
//     stats.investorCount = new Set(investments.map(inv => inv.user?._id?.toString())).size;
    
//     res.json({ 
//       success: true, 
//       investments: formattedInvestments,
//       stats
//     });
//   } catch (error) {
//     console.error('Get investments error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get investment by ID
// router.get('/investments/:id', adminAuth, async (req, res) => {
//   try {
//     const investment = await Investment.findById(req.params.id)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets');
    
//     if (!investment) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Investment not found' 
//       });
//     }
    
//     const purchaseDate = new Date(investment.purchaseDate);
//     const endDate = new Date(investment.endDate);
//     const today = new Date();
    
//     const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
//     const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
//     const progress = Math.min(100, (daysSincePurchase / 30) * 100);
    
//     res.json({ 
//       success: true, 
//       investment: {
//         ...investment.toObject(),
//         daysRemaining,
//         progress,
//         daysSincePurchase
//       }
//     });
//   } catch (error) {
//     console.error('Get investment error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // ==================================================
// // TRANSACTION MANAGEMENT
// // ==================================================

// // Get all transactions (admin view)
// router.get('/transactions', adminAuth, async (req, res) => {
//   try {
//     const { type, status, page = 1, limit = 50, userId } = req.query;
    
//     const query = {};
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (userId) query.user = userId;
    
//     const transactions = await Transaction.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
//       .populate('processedBy', 'izina_ryogukoresha')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
    
//     const total = await Transaction.countDocuments(query);
    
//     // Get summary stats
//     const summary = {
//       totalDeposits: await Transaction.countDocuments({ type: 'deposit' }),
//       totalWithdrawals: await Transaction.countDocuments({ type: 'withdraw' }),
//       pendingDeposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
//       pendingWithdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
//       totalAmount: await Transaction.aggregate([
//         { $match: query },
//         { $group: { _id: null, total: { $sum: '$amount' } } }
//       ]).then(result => result[0]?.total || 0)
//     };
    
//     res.json({ 
//       success: true, 
//       transactions,
//       summary,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit)
//     });
//   } catch (error) {
//     console.error('Get admin transactions error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get all pending transactions
// router.get('/transactions/pending', adminAuth, async (req, res) => {
//   try {
//     const { type } = req.query;
    
//     const query = { status: 'pending' };
//     if (type) query.type = type;
    
//     const transactions = await Transaction.find(query)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
//       .sort({ createdAt: 1 }) // Oldest first
//       .limit(100);
    
//     // Format transactions for frontend with all metadata
//     const formattedTransactions = transactions.map(tx => ({
//       transactionId: tx._id,
//       userId: tx.user?._id,
//       userName: tx.user?.izina_ryogukoresha || 'Unknown',
//       userPhone: tx.user?.nimero_yatelefone || '',
//       type: tx.type,
//       amount: tx.amount,
//       paymentMethod: tx.paymentMethod,
//       phoneNumber: tx.phoneNumber,
//       reference: tx.reference,
//       description: tx.description,
//       createdAt: tx.createdAt,
//       metadata: tx.metadata || {} // Include all metadata
//     }));
    
//     // Get counts for each type
//     const counts = {
//       deposits: await Transaction.countDocuments({ type: 'deposit', status: 'pending' }),
//       withdrawals: await Transaction.countDocuments({ type: 'withdraw', status: 'pending' }),
//       total: await Transaction.countDocuments({ status: 'pending' })
//     };
    
//     // Calculate total amounts
//     const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
//     const depositAmount = transactions
//       .filter(tx => tx.type === 'deposit')
//       .reduce((sum, tx) => sum + tx.amount, 0);
//     const withdrawalAmount = transactions
//       .filter(tx => tx.type === 'withdraw')
//       .reduce((sum, tx) => sum + tx.amount, 0);
    
//     res.json({ 
//       success: true, 
//       transactions: formattedTransactions,
//       counts,
//       total: transactions.length,
//       amounts: {
//         total: totalAmount,
//         deposits: depositAmount,
//         withdrawals: withdrawalAmount
//       }
//     });
//   } catch (error) {
//     console.error('Get pending transactions error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Get transaction by ID with full details
// router.get('/transactions/:id', adminAuth, async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id)
//       .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
//       .populate('processedBy', 'izina_ryogukoresha email');
    
//     if (!transaction) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found' 
//       });
//     }
    
//     res.json({ 
//       success: true, 
//       transaction 
//     });
//   } catch (error) {
//     console.error('Get transaction error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// // Approve transaction - UPDATED to include metadata
// router.post('/transactions/:id/approve', adminAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { note } = req.body;
//     const adminId = req.admin._id;
    
//     console.log(`\n🚀 ========================================`);
//     console.log(`🚀 ADMIN TRANSACTION APPROVAL REQUEST`);
//     console.log(`🚀 ========================================`);
//     console.log(`📅 Timestamp: ${new Date().toISOString()}`);
//     console.log(`👤 Admin ID: ${adminId}`);
//     console.log(`📝 Transaction ID: ${id}`);
//     console.log(`🗒️  Note: ${note || 'No note provided'}`);
//     console.log(`🚀 ========================================\n`);
    
//     // Find transaction in Transaction collection
//     const transaction = await Transaction.findById(id);
    
//     if (!transaction) {
//       console.error(`❌ Transaction not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found in database' 
//       });
//     }
    
//     // Check if already processed
//     if (transaction.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Transaction already ${transaction.status}`
//       });
//     }
    
//     // Populate user details
//     await transaction.populate('user');
    
//     console.log(`📋 ========================================`);
//     console.log(`📋 TRANSACTION DETAILS`);
//     console.log(`📋 ========================================`);
//     console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
//     console.log(`📱 Phone: ${transaction.user.nimero_yatelefone}`);
//     console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📞 Payment Method: ${transaction.paymentMethod}`);
//     console.log(`📱 Receiver Phone: ${transaction.phoneNumber}`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
    
//     // Log metadata if present
//     if (transaction.metadata) {
//       console.log(`📋 Metadata:`, JSON.stringify(transaction.metadata, null, 2));
//     }
    
//     console.log(`📊 Current Status: ${transaction.status}`);
//     console.log(`📅 Created: ${transaction.createdAt}`);
//     console.log(`📋 ========================================\n`);
    
//     // Update transaction status
//     transaction.status = 'completed';
//     transaction.adminNote = note || 'Transaction approved by admin';
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
    
//     // Get user to update wallet
//     const user = await User.findById(transaction.user._id);
    
//     if (!user) {
//       console.error(`❌ User not found: ${transaction.user._id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (transaction.type === 'deposit') {
//       console.log(`💰 ========================================`);
//       console.log(`💰 PROCESSING DEPOSIT`);
//       console.log(`💰 ========================================`);
      
//       // Add to user's main wallet
//       const oldBalance = user.wallets.main;
//       user.wallets.main += transaction.amount;
//       user.stats.totalDeposits += transaction.amount;
//       user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
//       console.log(`💰 Old Balance: ${oldBalance.toLocaleString()} FRW`);
//       console.log(`💰 Deposit Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💰 New Balance: ${user.wallets.main.toLocaleString()} FRW`);
//       console.log(`💰 Total Deposits: ${user.stats.totalDeposits.toLocaleString()} FRW`);
      
//       // Update embedded transaction in user document
//       const userTransaction = user.transactions.id(id);
//       if (userTransaction) {
//         userTransaction.status = 'completed';
//         userTransaction.processedBy = adminId;
//         userTransaction.processedAt = new Date();
//         userTransaction.adminNote = note || 'Deposit approved';
//       }
      
//       // NOTIFICATION: Deposit approved with metadata info
//       const metadata = transaction.metadata || {};
//       let notificationMessage = `Your deposit of ${transaction.amount.toLocaleString()} FRW has been approved.`;
      
//       if (metadata.senderName && metadata.senderPhone) {
//         notificationMessage += ` Sender: ${metadata.senderName} (${metadata.senderPhone})`;
//       }
      
//       await user.addNotification(notificationMessage, 'success');
      
//       console.log(`✅ Deposit added to user's wallet`);
//       console.log(`💰 ========================================\n`);
//     }
    
//     if (transaction.type === 'withdraw') {
//       console.log(`💸 ========================================`);
//       console.log(`💸 PROCESSING WITHDRAWAL APPROVAL`);
//       console.log(`💸 ========================================`);
      
//       // Check if user has enough in reserved wallet
//       if (user.wallets.reserved < transaction.amount) {
//         console.error(`❌ Insufficient reserved funds!`);
//         console.error(`💸 User Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//         console.error(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
        
//         // Reject transaction automatically
//         transaction.status = 'rejected';
//         transaction.adminNote = 'Insufficient reserved funds';
//         await transaction.save();
        
//         return res.status(400).json({
//           success: false,
//           message: `User has insufficient reserved funds for this withdrawal. Available: ${user.wallets.reserved.toLocaleString()} FRW`
//         });
//       }
      
//       // ONLY remove from RESERVED (money already out of EARNING)
//       const oldReserved = user.wallets.reserved;
      
//       user.wallets.reserved -= transaction.amount;
//       user.stats.totalWithdrawn += transaction.amount;
//       user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//       console.log(`💸 Total Withdrawn: ${user.stats.totalWithdrawn.toLocaleString()} FRW`);
      
//       // Update embedded transaction in user document
//       const userTransaction = user.transactions.id(id);
//       if (userTransaction) {
//         userTransaction.status = 'completed';
//         userTransaction.processedBy = adminId;
//         userTransaction.processedAt = new Date();
//         userTransaction.adminNote = note || 'Withdrawal approved';
//       }
      
//       // NOTIFICATION: Withdrawal approved with receiver info
//       const metadata = transaction.metadata || {};
//       let notificationMessage = `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been approved.`;
      
//       if (metadata.receiverName) {
//         notificationMessage += ` Receiver: ${metadata.receiverName}`;
//       }
      
//       if (metadata.fees) {
//         notificationMessage += ` Net amount: ${metadata.fees.netAmount?.toLocaleString() || transaction.amount} FRW.`;
//       }
      
//       await user.addNotification(notificationMessage, 'success');
      
//       console.log(`✅ Withdrawal approved successfully`);
//       console.log(`💸 ========================================\n`);
//     }
    
//     // Save all changes
//     await transaction.save();
//     await user.save();
    
//     console.log(`✅ ========================================`);
//     console.log(`✅ TRANSACTION APPROVED SUCCESSFULLY!`);
//     console.log(`✅ ========================================`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`💰 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`👤 User: ${user.izina_ryogukoresha}`);
//     console.log(`📱 Phone: ${user.nimero_yatelefone}`);
//     console.log(`📊 New Wallet Status:`);
//     console.log(`   💰 Main: ${user.wallets.main.toLocaleString()} FRW`);
//     console.log(`   💸 Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//     console.log(`   🔒 Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//     console.log(`✅ ========================================\n`);
    
//     res.json({ 
//       success: true, 
//       message: 'Transaction approved successfully',
//       transaction: {
//         id: transaction._id,
//         type: transaction.type,
//         amount: transaction.amount,
//         status: transaction.status,
//         adminNote: transaction.adminNote,
//         reference: transaction.reference,
//         metadata: transaction.metadata
//       },
//       user: {
//         id: user._id,
//         name: user.izina_ryogukoresha,
//         email: user.email,
//         phone: user.nimero_yatelefone,
//         wallets: user.wallets
//       }
//     });
//   } catch (error) {
//     console.error(`❌ ========================================`);
//     console.error(`❌ APPROVAL ERROR`);
//     console.error(`❌ ========================================`);
//     console.error(`Error: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
//     console.error(`❌ ========================================\n`);
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to approve transaction',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Reject transaction - UPDATED to handle metadata
// router.post('/transactions/:id/reject', adminAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { note } = req.body;
//     const adminId = req.admin._id;
    
//     console.log(`\n❌ ========================================`);
//     console.log(`❌ ADMIN TRANSACTION REJECTION REQUEST`);
//     console.log(`❌ ========================================`);
//     console.log(`📅 Timestamp: ${new Date().toISOString()}`);
//     console.log(`👤 Admin ID: ${adminId}`);
//     console.log(`📝 Transaction ID: ${id}`);
//     console.log(`🗒️  Reason: ${note || 'No reason provided'}`);
    
//     if (!note || note.trim() === '') {
//       console.error(`❌ Rejection reason is required`);
//       return res.status(400).json({
//         success: false,
//         message: 'Rejection reason is required'
//       });
//     }
    
//     // Find transaction in Transaction collection
//     const transaction = await Transaction.findById(id);
    
//     if (!transaction) {
//       console.error(`❌ Transaction not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Transaction not found' 
//       });
//     }
    
//     // Check if already processed
//     if (transaction.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Transaction already ${transaction.status}`
//       });
//     }
    
//     // Populate user details
//     await transaction.populate('user');
    
//     console.log(`📋 ========================================`);
//     console.log(`📋 TRANSACTION DETAILS`);
//     console.log(`📋 ========================================`);
//     console.log(`👤 User: ${transaction.user.izina_ryogukoresha} (${transaction.user.email})`);
//     console.log(`💰 Type: ${transaction.type.toUpperCase()}`);
//     console.log(`💵 Amount: ${transaction.amount.toLocaleString()} FRW`);
//     console.log(`📄 Description: ${transaction.description}`);
//     console.log(`🆔 Reference: ${transaction.reference}`);
//     console.log(`📊 Current Status: ${transaction.status}`);
    
//     // Log metadata if present
//     if (transaction.metadata) {
//       console.log(`📋 Metadata:`, JSON.stringify(transaction.metadata, null, 2));
//     }
    
//     console.log(`📋 ========================================\n`);
    
//     // Update transaction
//     transaction.status = 'rejected';
//     transaction.adminNote = note;
//     transaction.processedBy = adminId;
//     transaction.processedAt = new Date();
    
//     // Get user to update
//     const user = await User.findById(transaction.user._id);
    
//     if (!user) {
//       console.error(`❌ User not found: ${transaction.user._id}`);
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     if (transaction.type === 'withdraw') {
//       console.log(`💸 ========================================`);
//       console.log(`💸 RELEASING RESERVED FUNDS BACK TO EARNING`);
//       console.log(`💸 ========================================`);
      
//       // Release reserved funds back to earning wallet
//       const oldReserved = user.wallets.reserved;
//       const oldEarnings = user.wallets.earning;
      
//       user.wallets.earning += transaction.amount;
//       user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
//       user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
//       console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
//       console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
//       console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
//       console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
//       console.log(`💸 New Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
//       console.log(`💸 ========================================\n`);
      
//       await user.addNotification(
//         `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}. Funds returned to your earnings wallet.`,
//         'warning'
//       );
      
//     } else if (transaction.type === 'deposit') {
//       user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
//       await user.addNotification(
//         `Your deposit of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}.`,
//         'warning'
//       );
//     }
    
//     // Update embedded transaction in user document
//     const userTransaction = user.transactions.id(id);
//     if (userTransaction) {
//       userTransaction.status = 'rejected';
//       userTransaction.processedBy = adminId;
//       userTransaction.processedAt = new Date();
//       userTransaction.adminNote = note;
//     }
    
//     // Save changes
//     await transaction.save();
//     await user.save();
    
//     console.log(`✅ ========================================`);
//     console.log(`✅ TRANSACTION REJECTED SUCCESSFULLY!`);
//     console.log(`✅ ========================================`);
//     console.log(`📝 Transaction ID: ${transaction._id}`);
//     console.log(`🗒️  Reason: ${note}`);
//     console.log(`👤 User Notified: ${user.izina_ryogukoresha}`);
//     console.log(`✅ ========================================\n`);
    
//     res.json({ 
//       success: true, 
//       message: 'Transaction rejected',
//       transaction: {
//         id: transaction._id,
//         type: transaction.type,
//         amount: transaction.amount,
//         status: transaction.status,
//         adminNote: transaction.adminNote,
//         metadata: transaction.metadata
//       }
//     });
//   } catch (error) {
//     console.error(`❌ ========================================`);
//     console.error(`❌ REJECTION ERROR`);
//     console.error(`❌ ========================================`);
//     console.error(`Error: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
//     console.error(`❌ ========================================\n`);
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to reject transaction',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ==================================================
// // SYSTEM STATISTICS - FIXED to show correct data
// // ==================================================

// // Get system statistics
// router.get('/stats', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find();
//     const products = await Product.find();
//     const transactions = await Transaction.find();
//     const investments = await Investment.find();
    
//     // Get today's date for filtering
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Investment statistics
//     const activeInvestments = investments.filter(inv => inv.status === 'active');
//     const completedInvestments = investments.filter(inv => inv.status === 'completed');
    
//     const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
//     const totalEarnedFromInvestments = investments.reduce((sum, inv) => sum + (inv.totalEarnedSoFar || 0), 0);
//     const totalExpectedReturn = investments.reduce((sum, inv) => sum + (inv.totalReturn || 0), 0);
    
//     const averageROI = totalInvested > 0 
//       ? ((totalExpectedReturn / totalInvested) * 100).toFixed(1) 
//       : 0;
    
//     const investorCount = new Set(investments.map(inv => inv.user?.toString())).size;
    
//     // Transaction statistics with correct counts
//     const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
//     const pendingWithdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').length;
    
//     const stats = {
//       users: {
//         total: users.length,
//         active: users.filter(u => u.status === 'active').length,
//         suspended: users.filter(u => u.status === 'suspended').length,
//         today: users.filter(u => 
//           new Date(u.createdAt) >= today
//         ).length
//       },
      
//       finances: {
//         totalMain: users.reduce((sum, u) => sum + (u.wallets?.main || 0), 0),
//         totalEarning: users.reduce((sum, u) => sum + (u.wallets?.earning || 0), 0),
//         totalReserved: users.reduce((sum, u) => sum + (u.wallets?.reserved || 0), 0),
//         totalDeposits: await Transaction.aggregate([
//           { $match: { type: 'deposit', status: 'completed' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         totalWithdrawals: await Transaction.aggregate([
//           { $match: { type: 'withdraw', status: 'completed' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         pendingDeposits: await Transaction.aggregate([
//           { $match: { type: 'deposit', status: 'pending' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0),
//         pendingWithdrawals: await Transaction.aggregate([
//           { $match: { type: 'withdraw', status: 'pending' } },
//           { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]).then(result => result[0]?.total || 0)
//       },
      
//       investments: {
//         totalInvested,
//         totalEarned: totalEarnedFromInvestments,
//         activeCount: activeInvestments.length,
//         completedCount: completedInvestments.length,
//         totalExpectedReturn,
//         averageROI,
//         investorCount
//       },
      
//       products: {
//         total: products.length,
//         active: products.filter(p => p.status === 'active').length
//       },
      
//       transactions: {
//         total: transactions.length,
//         pending: transactions.filter(t => t.status === 'pending').length,
//         pendingDeposits,
//         pendingWithdrawals,
//         completed: transactions.filter(t => t.status === 'completed').length,
//         rejected: transactions.filter(t => t.status === 'rejected').length,
//         deposits: transactions.filter(t => t.type === 'deposit').length,
//         withdrawals: transactions.filter(t => t.type === 'withdraw').length
//       }
//     };
    
//     res.json({ 
//       success: true, 
//       stats 
//     });
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// });

// module.exports = router;



















// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');
const adminAuth = require('../middleware/adminAuth');
const notifyUser = require('../utils/notifications');

// ==================================================
// USER MANAGEMENT
// ==================================================

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('izina_ryogukoresha nimero_yatelefone email referralCode wallets stats status createdAt lastLogin bonus activeInvestments')
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
        lastLogin: user.lastLogin,
        bonus: user.bonus,
        activeInvestmentsCount: user.activeInvestments?.length || 0
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
    
    // Get user's investments
    const investments = await Investment.find({ user: user._id })
      .sort({ purchaseDate: -1 });
    
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
        lastLogin: user.lastLogin,
        bonus: user.bonus
      },
      activeInvestments: investments.filter(inv => inv.status === 'active'),
      completedInvestments: investments.filter(inv => inv.status === 'completed'),
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
    
    // NOTIFICATION: Status change
    if (typeof notifyUser?.statusChanged === 'function') {
      await notifyUser.statusChanged(user._id, status);
    }
    
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
// INVESTMENT MANAGEMENT
// ==================================================

// Get all investments
router.get('/investments', adminAuth, async (req, res) => {
  try {
    const { dateRange, status } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    // Date filtering
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      query.purchaseDate = { $gte: startDate };
    }
    
    const investments = await Investment.find(query)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email')
      .sort({ purchaseDate: -1 });
    
    const formattedInvestments = investments.map(inv => {
      const purchaseDate = new Date(inv.purchaseDate);
      const endDate = new Date(inv.endDate);
      const today = new Date();
      
      const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
      const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
      return {
        _id: inv._id,
        userId: inv.user?._id,
        userName: inv.user?.izina_ryogukoresha || 'Unknown',
        userPhone: inv.user?.nimero_yatelefone || '',
        productName: inv.productName,
        amount: inv.amount,
        dailyEarning: inv.dailyEarning,
        totalReturn: inv.totalReturn,
        totalEarnedSoFar: inv.totalEarnedSoFar,
        status: inv.status,
        purchaseDate: inv.purchaseDate,
        endDate: inv.endDate,
        daysRemaining,
        progress,
        earningsHistory: inv.earningsHistory || []
      };
    });
    
    // Calculate stats
    const stats = formattedInvestments.reduce((acc, inv) => {
      acc.totalInvested += inv.amount;
      acc.totalEarned += inv.totalEarnedSoFar;
      if (inv.status === 'active') acc.activeCount++;
      if (inv.status === 'completed') acc.completedCount++;
      acc.totalExpectedReturn += inv.totalReturn;
      return acc;
    }, { totalInvested: 0, totalEarned: 0, activeCount: 0, completedCount: 0, totalExpectedReturn: 0 });
    
    stats.averageROI = stats.totalInvested > 0 
      ? ((stats.totalExpectedReturn / stats.totalInvested) * 100).toFixed(1) 
      : 0;
    
    stats.investorCount = new Set(investments.map(inv => inv.user?._id?.toString())).size;
    
    res.json({ 
      success: true, 
      investments: formattedInvestments,
      stats
    });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
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
    const endDate = new Date(investment.endDate);
    const today = new Date();
    
    const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
    const progress = Math.min(100, (daysSincePurchase / 30) * 100);
    
    res.json({ 
      success: true, 
      investment: {
        ...investment.toObject(),
        daysRemaining,
        progress,
        daysSincePurchase
      }
    });
  } catch (error) {
    console.error('Get investment error:', error);
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

// Get all pending transactions - UPDATED with full metadata
router.get('/transactions/pending', adminAuth, async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { status: 'pending' };
    if (type) query.type = type;
    
    const transactions = await Transaction.find(query)
      .populate('user', 'izina_ryogukoresha nimero_yatelefone email wallets')
      .sort({ createdAt: 1 }) // Oldest first
      .limit(100);
    
    // Format transactions for frontend with all metadata
    const formattedTransactions = transactions.map(tx => {
      // Get user's registered phone
      const registeredPhone = tx.user?.nimero_yatelefone || '';
      
      // Extract metadata safely
      const metadata = tx.metadata || {};
      
      return {
        transactionId: tx._id,
        userId: tx.user?._id,
        userName: tx.user?.izina_ryogukoresha || 'Unknown',
        userPhone: registeredPhone, // This is the REGISTERED phone
        userEmail: tx.user?.email || '',
        type: tx.type,
        amount: tx.amount,
        paymentMethod: tx.paymentMethod,
        phoneNumber: tx.phoneNumber, // This is the target phone (deposit number or withdrawal number)
        reference: tx.reference,
        description: tx.description,
        createdAt: tx.createdAt,
        metadata: {
          // Deposit-specific fields
          senderPhone: metadata.senderPhone || null,
          senderName: metadata.senderName || null,
          
          // Withdrawal-specific fields
          receiverName: metadata.receiverName || null,
          
          // Fee breakdown for withdrawals
          fees: metadata.fees || null,
          
          // Bonus info
          bonus: metadata.bonus || null,
          
          // Any other metadata
          ...metadata
        }
      };
    });
    
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
      transactions: formattedTransactions,
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
    const adminId = req.admin._id;
    
    console.log(`\n🚀 ========================================`);
    console.log(`🚀 ADMIN TRANSACTION APPROVAL REQUEST`);
    console.log(`🚀 ========================================`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`👤 Admin ID: ${adminId}`);
    console.log(`📝 Transaction ID: ${id}`);
    console.log(`🗒️  Note: ${note || 'No note provided'}`);
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
    
    // Check if already processed
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Transaction already ${transaction.status}`
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
    
    // Log metadata if present
    if (transaction.metadata) {
      console.log(`📋 Metadata:`, JSON.stringify(transaction.metadata, null, 2));
    }
    
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
      
      // NOTIFICATION: Deposit approved with metadata info
      const metadata = transaction.metadata || {};
      let notificationMessage = `Your deposit of ${transaction.amount.toLocaleString()} FRW has been approved.`;
      
      if (metadata.senderName && metadata.senderPhone) {
        notificationMessage += ` Sender: ${metadata.senderName} (${metadata.senderPhone})`;
      }
      
      await user.addNotification(notificationMessage, 'success');
      
      console.log(`✅ Deposit added to user's wallet`);
      console.log(`💰 ========================================\n`);
    }
    
    if (transaction.type === 'withdraw') {
      console.log(`💸 ========================================`);
      console.log(`💸 PROCESSING WITHDRAWAL APPROVAL`);
      console.log(`💸 ========================================`);
      
      // Check if user has enough in reserved wallet
      if (user.wallets.reserved < transaction.amount) {
        console.error(`❌ Insufficient reserved funds!`);
        console.error(`💸 User Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
        console.error(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
        
        // Reject transaction automatically
        transaction.status = 'rejected';
        transaction.adminNote = 'Insufficient reserved funds';
        await transaction.save();
        
        return res.status(400).json({
          success: false,
          message: `User has insufficient reserved funds for this withdrawal. Available: ${user.wallets.reserved.toLocaleString()} FRW`
        });
      }
      
      // ONLY remove from RESERVED (money already out of EARNING)
      const oldReserved = user.wallets.reserved;
      
      user.wallets.reserved -= transaction.amount;
      user.stats.totalWithdrawn += transaction.amount;
      user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
      console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
      console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
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
      
      // NOTIFICATION: Withdrawal approved with receiver info
      const metadata = transaction.metadata || {};
      let notificationMessage = `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been approved.`;
      
      if (metadata.receiverName) {
        notificationMessage += ` Receiver: ${metadata.receiverName}`;
      }
      
      if (metadata.fees) {
        notificationMessage += ` Net amount: ${metadata.fees.netAmount?.toLocaleString() || transaction.amount} FRW.`;
      }
      
      await user.addNotification(notificationMessage, 'success');
      
      console.log(`✅ Withdrawal approved successfully`);
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
        reference: transaction.reference,
        metadata: transaction.metadata
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
    const adminId = req.admin._id;
    
    console.log(`\n❌ ========================================`);
    console.log(`❌ ADMIN TRANSACTION REJECTION REQUEST`);
    console.log(`❌ ========================================`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`👤 Admin ID: ${adminId}`);
    console.log(`📝 Transaction ID: ${id}`);
    console.log(`🗒️  Reason: ${note || 'No reason provided'}`);
    
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
    
    // Check if already processed
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Transaction already ${transaction.status}`
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
    
    // Log metadata if present
    if (transaction.metadata) {
      console.log(`📋 Metadata:`, JSON.stringify(transaction.metadata, null, 2));
    }
    
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
      console.log(`💸 RELEASING RESERVED FUNDS BACK TO EARNING`);
      console.log(`💸 ========================================`);
      
      // Release reserved funds back to earning wallet
      const oldReserved = user.wallets.reserved;
      const oldEarnings = user.wallets.earning;
      
      user.wallets.earning += transaction.amount;
      user.wallets.reserved = Math.max(0, user.wallets.reserved - transaction.amount);
      user.stats.pendingWithdrawals = Math.max(0, user.stats.pendingWithdrawals - transaction.amount);
      
      console.log(`💸 Old Reserved: ${oldReserved.toLocaleString()} FRW`);
      console.log(`💸 Old Earnings: ${oldEarnings.toLocaleString()} FRW`);
      console.log(`💸 Withdrawal Amount: ${transaction.amount.toLocaleString()} FRW`);
      console.log(`💸 New Reserved: ${user.wallets.reserved.toLocaleString()} FRW`);
      console.log(`💸 New Earnings: ${user.wallets.earning.toLocaleString()} FRW`);
      console.log(`💸 ========================================\n`);
      
      await user.addNotification(
        `Your withdrawal of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}. Funds returned to your earnings wallet.`,
        'warning'
      );
      
    } else if (transaction.type === 'deposit') {
      user.stats.pendingDeposits = Math.max(0, user.stats.pendingDeposits - transaction.amount);
      
      await user.addNotification(
        `Your deposit of ${transaction.amount.toLocaleString()} FRW has been rejected. Reason: ${note}.`,
        'warning'
      );
    }
    
    // Update embedded transaction in user document
    const userTransaction = user.transactions.id(id);
    if (userTransaction) {
      userTransaction.status = 'rejected';
      userTransaction.processedBy = adminId;
      userTransaction.processedAt = new Date();
      userTransaction.adminNote = note;
    }
    
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
        adminNote: transaction.adminNote,
        metadata: transaction.metadata
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
    const investments = await Investment.find();
    
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Investment statistics
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    const completedInvestments = investments.filter(inv => inv.status === 'completed');
    
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalEarnedFromInvestments = investments.reduce((sum, inv) => sum + (inv.totalEarnedSoFar || 0), 0);
    const totalExpectedReturn = investments.reduce((sum, inv) => sum + (inv.totalReturn || 0), 0);
    
    const averageROI = totalInvested > 0 
      ? ((totalExpectedReturn / totalInvested) * 100).toFixed(1) 
      : 0;
    
    const investorCount = new Set(investments.map(inv => inv.user?.toString())).size;
    
    // Transaction statistics with correct counts
    const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
    const pendingWithdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').length;
    
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
      
      investments: {
        totalInvested,
        totalEarned: totalEarnedFromInvestments,
        activeCount: activeInvestments.length,
        completedCount: completedInvestments.length,
        totalExpectedReturn,
        averageROI,
        investorCount
      },
      
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length
      },
      
      transactions: {
        total: transactions.length,
        pending: transactions.filter(t => t.status === 'pending').length,
        pendingDeposits,
        pendingWithdrawals,
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