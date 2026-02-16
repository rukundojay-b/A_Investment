
// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // =======================
// // DATABASE
// // =======================
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_invest')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => {
//     console.error('❌ MongoDB error', err);
//     process.exit(1);
//   });

// // =======================
// // ROUTES
// // =======================
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/product'));

// // Health
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', time: new Date() });
// });

// // =======================
// // START SERVER
// // =======================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



















// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const path = require('path');
// const transactionRoutes = require('./routes/transactionRoutes');
// const adminRoutes = require('./routes/admin');


// dotenv.config();
// const app = express();


// // In server.js, add these lines:

// // Import routes

// // Use routes


// // =======================
// // MIDDLEWARE
// // =======================
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:5173'], // React dev servers
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // =======================
// // DATABASE
// // =======================
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_invest', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// })
// .then(() => console.log('✅ MongoDB connected successfully'))
// .catch(err => {
//   console.error('❌ MongoDB connection error:', err.message);
//   process.exit(1);
// });

// // Handle MongoDB connection events
// mongoose.connection.on('connected', () => {
//   console.log('📊 MongoDB event connected');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('📊 MongoDB event error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('📊 MongoDB event disconnected');
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('📊 MongoDB connection closed through app termination');
//   process.exit(0);
// });

// // =======================
// // STATIC FILES
// // =======================
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // =======================
// // ROUTES
// // =======================

// app.use('/api/transactions', transactionRoutes);
// app.use('/api/admin', adminRoutes);

// // 1. AUTHENTICATION ROUTES
// app.use('/api/auth', require('./routes/auth'));

// // 2. PRODUCT ROUTES
// app.use('/api/products', require('./routes/product'));

// // 3. USER ROUTES (Dashboard, Purchases, Profile)
// app.use('/api/user', require('./routes/user'));

// // 4. TRANSACTION ROUTES (Deposits, Withdrawals)
// app.use('/api/transactions', require('./routes/transactionRoutes'));

// // 5. ADMIN ROUTES
// app.use('/api/admin', require('./routes/admin'));

// // 6. REFERRAL ROUTES
// app.use('/api/referrals', require('./routes/referral'));

// // 7. WALLET ROUTES
// app.use('/api/wallet', require('./routes/wallet'));

// // =======================
// // ERROR HANDLING MIDDLEWARE
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
// // 404 HANDLER
// // =======================
// app.use('/404', (req, res) => {
//   console.warn(`⚠️ 404: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

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
// // SERVER INFO ENDPOINT
// // =======================
// app.get('/api/info', (req, res) => {
//   res.json({
//     name: 'Apex Investment Platform',
//     version: '1.0.0',
//     description: 'Investment platform with deposit/withdrawal system',
//     endpoints: {
//       auth: '/api/auth',
//       products:
//        '/api/products',
//       user: '/api/user',
//       transactions: '/api/transactions',
//       admin: '/api/admin',
//       referrals: '/api/referrals',
//       wallet: '/api/wallet',
//       health: '/api/health'
//     },
//     features: [
//       'User Authentication',
//       'Product Investment',
//       'Deposit/Withdrawal System',
//       'Admin Approval System',
//       'Referral System',
//       'Wallet Management'
//     ]
//   });
// });

// // =======================
// // START SERVER
// // =======================
// const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || '0.0.0.0';

// const server = app.listen(PORT, HOST, () => {
//   console.log(`
//   🚀 Server Information:
//   ========================
//   📍 URL: http://${HOST}:${PORT}
//   🌍 Environment: ${process.env.NODE_ENV || 'development'}
//   ⏰ Started: ${new Date().toLocaleString()}
//   📊 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
  
//   🔌 Available Endpoints:
//   ------------------------
//   GET  /api/health      - Health check
//   GET  /api/info        - Server information
//   POST /api/auth/login  - User login
//   POST /api/auth/signup - User registration
//   GET  /api/products    - Get all products
//   POST /api/user/purchase - Purchase product
  
//   💰 Transaction System:
//   ------------------------
//   POST /api/transactions        - Create deposit/withdraw request
//   GET  /api/transactions        - Get user transactions
//   GET  /api/transactions/pending - Get pending transactions
//   GET  /api/transactions/admin/pending - Admin: Get all pending
  
//   👨‍💼 Admin Panel:
//   ------------------------
//   POST /api/transactions/admin/approve/:id - Approve transaction
//   POST /api/transactions/admin/reject/:id  - Reject transaction
//   GET  /api/transactions/admin/stats       - Transaction statistics
  
//   ========================
//   ✅ Server is running...
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

//   // Force close after 10 seconds
//   setTimeout(() => {
//     console.error('⏰ Could not close connections in time, forcing shutdown');
//     process.exit(1);
//   }, 10000);
// };

// // Handle shutdown signals
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   console.error('💥 Uncaught Exception:', error);
//   gracefulShutdown('UNCAUGHT_EXCEPTION');
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
//   gracefulShutdown('UNHANDLED_REJECTION');
// });

// // =======================
// // MONITORING
// // =======================
// setInterval(() => {
//   const memoryUsage = process.memoryUsage();
//   const memoryMB = {
//     rss: Math.round(memoryUsage.rss / 1024 / 1024),
//     heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
//     heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
//     external: Math.round(memoryUsage.external / 1024 / 1024)
//   };
  
//   console.log(`📈 Memory Usage: RSS: ${memoryMB.rss}MB, Heap: ${memoryMB.heapUsed}/${memoryMB.heapTotal}MB`);
// }, 300000); // Log every 5 minutes












// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();
const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// DATABASE
// =======================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_invest')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// =======================
// STATIC FILES
// =======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// ROUTES - CLEANED UP (NO DUPLICATES)
// =======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/user', require('./routes/user'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/referrals', require('./routes/referral'));
app.use('/api/wallet', require('./routes/wallet'));

// =======================
// HEALTH CHECK
// =======================
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbState] || 'unknown';

  res.json({ 
    status: 'OK',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// =======================
// API INFO
// =======================
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Apex Investment Platform',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      user: '/api/user',
      transactions: '/api/transactions',
      admin: '/api/admin',
      referrals: '/api/referrals',
      wallet: '/api/wallet',
      health: '/api/health'
    }
  });
});

// =======================
// 404 HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
  🚀 APEX INVESTMENT PLATFORM
  =============================
  📍 URL: http://${HOST}:${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📊 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
  =============================
  `);
});

// =======================
// GRACEFUL SHUTDOWN
// =======================
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('🔒 HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('📊 MongoDB connection closed');
      console.log('👋 Graceful shutdown complete');
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('⏰ Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

module.exports = server;