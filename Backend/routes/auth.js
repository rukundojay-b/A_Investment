








// // // // // // backend/routes/auth.js
// // // // // const express = require('express');
// // // // // const router = express.Router();
// // // // // const User = require('../models/User');

// // // // // // =====================
// // // // // // REGISTER USER
// // // // // // =====================
// // // // // router.post('/signup', async (req, res) => {
// // // // //   try {
// // // // //     const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga, referredBy } = req.body;

// // // // //     console.log('🔐 Signup attempt:', { 
// // // // //       izina_ryogukoresha, 
// // // // //       nimero_yatelefone, 
// // // // //       referredBy: referredBy || 'No referral' 
// // // // //     });

// // // // //     // Validation
// // // // //     if (!izina_ryogukoresha || !nimero_yatelefone || !ijambo_banga) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Byose birakenewe: izina, numero ya telefone, ijambo banga'
// // // // //       });
// // // // //     }

// // // // //     // Check phone format
// // // // //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// // // // //     if (!phoneRegex.test(nimero_yatelefone)) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// // // // //       });
// // // // //     }

// // // // //     // Check if username already exists
// // // // //     const existingUsername = await User.findOne({ izina_ryogukoresha });
// // // // //     if (existingUsername) {
// // // // //       return res.status(409).json({
// // // // //         success: false,
// // // // //         message: 'Izina ryogukoresha risanzwe rikoreshwa'
// // // // //       });
// // // // //     }

// // // // //     // Check if phone number already exists
// // // // //     const existingPhone = await User.findOne({ nimero_yatelefone });
// // // // //     if (existingPhone) {
// // // // //       return res.status(409).json({
// // // // //         success: false,
// // // // //         message: 'Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.'
// // // // //       });
// // // // //     }

// // // // //     // Find referrer if referral code exists
// // // // //     let referrerUser = null;
// // // // //     if (referredBy) {
// // // // //       referrerUser = await User.findOne({ referralCode: referredBy });
// // // // //       if (referrerUser) {
// // // // //         console.log('✅ Referrer found:', referrerUser.izina_ryogukoresha, 'with code:', referredBy);
// // // // //       } else {
// // // // //         console.log('⚠️ Referrer not found for code:', referredBy);
// // // // //       }
// // // // //     }

// // // // //     // Create new user
// // // // //     const user = new User({
// // // // //       izina_ryogukoresha,
// // // // //       nimero_yatelefone,
// // // // //       ijambo_banga,
// // // // //       referredBy: referrerUser ? referrerUser._id : null, // Store referrer's ID
// // // // //       wallets: { main: 400, earning: 0, reserved: 0 }, // Registration bonus
// // // // //       stats: {
// // // // //         totalReferrals: 0,
// // // // //         totalEarned: 0,
// // // // //         totalSpent: 0,
// // // // //         totalInvestments: 0,
// // // // //         totalWithdrawn: 0,
// // // // //         referralEarnings: 0,
// // // // //         totalDeposits: 0,
// // // // //         pendingDeposits: 0,
// // // // //         pendingWithdrawals: 0,
// // // // //         dailyEarnings: 0
// // // // //       },
// // // // //       status: 'active'
// // // // //     });

// // // // //     await user.save();
// // // // //     console.log('✅ New user created:', user.izina_ryogukoresha);
// // // // //     console.log('📋 Referral code generated:', user.referralCode);
    
// // // // //     if (user.referredBy) {
// // // // //       console.log('👥 Referred by user ID:', user.referredBy);
// // // // //     }

// // // // //     // If there's a referrer, update their stats
// // // // //     if (referrerUser) {
// // // // //       referrerUser.stats.totalReferrals += 1;
// // // // //       await referrerUser.save();
// // // // //       console.log('✅ Updated referrer stats for:', referrerUser.izina_ryogukoresha);
// // // // //       console.log('📊 Referrer total referrals now:', referrerUser.stats.totalReferrals);
      
// // // // //       // Add notification for referrer
// // // // //       await referrerUser.addNotification(
// // // // //         `🎉 ${user.izina_ryogukoresha} just signed up using your referral link!`,
// // // // //         'success'
// // // // //       );
// // // // //     }

// // // // //     // Generate token
// // // // //     const token = user.generateAuthToken();

// // // // //     // Get dashboard data
// // // // //     const userResponse = user.getDashboardData();

// // // // //     res.status(201).json({
// // // // //       success: true,
// // // // //       message: 'Urabyemewe! Urakozwe kwiyandikisha.',
// // // // //       token,
// // // // //       user: userResponse
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('❌ Signup error:', error.message);
    
// // // // //     // Handle duplicate key errors
// // // // //     if (error.code === 11000) {
// // // // //       const field = Object.keys(error.keyPattern)[0];
// // // // //       const message = field === 'nimero_yatelefone' 
// // // // //         ? 'Numero ya telefone isanzwe ikoreshwa'
// // // // //         : 'Izina ryogukoresha risanzwe rikoreshwa';
      
// // // // //       return res.status(409).json({
// // // // //         success: false,
// // // // //         message
// // // // //       });
// // // // //     }

// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error. Ongera ugerageze nyuma.'
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // =====================
// // // // // // LOGIN USER
// // // // // // =====================
// // // // // router.post('/login', async (req, res) => {
// // // // //   try {
// // // // //     const { nimero_yatelefone, ijambo_banga } = req.body;

// // // // //     console.log('🔐 Login attempt for phone:', nimero_yatelefone);

// // // // //     // Validation
// // // // //     if (!nimero_yatelefone || !ijambo_banga) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
// // // // //       });
// // // // //     }

// // // // //     // Check phone format
// // // // //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// // // // //     if (!phoneRegex.test(nimero_yatelefone)) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// // // // //       });
// // // // //     }

// // // // //     // Find user
// // // // //     const user = await User.findOne({ nimero_yatelefone });
// // // // //     if (!user) {
// // // // //       console.log('❌ Login failed: User not found');
// // // // //       return res.status(401).json({
// // // // //         success: false,
// // // // //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// // // // //       });
// // // // //     }

// // // // //     // Check password
// // // // //     const isPasswordValid = await user.comparePassword(ijambo_banga);
// // // // //     if (!isPasswordValid) {
// // // // //       console.log('❌ Login failed: Invalid password');
// // // // //       return res.status(401).json({
// // // // //         success: false,
// // // // //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// // // // //       });
// // // // //     }

// // // // //     // Update last login
// // // // //     user.lastLogin = new Date();
// // // // //     await user.save();

// // // // //     console.log('✅ Login successful for:', user.izina_ryogukoresha);

// // // // //     // Generate token
// // // // //     const token = user.generateAuthToken();

// // // // //     // Get dashboard data
// // // // //     const dashboardData = user.getDashboardData();

// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: 'Login successful!',
// // // // //       token,
// // // // //       user: dashboardData
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('❌ Login error:', error.message);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error. Ongera ugerageze nyuma.'
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // =====================
// // // // // // CHECK PHONE AVAILABILITY
// // // // // // =====================
// // // // // router.get('/check-phone/:phone', async (req, res) => {
// // // // //   try {
// // // // //     const { phone } = req.params;
    
// // // // //     const user = await User.findOne({ nimero_yatelefone: phone });
    
// // // // //     res.json({
// // // // //       success: true,
// // // // //       available: !user,
// // // // //       message: user ? 'Numero isanzwe ikoreshwa' : 'Numero irashobora gukoreshwa'
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error('❌ Check phone error:', error.message);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error'
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // =====================
// // // // // // CHECK USERNAME AVAILABILITY
// // // // // // =====================
// // // // // router.get('/check-username/:username', async (req, res) => {
// // // // //   try {
// // // // //     const { username } = req.params;
    
// // // // //     const user = await User.findOne({ izina_ryogukoresha: username });
    
// // // // //     res.json({
// // // // //       success: true,
// // // // //       available: !user,
// // // // //       message: user ? 'Izina risanzwe rikoreshwa' : 'Izina rirashobora gukoreshwa'
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error('❌ Check username error:', error.message);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error'
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // =====================
// // // // // // GET REFERRAL INFO
// // // // // // =====================
// // // // // router.get('/referral/:code', async (req, res) => {
// // // // //   try {
// // // // //     const { code } = req.params;
    
// // // // //     const user = await User.findOne({ referralCode: code }).select('izina_ryogukoresha referralCode');
    
// // // // //     if (!user) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: 'Referral code not found'
// // // // //       });
// // // // //     }
    
// // // // //     res.json({
// // // // //       success: true,
// // // // //       user: {
// // // // //         name: user.izina_ryogukoresha,
// // // // //         code: user.referralCode
// // // // //       }
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error('❌ Referral check error:', error.message);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error'
// // // // //     });
// // // // //   }
// // // // // });

// // // // // module.exports = router;















// // // // // backend/routes/auth.js
// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const User = require('../models/User');
// // // // const notifyUser = require('../utils/notifications');

// // // // // =====================
// // // // // REGISTER USER
// // // // // =====================
// // // // router.post('/signup', async (req, res) => {
// // // //   try {
// // // //     const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga, referredBy } = req.body;

// // // //     console.log('🔐 Signup attempt:', { 
// // // //       izina_ryogukoresha, 
// // // //       nimero_yatelefone, 
// // // //       referredBy: referredBy || 'No referral' 
// // // //     });

// // // //     // Validation
// // // //     if (!izina_ryogukoresha || !nimero_yatelefone || !ijambo_banga) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Byose birakenewe: izina, numero ya telefone, ijambo banga'
// // // //       });
// // // //     }

// // // //     // Check phone format
// // // //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// // // //     if (!phoneRegex.test(nimero_yatelefone)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// // // //       });
// // // //     }

// // // //     // Check if username already exists
// // // //     const existingUsername = await User.findOne({ izina_ryogukoresha });
// // // //     if (existingUsername) {
// // // //       return res.status(409).json({
// // // //         success: false,
// // // //         message: 'Izina ryogukoresha risanzwe rikoreshwa'
// // // //       });
// // // //     }

// // // //     // Check if phone number already exists
// // // //     const existingPhone = await User.findOne({ nimero_yatelefone });
// // // //     if (existingPhone) {
// // // //       return res.status(409).json({
// // // //         success: false,
// // // //         message: 'Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.'
// // // //       });
// // // //     }

// // // //     // Find referrer if referral code exists
// // // //     let referrerUser = null;
// // // //     if (referredBy) {
// // // //       referrerUser = await User.findOne({ referralCode: referredBy });
// // // //       if (referrerUser) {
// // // //         console.log('✅ Referrer found:', referrerUser.izina_ryogukoresha, 'with code:', referredBy);
// // // //       } else {
// // // //         console.log('⚠️ Referrer not found for code:', referredBy);
// // // //       }
// // // //     }

// // // //     // Create new user
// // // //     const user = new User({
// // // //       izina_ryogukoresha,
// // // //       nimero_yatelefone,
// // // //       ijambo_banga,
// // // //       referredBy: referrerUser ? referrerUser._id : null, // Store referrer's ID
// // // //       wallets: { main: 400, earning: 0, reserved: 0 }, // Registration bonus
// // // //       stats: {
// // // //         totalReferrals: 0,
// // // //         totalEarned: 0,
// // // //         totalSpent: 0,
// // // //         totalInvestments: 0,
// // // //         totalWithdrawn: 0,
// // // //         referralEarnings: 0,
// // // //         totalDeposits: 0,
// // // //         pendingDeposits: 0,
// // // //         pendingWithdrawals: 0,
// // // //         dailyEarnings: 0
// // // //       },
// // // //       status: 'active'
// // // //     });

// // // //     await user.save();
// // // //     console.log('✅ New user created:', user.izina_ryogukoresha);
// // // //     console.log('📋 Referral code generated:', user.referralCode);
    
// // // //     if (user.referredBy) {
// // // //       console.log('👥 Referred by user ID:', user.referredBy);
// // // //     }

// // // //     // If there's a referrer, update their stats
// // // //     if (referrerUser) {
// // // //       referrerUser.stats.totalReferrals += 1;
// // // //       await referrerUser.save();
// // // //       console.log('✅ Updated referrer stats for:', referrerUser.izina_ryogukoresha);
// // // //       console.log('📊 Referrer total referrals now:', referrerUser.stats.totalReferrals);
      
// // // //       // Add notification for referrer (using existing method)
// // // //       await referrerUser.addNotification(
// // // //         `🎉 ${user.izina_ryogukoresha} just signed up using your referral link!`,
// // // //         'success'
// // // //       );
      
// // // //       // ✅ NOTIFICATION: New referral using new system
// // // //       await notifyUser.newReferral(
// // // //         referrerUser._id,
// // // //         user.izina_ryogukoresha
// // // //       );
// // // //     }

// // // //     // ✅ NOTIFICATION: Welcome new user
// // // //     await notifyUser.welcome(user._id, user.izina_ryogukoresha);

// // // //     // Generate token
// // // //     const token = user.generateAuthToken();

// // // //     // Get dashboard data
// // // //     const userResponse = user.getDashboardData();

// // // //     res.status(201).json({
// // // //       success: true,
// // // //       message: 'Urabyemewe! Urakozwe kwiyandikisha.',
// // // //       token,
// // // //       user: userResponse
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('❌ Signup error:', error.message);
    
// // // //     // Handle duplicate key errors
// // // //     if (error.code === 11000) {
// // // //       const field = Object.keys(error.keyPattern)[0];
// // // //       const message = field === 'nimero_yatelefone' 
// // // //         ? 'Numero ya telefone isanzwe ikoreshwa'
// // // //         : 'Izina ryogukoresha risanzwe rikoreshwa';
      
// // // //       return res.status(409).json({
// // // //         success: false,
// // // //         message
// // // //       });
// // // //     }

// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error. Ongera ugerageze nyuma.'
// // // //     });
// // // //   }
// // // // });

// // // // // =====================
// // // // // LOGIN USER
// // // // // =====================
// // // // router.post('/login', async (req, res) => {
// // // //   try {
// // // //     const { nimero_yatelefone, ijambo_banga } = req.body;

// // // //     console.log('🔐 Login attempt for phone:', nimero_yatelefone);

// // // //     // Validation
// // // //     if (!nimero_yatelefone || !ijambo_banga) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
// // // //       });
// // // //     }

// // // //     // Check phone format
// // // //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// // // //     if (!phoneRegex.test(nimero_yatelefone)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// // // //       });
// // // //     }

// // // //     // Find user
// // // //     const user = await User.findOne({ nimero_yatelefone });
// // // //     if (!user) {
// // // //       console.log('❌ Login failed: User not found');
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// // // //       });
// // // //     }

// // // //     // Check password
// // // //     const isPasswordValid = await user.comparePassword(ijambo_banga);
// // // //     if (!isPasswordValid) {
// // // //       console.log('❌ Login failed: Invalid password');
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// // // //       });
// // // //     }

// // // //     // Update last login
// // // //     user.lastLogin = new Date();
// // // //     await user.save();

// // // //     console.log('✅ Login successful for:', user.izina_ryogukoresha);

// // // //     // Generate token
// // // //     const token = user.generateAuthToken();

// // // //     // Get dashboard data
// // // //     const dashboardData = user.getDashboardData();

// // // //     res.json({
// // // //       success: true,
// // // //       message: 'Login successful!',
// // // //       token,
// // // //       user: dashboardData
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('❌ Login error:', error.message);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error. Ongera ugerageze nyuma.'
// // // //     });
// // // //   }
// // // // });

// // // // // =====================
// // // // // CHECK PHONE AVAILABILITY
// // // // // =====================
// // // // router.get('/check-phone/:phone', async (req, res) => {
// // // //   try {
// // // //     const { phone } = req.params;
    
// // // //     const user = await User.findOne({ nimero_yatelefone: phone });
    
// // // //     res.json({
// // // //       success: true,
// // // //       available: !user,
// // // //       message: user ? 'Numero isanzwe ikoreshwa' : 'Numero irashobora gukoreshwa'
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('❌ Check phone error:', error.message);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error'
// // // //     });
// // // //   }
// // // // });

// // // // // =====================
// // // // // CHECK USERNAME AVAILABILITY
// // // // // =====================
// // // // router.get('/check-username/:username', async (req, res) => {
// // // //   try {
// // // //     const { username } = req.params;
    
// // // //     const user = await User.findOne({ izina_ryogukoresha: username });
    
// // // //     res.json({
// // // //       success: true,
// // // //       available: !user,
// // // //       message: user ? 'Izina risanzwe rikoreshwa' : 'Izina rirashobora gukoreshwa'
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('❌ Check username error:', error.message);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error'
// // // //     });
// // // //   }
// // // // });

// // // // // =====================
// // // // // GET REFERRAL INFO
// // // // // =====================
// // // // router.get('/referral/:code', async (req, res) => {
// // // //   try {
// // // //     const { code } = req.params;
    
// // // //     const user = await User.findOne({ referralCode: code }).select('izina_ryogukoresha referralCode');
    
// // // //     if (!user) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'Referral code not found'
// // // //       });
// // // //     }
    
// // // //     res.json({
// // // //       success: true,
// // // //       user: {
// // // //         name: user.izina_ryogukoresha,
// // // //         code: user.referralCode
// // // //       }
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('❌ Referral check error:', error.message);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error'
// // // //     });
// // // //   }
// // // // });

// // // // module.exports = router;











// // // // backend/routes/auth.js
// // // const express = require('express');
// // // const router = express.Router();
// // // const User = require('../models/User');
// // // const notifyUser = require('../utils/notifications');
// // // const bcrypt = require('bcryptjs'); // Make sure to require bcrypt

// // // // =====================
// // // // REGISTER USER
// // // // =====================
// // // router.post('/signup', async (req, res) => {
// // //   try {
// // //     const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga, referredBy } = req.body;

// // //     console.log('🔐 Signup attempt:', { 
// // //       izina_ryogukoresha, 
// // //       nimero_yatelefone, 
// // //       referredBy: referredBy || 'No referral' 
// // //     });

// // //     // Validation
// // //     if (!izina_ryogukoresha || !nimero_yatelefone || !ijambo_banga) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Byose birakenewe: izina, numero ya telefone, ijambo banga'
// // //       });
// // //     }

// // //     // Check phone format
// // //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// // //     if (!phoneRegex.test(nimero_yatelefone)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// // //       });
// // //     }

// // //     // Check if username already exists
// // //     const existingUsername = await User.findOne({ izina_ryogukoresha });
// // //     if (existingUsername) {
// // //       return res.status(409).json({
// // //         success: false,
// // //         message: 'Izina ryogukoresha risanzwe rikoreshwa'
// // //       });
// // //     }

// // //     // Check if phone number already exists
// // //     const existingPhone = await User.findOne({ nimero_yatelefone });
// // //     if (existingPhone) {
// // //       return res.status(409).json({
// // //         success: false,
// // //         message: 'Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.'
// // //       });
// // //     }

// // //     // Find referrer if referral code exists
// // //     let referrerUser = null;
// // //     if (referredBy) {
// // //       referrerUser = await User.findOne({ referralCode: referredBy });
// // //       if (referrerUser) {
// // //         console.log('✅ Referrer found:', referrerUser.izina_ryogukoresha, 'with code:', referredBy);
// // //       } else {
// // //         console.log('⚠️ Referrer not found for code:', referredBy);
// // //       }
// // //     }

// // //     // Create new user
// // //     const user = new User({
// // //       izina_ryogukoresha,
// // //       nimero_yatelefone,
// // //       ijambo_banga,
// // //       referredBy: referrerUser ? referrerUser._id : null, // Store referrer's ID
// // //       wallets: { main: 400, earning: 0, reserved: 0 }, // Registration bonus
// // //       stats: {
// // //         totalReferrals: 0,
// // //         totalEarned: 0,
// // //         totalSpent: 0,
// // //         totalInvestments: 0,
// // //         totalWithdrawn: 0,
// // //         referralEarnings: 0,
// // //         totalDeposits: 0,
// // //         pendingDeposits: 0,
// // //         pendingWithdrawals: 0,
// // //         dailyEarnings: 0
// // //       },
// // //       status: 'active'
// // //     });

// // //     await user.save();
// // //     console.log('✅ New user created:', user.izina_ryogukoresha);
// // //     console.log('📋 Referral code generated:', user.referralCode);
    
// // //     if (user.referredBy) {
// // //       console.log('👥 Referred by user ID:', user.referredBy);
// // //     }

// // //     // If there's a referrer, update their stats
// // //     if (referrerUser) {
// // //       referrerUser.stats.totalReferrals += 1;
// // //       await referrerUser.save();
// // //       console.log('✅ Updated referrer stats for:', referrerUser.izina_ryogukoresha);
// // //       console.log('📊 Referrer total referrals now:', referrerUser.stats.totalReferrals);
      
// // //       // Add notification for referrer (using existing method)
// // //       await referrerUser.addNotification(
// // //         `🎉 ${user.izina_ryogukoresha} just signed up using your referral link!`,
// // //         'success'
// // //       );
      
// // //       // ✅ NOTIFICATION: New referral using new system
// // //       await notifyUser.newReferral(
// // //         referrerUser._id,
// // //         user.izina_ryogukoresha
// // //       );
// // //     }

// // //     // ✅ NOTIFICATION: Welcome new user
// // //     await notifyUser.welcome(user._id, user.izina_ryogukoresha);

// // //     // Generate token
// // //     const token = user.generateAuthToken();

// // //     // Get dashboard data
// // //     const userResponse = user.getDashboardData();

// // //     res.status(201).json({
// // //       success: true,
// // //       message: 'Urabyemewe! Urakozwe kwiyandikisha.',
// // //       token,
// // //       user: userResponse
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Signup error:', error.message);
    
// // //     // Handle duplicate key errors
// // //     if (error.code === 11000) {
// // //       const field = Object.keys(error.keyPattern)[0];
// // //       const message = field === 'nimero_yatelefone' 
// // //         ? 'Numero ya telefone isanzwe ikoreshwa'
// // //         : 'Izina ryogukoresha risanzwe rikoreshwa';
      
// // //       return res.status(409).json({
// // //         success: false,
// // //         message
// // //       });
// // //     }

// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error. Ongera ugerageze nyuma.'
// // //     });
// // //   }
// // // });

// // // // =====================
// // // // LOGIN USER
// // // // =====================
// // // router.post('/login', async (req, res) => {
// // //   try {
// // //     const { nimero_yatelefone, ijambo_banga } = req.body;

// // //     console.log('🔐 Login attempt for phone:', nimero_yatelefone);

// // //     // Validation
// // //     if (!nimero_yatelefone || !ijambo_banga) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
// // //       });
// // //     }

// // //     // Check phone format
// // //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// // //     if (!phoneRegex.test(nimero_yatelefone)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// // //       });
// // //     }

// // //     // Find user
// // //     const user = await User.findOne({ nimero_yatelefone });
// // //     if (!user) {
// // //       console.log('❌ Login failed: User not found');
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// // //       });
// // //     }

// // //     // Check password
// // //     const isPasswordValid = await user.comparePassword(ijambo_banga);
// // //     if (!isPasswordValid) {
// // //       console.log('❌ Login failed: Invalid password');
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// // //       });
// // //     }

// // //     // Update last login
// // //     user.lastLogin = new Date();
// // //     await user.save();

// // //     console.log('✅ Login successful for:', user.izina_ryogukoresha);

// // //     // Generate token
// // //     const token = user.generateAuthToken();

// // //     // Get dashboard data
// // //     const dashboardData = user.getDashboardData();

// // //     res.json({
// // //       success: true,
// // //       message: 'Login successful!',
// // //       token,
// // //       user: dashboardData
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Login error:', error.message);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error. Ongera ugerageze nyuma.'
// // //     });
// // //   }
// // // });

// // // // =====================
// // // // CHANGE PASSWORD
// // // // =====================
// // // router.post('/user/change-password', async (req, res) => {
// // //   try {
// // //     const { currentPassword, newPassword } = req.body;
    
// // //     // Get token from header
// // //     const token = req.header('Authorization')?.replace('Bearer ', '');
// // //     if (!token) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'No authentication token provided'
// // //       });
// // //     }

// // //     // Verify token and get user ID
// // //     const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
// // //     const userId = decoded.userId || decoded.id;

// // //     if (!userId) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Invalid token'
// // //       });
// // //     }

// // //     console.log('🔐 Password change attempt for user ID:', userId);

// // //     // Validate input
// // //     if (!currentPassword || !newPassword) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Current password and new password are required'
// // //       });
// // //     }

// // //     if (newPassword.length < 6) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'New password must be at least 6 characters long'
// // //       });
// // //     }

// // //     // Find user
// // //     const user = await User.findById(userId);
// // //     if (!user) {
// // //       console.log('❌ Password change failed: User not found');
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     // Verify current password
// // //     const isPasswordValid = await user.comparePassword(currentPassword);
// // //     if (!isPasswordValid) {
// // //       console.log('❌ Password change failed: Current password is incorrect');
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Current password is incorrect'
// // //       });
// // //     }

// // //     // Check if new password is same as current
// // //     if (currentPassword === newPassword) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'New password must be different from current password'
// // //       });
// // //     }

// // //     // Hash new password
// // //     const salt = await bcrypt.genSalt(10);
// // //     const hashedPassword = await bcrypt.hash(newPassword, salt);

// // //     // Update user password
// // //     user.ijambo_banga = hashedPassword;
// // //     await user.save();

// // //     console.log('✅ Password changed successfully for user:', user.izina_ryogukoresha);

// // //     // Add notification
// // //     await user.addNotification(
// // //       '🔐 Your password was changed successfully. If you did not request this, please contact support immediately.',
// // //       'warning'
// // //     );

// // //     res.json({
// // //       success: true,
// // //       message: 'Password changed successfully. Please login with your new password.'
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Password change error:', error.message);
    
// // //     // Handle JWT errors
// // //     if (error.name === 'JsonWebTokenError') {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Invalid token. Please login again.'
// // //       });
// // //     }
    
// // //     if (error.name === 'TokenExpiredError') {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Token expired. Please login again.'
// // //       });
// // //     }

// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error while changing password. Please try again.'
// // //     });
// // //   }
// // // });

// // // // =====================
// // // // UPDATE USER PROFILE (Alternative for password update)
// // // // =====================
// // // router.put('/user/update-profile', async (req, res) => {
// // //   try {
// // //     const { password, currentPassword } = req.body;
    
// // //     // Get token from header
// // //     const token = req.header('Authorization')?.replace('Bearer ', '');
// // //     if (!token) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'No authentication token provided'
// // //       });
// // //     }

// // //     // Verify token and get user ID
// // //     const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
// // //     const userId = decoded.userId || decoded.id;

// // //     if (!userId) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Invalid token'
// // //       });
// // //     }

// // //     console.log('📝 Profile update attempt for user ID:', userId);

// // //     // Find user
// // //     const user = await User.findById(userId);
// // //     if (!user) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     // If updating password, verify current password
// // //     if (password && currentPassword) {
// // //       const isPasswordValid = await user.comparePassword(currentPassword);
// // //       if (!isPasswordValid) {
// // //         return res.status(401).json({
// // //           success: false,
// // //           message: 'Current password is incorrect'
// // //         });
// // //       }

// // //       if (password.length < 6) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'Password must be at least 6 characters long'
// // //         });
// // //       }

// // //       // Hash new password
// // //       const salt = await bcrypt.genSalt(10);
// // //       user.ijambo_banga = await bcrypt.hash(password, salt);
      
// // //       await user.save();
      
// // //       console.log('✅ Password updated successfully for user:', user.izina_ryogukoresha);
      
// // //       return res.json({
// // //         success: true,
// // //         message: 'Password updated successfully'
// // //       });
// // //     }

// // //     // Handle other profile updates here if needed

// // //   } catch (error) {
// // //     console.error('❌ Profile update error:', error.message);
    
// // //     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Invalid or expired token. Please login again.'
// // //       });
// // //     }

// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error while updating profile'
// // //     });
// // //   }
// // // });

// // // // =====================
// // // // CHECK PHONE AVAILABILITY
// // // // =====================
// // // router.get('/check-phone/:phone', async (req, res) => {
// // //   try {
// // //     const { phone } = req.params;
    
// // //     const user = await User.findOne({ nimero_yatelefone: phone });
    
// // //     res.json({
// // //       success: true,
// // //       available: !user,
// // //       message: user ? 'Numero isanzwe ikoreshwa' : 'Numero irashobora gukoreshwa'
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Check phone error:', error.message);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error'
// // //     });
// // //   }
// // // });

// // // // =====================
// // // // CHECK USERNAME AVAILABILITY
// // // // =====================
// // // router.get('/check-username/:username', async (req, res) => {
// // //   try {
// // //     const { username } = req.params;
    
// // //     const user = await User.findOne({ izina_ryogukoresha: username });
    
// // //     res.json({
// // //       success: true,
// // //       available: !user,
// // //       message: user ? 'Izina risanzwe rikoreshwa' : 'Izina rirashobora gukoreshwa'
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Check username error:', error.message);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error'
// // //     });
// // //   }
// // // });

// // // // =====================
// // // // GET REFERRAL INFO
// // // // =====================
// // // router.get('/referral/:code', async (req, res) => {
// // //   try {
// // //     const { code } = req.params;
    
// // //     const user = await User.findOne({ referralCode: code }).select('izina_ryogukoresha referralCode');
    
// // //     if (!user) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'Referral code not found'
// // //       });
// // //     }
    
// // //     res.json({
// // //       success: true,
// // //       user: {
// // //         name: user.izina_ryogukoresha,
// // //         code: user.referralCode
// // //       }
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Referral check error:', error.message);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error'
// // //     });
// // //   }
// // // });

// // // module.exports = router;












// // // backend/routes/auth.js
// // const express = require('express');
// // const router = express.Router();
// // const User = require('../models/User');
// // const notifyUser = require('../utils/notifications');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');

// // // =====================
// // // REGISTER USER
// // // =====================
// // router.post('/signup', async (req, res) => {
// //   try {
// //     const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga, referredBy } = req.body;

// //     console.log('🔐 Signup attempt:', { 
// //       izina_ryogukoresha, 
// //       nimero_yatelefone, 
// //       referredBy: referredBy || 'No referral' 
// //     });

// //     // Validation
// //     if (!izina_ryogukoresha || !nimero_yatelefone || !ijambo_banga) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Byose birakenewe: izina, numero ya telefone, ijambo banga'
// //       });
// //     }

// //     // Check phone format
// //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// //     if (!phoneRegex.test(nimero_yatelefone)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// //       });
// //     }

// //     // Check if username already exists
// //     const existingUsername = await User.findOne({ izina_ryogukoresha });
// //     if (existingUsername) {
// //       return res.status(409).json({
// //         success: false,
// //         message: 'Izina ryogukoresha risanzwe rikoreshwa'
// //       });
// //     }

// //     // Check if phone number already exists
// //     const existingPhone = await User.findOne({ nimero_yatelefone });
// //     if (existingPhone) {
// //       return res.status(409).json({
// //         success: false,
// //         message: 'Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.'
// //       });
// //     }

// //     // Find referrer if referral code exists
// //     let referrerUser = null;
// //     if (referredBy) {
// //       referrerUser = await User.findOne({ referralCode: referredBy });
// //       if (referrerUser) {
// //         console.log('✅ Referrer found:', referrerUser.izina_ryogukoresha, 'with code:', referredBy);
// //       } else {
// //         console.log('⚠️ Referrer not found for code:', referredBy);
// //       }
// //     }

// //     // Create new user
// //     const user = new User({
// //       izina_ryogukoresha,
// //       nimero_yatelefone,
// //       ijambo_banga,
// //       referredBy: referrerUser ? referrerUser._id : null,
// //       wallets: { main: 400, earning: 0, reserved: 0 },
// //       stats: {
// //         totalReferrals: 0,
// //         totalEarned: 0,
// //         totalSpent: 0,
// //         totalInvestments: 0,
// //         totalWithdrawn: 0,
// //         referralEarnings: 0,
// //         totalDeposits: 0,
// //         pendingDeposits: 0,
// //         pendingWithdrawals: 0,
// //         dailyEarnings: 0
// //       },
// //       status: 'active'
// //     });

// //     await user.save();
// //     console.log('✅ New user created:', user.izina_ryogukoresha);
// //     console.log('📋 Referral code generated:', user.referralCode);
    
// //     if (user.referredBy) {
// //       console.log('👥 Referred by user ID:', user.referredBy);
// //     }

// //     // If there's a referrer, update their stats
// //     if (referrerUser) {
// //       referrerUser.stats.totalReferrals += 1;
// //       await referrerUser.save();
// //       console.log('✅ Updated referrer stats for:', referrerUser.izina_ryogukoresha);
// //       console.log('📊 Referrer total referrals now:', referrerUser.stats.totalReferrals);
      
// //       await referrerUser.addNotification(
// //         `🎉 ${user.izina_ryogukoresha} just signed up using your referral link!`,
// //         'success'
// //       );
      
// //       await notifyUser.newReferral(
// //         referrerUser._id,
// //         user.izina_ryogukoresha
// //       );
// //     }

// //     await notifyUser.welcome(user._id, user.izina_ryogukoresha);

// //     const token = user.generateAuthToken();
// //     const userResponse = user.getDashboardData();

// //     res.status(201).json({
// //       success: true,
// //       message: 'Urabyemewe! Urakozwe kwiyandikisha.',
// //       token,
// //       user: userResponse
// //     });

// //   } catch (error) {
// //     console.error('❌ Signup error:', error.message);
    
// //     if (error.code === 11000) {
// //       const field = Object.keys(error.keyPattern)[0];
// //       const message = field === 'nimero_yatelefone' 
// //         ? 'Numero ya telefone isanzwe ikoreshwa'
// //         : 'Izina ryogukoresha risanzwe rikoreshwa';
      
// //       return res.status(409).json({
// //         success: false,
// //         message
// //       });
// //     }

// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error. Ongera ugerageze nyuma.'
// //     });
// //   }
// // });

// // // =====================
// // // LOGIN USER
// // // =====================
// // router.post('/login', async (req, res) => {
// //   try {
// //     const { nimero_yatelefone, ijambo_banga } = req.body;

// //     console.log('🔐 Login attempt for phone:', nimero_yatelefone);

// //     if (!nimero_yatelefone || !ijambo_banga) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
// //       });
// //     }

// //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// //     if (!phoneRegex.test(nimero_yatelefone)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
// //       });
// //     }

// //     const user = await User.findOne({ nimero_yatelefone });
// //     if (!user) {
// //       console.log('❌ Login failed: User not found');
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// //       });
// //     }

// //     const isPasswordValid = await user.comparePassword(ijambo_banga);
// //     if (!isPasswordValid) {
// //       console.log('❌ Login failed: Invalid password');
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
// //       });
// //     }

// //     user.lastLogin = new Date();
// //     await user.save();

// //     console.log('✅ Login successful for:', user.izina_ryogukoresha);

// //     const token = user.generateAuthToken();
// //     const dashboardData = user.getDashboardData();

// //     res.json({
// //       success: true,
// //       message: 'Login successful!',
// //       token,
// //       user: dashboardData
// //     });

// //   } catch (error) {
// //     console.error('❌ Login error:', error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error. Ongera ugerageze nyuma.'
// //     });
// //   }
// // });

// // // =====================
// // // CHANGE PASSWORD - ADD THIS NEW ENDPOINT
// // // =====================
// // router.post('/user/change-password', async (req, res) => {
// //   try {
// //     const { currentPassword, newPassword } = req.body;
    
// //     // Get token from header
// //     const token = req.header('Authorization')?.replace('Bearer ', '');
// //     if (!token) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'No authentication token provided'
// //       });
// //     }

// //     // Verify token and get user ID
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const userId = decoded.userId || decoded.id;

// //     if (!userId) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid token'
// //       });
// //     }

// //     console.log('🔐 Password change attempt for user ID:', userId);

// //     // Validate input
// //     if (!currentPassword || !newPassword) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Current password and new password are required'
// //       });
// //     }

// //     if (newPassword.length < 6) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'New password must be at least 6 characters long'
// //       });
// //     }

// //     if (currentPassword === newPassword) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'New password must be different from current password'
// //       });
// //     }

// //     // Find user
// //     const user = await User.findById(userId);
// //     if (!user) {
// //       console.log('❌ Password change failed: User not found');
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     // Verify current password
// //     const isPasswordValid = await user.comparePassword(currentPassword);
// //     if (!isPasswordValid) {
// //       console.log('❌ Password change failed: Current password is incorrect');
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Current password is incorrect'
// //       });
// //     }

// //     // Hash new password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(newPassword, salt);

// //     // Update user password
// //     user.ijambo_banga = hashedPassword;
// //     await user.save();

// //     console.log('✅ Password changed successfully for user:', user.izina_ryogukoresha);

// //     // Add notification
// //     await user.addNotification(
// //       '🔐 Your password was changed successfully. If you did not request this, please contact support immediately.',
// //       'warning'
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Password changed successfully. Please login with your new password.'
// //     });

// //   } catch (error) {
// //     console.error('❌ Password change error:', error.message);
    
// //     if (error.name === 'JsonWebTokenError') {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid token. Please login again.'
// //       });
// //     }
    
// //     if (error.name === 'TokenExpiredError') {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Token expired. Please login again.'
// //       });
// //     }

// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error while changing password. Please try again.'
// //     });
// //   }
// // });

// // // =====================
// // // CHECK PHONE AVAILABILITY
// // // =====================
// // router.get('/check-phone/:phone', async (req, res) => {
// //   try {
// //     const { phone } = req.params;
    
// //     const user = await User.findOne({ nimero_yatelefone: phone });
    
// //     res.json({
// //       success: true,
// //       available: !user,
// //       message: user ? 'Numero isanzwe ikoreshwa' : 'Numero irashobora gukoreshwa'
// //     });
// //   } catch (error) {
// //     console.error('❌ Check phone error:', error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error'
// //     });
// //   }
// // });

// // // =====================
// // // CHECK USERNAME AVAILABILITY
// // // =====================
// // router.get('/check-username/:username', async (req, res) => {
// //   try {
// //     const { username } = req.params;
    
// //     const user = await User.findOne({ izina_ryogukoresha: username });
    
// //     res.json({
// //       success: true,
// //       available: !user,
// //       message: user ? 'Izina risanzwe rikoreshwa' : 'Izina rirashobora gukoreshwa'
// //     });
// //   } catch (error) {
// //     console.error('❌ Check username error:', error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error'
// //     });
// //   }
// // });

// // // =====================
// // // GET REFERRAL INFO
// // // =====================
// // router.get('/referral/:code', async (req, res) => {
// //   try {
// //     const { code } = req.params;
    
// //     const user = await User.findOne({ referralCode: code }).select('izina_ryogukoresha referralCode');
    
// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Referral code not found'
// //       });
// //     }
    
// //     res.json({
// //       success: true,
// //       user: {
// //         name: user.izina_ryogukoresha,
// //         code: user.referralCode
// //       }
// //     });
// //   } catch (error) {
// //     console.error('❌ Referral check error:', error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error'
// //     });
// //   }
// // });

// // module.exports = router;













// // backend/routes/auth.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const notifyUser = require('../utils/notifications');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // =====================
// // REGISTER USER
// // =====================
// router.post('/signup', async (req, res) => {
//   try {
//     const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga, referredBy } = req.body;

//     console.log('🔐 Signup attempt:', { 
//       izina_ryogukoresha, 
//       nimero_yatelefone, 
//       referredBy: referredBy || 'No referral' 
//     });

//     // Validation
//     if (!izina_ryogukoresha || !nimero_yatelefone || !ijambo_banga) {
//       return res.status(400).json({
//         success: false,
//         message: 'Byose birakenewe: izina, numero ya telefone, ijambo banga'
//       });
//     }

//     // Check phone format
//     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
//     if (!phoneRegex.test(nimero_yatelefone)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
//       });
//     }

//     // Check if username already exists
//     const existingUsername = await User.findOne({ izina_ryogukoresha });
//     if (existingUsername) {
//       return res.status(409).json({
//         success: false,
//         message: 'Izina ryogukoresha risanzwe rikoreshwa'
//       });
//     }

//     // Check if phone number already exists
//     const existingPhone = await User.findOne({ nimero_yatelefone });
//     if (existingPhone) {
//       return res.status(409).json({
//         success: false,
//         message: 'Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.'
//       });
//     }

//     // Find referrer if referral code exists
//     let referrerUser = null;
//     if (referredBy) {
//       referrerUser = await User.findOne({ referralCode: referredBy });
//       if (referrerUser) {
//         console.log('✅ Referrer found:', referrerUser.izina_ryogukoresha, 'with code:', referredBy);
//       } else {
//         console.log('⚠️ Referrer not found for code:', referredBy);
//       }
//     }

//     // Create new user
//     const user = new User({
//       izina_ryogukoresha,
//       nimero_yatelefone,
//       ijambo_banga,
//       referredBy: referrerUser ? referrerUser._id : null,
//       wallets: { main: 400, earning: 0, reserved: 0 },
//       stats: {
//         totalReferrals: 0,
//         totalEarned: 0,
//         totalSpent: 0,
//         totalInvestments: 0,
//         totalWithdrawn: 0,
//         referralEarnings: 0,
//         totalDeposits: 0,
//         pendingDeposits: 0,
//         pendingWithdrawals: 0,
//         dailyEarnings: 0
//       },
//       status: 'active'
//     });

//     await user.save();
//     console.log('✅ New user created:', user.izina_ryogukoresha);
//     console.log('📋 Referral code generated:', user.referralCode);
    
//     if (user.referredBy) {
//       console.log('👥 Referred by user ID:', user.referredBy);
//     }

//     // If there's a referrer, update their stats
//     if (referrerUser) {
//       referrerUser.stats.totalReferrals += 1;
//       await referrerUser.save();
//       console.log('✅ Updated referrer stats for:', referrerUser.izina_ryogukoresha);
//       console.log('📊 Referrer total referrals now:', referrerUser.stats.totalReferrals);
      
//       await referrerUser.addNotification(
//         `🎉 ${user.izina_ryogukoresha} just signed up using your referral link!`,
//         'success'
//       );
      
//       await notifyUser.newReferral(
//         referrerUser._id,
//         user.izina_ryogukoresha
//       );
//     }

//     await notifyUser.welcome(user._id, user.izina_ryogukoresha);

//     const token = user.generateAuthToken();
//     const userResponse = user.getDashboardData();

//     res.status(201).json({
//       success: true,
//       message: 'Urabyemewe! Urakozwe kwiyandikisha.',
//       token,
//       user: userResponse
//     });

//   } catch (error) {
//     console.error('❌ Signup error:', error.message);
    
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       const message = field === 'nimero_yatelefone' 
//         ? 'Numero ya telefone isanzwe ikoreshwa'
//         : 'Izina ryogukoresha risanzwe rikoreshwa';
      
//       return res.status(409).json({
//         success: false,
//         message
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error. Ongera ugerageze nyuma.'
//     });
//   }
// });

// // =====================
// // LOGIN USER
// // =====================
// router.post('/login', async (req, res) => {
//   try {
//     const { nimero_yatelefone, ijambo_banga } = req.body;

//     console.log('🔐 Login attempt for phone:', nimero_yatelefone);

//     if (!nimero_yatelefone || !ijambo_banga) {
//       return res.status(400).json({
//         success: false,
//         message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
//       });
//     }

//     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
//     if (!phoneRegex.test(nimero_yatelefone)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
//       });
//     }

//     const user = await User.findOne({ nimero_yatelefone });
//     if (!user) {
//       console.log('❌ Login failed: User not found');
//       return res.status(401).json({
//         success: false,
//         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
//       });
//     }

//     const isPasswordValid = await user.comparePassword(ijambo_banga);
//     if (!isPasswordValid) {
//       console.log('❌ Login failed: Invalid password');
//       return res.status(401).json({
//         success: false,
//         message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
//       });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     console.log('✅ Login successful for:', user.izina_ryogukoresha);

//     const token = user.generateAuthToken();
//     const dashboardData = user.getDashboardData();

//     res.json({
//       success: true,
//       message: 'Login successful!',
//       token,
//       user: dashboardData
//     });

//   } catch (error) {
//     console.error('❌ Login error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Server error. Ongera ugerageze nyuma.'
//     });
//   }
// });

// // =====================
// // CHANGE PASSWORD - FIXED: Changed from '/user/change-password' to '/change-password'
// // =====================
// router.post('/change-password', async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
    
//     // Get token from header
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'No authentication token provided'
//       });
//     }

//     // Verify token and get user ID
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.userId || decoded.id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token'
//       });
//     }

//     console.log('🔐 Password change attempt for user ID:', userId);

//     // Validate input
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password and new password are required'
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'New password must be at least 6 characters long'
//       });
//     }

//     if (currentPassword === newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'New password must be different from current password'
//       });
//     }

//     // Find user
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log('❌ Password change failed: User not found');
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Verify current password
//     const isPasswordValid = await user.comparePassword(currentPassword);
//     if (!isPasswordValid) {
//       console.log('❌ Password change failed: Current password is incorrect');
//       return res.status(401).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Update user password
//     user.ijambo_banga = hashedPassword;
//     await user.save();

//     console.log('✅ Password changed successfully for user:', user.izina_ryogukoresha);

//     // Add notification
//     if (user.addNotification) {
//       await user.addNotification(
//         '🔐 Your password was changed successfully. If you did not request this, please contact support immediately.',
//         'warning'
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Password changed successfully. Please login with your new password.'
//     });

//   } catch (error) {
//     console.error('❌ Password change error:', error.message);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token. Please login again.'
//       });
//     }
    
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token expired. Please login again.'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error while changing password. Please try again.'
//     });
//   }
// });

// // =====================
// // CHECK PHONE AVAILABILITY
// // =====================
// router.get('/check-phone/:phone', async (req, res) => {
//   try {
//     const { phone } = req.params;
    
//     const user = await User.findOne({ nimero_yatelefone: phone });
    
//     res.json({
//       success: true,
//       available: !user,
//       message: user ? 'Numero isanzwe ikoreshwa' : 'Numero irashobora gukoreshwa'
//     });
//   } catch (error) {
//     console.error('❌ Check phone error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // =====================
// // CHECK USERNAME AVAILABILITY
// // =====================
// router.get('/check-username/:username', async (req, res) => {
//   try {
//     const { username } = req.params;
    
//     const user = await User.findOne({ izina_ryogukoresha: username });
    
//     res.json({
//       success: true,
//       available: !user,
//       message: user ? 'Izina risanzwe rikoreshwa' : 'Izina rirashobora gukoreshwa'
//     });
//   } catch (error) {
//     console.error('❌ Check username error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // =====================
// // GET REFERRAL INFO
// // =====================
// router.get('/referral/:code', async (req, res) => {
//   try {
//     const { code } = req.params;
    
//     const user = await User.findOne({ referralCode: code }).select('izina_ryogukoresha referralCode');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Referral code not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       user: {
//         name: user.izina_ryogukoresha,
//         code: user.referralCode
//       }
//     });
//   } catch (error) {
//     console.error('❌ Referral check error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// module.exports = router;
















// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const notifyUser = require('../utils/notifications');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =====================
// REGISTER USER - UPDATED WITH BONUS
// =====================
router.post('/signup', async (req, res) => {
  try {
    const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga, referredBy } = req.body;

    console.log('🔐 Signup attempt:', { 
      izina_ryogukoresha, 
      nimero_yatelefone, 
      referredBy: referredBy || 'No referral' 
    });

    // Validation
    if (!izina_ryogukoresha || !nimero_yatelefone || !ijambo_banga) {
      return res.status(400).json({
        success: false,
        message: 'Byose birakenewe: izina, numero ya telefone, ijambo banga'
      });
    }

    // Check phone format
    const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
    if (!phoneRegex.test(nimero_yatelefone)) {
      return res.status(400).json({
        success: false,
        message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ izina_ryogukoresha });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Izina ryogukoresha risanzwe rikoreshwa'
      });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ nimero_yatelefone });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.'
      });
    }

    // Find referrer if referral code exists
    let referrerUser = null;
    if (referredBy) {
      referrerUser = await User.findOne({ referralCode: referredBy });
      if (referrerUser) {
        console.log('✅ Referrer found:', referrerUser.izina_ryogukoresha, 'with code:', referredBy);
      } else {
        console.log('⚠️ Referrer not found for code:', referredBy);
      }
    }

    // Create new user with bonus in earning wallet
    const user = new User({
      izina_ryogukoresha,
      nimero_yatelefone,
      ijambo_banga,
      referredBy: referrerUser ? referrerUser._id : null,
      wallets: { 
        main: 0, // No main wallet balance initially
        earning: 2500, // 2,500 FRW bonus in earning wallet
        reserved: 0 
      },
      bonus: {
        amount: 2500,
        isClaimed: true,
        canWithdraw: false, // Locked until investment
        investedToActivate: false,
        createdAt: new Date()
      },
      stats: {
        totalReferrals: 0,
        totalEarned: 0,
        totalSpent: 0,
        totalInvestments: 0,
        totalWithdrawn: 0,
        referralEarnings: 0,
        totalDeposits: 0,
        pendingDeposits: 0,
        pendingWithdrawals: 0,
        dailyEarnings: 0
      },
      status: 'active'
    });

    await user.save();
    console.log('✅ New user created:', user.izina_ryogukoresha);
    console.log('📋 Referral code generated:', user.referralCode);
    console.log('💰 Welcome bonus: 2,500 FRW added to earning wallet');
    
    if (user.referredBy) {
      console.log('👥 Referred by user ID:', user.referredBy);
    }

    // If there's a referrer, update their stats
    if (referrerUser) {
      referrerUser.stats.totalReferrals += 1;
      await referrerUser.save();
      console.log('✅ Updated referrer stats for:', referrerUser.izina_ryogukoresha);
      console.log('📊 Referrer total referrals now:', referrerUser.stats.totalReferrals);
      
      await referrerUser.addNotification(
        `🎉 ${user.izina_ryogukoresha} just signed up using your referral link!`,
        'success'
      );
      
      await notifyUser.newReferral(
        referrerUser._id,
        user.izina_ryogukoresha
      );
    }

    await notifyUser.welcome(user._id, user.izina_ryogukoresha);

    const token = user.generateAuthToken();
    const userResponse = user.getDashboardData();

    res.status(201).json({
      success: true,
      message: 'Urabyemewe! Urakozwe kwiyandikisha.',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Signup error:', error.message);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'nimero_yatelefone' 
        ? 'Numero ya telefone isanzwe ikoreshwa'
        : 'Izina ryogukoresha risanzwe rikoreshwa';
      
      return res.status(409).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Ongera ugerageze nyuma.'
    });
  }
});

// =====================
// LOGIN USER
// =====================
router.post('/login', async (req, res) => {
  try {
    const { nimero_yatelefone, ijambo_banga } = req.body;

    console.log('🔐 Login attempt for phone:', nimero_yatelefone);

    if (!nimero_yatelefone || !ijambo_banga) {
      return res.status(400).json({
        success: false,
        message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
      });
    }

    const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
    if (!phoneRegex.test(nimero_yatelefone)) {
      return res.status(400).json({
        success: false,
        message: 'Numero ya telefone ntabwo ari yo. Andika nka: 0781234567'
      });
    }

    const user = await User.findOne({ nimero_yatelefone });
    if (!user) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
      });
    }

    const isPasswordValid = await user.comparePassword(ijambo_banga);
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Login successful for:', user.izina_ryogukoresha);

    const token = user.generateAuthToken();
    const dashboardData = user.getDashboardData();

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: dashboardData
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error. Ongera ugerageze nyuma.'
    });
  }
});

// =====================
// CHANGE PASSWORD
// =====================
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    console.log('🔐 Password change attempt for user ID:', userId);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Password change failed: User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      console.log('❌ Password change failed: Current password is incorrect');
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.ijambo_banga = hashedPassword;
    await user.save();

    console.log('✅ Password changed successfully for user:', user.izina_ryogukoresha);

    if (user.addNotification) {
      await user.addNotification(
        '🔐 Your password was changed successfully. If you did not request this, please contact support immediately.',
        'warning'
      );
    }

    res.json({
      success: true,
      message: 'Password changed successfully. Please login with your new password.'
    });

  } catch (error) {
    console.error('❌ Password change error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while changing password. Please try again.'
    });
  }
});

// =====================
// CHECK PHONE AVAILABILITY
// =====================
router.get('/check-phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const user = await User.findOne({ nimero_yatelefone: phone });
    
    res.json({
      success: true,
      available: !user,
      message: user ? 'Numero isanzwe ikoreshwa' : 'Numero irashobora gukoreshwa'
    });
  } catch (error) {
    console.error('❌ Check phone error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// =====================
// CHECK USERNAME AVAILABILITY
// =====================
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ izina_ryogukoresha: username });
    
    res.json({
      success: true,
      available: !user,
      message: user ? 'Izina risanzwe rikoreshwa' : 'Izina rirashobora gukoreshwa'
    });
  } catch (error) {
    console.error('❌ Check username error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// =====================
// GET REFERRAL INFO
// =====================
router.get('/referral/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const user = await User.findOne({ referralCode: code }).select('izina_ryogukoresha referralCode');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Referral code not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        name: user.izina_ryogukoresha,
        code: user.referralCode
      }
    });
  } catch (error) {
    console.error('❌ Referral check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;