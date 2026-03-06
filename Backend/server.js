


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
// // ROUTES - CLEANED UP (NO DUPLICATES)
// // =======================
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/product'));
// app.use('/api/user', require('./routes/user'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/referrals', require('./routes/referral'));
// app.use('/api/wallet', require('./routes/wallet'));
// // Add this with your other routes
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
//       admin: '/api/admin',
//       referrals: '/api/referrals',
//       wallet: '/api/wallet',
//       health: '/api/health'
//     }
//   });
// });

// // =======================
// // 404 HANDLER
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
// app.use('/api/test', require('./routes/test'));
// app.use('/api/products', require('./routes/product'));
// app.use('/api/user', require('./routes/user')); 
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/admin', require('./routes/adminAuth')); // Admin auth routes FIRST
// app.use('/api/admin', require('./routes/admin')); 
// app.use('/api/admin', require('./routes/adminInvestmentRoutes')); // Your existing admin routes
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
//       admin: '/api/admin',
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



















// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Import the daily earnings job
const setupDailyEarningsJob = require('./jobs/dailyEarnings');

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
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start the daily earnings job after database connection
    console.log('📊 Starting scheduled jobs...');
    setupDailyEarningsJob();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// =======================
// STATIC FILES
// =======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// ROUTES
// =======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/test', require('./routes/test'));
app.use('/api/products', require('./routes/product'));
app.use('/api/user', require('./routes/user')); 
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/admin', require('./routes/adminAuth')); // Admin auth routes FIRST
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/admin', require('./routes/adminInvestmentRoutes')); // Your existing admin routes
app.use('/api/referrals', require('./routes/referral'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/notifications', require('./routes/notifications'));

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
      notifications: '/api/notifications',
      health: '/api/health'
    }
  });
});

// =======================
// ERROR HANDLER
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
  📊 Database: ✅ Connected
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