const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST withdrawal request
router.post('/', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check earning wallet
    if (amount > user.earningWallet) {
      return res.status(400).json({ success: false, message: 'Insufficient balance in earning wallet' });
    }

    // For simplicity, we just mark it as pending for admin approval
    // In real scenario, create Withdrawal collection
    user.earningWallet -= amount; // deduct immediately
    await user.save();

    res.json({ success: true, message: `Withdrawal request for ${amount} RWF submitted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
