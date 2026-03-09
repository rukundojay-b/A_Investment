












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
// import Portfolio from '../Portfolio';

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
//   availableBalance,
//   notifications: propNotifications 
// }) => {
//   const navigate = useNavigate();
//   const [showPortfolio, setShowPortfolio] = useState(false);
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

//   const API_URL = 'http://localhost:5000/api';

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
      
//       const response = await axios.get(`${API_URL}/notifications`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const userNotifications = response.data.notifications || [];
//         setNotifications(userNotifications);
//         setUnreadCount(response.data.unreadCount || 0);
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
      
//       await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
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
      
//       await axios.put(`${API_URL}/notifications/read-all`, {}, {
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

//   // Use notifications from props if available
//   useEffect(() => {
//     if (propNotifications && propNotifications.length > 0) {
//       setNotifications(propNotifications);
//       setUnreadCount(propNotifications.filter(n => !n.read).length);
//     }
//   }, [propNotifications]);

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
      
//       const response = await axios.get(`${API_URL}/user/active-investments`, {
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

//   const handleMyInvestmentsClick = () => {
//     setShowPortfolio(true);
//   };

//   // Handle menu button click - this controls the sidebar on mobile
//   const handleMenuClick = () => {
//     setShowSidebar(!showSidebar);
//     // If opening sidebar on mobile, close any open modals
//     if (!showSidebar && isMobile) {
//       setShowNotifications(false);
//     }
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
//             {/* Menu Button - Only visible on mobile, controls sidebar */}
//             <button
//               type="button"
//               onClick={handleMenuClick}
//               className={`p-2 rounded-lg mr-2 flex-shrink-0 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} md:hidden`}
//               aria-label={showSidebar ? "Close menu" : "Open menu"}
//             >
//               {showSidebar ? <FaTimes size={18} /> : <FaBars size={18} />}
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
//             {/* MY PORTFOLIO BUTTON */}
//             <button
//               type="button"
//               onClick={handleMyInvestmentsClick}
//               className={`px-2 sm:px-3 py-2 rounded-lg flex items-center ${
//                 darkMode 
//                   ? 'bg-purple-600 hover:bg-purple-700 text-white' 
//                   : 'bg-purple-500 hover:bg-purple-600 text-white'
//               } transition-colors text-xs sm:text-sm`}
//               title="My Portfolio"
//             >
//               <FaChartLine className="mr-1" />
//               <span className="hidden xs:inline">Portfolio</span>
//               <span className="xs:hidden">PF</span>
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

//       {/* Portfolio Modal */}
//       {showPortfolio && (
//         <Portfolio
//           darkMode={darkMode}
//           user={user}
//           formatCurrency={formatCurrency}
//           onClose={() => setShowPortfolio(false)}
//         />
//       )}
//     </>
//   );
// };

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
import Portfolio from '../Portfolio';
import API_BASE_URL from '../../../config' // Correct import path from src/components/dashboard to root

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
  const [showPortfolio, setShowPortfolio] = useState(false);
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

  // Remove this line:
  // const API_URL = 'http://localhost:5000/api';

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
      
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
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
      
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
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
      
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
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
      
      const response = await axios.get(`${API_BASE_URL}/user/active-investments`, {
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

  const handleMyInvestmentsClick = () => {
    setShowPortfolio(true);
  };

  // Handle menu button click - this controls the sidebar on mobile
  const handleMenuClick = () => {
    setShowSidebar(!showSidebar);
    // If opening sidebar on mobile, close any open modals
    if (!showSidebar && isMobile) {
      setShowNotifications(false);
    }
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
            {/* Menu Button - Only visible on mobile, controls sidebar */}
            <button
              type="button"
              onClick={handleMenuClick}
              className={`p-2 rounded-lg mr-2 flex-shrink-0 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} md:hidden`}
              aria-label={showSidebar ? "Close menu" : "Open menu"}
            >
              {showSidebar ? <FaTimes size={18} /> : <FaBars size={18} />}
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
            {/* MY PORTFOLIO BUTTON */}
            <button
              type="button"
              onClick={handleMyInvestmentsClick}
              className={`px-2 sm:px-3 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              } transition-colors text-xs sm:text-sm`}
              title="My Portfolio"
            >
              <FaChartLine className="mr-1" />
              <span className="hidden xs:inline">Portfolio</span>
              <span className="xs:hidden">PF</span>
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

      {/* Portfolio Modal */}
      {showPortfolio && (
        <Portfolio
          darkMode={darkMode}
          user={user}
          formatCurrency={formatCurrency}
          onClose={() => setShowPortfolio(false)}
        />
      )}
    </>
  );
};

export default Header;