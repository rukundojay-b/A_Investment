

// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// =====================
// REGISTER USER
// =====================
router.post('/signup', async (req, res) => {
  try {
    const { izina_ryogukoresha, nimero_yatelefone, ijambo_banga } = req.body;

    console.log('🔐 Signup attempt:', { izina_ryogukoresha, nimero_yatelefone });

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

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      izina_ryogukoresha,
      nimero_yatelefone,
      ijambo_banga,
      wallets: { main: 400, earning: 0 }, // Registration bonus
      stats: {
        totalReferrals: 0,
        totalEarned: 0,
        totalSpent: 0,
        totalInvestments: 0,
        totalWithdrawn: 0,
        referralEarnings: 0
      },
      status: 'active'
    });

    await user.save();
    console.log('✅ New user created:', user.izina_ryogukoresha);

    // Generate token
    const token = user.generateAuthToken();

    // Get dashboard data
    const userResponse = user.getDashboardData();

    res.status(201).json({
      success: true,
      message: 'Urabyemewe! Urakozwe kwiyandikisha.',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Signup error:', error.message);
    
    
    // Handle duplicate key errors
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

    // Validation
    if (!nimero_yatelefone || !ijambo_banga) {
      return res.status(400).json({
        success: false,
        message: 'Nimero ya telefone n\'ijambo banga byombi birakenewe'
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

    // Find user
    const user = await User.findOne({ nimero_yatelefone });
    if (!user) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(ijambo_banga);
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Login successful for:', user.izina_ryogukoresha);

    // Generate token
    const token = user.generateAuthToken();

    // Get dashboard data
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

module.exports = router;