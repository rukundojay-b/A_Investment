// // backend/jobs/dailyEarnings.js
// const cron = require('node-cron');
// const Investment = require('../models/Investment');
// const User = require('../models/User');
// const Transaction = require('../models/Transaction');

// /**
//  * Daily Earnings Job - PRODUCTION MODE
//  * Runs every day at 00:01 AM
//  * Processes all active investments and adds daily earnings to users' wallets
//  */
// const setupDailyEarningsJob = () => {
//   // 🏭 PRODUCTION MODE: Run at 00:01 AM every day
//   cron.schedule('1 0 * * *', async () => {
//     console.log('⏰ ========================================');
//     console.log('⏰ RUNNING DAILY EARNINGS JOB (PRODUCTION MODE)');
//     console.log('⏰ Time:', new Date().toISOString());
//     console.log('⏰ ========================================');

//     const startTime = Date.now();
//     const stats = {
//       processed: 0,
//       completed: 0,
//       earningsAdded: 0,
//       usersUpdated: 0,
//       errors: 0
//     };

//     try {
//       // Find all active investments that haven't ended yet
//       const activeInvestments = await Investment.find({
//         status: 'active',
//         endDate: { $gt: new Date() } // Not expired
//       }).populate('user');

//       console.log(`📊 Found ${activeInvestments.length} active investments to process`);

//       // Group investments by user for batch updates
//       const userInvestments = {};
//       activeInvestments.forEach(inv => {
//         const userId = inv.user._id.toString();
//         if (!userInvestments[userId]) {
//           userInvestments[userId] = {
//             user: inv.user,
//             investments: []
//           };
//         }
//         userInvestments[userId].investments.push(inv);
//       });

//       // Process each user's investments
//       for (const [userId, data] of Object.entries(userInvestments)) {
//         try {
//           const user = data.user;
//           const investments = data.investments;
          
//           console.log(`\n👤 Processing user: ${user.izina_ryogukoresha} (${userId})`);
//           console.log(`📊 Has ${investments.length} active investments`);

//           let userDailyTotal = 0;
//           const processedInvestments = [];

//           // Process each investment for this user
//           for (const investment of investments) {
//             try {
//               // Skip if already processed today
//               const lastProfitDate = investment.lastProfitDate;
//               const today = new Date();
//               today.setHours(0, 0, 0, 0);
              
//               if (lastProfitDate && new Date(lastProfitDate).setHours(0, 0, 0, 0) >= today) {
//                 console.log(`⏭️ Investment ${investment.productName} already processed today`);
//                 continue;
//               }

//               // Calculate today's earning
//               const todayEarning = investment.dailyEarning || 0;
              
//               if (todayEarning <= 0) {
//                 console.log(`⚠️ Investment ${investment._id} has zero daily earning, skipping`);
//                 continue;
//               }

//               // Create transaction record
//               const transaction = new Transaction({
//                 user: user._id,
//                 type: 'earning',
//                 amount: todayEarning,
//                 status: 'completed',
//                 description: `Daily earning from ${investment.productName}`,
//                 paymentMethod: 'system',
//                 metadata: {
//                   investmentId: investment._id,
//                   productName: investment.productName,
//                   dailyEarning: todayEarning,
//                   date: new Date()
//                 }
//               });
              
//               await transaction.save();
              
//               // Update investment
//               investment.totalEarnedSoFar += todayEarning;
//               investment.lastProfitDate = new Date();
              
//               // Add to earnings history if field exists
//               if (investment.earningsHistory) {
//                 investment.earningsHistory.push({
//                   amount: todayEarning,
//                   date: new Date(),
//                   transactionId: transaction._id
//                 });
//               }
              
//               await investment.save();
              
//               userDailyTotal += todayEarning;
//               processedInvestments.push(investment);
//               stats.processed++;
//               stats.earningsAdded += todayEarning;

//               console.log(`✅ Added ${todayEarning.toLocaleString()} FRW from ${investment.productName}`);

//             } catch (invError) {
//               console.error(`❌ Error processing investment ${investment._id}:`, invError.message);
//               stats.errors++;
//             }
//           }

//           // Add total daily earnings to user's wallet
//           if (userDailyTotal > 0) {
//             // Ensure wallets object exists
//             if (!user.wallets) user.wallets = { main: 0, earning: 0, reserved: 0 };
//             if (!user.stats) user.stats = { totalEarned: 0, dailyEarnings: 0 };
            
//             // Add to earning wallet
//             user.wallets.earning = (user.wallets.earning || 0) + userDailyTotal;
//             user.stats.totalEarned = (user.stats.totalEarned || 0) + userDailyTotal;
//             user.stats.dailyEarnings = userDailyTotal;
            
//             // Update investmentStats if it exists
//             if (user.investmentStats) {
//               user.investmentStats.totalEarnedFromInvestments = (user.investmentStats.totalEarnedFromInvestments || 0) + userDailyTotal;
//             }
            
//             await user.save();
//             stats.usersUpdated++;

//             // Add notification for user
//             try {
//               if (user.addNotification) {
//                 await user.addNotification(
//                   `💰 You earned ${userDailyTotal.toLocaleString()} FRW today from your investments!`,
//                   'success'
//                 );
//               }
//             } catch (notifyError) {
//               console.error('Error adding notification:', notifyError);
//             }

//             console.log(`💰 User ${user.izina_ryogukoresha} earned total: ${userDailyTotal.toLocaleString()} FRW`);
//           }

//         } catch (userError) {
//           console.error(`❌ Error processing user ${userId}:`, userError.message);
//           stats.errors++;
//         }
//       }

//       // Process completed investments (expired today)
//       await processCompletedInvestments(stats);

//       const duration = Date.now() - startTime;
      
//       console.log(`
//       🎉 ========================================
//       🎉 DAILY EARNINGS JOB COMPLETED
//       🎉 ========================================
//       ⏱️ Duration: ${duration}ms
//       📊 Investments processed: ${stats.processed}
//       👥 Users updated: ${stats.usersUpdated}
//       💰 Total earnings added: ${stats.earningsAdded.toLocaleString()} FRW
//       ✅ Investments completed: ${stats.completed}
//       ❌ Errors: ${stats.errors}
//       🎉 ========================================
//       `);

//     } catch (error) {
//       console.error('❌ Daily earnings job failed:', error);
//     }
//   });

//   console.log('📅 Daily earnings job scheduled to run at 00:01 AM every day (PRODUCTION MODE)');
// };

// /**
//  * Process investments that have ended today
//  */
// const processCompletedInvestments = async (stats) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     // Find investments that ended today
//     const completedInvestments = await Investment.find({
//       status: 'active',
//       endDate: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     }).populate('user');

//     if (completedInvestments.length === 0) {
//       console.log('📅 No investments completed today');
//       return;
//     }

//     console.log(`📅 Found ${completedInvestments.length} investments completed today`);

//     for (const investment of completedInvestments) {
//       try {
//         // Mark as completed
//         investment.status = 'completed';
//         investment.active = false;
//         await investment.save();

//         // Update user's active investments array
//         const user = investment.user;
//         if (user && user.activeInvestments) {
//           // Find the investment in user's array and update its status
//           const userInvestment = user.activeInvestments.find(
//             inv => inv.productId.toString() === investment.product.toString() && 
//                    inv.status === 'active'
//           );
          
//           if (userInvestment) {
//             userInvestment.status = 'completed';
//             await user.save();
//           }
//         }

//         stats.completed++;

//         // Notify user
//         if (user && user.addNotification) {
//           await user.addNotification(
//             `✅ Your investment in ${investment.productName} has completed its 30-day period. You earned a total of ${investment.totalEarnedSoFar.toLocaleString()} FRW! You can purchase again to continue earning.`,
//             'info'
//           );
//         }

//         console.log(`✅ Investment ${investment.productName} marked as completed for user ${user?.izina_ryogukoresha}`);

//       } catch (invError) {
//         console.error(`❌ Error completing investment ${investment._id}:`, invError.message);
//         stats.errors++;
//       }
//     }

//   } catch (error) {
//     console.error('❌ Error processing completed investments:', error);
//   }
// };  

// module.exports = setupDailyEarningsJob;












// backend/jobs/dailyEarnings.js
const cron = require('node-cron');
const Investment = require('../models/Investment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * Daily Earnings Job - Runs every hour, pays users once per local day
 */
const setupDailyEarningsJob = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ ========================================');
    console.log('⏰ RUNNING HOURLY EARNINGS CHECK');
    console.log('⏰ UTC Time:', new Date().toISOString());
    console.log('⏰ Local Time:', new Date().toString());
    console.log('⏰ ========================================');

    const startTime = Date.now();
    const stats = {
      usersProcessed: 0,
      investmentsProcessed: 0,
      earningsAdded: 0,
      usersUpdated: 0,
      errors: 0
    };

    try {
      // Find all users with active investments
      const users = await User.find({ 
        'activeInvestments.status': 'active' 
      });

      console.log(`📊 Found ${users.length} users with active investments`);

      for (const user of users) {
        try {
          // Get user's timezone (default to UTC if not set)
          const userTimezone = user.timezone || 'UTC';
          
          // Get current time in user's timezone
          const now = new Date();
          const userNow = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
          
          // Get start of today in user's timezone (midnight)
          const userTodayStart = new Date(Date.UTC(
            userNow.getFullYear(),
            userNow.getMonth(),
            userNow.getDate(),
            0, 0, 0, 0
          ));

          // Check if user has been paid today
          const lastPayment = user.lastPaymentDate;
          
          // If no lastPayment OR last payment was before today in user's timezone
          let shouldPay = false;
          
          if (!lastPayment) {
            shouldPay = true;
            console.log(`\n👤 ${user.izina_ryogukoresha}: First time payment`);
          } else {
            // Convert last payment to user's timezone for comparison
            const lastPaymentUTC = new Date(lastPayment);
            const lastPaymentUser = new Date(lastPaymentUTC.toLocaleString('en-US', { timeZone: userTimezone }));
            const lastPaymentDay = new Date(Date.UTC(
              lastPaymentUser.getFullYear(),
              lastPaymentUser.getMonth(),
              lastPaymentUser.getDate(),
              0, 0, 0, 0
            ));
            
            // If last payment day is before today, they need to be paid
            if (lastPaymentDay < userTodayStart) {
              shouldPay = true;
              console.log(`\n👤 ${user.izina_ryogukoresha}: Needs payment for ${userTodayStart.toDateString()}`);
            } else {
              console.log(`⏭️ ${user.izina_ryogukoresha}: Already paid today`);
            }
          }

          if (shouldPay) {
            // Find user's active investments from Investment collection
            const investments = await Investment.find({
              user: user._id,
              status: 'active',
              endDate: { $gt: new Date() }
            });

            if (investments.length === 0) {
              console.log(`⚠️ No active investments found for ${user.izina_ryogukoresha}`);
              continue;
            }

            let userDailyTotal = 0;
            const processedInvestments = [];

            for (const investment of investments) {
              const earning = investment.dailyEarning;
              
              // Create transaction record
              const transaction = new Transaction({
                user: user._id,
                type: 'earning',
                amount: earning,
                status: 'completed',
                description: `Daily earnings for ${userNow.toDateString()}`,
                paymentMethod: 'system',
                metadata: {
                  investmentId: investment._id,
                  productName: investment.productName,
                  dailyEarning: earning,
                  userTimezone: userTimezone,
                  paymentDate: userNow,
                  paymentDay: userTodayStart
                }
              });
              
              await transaction.save();
              
              // Update investment
              investment.totalEarnedSoFar += earning;
              investment.lastProfitDate = new Date();
              
              if (!investment.earningsHistory) investment.earningsHistory = [];
              investment.earningsHistory.push({
                amount: earning,
                date: new Date(),
                transactionId: transaction._id
              });
              
              await investment.save();
              
              userDailyTotal += earning;
              processedInvestments.push(investment);
              stats.investmentsProcessed++;
              stats.earningsAdded += earning;

              console.log(`   ✅ Added ${earning.toLocaleString()} FRW from ${investment.productName}`);
            }

            // Update user's wallet and stats
            user.wallets.earning = (user.wallets.earning || 0) + userDailyTotal;
            user.stats.totalEarned = (user.stats.totalEarned || 0) + userDailyTotal;
            user.stats.dailyEarnings = userDailyTotal;
            
            // Update investmentStats if it exists
            if (user.investmentStats) {
              user.investmentStats.totalEarnedFromInvestments = (user.investmentStats.totalEarnedFromInvestments || 0) + userDailyTotal;
            }
            
            // CRITICAL: Update last payment date to NOW
            user.lastPaymentDate = new Date();
            
            await user.save();
            
            stats.usersProcessed++;
            stats.usersUpdated++;

            // Send notification
            try {
              if (user.addNotification) {
                await user.addNotification(
                  `💰 You earned ${userDailyTotal.toLocaleString()} FRW for ${userNow.toDateString()}!`,
                  'success'
                );
              }
            } catch (notifyError) {
              console.error('Error adding notification:', notifyError);
            }

            console.log(`💰 ${user.izina_ryogukoresha} earned total: ${userDailyTotal.toLocaleString()} FRW`);
            console.log(`📅 Next payment due: ${new Date(userTodayStart.getTime() + 24*60*60*1000).toDateString()}`);
          }

        } catch (userError) {
          console.error(`❌ Error processing user:`, userError.message);
          stats.errors++;
        }
      }

      const duration = Date.now() - startTime;
      
      console.log(`
      🎉 ========================================
      🎉 HOURLY EARNINGS CHECK COMPLETED
      🎉 ========================================
      ⏱️ Duration: ${duration}ms
      👥 Users processed: ${stats.usersProcessed}
      👤 Users updated: ${stats.usersUpdated}
      📊 Investments processed: ${stats.investmentsProcessed}
      💰 Total earnings added: ${stats.earningsAdded.toLocaleString()} FRW
      ❌ Errors: ${stats.errors}
      🎉 ========================================
      `);

    } catch (error) {
      console.error('❌ Daily earnings job failed:', error);
    }
  });

  console.log('📅 Hourly earnings check scheduled - pays each user once per local day');
  console.log('⏰ Job runs every hour at minute 0');
};

module.exports = setupDailyEarningsJob;