

// // backend/routes/product.js
// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const User = require('../models/User');
// const Transaction = require('../models/Transaction');

// // Use authMiddleware (same as user routes)
// const authMiddleware = require('../middleware/authMiddleware');

// // GET all products
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json({ success: true, products });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // GET single product by id
// router.get('/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
//     res.json({ success: true, product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST new product (admin only - for now no auth)
// router.post('/', async (req, res) => {
//   try {
//     const { name, type, price, image, dailyEarning } = req.body;
//     const product = new Product({ name, type, price, image, dailyEarning });
//     await product.save();
//     res.status(201).json({ success: true, product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // PUT update product
// router.put('/:id', async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ success: true, product: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST purchase product - PROTECTED ROUTE
// router.post('/:id/purchase', authMiddleware, async (req, res) => {
//   try {
//     const { quantity = 1 } = req.body;
//     const userId = req.user._id;
//     const productId = req.params.id;

//     // Find user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Find product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, message: 'Product not found' });
//     }

//     // Calculate total price
//     const totalPrice = product.price * quantity;

//     // Check if user has enough balance in main wallet
//     if (user.wallets.main < totalPrice) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Insufficient balance in main wallet' 
//       });
//     }

//     // Deduct from main wallet
//     user.wallets.main -= totalPrice;
    
//     // Calculate daily earning
//     const dailyEarningTotal = (product.dailyEarning || 0) * quantity;
    
//     // Add to earning wallet
//     user.wallets.earning = (user.wallets.earning || 0) + dailyEarningTotal;
    
//     // Create transaction record
//     const transaction = new Transaction({
//       userId: user._id,
//       type: 'purchase',
//       amount: totalPrice,
//       description: `Purchased ${quantity} x ${product.name}`,
//       status: 'completed',
//       details: {
//         productId: product._id,
//         productName: product.name,
//         quantity: quantity,
//         unitPrice: product.price,
//         dailyEarning: product.dailyEarning,
//         totalDailyEarning: dailyEarningTotal
//       }
//     });
//     await transaction.save();

//     // Update user's active investments
//     if (!user.activeInvestments) {
//       user.activeInvestments = [];
//     }
    
//     user.activeInvestments.push({
//       productId: product._id,
//       productName: product.name,
//       quantity: quantity,
//       purchasePrice: totalPrice,
//       dailyEarning: dailyEarningTotal,
//       purchaseDate: new Date(),
//       status: 'active'
//     });

//     // Update user stats
//     user.stats.totalSpent = (user.stats.totalSpent || 0) + totalPrice;
//     user.stats.totalInvestments = (user.stats.totalInvestments || 0) + 1;
//     user.stats.totalEarned = (user.stats.totalEarned || 0) + dailyEarningTotal;

//     await user.save();

//     res.json({
//       success: true,
//       message: 'Purchase successful!',
//       data: {
//         newBalance: user.wallets.main,
//         earningWallet: user.wallets.earning,
//         product: {
//           name: product.name,
//           quantity: quantity,
//           totalPrice: totalPrice,
//           dailyEarning: dailyEarningTotal
//         },
//         transactionId: transaction._id
//       }
//     });

//   } catch (error) {
//     console.error('Purchase error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;














// backend/routes/product.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');
const notifyUser = require('../utils/notifications');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST new product (admin only - for now no auth)
router.post('/', async (req, res) => {
  try {
    const { name, type, price, image, dailyEarning } = req.body;
    const product = new Product({ name, type, price, image, dailyEarning });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST purchase product - PROTECTED ROUTE
router.post('/:id/purchase', authMiddleware, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const userId = req.user._id;
    const productId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Check if user has enough balance in main wallet
    if (user.wallets.main < totalPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance in main wallet' 
      });
    }

    // Deduct from main wallet
    user.wallets.main -= totalPrice;
    
    // Calculate daily earning
    const dailyEarningTotal = (product.dailyEarning || 0) * quantity;
    
    // Add to earning wallet
    user.wallets.earning = (user.wallets.earning || 0) + dailyEarningTotal;
    
    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'purchase',
      amount: totalPrice,
      description: `Purchased ${quantity} x ${product.name}`,
      status: 'completed',
      details: {
        productId: product._id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.price,
        dailyEarning: product.dailyEarning,
        totalDailyEarning: dailyEarningTotal
      }
    });
    await transaction.save();

    // Update user's active investments
    if (!user.activeInvestments) {
      user.activeInvestments = [];
    }
    
    user.activeInvestments.push({
      productId: product._id,
      productName: product.name,
      quantity: quantity,
      purchasePrice: totalPrice,
      dailyEarning: dailyEarningTotal,
      purchaseDate: new Date(),
      status: 'active'
    });

    // Update user stats
    user.stats.totalSpent = (user.stats.totalSpent || 0) + totalPrice;
    user.stats.totalInvestments = (user.stats.totalInvestments || 0) + 1;
    user.stats.totalEarned = (user.stats.totalEarned || 0) + dailyEarningTotal;

    await user.save();

    // ✅ NOTIFICATION: Investment successful
    await notifyUser.investmentSuccess(
      user._id,
      product.name,
      totalPrice,
      user.activeInvestments[user.activeInvestments.length - 1]._id
    );

    res.json({
      success: true,
      message: 'Purchase successful!',
      data: {
        newBalance: user.wallets.main,
        earningWallet: user.wallets.earning,
        product: {
          name: product.name,
          quantity: quantity,
          totalPrice: totalPrice,
          dailyEarning: dailyEarningTotal
        },
        transactionId: transaction._id
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;