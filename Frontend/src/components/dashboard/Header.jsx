










// // src/components/dashboard/Header.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   FaBars, FaSun, FaMoon, FaBell, FaRobot, FaSignOutAlt,
//   FaChartLine, FaWallet, FaHistory, FaTimes, FaSpinner,
//   FaClock, FaCalendarAlt, FaCoins, FaPercentage, FaArrowUp,
//   FaArrowDown, FaInfoCircle, FaChevronDown, FaChevronUp,
//   FaCheckCircle, FaExclamationCircle, FaBan, FaEye
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ChatbotFAB from './ChatbotFAB'; // We'll create this new component

// const Header = ({ 
//   darkMode, 
//   user, 
//   showSidebar, 
//   setShowSidebar, 
//   setShowChatbot, 
//   toggleDarkMode, 
//   onLogout, 
//   dataSource, 
//   formatCurrency, 
//   availableBalance 
// }) => {
//   const navigate = useNavigate();
//   const [showInvestmentsModal, setShowInvestmentsModal] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [investments, setInvestments] = useState([]);
//   const [loadingInvestments, setLoadingInvestments] = useState(false);
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loadingNotifications, setLoadingNotifications] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [investmentStats, setInvestmentStats] = useState({
//     totalInvested: 0,
//     todayInvested: 0,
//     totalEarnedSoFar: 0,
//     activeCount: 0,
//     dailyEarnings: 0,
//     totalROI: 0,
//     averageReturn: 0
//   });

//   // Check screen size on resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Get first letter of user's name
//   const getFirstLetter = () => {
//     if (!user?.izina_ryogukoresha) return 'U';
//     return user.izina_ryogukoresha.charAt(0).toUpperCase();
//   };

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       setLoadingNotifications(true);
//       const token = sessionStorage.getItem('token');
      
//       const response = await axios.get('http://localhost:5000/api/user/notifications', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const userNotifications = response.data.notifications || [];
//         setNotifications(userNotifications);
//         setUnreadCount(userNotifications.filter(n => !n.read).length);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoadingNotifications(false);
//     }
//   };

//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     try {
//       const token = sessionStorage.getItem('token');
      
//       await axios.put(`http://localhost:5000/api/user/notifications/${notificationId}/read`, {}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setNotifications(prev => 
//         prev.map(n => 
//           n._id === notificationId ? { ...n, read: true } : n
//         )
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // Mark all as read
//   const markAllAsRead = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
      
//       await axios.put('http://localhost:5000/api/user/notifications/read-all', {}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//     }
//   };

//   // Fetch notifications on mount and when modal opens
//   useEffect(() => {
//     if (showNotifications) {
//       fetchNotifications();
//     }
//   }, [showNotifications]);

//   // Also fetch periodically (every 30 seconds)
//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchInvestments = async () => {
//     try {
//       setLoadingInvestments(true);
//       const token = sessionStorage.getItem('token');
      
//       const response = await axios.get('http://localhost:5000/api/user/active-investments', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const userInvestments = response.data.activeInvestments || [];
        
//         // Get today's date at midnight for comparison
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
        
//         // Add timer data and calculate earnings to each investment
//         const investmentsWithDetails = userInvestments.map(inv => {
//           const purchaseDate = new Date(inv.purchaseDate);
//           const nextPayout = new Date(purchaseDate);
//           nextPayout.setDate(nextPayout.getDate() + 1);
          
//           // Calculate days since purchase
//           const today = new Date();
//           const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
          
//           // Calculate earnings so far
//           const earningsSoFar = (inv.dailyEarning || 0) * daysSincePurchase;
          
//           // Calculate total expected earnings (30 days)
//           const totalExpectedEarnings = (inv.dailyEarning || 0) * 30;
          
//           // Calculate remaining days
//           const daysRemaining = Math.max(0, 30 - daysSincePurchase);
          
//           // Calculate ROI percentage
//           const roiPercentage = ((totalExpectedEarnings / inv.purchasePrice) * 100).toFixed(1);
          
//           // Check if purchased today
//           const isToday = purchaseDate >= today;
          
//           return {
//             ...inv,
//             purchaseDate: inv.purchaseDate,
//             nextPayout: nextPayout.toISOString(),
//             timeRemaining: calculateTimeRemaining(nextPayout),
//             daysSincePurchase: daysSincePurchase < 0 ? 0 : daysSincePurchase,
//             earningsSoFar: earningsSoFar < 0 ? 0 : earningsSoFar,
//             totalExpectedEarnings,
//             daysRemaining,
//             roiPercentage,
//             progress: Math.min(100, (daysSincePurchase / 30) * 100),
//             isToday
//           };
//         });
        
//         setInvestments(investmentsWithDetails);
        
//         // Calculate overall stats
//         const stats = investmentsWithDetails.reduce((acc, inv) => {
//           acc.totalInvested += inv.purchasePrice || 0;
//           if (inv.isToday) {
//             acc.todayInvested += inv.purchasePrice || 0;
//           }
//           acc.totalEarnedSoFar += inv.earningsSoFar || 0;
//           acc.dailyEarnings += inv.dailyEarning || 0;
//           acc.activeCount += inv.status === 'active' ? 1 : 0;
//           acc.totalROI += inv.totalExpectedEarnings || 0;
//           return acc;
//         }, { 
//           totalInvested: 0, 
//           todayInvested: 0,
//           totalEarnedSoFar: 0, 
//           dailyEarnings: 0, 
//           activeCount: 0, 
//           totalROI: 0 
//         });
        
//         stats.averageReturn = stats.totalInvested > 0 
//           ? ((stats.totalROI / stats.totalInvested) * 100).toFixed(1) 
//           : 0;
        
//         setInvestmentStats(stats);
//       }
//     } catch (error) {
//       console.error('Error fetching investments:', error);
//     } finally {
//       setLoadingInvestments(false);
//     }
//   };

//   const calculateTimeRemaining = (nextPayoutDate) => {
//     const now = new Date();
//     const payout = new Date(nextPayoutDate);
//     const diffMs = payout - now;
    
//     if (diffMs <= 0) return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    
//     const totalSeconds = Math.floor(diffMs / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
    
//     return { hours, minutes, seconds, total: totalSeconds };
//   };

//   const toggleExpandCard = (index) => {
//     if (expandedCard === index) {
//       setExpandedCard(null);
//     } else {
//       setExpandedCard(index);
//     }
//   };

//   const handleMyInvestmentsClick = () => {
//     fetchInvestments();
//     setShowInvestmentsModal(true);
//   };

//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'success':
//         return <FaCheckCircle className="text-green-500" />;
//       case 'warning':
//         return <FaExclamationCircle className="text-yellow-500" />;
//       case 'error':
//         return <FaBan className="text-red-500" />;
//       default:
//         return <FaInfoCircle className="text-blue-500" />;
//     }
//   };

//   const formatNotificationTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins} min ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   // Handle dark mode toggle
//   const handleDarkModeToggle = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     toggleDarkMode();
//   };

//   return (
//     <>
//       <header className={`sticky top-0 z-20 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} py-2 px-3 md:px-6`}>
//         <div className="flex items-center justify-between">
//           {/* Left side - Menu button and User Letter */}
//           <div className="flex items-center min-w-0">
//             <button
//               type="button"
//               onClick={() => setShowSidebar(!showSidebar)}
//               className={`p-2 rounded-lg mr-2 flex-shrink-0 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} md:hidden`}
//             >
//               <FaBars />
//             </button>
            
//             {/* User Letter Circle */}
//             <div className={`
//               w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-xl
//               ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'}
//               text-white shadow-lg
//             `}>
//               {getFirstLetter()}
//             </div>
            
//             {/* Date on larger screens */}
//             <div className="hidden lg:block ml-3">
//               <p className="text-xs opacity-75">
//                 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//               </p>
//             </div>
//           </div>

//           {/* Right side - Actions */}
//           <div className="flex items-center space-x-1 sm:space-x-2">
//             {/* MY INVESTMENT BUTTON */}
//             <button
//               type="button"
//               onClick={handleMyInvestmentsClick}
//               className={`px-2 sm:px-3 py-2 rounded-lg flex items-center ${
//                 darkMode 
//                   ? 'bg-purple-600 hover:bg-purple-700 text-white' 
//                   : 'bg-purple-500 hover:bg-purple-600 text-white'
//               } transition-colors text-xs sm:text-sm`}
//               title="My Investment"
//             >
//               <FaChartLine className="mr-1" />
//               <span>My_Investment</span>
//             </button>

//             {/* Chatbot Button - Hidden on mobile (will show as FAB) */}
//             {!isMobile && (
//               <button
//                 type="button"
//                 onClick={() => setShowChatbot(true)}
//                 className={`p-2 rounded-lg ${
//                   darkMode 
//                     ? 'bg-blue-600 hover:bg-blue-700 text-white' 
//                     : 'bg-blue-500 hover:bg-blue-600 text-white'
//                 }`}
//                 title="Support"
//               >
//                 <FaRobot className="text-sm sm:text-base" />
//               </button>
//             )}

//             {/* Notifications Button */}
//             <button
//               type="button"
//               onClick={() => setShowNotifications(!showNotifications)}
//               className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               title="Notifications"
//             >
//               <FaBell className={`text-sm sm:text-base ${unreadCount > 0 ? 'text-yellow-500' : ''}`} />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1">
//                   {unreadCount > 9 ? '9+' : unreadCount}
//                 </span>
//               )}
//             </button>

//             {/* Dark Mode Toggle */}
//             <button
//               type="button"
//               onClick={handleDarkModeToggle}
//               className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               title={darkMode ? 'Light Mode' : 'Dark Mode'}
//             >
//               {darkMode ? <FaSun className="text-yellow-500 text-sm sm:text-base" /> : <FaMoon className="text-gray-600 text-sm sm:text-base" />}
//             </button>

//             {/* Logout Button */}
//             <button
//               type="button"
//               onClick={onLogout}
//               className={`p-2 rounded-lg ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
//               title="Logout"
//             >
//               <FaSignOutAlt className="text-sm sm:text-base" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Notifications Panel */}
//       {showNotifications && (
//         <div className="absolute right-4 top-16 z-50 w-80 sm:w-96">
//           <div className={`relative rounded-xl shadow-2xl overflow-hidden ${
//             darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
//           }`}>
//             {/* Notifications Header */}
//             <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
//               <div className="flex items-center">
//                 <FaBell className="mr-2 text-yellow-500" />
//                 <h3 className="font-bold">Notifications</h3>
//                 {unreadCount > 0 && (
//                   <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
//                     darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
//                   }`}>
//                     {unreadCount} new
//                   </span>
//                 )}
//               </div>
//               {unreadCount > 0 && (
//                 <button
//                   type="button"
//                   onClick={markAllAsRead}
//                   className={`text-xs px-2 py-1 rounded ${
//                     darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   Mark all read
//                 </button>
//               )}
//             </div>

//             {/* Notifications List */}
//             <div className="max-h-96 overflow-y-auto">
//               {loadingNotifications ? (
//                 <div className="p-8 text-center">
//                   <FaSpinner className="animate-spin mx-auto mb-2" />
//                   <p className="text-sm opacity-75">Loading...</p>
//                 </div>
//               ) : notifications.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <FaInfoCircle className="mx-auto text-3xl mb-2 opacity-50" />
//                   <p className="text-sm opacity-75">No notifications</p>
//                 </div>
//               ) : (
//                 notifications.map((notification) => (
//                   <div
//                     key={notification._id}
//                     className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors ${!notification.read ? (darkMode ? 'bg-blue-900/10' : 'bg-blue-50') : ''}`}
//                     onClick={() => markAsRead(notification._id)}
//                   >
//                     <div className="flex items-start">
//                       <div className="mr-3 mt-1">
//                         {getNotificationIcon(notification.type)}
//                       </div>
//                       <div className="flex-1">
//                         <p className={`text-sm ${!notification.read ? 'font-bold' : ''}`}>
//                           {notification.message}
//                         </p>
//                         <p className="text-xs opacity-60 mt-1">
//                           {formatNotificationTime(notification.createdAt)}
//                         </p>
//                       </div>
//                       {!notification.read && (
//                         <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* View All Link */}
//             <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowNotifications(false);
//                   navigate('/notifications');
//                 }}
//                 className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
//               >
//                 View all notifications
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* My Investments Modal */}
//       {showInvestmentsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70">
//           <div className={`relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl sm:rounded-2xl ${
//             darkMode ? 'bg-gray-800' : 'bg-white'
//           } p-3 sm:p-6`}>
//             {/* Modal Header */}
//             <div className="flex justify-between items-start mb-4 sticky top-0 bg-inherit z-10 pb-2 border-b border-gray-700/30">
//               <h2 className="text-lg sm:text-2xl font-bold flex items-center">
//                 <FaChartLine className="mr-2 text-purple-500 text-base sm:text-xl" />
//                 <span className="truncate">My Investment Portfolio</span>
//               </h2>
//               <button
//                 type="button"
//                 onClick={() => setShowInvestmentsModal(false)}
//                 className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Investment Stats Cards */}
//             <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
//               {/* Total Invest Card */}
//               <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <div className="text-[10px] sm:text-xs opacity-75 truncate">Total Invest</div>
//                 <div className="text-sm sm:text-xl md:text-2xl font-bold text-indigo-500 truncate">
//                   {formatCurrency(investmentStats.totalInvested)} <span className="text-[8px] sm:text-xs">FRW</span>
//                 </div>
//               </div>
              
//               {/* Today Invested Card */}
//               <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <div className="text-[10px] sm:text-xs opacity-75 truncate">Today Invested</div>
//                 <div className="text-sm sm:text-xl md:text-2xl font-bold text-cyan-500 truncate">
//                   {formatCurrency(investmentStats.todayInvested)} <span className="text-[8px] sm:text-xs">FRW</span>
//                 </div>
//               </div>
              
//               <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <div className="text-[10px] sm:text-xs opacity-75 truncate">Earned</div>
//                 <div className="text-sm sm:text-xl md:text-2xl font-bold text-green-500 truncate">
//                   {formatCurrency(investmentStats.totalEarnedSoFar)} <span className="text-[8px] sm:text-xs">FRW</span>
//                 </div>
//               </div>
              
//               <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <div className="text-[10px] sm:text-xs opacity-75 truncate">Daily</div>
//                 <div className="text-sm sm:text-xl md:text-2xl font-bold text-yellow-500 truncate">
//                   {formatCurrency(investmentStats.dailyEarnings)} <span className="text-[8px] sm:text-xs">FRW</span>
//                 </div>
//               </div>
              
//               <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <div className="text-[10px] sm:text-xs opacity-75 truncate">ROI</div>
//                 <div className="text-sm sm:text-xl md:text-2xl font-bold text-purple-500">
//                   {investmentStats.averageReturn}%
//                 </div>
//               </div>
              
//               <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                 <div className="text-[10px] sm:text-xs opacity-75 truncate">Active</div>
//                 <div className="text-sm sm:text-xl md:text-2xl font-bold text-pink-500">
//                   {investmentStats.activeCount}
//                 </div>
//               </div>
//             </div>

//             {/* Investments List */}
//             <h3 className="text-sm sm:text-xl font-bold mb-3">Products</h3>
            
//             {loadingInvestments ? (
//               <div className="text-center py-8 sm:py-12">
//                 <FaSpinner className="animate-spin mx-auto text-2xl sm:text-3xl mb-3" />
//                 <p className="text-sm">Loading...</p>
//               </div>
//             ) : investments.length === 0 ? (
//               <EmptyState darkMode={darkMode} setShowInvestmentsModal={setShowInvestmentsModal} />
//             ) : (
//               <div className="space-y-3 sm:space-y-4">
//                 {investments.map((investment, index) => (
//                   <MobileInvestmentCard 
//                     key={index}
//                     investment={investment}
//                     darkMode={darkMode}
//                     formatCurrency={formatCurrency}
//                     isExpanded={expandedCard === index}
//                     onToggle={() => toggleExpandCard(index)}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Modal Footer */}
//             <div className="mt-4 sm:mt-6 flex justify-end sticky bottom-0 bg-inherit pt-2 border-t border-gray-700/30">
//               <button
//                 type="button"
//                 onClick={() => setShowInvestmentsModal(false)}
//                 className={`px-4 sm:px-6 py-2 rounded-lg text-sm ${
//                   darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // Mobile-Optimized Investment Card
// const MobileInvestmentCard = ({ investment, darkMode, formatCurrency, isExpanded, onToggle }) => {
//   const [timeRemaining, setTimeRemaining] = useState(
//     investment.timeRemaining || { hours: 0, minutes: 0, seconds: 0, total: 0 }
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (investment.nextPayout) {
//         const now = new Date();
//         const payout = new Date(investment.nextPayout);
//         const diffMs = payout - now;
        
//         if (diffMs <= 0) {
//           const nextPayout = new Date(payout);
//           nextPayout.setDate(nextPayout.getDate() + 1);
//           investment.nextPayout = nextPayout.toISOString();
//           setTimeRemaining({ hours: 24, minutes: 0, seconds: 0, total: 86400 });
//         } else {
//           const totalSeconds = Math.floor(diffMs / 1000);
//           const hours = Math.floor(totalSeconds / 3600);
//           const minutes = Math.floor((totalSeconds % 3600) / 60);
//           const seconds = totalSeconds % 60;
//           setTimeRemaining({ hours, minutes, seconds, total: totalSeconds });
//         }
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [investment.nextPayout]);

//   const getProgressPercentage = () => {
//     if (!investment.nextPayout) return 0;
//     const total = 24 * 3600;
//     const remaining = timeRemaining.total;
//     return ((total - remaining) / total) * 100;
//   };

//   return (
//     <div className={`rounded-xl border overflow-hidden ${
//       darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
//     }`}>
//       {/* Card Header */}
//       <div 
//         className="p-3 flex items-center justify-between cursor-pointer active:bg-black/10"
//         onClick={onToggle}
//       >
//         <div className="flex items-center flex-1 min-w-0">
//           <div className={`p-2 rounded-lg mr-3 ${
//             darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
//           }`}>
//             <FaChartLine className="text-purple-500 text-sm" />
//           </div>
//           <div className="min-w-0 flex-1">
//             <h4 className="font-bold text-sm truncate">{investment.productName}</h4>
//             <div className="flex items-center text-xs">
//               <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
//                 investment.status === 'active'
//                   ? 'bg-green-500/20 text-green-400'
//                   : 'bg-gray-500/20 text-gray-400'
//               }`}>
//                 {investment.status}
//               </span>
//               <span className="ml-2 opacity-75 text-[10px]">
//                 Day {investment.daysSincePurchase || 0}/30
//               </span>
//               {investment.isToday && (
//                 <span className="ml-2 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[8px]">
//                   Today
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center">
//           <div className="text-right mr-2">
//             <div className="text-xs opacity-75">Daily</div>
//             <div className="text-sm font-bold text-green-500">
//               {formatCurrency(investment.dailyEarning)}
//             </div>
//           </div>
//           {isExpanded ? (
//             <FaChevronUp className="opacity-50 text-xs" />
//           ) : (
//             <FaChevronDown className="opacity-50 text-xs" />
//           )}
//         </div>
//       </div>

//       {/* Expanded Details */}
//       {isExpanded && (
//         <div className="p-3 pt-0 border-t border-gray-600/30 mt-2">
//           {/* Quick Stats Grid */}
//           <div className="grid grid-cols-2 gap-2 mb-3">
//             <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
//               <div className="text-[10px] opacity-75">Invested</div>
//               <div className="text-xs font-bold text-blue-500">
//                 {formatCurrency(investment.purchasePrice)} FRW
//               </div>
//             </div>
//             <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
//               <div className="text-[10px] opacity-75">Earned</div>
//               <div className="text-xs font-bold text-yellow-500">
//                 {formatCurrency(investment.earningsSoFar || 0)} FRW
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-3">
//             <div className="flex justify-between text-[10px] mb-1">
//               <span>Progress</span>
//               <span>{Math.round(investment.progress || 0)}%</span>
//             </div>
//             <div className="w-full h-1.5 bg-gray-600 rounded-full">
//               <div 
//                 className="h-full bg-blue-500 rounded-full transition-all duration-500"
//                 style={{ width: `${investment.progress || 0}%` }}
//               />
//             </div>
//           </div>

//           {/* Timer and Dates */}
//           <div className="space-y-2 text-xs">
//             <div className="flex items-center justify-between">
//               <span className="flex items-center opacity-75">
//                 <FaClock className="mr-1 text-yellow-500 text-[10px]" />
//                 Next payout
//               </span>
//               <span className={`font-mono font-bold ${
//                 timeRemaining.total < 3600 ? 'text-yellow-500 animate-pulse' : ''
//               }`}>
//                 {String(timeRemaining.hours).padStart(2, '0')}:
//                 {String(timeRemaining.minutes).padStart(2, '0')}:
//                 {String(timeRemaining.seconds).padStart(2, '0')}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="flex items-center opacity-75">
//                 <FaCalendarAlt className="mr-1 text-blue-500 text-[10px]" />
//                 Started
//               </span>
//               <span>{new Date(investment.purchaseDate).toLocaleDateString()}</span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="flex items-center opacity-75">
//                 <FaArrowUp className="mr-1 text-green-500 text-[10px]" />
//                 Total expected
//               </span>
//               <span className="font-bold text-purple-500">
//                 {formatCurrency(investment.totalExpectedEarnings)} FRW
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="flex items-center opacity-75">
//                 <FaPercentage className="mr-1 text-pink-500 text-[10px]" />
//                 ROI
//               </span>
//               <span className="font-bold">{investment.roiPercentage}%</span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="flex items-center opacity-75">
//                 <FaArrowDown className="mr-1 text-red-500 text-[10px]" />
//                 Days left
//               </span>
//               <span className="font-bold">{investment.daysRemaining} days</span>
//             </div>
//           </div>

//           {/* View Details Button */}
//           <button
//             type="button"
//             className={`w-full mt-3 py-2 rounded-lg text-xs font-medium ${
//               darkMode ? 'bg-purple-600/30 hover:bg-purple-600/50' : 'bg-purple-100 hover:bg-purple-200'
//             } transition-colors`}
//           >
//             View Full Details
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Empty State Component
// const EmptyState = ({ darkMode, setShowInvestmentsModal }) => (
//   <div className={`text-center py-8 sm:py-12 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
//     <FaInfoCircle className="mx-auto text-3xl sm:text-4xl mb-3 opacity-50" />
//     <p className="text-sm sm:text-base opacity-75 mb-4 px-4">
//       You haven't invested in any products yet.
//     </p>
//     <button
//       type="button"
//       onClick={() => {
//         setShowInvestmentsModal(false);
//         setTimeout(() => {
//           document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
//         }, 300);
//       }}
//       className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm ${
//         darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
//       } text-white font-bold`}
//     >
//       Browse Products
//     </button>
//   </div>
// );

// export default Header;


// src/components/dashboard/Header.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaBars, FaSun, FaMoon, FaBell, FaRobot, FaSignOutAlt,
  FaChartLine, FaWallet, FaHistory, FaTimes, FaSpinner,
  FaClock, FaCalendarAlt, FaCoins, FaPercentage, FaArrowUp,
  FaArrowDown, FaInfoCircle, FaChevronDown, FaChevronUp,
  FaCheckCircle, FaExclamationCircle, FaBan, FaEye
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ 
  darkMode, 
  user, 
  showSidebar, 
  setShowSidebar, 
  setShowChatbot, 
  toggleDarkMode, 
  onLogout, 
  dataSource, 
  formatCurrency, 
  availableBalance,
  notifications: propNotifications 
}) => {
  const navigate = useNavigate();
  const [showInvestmentsModal, setShowInvestmentsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [investmentStats, setInvestmentStats] = useState({
    totalInvested: 0,
    todayInvested: 0,
    totalEarnedSoFar: 0,
    activeCount: 0,
    dailyEarnings: 0,
    totalROI: 0,
    averageReturn: 0
  });

  const API_URL = 'http://localhost:5000/api';

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get first letter of user's name
  const getFirstLetter = () => {
    if (!user?.izina_ryogukoresha) return 'U';
    return user.izina_ryogukoresha.charAt(0).toUpperCase();
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = sessionStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const userNotifications = response.data.notifications || [];
        setNotifications(userNotifications);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem('token');
      
      await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
      await axios.put(`${API_URL}/notifications/read-all`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Fetch notifications on mount and when modal opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  // Use notifications from props if available
  useEffect(() => {
    if (propNotifications && propNotifications.length > 0) {
      setNotifications(propNotifications);
      setUnreadCount(propNotifications.filter(n => !n.read).length);
    }
  }, [propNotifications]);

  // Also fetch periodically (every 30 seconds)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoadingInvestments(true);
      const token = sessionStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/user/active-investments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const userInvestments = response.data.activeInvestments || [];
        
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Add timer data and calculate earnings to each investment
        const investmentsWithDetails = userInvestments.map(inv => {
          const purchaseDate = new Date(inv.purchaseDate);
          const nextPayout = new Date(purchaseDate);
          nextPayout.setDate(nextPayout.getDate() + 1);
          
          // Calculate days since purchase
          const today = new Date();
          const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
          
          // Calculate earnings so far
          const earningsSoFar = (inv.dailyEarning || 0) * daysSincePurchase;
          
          // Calculate total expected earnings (30 days)
          const totalExpectedEarnings = (inv.dailyEarning || 0) * 30;
          
          // Calculate remaining days
          const daysRemaining = Math.max(0, 30 - daysSincePurchase);
          
          // Calculate ROI percentage
          const roiPercentage = ((totalExpectedEarnings / inv.purchasePrice) * 100).toFixed(1);
          
          // Check if purchased today
          const isToday = purchaseDate >= today;
          
          return {
            ...inv,
            purchaseDate: inv.purchaseDate,
            nextPayout: nextPayout.toISOString(),
            timeRemaining: calculateTimeRemaining(nextPayout),
            daysSincePurchase: daysSincePurchase < 0 ? 0 : daysSincePurchase,
            earningsSoFar: earningsSoFar < 0 ? 0 : earningsSoFar,
            totalExpectedEarnings,
            daysRemaining,
            roiPercentage,
            progress: Math.min(100, (daysSincePurchase / 30) * 100),
            isToday
          };
        });
        
        setInvestments(investmentsWithDetails);
        
        // Calculate overall stats
        const stats = investmentsWithDetails.reduce((acc, inv) => {
          acc.totalInvested += inv.purchasePrice || 0;
          if (inv.isToday) {
            acc.todayInvested += inv.purchasePrice || 0;
          }
          acc.totalEarnedSoFar += inv.earningsSoFar || 0;
          acc.dailyEarnings += inv.dailyEarning || 0;
          acc.activeCount += inv.status === 'active' ? 1 : 0;
          acc.totalROI += inv.totalExpectedEarnings || 0;
          return acc;
        }, { 
          totalInvested: 0, 
          todayInvested: 0,
          totalEarnedSoFar: 0, 
          dailyEarnings: 0, 
          activeCount: 0, 
          totalROI: 0 
        });
        
        stats.averageReturn = stats.totalInvested > 0 
          ? ((stats.totalROI / stats.totalInvested) * 100).toFixed(1) 
          : 0;
        
        setInvestmentStats(stats);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoadingInvestments(false);
    }
  };

  const calculateTimeRemaining = (nextPayoutDate) => {
    const now = new Date();
    const payout = new Date(nextPayoutDate);
    const diffMs = payout - now;
    
    if (diffMs <= 0) return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds, total: totalSeconds };
  };

  const toggleExpandCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  const handleMyInvestmentsClick = () => {
    fetchInvestments();
    setShowInvestmentsModal(true);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500" />;
      case 'error':
        return <FaBan className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDarkMode();
  };

  return (
    <>
      <header className={`sticky top-0 z-20 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} py-2 px-3 md:px-6`}>
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and User Letter */}
          <div className="flex items-center min-w-0">
            <button
              type="button"
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-lg mr-2 flex-shrink-0 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} md:hidden`}
            >
              <FaBars />
            </button>
            
            {/* User Letter Circle */}
            <div className={`
              w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-xl
              ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'}
              text-white shadow-lg
            `}>
              {getFirstLetter()}
            </div>
            
            {/* Date on larger screens */}
            <div className="hidden lg:block ml-3">
              <p className="text-xs opacity-75">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* MY INVESTMENT BUTTON */}
            <button
              type="button"
              onClick={handleMyInvestmentsClick}
              className={`px-2 sm:px-3 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              } transition-colors text-xs sm:text-sm`}
              title="My Investment"
            >
              <FaChartLine className="mr-1" />
              <span>My_Investment</span>
            </button>

            {/* Chatbot Button - Hidden on mobile (will show as FAB) */}
            {!isMobile && (
              <button
                type="button"
                onClick={() => setShowChatbot(true)}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                title="Support"
              >
                <FaRobot className="text-sm sm:text-base" />
              </button>
            )}

            {/* Notifications Button */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Notifications"
            >
              <FaBell className={`text-sm sm:text-base ${unreadCount > 0 ? 'text-yellow-500' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={handleDarkModeToggle}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <FaSun className="text-yellow-500 text-sm sm:text-base" /> : <FaMoon className="text-gray-600 text-sm sm:text-base" />}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className={`p-2 rounded-lg ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
              title="Logout"
            >
              <FaSignOutAlt className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-4 top-16 z-50 w-80 sm:w-96">
          <div className={`relative rounded-xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Notifications Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <div className="flex items-center">
                <FaBell className="mr-2 text-yellow-500" />
                <h3 className="font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className={`text-xs px-2 py-1 rounded ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loadingNotifications ? (
                <div className="p-8 text-center">
                  <FaSpinner className="animate-spin mx-auto mb-2" />
                  <p className="text-sm opacity-75">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FaInfoCircle className="mx-auto text-3xl mb-2 opacity-50" />
                  <p className="text-sm opacity-75">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors ${!notification.read ? (darkMode ? 'bg-blue-900/10' : 'bg-blue-50') : ''}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-bold' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View All Link */}
            <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/notifications');
                }}
                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                View all notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Investments Modal */}
      {showInvestmentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70">
          <div className={`relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl sm:rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-3 sm:p-6`}>
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4 sticky top-0 bg-inherit z-10 pb-2 border-b border-gray-700/30">
              <h2 className="text-lg sm:text-2xl font-bold flex items-center">
                <FaChartLine className="mr-2 text-purple-500 text-base sm:text-xl" />
                <span className="truncate">My Investment Portfolio</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowInvestmentsModal(false)}
                className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FaTimes />
              </button>
            </div>

            {/* Investment Stats Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Total Invest Card */}
              <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="text-[10px] sm:text-xs opacity-75 truncate">Total Invest</div>
                <div className="text-sm sm:text-xl md:text-2xl font-bold text-indigo-500 truncate">
                  {formatCurrency(investmentStats.totalInvested)} <span className="text-[8px] sm:text-xs">FRW</span>
                </div>
              </div>
              
              {/* Today Invested Card */}
              <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="text-[10px] sm:text-xs opacity-75 truncate">Today Invested</div>
                <div className="text-sm sm:text-xl md:text-2xl font-bold text-cyan-500 truncate">
                  {formatCurrency(investmentStats.todayInvested)} <span className="text-[8px] sm:text-xs">FRW</span>
                </div>
              </div>
              
              <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="text-[10px] sm:text-xs opacity-75 truncate">Earned</div>
                <div className="text-sm sm:text-xl md:text-2xl font-bold text-green-500 truncate">
                  {formatCurrency(investmentStats.totalEarnedSoFar)} <span className="text-[8px] sm:text-xs">FRW</span>
                </div>
              </div>
              
              <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="text-[10px] sm:text-xs opacity-75 truncate">Daily</div>
                <div className="text-sm sm:text-xl md:text-2xl font-bold text-yellow-500 truncate">
                  {formatCurrency(investmentStats.dailyEarnings)} <span className="text-[8px] sm:text-xs">FRW</span>
                </div>
              </div>
              
              <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="text-[10px] sm:text-xs opacity-75 truncate">ROI</div>
                <div className="text-sm sm:text-xl md:text-2xl font-bold text-purple-500">
                  {investmentStats.averageReturn}%
                </div>
              </div>
              
              <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="text-[10px] sm:text-xs opacity-75 truncate">Active</div>
                <div className="text-sm sm:text-xl md:text-2xl font-bold text-pink-500">
                  {investmentStats.activeCount}
                </div>
              </div>
            </div>

            {/* Investments List */}
            <h3 className="text-sm sm:text-xl font-bold mb-3">Products</h3>
            
            {loadingInvestments ? (
              <div className="text-center py-8 sm:py-12">
                <FaSpinner className="animate-spin mx-auto text-2xl sm:text-3xl mb-3" />
                <p className="text-sm">Loading...</p>
              </div>
            ) : investments.length === 0 ? (
              <EmptyState darkMode={darkMode} setShowInvestmentsModal={setShowInvestmentsModal} />
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {investments.map((investment, index) => (
                  <MobileInvestmentCard 
                    key={index}
                    investment={investment}
                    darkMode={darkMode}
                    formatCurrency={formatCurrency}
                    isExpanded={expandedCard === index}
                    onToggle={() => toggleExpandCard(index)}
                  />
                ))}
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-4 sm:mt-6 flex justify-end sticky bottom-0 bg-inherit pt-2 border-t border-gray-700/30">
              <button
                type="button"
                onClick={() => setShowInvestmentsModal(false)}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mobile-Optimized Investment Card
const MobileInvestmentCard = ({ investment, darkMode, formatCurrency, isExpanded, onToggle }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    investment.timeRemaining || { hours: 0, minutes: 0, seconds: 0, total: 0 }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (investment.nextPayout) {
        const now = new Date();
        const payout = new Date(investment.nextPayout);
        const diffMs = payout - now;
        
        if (diffMs <= 0) {
          const nextPayout = new Date(payout);
          nextPayout.setDate(nextPayout.getDate() + 1);
          investment.nextPayout = nextPayout.toISOString();
          setTimeRemaining({ hours: 24, minutes: 0, seconds: 0, total: 86400 });
        } else {
          const totalSeconds = Math.floor(diffMs / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          setTimeRemaining({ hours, minutes, seconds, total: totalSeconds });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [investment.nextPayout]);

  const getProgressPercentage = () => {
    if (!investment.nextPayout) return 0;
    const total = 24 * 3600;
    const remaining = timeRemaining.total;
    return ((total - remaining) / total) * 100;
  };

  return (
    <div className={`rounded-xl border overflow-hidden ${
      darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
    }`}>
      {/* Card Header */}
      <div 
        className="p-3 flex items-center justify-between cursor-pointer active:bg-black/10"
        onClick={onToggle}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className={`p-2 rounded-lg mr-3 ${
            darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
          }`}>
            <FaChartLine className="text-purple-500 text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm truncate">{investment.productName}</h4>
            <div className="flex items-center text-xs">
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                investment.status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {investment.status}
              </span>
              <span className="ml-2 opacity-75 text-[10px]">
                Day {investment.daysSincePurchase || 0}/30
              </span>
              {investment.isToday && (
                <span className="ml-2 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[8px]">
                  Today
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-2">
            <div className="text-xs opacity-75">Daily</div>
            <div className="text-sm font-bold text-green-500">
              {formatCurrency(investment.dailyEarning)}
            </div>
          </div>
          {isExpanded ? (
            <FaChevronUp className="opacity-50 text-xs" />
          ) : (
            <FaChevronDown className="opacity-50 text-xs" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-3 pt-0 border-t border-gray-600/30 mt-2">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
              <div className="text-[10px] opacity-75">Invested</div>
              <div className="text-xs font-bold text-blue-500">
                {formatCurrency(investment.purchasePrice)} FRW
              </div>
            </div>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
              <div className="text-[10px] opacity-75">Earned</div>
              <div className="text-xs font-bold text-yellow-500">
                {formatCurrency(investment.earningsSoFar || 0)} FRW
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] mb-1">
              <span>Progress</span>
              <span>{Math.round(investment.progress || 0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-600 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${investment.progress || 0}%` }}
              />
            </div>
          </div>

          {/* Timer and Dates */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center opacity-75">
                <FaClock className="mr-1 text-yellow-500 text-[10px]" />
                Next payout
              </span>
              <span className={`font-mono font-bold ${
                timeRemaining.total < 3600 ? 'text-yellow-500 animate-pulse' : ''
              }`}>
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center opacity-75">
                <FaCalendarAlt className="mr-1 text-blue-500 text-[10px]" />
                Started
              </span>
              <span>{new Date(investment.purchaseDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center opacity-75">
                <FaArrowUp className="mr-1 text-green-500 text-[10px]" />
                Total expected
              </span>
              <span className="font-bold text-purple-500">
                {formatCurrency(investment.totalExpectedEarnings)} FRW
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center opacity-75">
                <FaPercentage className="mr-1 text-pink-500 text-[10px]" />
                ROI
              </span>
              <span className="font-bold">{investment.roiPercentage}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center opacity-75">
                <FaArrowDown className="mr-1 text-red-500 text-[10px]" />
                Days left
              </span>
              <span className="font-bold">{investment.daysRemaining} days</span>
            </div>
          </div>

          {/* View Details Button */}
          <button
            type="button"
            className={`w-full mt-3 py-2 rounded-lg text-xs font-medium ${
              darkMode ? 'bg-purple-600/30 hover:bg-purple-600/50' : 'bg-purple-100 hover:bg-purple-200'
            } transition-colors`}
          >
            View Full Details
          </button>
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ darkMode, setShowInvestmentsModal }) => (
  <div className={`text-center py-8 sm:py-12 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
    <FaInfoCircle className="mx-auto text-3xl sm:text-4xl mb-3 opacity-50" />
    <p className="text-sm sm:text-base opacity-75 mb-4 px-4">
      You haven't invested in any products yet.
    </p>
    <button
      type="button"
      onClick={() => {
        setShowInvestmentsModal(false);
        setTimeout(() => {
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm ${
        darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
      } text-white font-bold`}
    >
      Browse Products
    </button>
  </div>
);

export default Header;