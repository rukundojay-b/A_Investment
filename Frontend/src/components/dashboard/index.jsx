









// // src/components/dashboard/index.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FaExclamationCircle, FaDatabase, FaSync, FaShoppingCart,
//   FaHistory
// } from 'react-icons/fa';
// import axios from 'axios';

// // Import all dashboard components
// import Sidebar from './Sidebar';
// import Header from './Header';
// import Footer from './Footer';
// import TransactionSummary from './TransactionSummary';
// import ProductsCarousel from './ProductsCarousel';
// import ReferralCard from './ReferralCard';
// import Chatbot from './Chatbot';
// import ChatbotFAB from './ChatbotFAB'; // Import the new ChatbotFAB component
// import DataStatus from './DataStatus';
// import TransactionModal from '../TransactionModal';

// const API_URL = 'http://localhost:5000/api';
// const FRONTEND_URL = window.location.origin; // This will be http://localhost:5173

// const InvestmentDashboard = ({ darkMode, toggleDarkMode, onLogout }) => {
//   const navigate = useNavigate();
//   const chatEndRef = useRef(null);
  
//   // State declarations
//   const [user, setUser] = useState(null);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCopySuccess, setShowCopySuccess] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);
//   const [chatMessage, setChatMessage] = useState('');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [dataSource, setDataSource] = useState('loading');
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [chatMessages, setChatMessages] = useState([
//     { id: 1, sender: 'bot', message: 'Welcome! How can I help you?', time: 'Just now' },
//     { id: 2, sender: 'bot', message: 'You can ask about investments, payments, or other services.', time: 'Just now' }
//   ]);
//   const [notifications, setNotifications] = useState([]);
  
//   // Transaction modal states
//   const [showTransactionModal, setShowTransactionModal] = useState(false);
//   const [transactionType, setTransactionType] = useState('deposit');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Helper function to ensure user has all required fields
//   const ensureUserFields = (userData) => {
//     if (!userData) return null;
    
//     // Use FRONTEND_URL for referral links
//     const referralLink = `${FRONTEND_URL}/signup?ref=${userData.referralCode || 'APEX000'}`;
    
//     return {
//       _id: userData._id || '',
//       izina_ryogukoresha: userData.izina_ryogukoresha || 'User',
//       nimero_yatelefone: userData.nimero_yatelefone || 'No phone',
//       email: userData.email || '',
//       imyaka: userData.imyaka || 0,
//       igitsina: userData.igitsina || '',
//       referralCode: userData.referralCode || 'APEX000',
//       referralLink: referralLink,
      
//       wallets: {
//         main: userData.wallets?.main || 0,
//         earning: userData.wallets?.earning || 0,
//         reserved: userData.wallets?.reserved || 0
//       },
      
//       stats: {
//         totalReferrals: userData.stats?.totalReferrals || 0,
//         totalEarned: userData.stats?.totalEarned || 0,
//         totalSpent: userData.stats?.totalSpent || 0,
//         totalInvestments: userData.stats?.totalInvestments || 0,
//         totalWithdrawn: userData.stats?.totalWithdrawn || 0,
//         referralEarnings: userData.stats?.referralEarnings || 0,
//         totalDeposits: userData.stats?.totalDeposits || 0,
//         pendingDeposits: userData.stats?.pendingDeposits || 0,
//         pendingWithdrawals: userData.stats?.pendingWithdrawals || 0,
//         dailyEarnings: userData.stats?.dailyEarnings || 0
//       },
      
//       activeInvestments: userData.activeInvestments || [],
//       transactions: userData.transactions || [],
//       notifications: userData.notifications || [],
//       status: userData.status || 'active',
//       createdAt: userData.createdAt || new Date(),
//       totalDailyProfit: userData.totalDailyProfit || 0,
//       activeInvestmentsCount: userData.activeInvestmentsCount || 0
//     };
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Use sessionStorage (not localStorage)
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         setError('No authentication token found. Please login again.');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(`${API_URL}/user/dashboard`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const safeUserData = ensureUserFields(response.data);
        
//         if (safeUserData) {
//           setDashboardData(safeUserData);
//           setUser(safeUserData);
//           setDataSource('database');
          
//           // Update sessionStorage (not localStorage)
//           sessionStorage.setItem('user', JSON.stringify(safeUserData));
          
//           if (safeUserData.notifications && safeUserData.notifications.length > 0) {
//             setNotifications(safeUserData.notifications.map(notif => ({
//               id: notif._id || Date.now(),
//               type: 'info',
//               message: notif.message,
//               time: formatTime(notif.createdAt || new Date()),
//               read: false
//             })));
//           }
//         } else {
//           throw new Error('Invalid user data received from server');
//         }
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (error) {
//       console.error('❌ Error fetching dashboard data:', error.response?.data || error.message);
      
//       if (error.response?.status === 401) {
//         setError('Session expired. Please login again.');
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('user');
//         navigate('/login');
//         return;
//       }
      
//       // Try to use saved user data from sessionStorage
//       const savedUser = sessionStorage.getItem('user');
//       if (savedUser) {
//         try {
//           const userData = JSON.parse(savedUser);
//           const safeUserData = ensureUserFields(userData);
//           setUser(safeUserData);
//           setDashboardData(safeUserData);
//           setDataSource('sessionstorage');
//         } catch (e) {
//           setDataSource('error');
//           setError('Failed to load user data. Please login again.');
//         }
//       } else {
//         setDataSource('error');
//         setError('Failed to load dashboard data. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const formatTime = (dateString) => {
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

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-RW').format(amount || 0);
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchDashboardData();
//   };

//   const handleCopyReferralLink = () => {
//     const referralCode = user?.referralCode || 'APEX000';
//     const link = `${FRONTEND_URL}/signup?ref=${referralCode}`;
    
//     navigator.clipboard.writeText(link).then(() => {
//       setShowCopySuccess(true);
//       setTimeout(() => setShowCopySuccess(false), 3000);
//     }).catch(err => {
//       const textArea = document.createElement('textarea');
//       textArea.value = link;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setShowCopySuccess(true);
//       setTimeout(() => setShowCopySuccess(false), 3000);
//     });
//   };

//   const handleShare = async () => {
//     const referralCode = user?.referralCode || 'APEX000';
//     const shareUrl = `${FRONTEND_URL}/signup?ref=${referralCode}`;
    
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: 'Join Apex Invest',
//           text: 'Join Apex Invest and start earning daily!',
//           url: shareUrl,
//         });
//       } catch (error) {
//         console.log('Sharing failed:', error);
//       }
//     } else {
//       handleCopyReferralLink();
//       alert('Link copied to clipboard!');
//     }
//   };

//   const handleQuickAction = (action) => {
//     const actions = {
//       deposit: () => {
//         setTransactionType('deposit');
//         setShowTransactionModal(true);
//       },
//       withdraw: () => {
//         setTransactionType('withdraw');
//         setShowTransactionModal(true);
//       },
//       invest: () => {
//         document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
//       }
//     };
    
//     if (actions[action]) {
//       actions[action]();
//     }
//   };

//   const handleTransferEarnings = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       const earningBalance = user?.wallets?.earning || 0;
      
//       if (!token) {
//         alert('Please login first');
//         return;
//       }

//       if (earningBalance <= 0) {
//         alert('❌ Nta mafaranga uri earning wallet!');
//         return;
//       }
//       const response = await axios.post(`${API_URL}/user/transfer-earnings`, {
//         amount: earningBalance
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         alert(`✅ ${response.data.message}`);
//         fetchDashboardData();
//       }
//     } catch (error) {
//       console.error('Transfer error:', error.response?.data || error.message);
//       alert('Transfer failed. Please try again.');
//     }
//   };

//   const handlePurchase = async (productId, productName, price) => {
//     try {
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         alert('Please login first');
//         navigate('/login');
//         return;
//       }

//       const availableBalance = (user?.wallets?.main || 0) - (user?.wallets?.reserved || 0);
//       if (availableBalance < price) {
//         alert(`❌ Nta mafaranga ahagije! Wukeneye ${price - availableBalance} FRW byongeye kugirango ukomeze.`);
//         return;
//       }

//       const response = await axios.post(`${API_URL}/user/purchase`, {
//         productId: productId,
//         productName: productName,
//         amount: price
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         alert(`✅ Igikorwa cyakozwe neza! ${response.data.message}`);
//         fetchDashboardData();
//       }
//     } catch (error) {
//       console.error('❌ Purchase error:', error.response?.data || error.message);
//       alert('Igikorwa ntabwo cyakozwe. Ongera ugerageze.');
//     }
//   };

//   const sendChatMessage = () => {
//     if (!chatMessage.trim()) return;

//     const newMessage = {
//       id: chatMessages.length + 1,
//       sender: 'user',
//       message: chatMessage,
//       time: 'Just now'
//     };

//     setChatMessages([...chatMessages, newMessage]);
//     setChatMessage('');

//     setTimeout(() => {
//       const botResponses = [
//         "I'm checking on that, I'll respond soon!",
//         "I've forwarded your question to our support team!",
//         "I'm working on your request!",
//         "Your question has been sent to our specialists!"
//       ];
      
//       const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
//       const botMessage = {
//         id: chatMessages.length + 2,
//         sender: 'bot',
//         message: randomResponse,
//         time: 'Just now'
//       };

//       setChatMessages(prev => [...prev, botMessage]);
//     }, 1000);
//   };

//   const totalDailyProfit = React.useMemo(() => {
//     if (!user || !user.activeInvestments) return 0;
//     return (user.activeInvestments || []).reduce((sum, investment) => {
//       return sum + (investment.dailyProfit || 0);
//     }, 0);
//   }, [user]);

//   const availableBalance = (user?.wallets?.main || 0) - (user?.wallets?.reserved || 0);
//   const earningBalance = user?.wallets?.earning || 0;

//   // Loading State
//   if (loading && !user) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (error && !user) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center max-w-md">
//           <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
//           <h3 className="text-xl font-bold mb-2">Connection Error</h3>
//           <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
//           <div className="space-y-3">
//             <button
//               onClick={fetchDashboardData}
//               className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white w-full`}
//             >
//               Retry Connection
//             </button>
//             <button
//               onClick={() => navigate('/login')}
//               className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white w-full`}
//             >
//               Login Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Sidebar */}
//       <Sidebar 
//         darkMode={darkMode}
//         showSidebar={showSidebar}
//         setShowSidebar={setShowSidebar}
//         user={user}
//         refreshing={refreshing}
//         handleRefresh={handleRefresh}
//         handleQuickAction={handleQuickAction}
//         handleTransferEarnings={handleTransferEarnings}
//         navigate={navigate}
//         dataSource={dataSource}
//         formatCurrency={formatCurrency}
//         availableBalance={availableBalance}
//         earningBalance={earningBalance}
//         totalDailyProfit={totalDailyProfit}
//         notifications={notifications}
//       />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <Header 
//           darkMode={darkMode}
//           user={user}
//           showSidebar={showSidebar}
//           setShowSidebar={setShowSidebar}
//           setShowChatbot={setShowChatbot}
//           toggleDarkMode={toggleDarkMode}
//           onLogout={onLogout}
//           dataSource={dataSource}
//           formatCurrency={formatCurrency}
//           availableBalance={availableBalance}
//         />

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto px-4 py-6">
//           {/* Welcome Banner */}
//           <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}>
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold mb-2">
//                   Welcome back, <span className="text-blue-500">{user.izina_ryogukoresha || 'User'}</span>! 👋
//                 </h1>
//                 <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   Your investment journey continues. Start earning today!
//                 </p>
//                 <div className="flex flex-wrap items-center gap-4 mt-2">
//                   <div className="flex items-center">
//                     <FaExclamationCircle className="mr-2 text-blue-500" />
//                     <span>{user.nimero_yatelefone || 'No phone'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaHistory className="mr-2 text-green-500" />
//                     <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className={`mt-4 md:mt-0 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                 <div className="text-center">
//                   <div className="text-sm opacity-75">Available Balance</div>
//                   <div className="text-2xl font-bold text-green-500">{formatCurrency(availableBalance)} FRW</div>
//                   <div className="text-xs mt-1">Ready for investment</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Products Section */}
//           <div id="products-section" className="mb-8">
//             <div className="mb-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold flex items-center">
//                   <FaShoppingCart className="mr-2 text-green-500" />
//                   Investment Products
//                 </h2>
//                 <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
//                   25% Daily Return
//                 </span>
//               </div>
//               <p className="opacity-75">Choose from our investment packages</p>
//             </div>
//             <ProductsCarousel 
//               darkMode={darkMode} 
//               user={user}
//               onPurchase={handlePurchase}
//               currentSlide={currentSlide}
//               setCurrentSlide={setCurrentSlide}
//               formatCurrency={formatCurrency}
//             />
//           </div>

//           {/* Referral Card */}
//           <ReferralCard 
//             darkMode={darkMode}
//             user={user}
//             showCopySuccess={showCopySuccess}
//             handleCopyReferralLink={handleCopyReferralLink}
//             handleShare={handleShare}
//           />

//           {/* Transaction Summary Section */}
//           <div className="mb-8">
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold flex items-center">
//                 <FaHistory className="mr-2 text-blue-500" />
//                 Transaction Summary
//               </h2>
//               <p className="opacity-75">Your financial activity overview</p>
//             </div>
//             <TransactionSummary 
//               darkMode={darkMode}
//               user={user}
//               formatCurrency={formatCurrency}
//             />
//           </div>

//           {/* Data Status */}
//           <DataStatus 
//             darkMode={darkMode}
//             dataSource={dataSource}
//             user={user}
//             onRefresh={handleRefresh}
//             refreshing={refreshing}
//           />

//           {/* Footer */}
//           <Footer />
//         </main>
//       </div>

//       {/* Chatbot FAB - Floating Action Button for mobile */}
//       <ChatbotFAB 
//         darkMode={darkMode} 
//         setShowChatbot={setShowChatbot} 
//       />

//       {/* Chatbot Modal */}
//       <Chatbot 
//         darkMode={darkMode}
//         showChatbot={showChatbot}
//         setShowChatbot={setShowChatbot}
//         chatMessages={chatMessages}
//         chatMessage={chatMessage}
//         setChatMessage={setChatMessage}
//         sendChatMessage={sendChatMessage}
//         chatEndRef={chatEndRef}
//       />

//       {/* Transaction Modal */}
//       <TransactionModal 
//         darkMode={darkMode}
//         isOpen={showTransactionModal}
//         onClose={() => setShowTransactionModal(false)}
//         type={transactionType}
//         user={user}
//         onSuccess={fetchDashboardData}
//       />
//     </div>
//   );
// };

// export default InvestmentDashboard;














// // src/components/dashboard/index.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FaExclamationCircle, FaDatabase, FaSync, FaShoppingCart,
//   FaHistory
// } from 'react-icons/fa';
// import axios from 'axios';

// // Import all dashboard components
// import Sidebar from './Sidebar';
// import Header from './Header';
// import Footer from './Footer';
// import TransactionSummary from './TransactionSummary';
// import ProductsCarousel from './ProductsCarousel';
// import ReferralCard from './ReferralCard';
// import Chatbot from './Chatbot';
// import ChatbotFAB from './ChatbotFAB';
// import DataStatus from './DataStatus';
// import TransactionModal from '../TransactionModal';

// const API_URL = 'http://localhost:5000/api';
// const FRONTEND_URL = window.location.origin;

// const InvestmentDashboard = ({ darkMode, toggleDarkMode, onLogout }) => {
//   const navigate = useNavigate();
//   const chatEndRef = useRef(null);
  
//   // State declarations
//   const [user, setUser] = useState(null);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCopySuccess, setShowCopySuccess] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);
//   const [chatMessage, setChatMessage] = useState('');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [dataSource, setDataSource] = useState('loading');
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [chatMessages, setChatMessages] = useState([
//     { id: 1, sender: 'bot', message: 'Welcome! How can I help you?', time: 'Just now' },
//     { id: 2, sender: 'bot', message: 'You can ask about investments, payments, or other services.', time: 'Just now' }
//   ]);
//   const [notifications, setNotifications] = useState([]);
  
//   // Transaction modal states
//   const [showTransactionModal, setShowTransactionModal] = useState(false);
//   const [transactionType, setTransactionType] = useState('deposit');

//   useEffect(() => {
//     // Verify token on component mount
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
    
//     // Decode token to see who it belongs to
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       console.log('🔍 Current token belongs to:', payload.username, 'ID:', payload.userId);
//     } catch (e) {
//       console.error('Invalid token');
//     }
    
//     fetchDashboardData();
//   }, []);

//   // Helper function to ensure user has all required fields
//   const ensureUserFields = (userData) => {
//     if (!userData) return null;
    
//     const referralLink = `${FRONTEND_URL}/signup?ref=${userData.referralCode || 'APEX000'}`;
    
//     return {
//       _id: userData._id || '',
//       izina_ryogukoresha: userData.izina_ryogukoresha || 'User',
//       nimero_yatelefone: userData.nimero_yatelefone || 'No phone',
//       email: userData.email || '',
//       imyaka: userData.imyaka || 0,
//       igitsina: userData.igitsina || '',
//       referralCode: userData.referralCode || 'APEX000',
//       referralLink: referralLink,
      
//       wallets: {
//         main: userData.wallets?.main || 0,
//         earning: userData.wallets?.earning || 0,
//         reserved: userData.wallets?.reserved || 0
//       },
      
//       stats: {
//         totalReferrals: userData.stats?.totalReferrals || 0,
//         totalEarned: userData.stats?.totalEarned || 0,
//         totalSpent: userData.stats?.totalSpent || 0,
//         totalInvestments: userData.stats?.totalInvestments || 0,
//         totalWithdrawn: userData.stats?.totalWithdrawn || 0,
//         referralEarnings: userData.stats?.referralEarnings || 0,
//         totalDeposits: userData.stats?.totalDeposits || 0,
//         pendingDeposits: userData.stats?.pendingDeposits || 0,
//         pendingWithdrawals: userData.stats?.pendingWithdrawals || 0,
//         dailyEarnings: userData.stats?.dailyEarnings || 0
//       },
      
//       activeInvestments: userData.activeInvestments || [],
//       transactions: userData.transactions || [],
//       notifications: userData.notifications || [],
//       status: userData.status || 'active',
//       createdAt: userData.createdAt || new Date(),
//       totalDailyProfit: userData.totalDailyProfit || 0,
//       activeInvestmentsCount: userData.activeInvestmentsCount || 0
//     };
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         setError('No authentication token found. Please login again.');
//         navigate('/login');
//         return;
//       }

//       // ✅ FIX: Decode token to verify which user we should be
//       let tokenUserId = null;
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         tokenUserId = payload.userId;
//         console.log('🔐 Token user ID:', tokenUserId);
//       } catch (e) {
//         console.error('Could not decode token');
//       }

//       const response = await axios.get(`${API_URL}/user/dashboard`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const safeUserData = ensureUserFields(response.data);
        
//         if (safeUserData) {
//           // ✅ FIX: Verify that the user from API matches token
//           if (tokenUserId && safeUserData._id !== tokenUserId) {
//             console.error('❌ USER MISMATCH! Token user:', tokenUserId, 'API user:', safeUserData._id);
//             setError('Session inconsistency detected. Please login again.');
//             sessionStorage.removeItem('token');
//             navigate('/login');
//             return;
//           }
          
//           setDashboardData(safeUserData);
//           setUser(safeUserData);
//           setDataSource('database');
          
//           // ✅ FIX: DON'T store user data in sessionStorage
//           // sessionStorage.setItem('user', JSON.stringify(safeUserData)); // ← REMOVED
          
//           if (safeUserData.notifications && safeUserData.notifications.length > 0) {
//             setNotifications(safeUserData.notifications.map(notif => ({
//               id: notif._id || Date.now(),
//               type: 'info',
//               message: notif.message,
//               time: formatTime(notif.createdAt || new Date()),
//               read: false
//             })));
//           }
//         } else {
//           throw new Error('Invalid user data received from server');
//         }
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (error) {
//       console.error('❌ Error fetching dashboard data:', error.response?.data || error.message);
      
//       if (error.response?.status === 401) {
//         setError('Session expired. Please login again.');
//         sessionStorage.removeItem('token');
//         navigate('/login');
//         return;
//       }
      
//       // ✅ FIX: Don't use cached user data
//       setDataSource('error');
//       setError('Failed to load dashboard data. Please try again.');
      
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const formatTime = (dateString) => {
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

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-RW').format(amount || 0);
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchDashboardData();
//   };

//   const handleCopyReferralLink = () => {
//     const referralCode = user?.referralCode || 'APEX000';
//     const link = `${FRONTEND_URL}/signup?ref=${referralCode}`;
    
//     navigator.clipboard.writeText(link).then(() => {
//       setShowCopySuccess(true);
//       setTimeout(() => setShowCopySuccess(false), 3000);
//     }).catch(err => {
//       const textArea = document.createElement('textarea');
//       textArea.value = link;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setShowCopySuccess(true);
//       setTimeout(() => setShowCopySuccess(false), 3000);
//     });
//   };

//   const handleShare = async () => {
//     const referralCode = user?.referralCode || 'APEX000';
//     const shareUrl = `${FRONTEND_URL}/signup?ref=${referralCode}`;
    
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: 'Join Apex Invest',
//           text: 'Join Apex Invest and start earning daily!',
//           url: shareUrl,
//         });
//       } catch (error) {
//         console.log('Sharing failed:', error);
//       }
//     } else {
//       handleCopyReferralLink();
//       alert('Link copied to clipboard!');
//     }
//   };

//   const handleQuickAction = (action) => {
//     const actions = {
//       deposit: () => {
//         setTransactionType('deposit');
//         setShowTransactionModal(true);
//       },
//       withdraw: () => {
//         setTransactionType('withdraw');
//         setShowTransactionModal(true);
//       },
//       invest: () => {
//         document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
//       }
//     };
    
//     if (actions[action]) {
//       actions[action]();
//     }
//   };

//   const handleTransferEarnings = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       const earningBalance = user?.wallets?.earning || 0;
      
//       if (!token) {
//         alert('Please login first');
//         return;
//       }

//       if (earningBalance <= 0) {
//         alert('❌ Nta mafaranga uri earning wallet!');
//         return;
//       }
//       const response = await axios.post(`${API_URL}/user/transfer-earnings`, {
//         amount: earningBalance
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         alert(`✅ ${response.data.message}`);
//         fetchDashboardData();
//       }
//     } catch (error) {
//       console.error('Transfer error:', error.response?.data || error.message);
//       alert('Transfer failed. Please try again.');
//     }
//   };

//   const handlePurchase = async (productId, productName, price) => {
//     try {
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         alert('Please login first');
//         navigate('/login');
//         return;
//       }

//       const availableBalance = (user?.wallets?.main || 0) - (user?.wallets?.reserved || 0);
//       if (availableBalance < price) {
//         alert(`❌ Nta mafaranga ahagije! Wukeneye ${price - availableBalance} FRW byongeye kugirango ukomeze.`);
//         return;
//       }

//       const response = await axios.post(`${API_URL}/user/purchase`, {
//         productId: productId,
//         productName: productName,
//         amount: price
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         alert(`✅ Igikorwa cyakozwe neza! ${response.data.message}`);
//         fetchDashboardData();
//       }
//     } catch (error) {
//       console.error('❌ Purchase error:', error.response?.data || error.message);
//       alert('Igikorwa ntabwo cyakozwe. Ongera ugerageze.');
//     }
//   };

//   const sendChatMessage = () => {
//     if (!chatMessage.trim()) return;

//     const newMessage = {
//       id: chatMessages.length + 1,
//       sender: 'user',
//       message: chatMessage,
//       time: 'Just now'
//     };

//     setChatMessages([...chatMessages, newMessage]);
//     setChatMessage('');

//     setTimeout(() => {
//       const botResponses = [
//         "I'm checking on that, I'll respond soon!",
//         "I've forwarded your question to our support team!",
//         "I'm working on your request!",
//         "Your question has been sent to our specialists!"
//       ];
      
//       const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
//       const botMessage = {
//         id: chatMessages.length + 2,
//         sender: 'bot',
//         message: randomResponse,
//         time: 'Just now'
//       };

//       setChatMessages(prev => [...prev, botMessage]);
//     }, 1000);
//   };

//   const totalDailyProfit = React.useMemo(() => {
//     if (!user || !user.activeInvestments) return 0;
//     return (user.activeInvestments || []).reduce((sum, investment) => {
//       return sum + (investment.dailyProfit || 0);
//     }, 0);
//   }, [user]);

//   const availableBalance = (user?.wallets?.main || 0) - (user?.wallets?.reserved || 0);
//   const earningBalance = user?.wallets?.earning || 0;

//   // Loading State
//   if (loading && !user) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (error && !user) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center max-w-md">
//           <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
//           <h3 className="text-xl font-bold mb-2">Connection Error</h3>
//           <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
//           <div className="space-y-3">
//             <button
//               onClick={fetchDashboardData}
//               className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white w-full`}
//             >
//               Retry Connection
//             </button>
//             <button
//               onClick={() => navigate('/login')}
//               className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white w-full`}
//             >
//               Login Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Sidebar */}
//       <Sidebar 
//         darkMode={darkMode}
//         showSidebar={showSidebar}
//         setShowSidebar={setShowSidebar}
//         user={user}
//         refreshing={refreshing}
//         handleRefresh={handleRefresh}
//         handleQuickAction={handleQuickAction}
//         handleTransferEarnings={handleTransferEarnings}
//         navigate={navigate}
//         dataSource={dataSource}
//         formatCurrency={formatCurrency}
//         availableBalance={availableBalance}
//         earningBalance={earningBalance}
//         totalDailyProfit={totalDailyProfit}
//         notifications={notifications}
//       />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <Header 
//           darkMode={darkMode}
//           user={user}
//           showSidebar={showSidebar}
//           setShowSidebar={setShowSidebar}
//           setShowChatbot={setShowChatbot}
//           toggleDarkMode={toggleDarkMode}
//           onLogout={onLogout}
//           dataSource={dataSource}
//           formatCurrency={formatCurrency}
//           availableBalance={availableBalance}
//         />

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto px-4 py-6">
//           {/* Welcome Banner */}
//           <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}>
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold mb-2">
//                   Welcome back, <span className="text-blue-500">{user.izina_ryogukoresha || 'User'}</span>! 👋
//                 </h1>
//                 <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   Your investment journey continues. Start earning today!
//                 </p>
//                 <div className="flex flex-wrap items-center gap-4 mt-2">
//                   <div className="flex items-center">
//                     <FaExclamationCircle className="mr-2 text-blue-500" />
//                     <span>{user.nimero_yatelefone || 'No phone'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaHistory className="mr-2 text-green-500" />
//                     <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className={`mt-4 md:mt-0 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                 <div className="text-center">
//                   <div className="text-sm opacity-75">Available Balance</div>
//                   <div className="text-2xl font-bold text-green-500">{formatCurrency(availableBalance)} FRW</div>
//                   <div className="text-xs mt-1">Ready for investment</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Products Section */}
//           <div id="products-section" className="mb-8">
//             <div className="mb-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold flex items-center">
//                   <FaShoppingCart className="mr-2 text-green-500" />
//                   Investment Products
//                 </h2>
//                 <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
//                   25% Daily Return
//                 </span>
//               </div>
//               <p className="opacity-75">Choose from our investment packages</p>
//             </div>
//             <ProductsCarousel 
//               darkMode={darkMode} 
//               user={user}
//               onPurchase={handlePurchase}
//               currentSlide={currentSlide}
//               setCurrentSlide={setCurrentSlide}
//               formatCurrency={formatCurrency}
//             />
//           </div>

//           {/* Referral Card */}
//           <ReferralCard 
//             darkMode={darkMode}
//             user={user}
//             showCopySuccess={showCopySuccess}
//             handleCopyReferralLink={handleCopyReferralLink}
//             handleShare={handleShare}
//           />

//           {/* Transaction Summary Section */}
//           <div className="mb-8">
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold flex items-center">
//                 <FaHistory className="mr-2 text-blue-500" />
//                 Transaction Summary
//               </h2>
//               <p className="opacity-75">Your financial activity overview</p>
//             </div>
//             <TransactionSummary 
//               darkMode={darkMode}
//               user={user}
//               formatCurrency={formatCurrency}
//             />
//           </div>

//           {/* Data Status */}
//           <DataStatus 
//             darkMode={darkMode}
//             dataSource={dataSource}
//             user={user}
//             onRefresh={handleRefresh}
//             refreshing={refreshing}
//           />

//           {/* Footer */}
//           <Footer />
//         </main>
//       </div>

//       {/* Chatbot FAB */}
//       <ChatbotFAB 
//         darkMode={darkMode} 
//         setShowChatbot={setShowChatbot} 
//       />

//       {/* Chatbot Modal */}
//       <Chatbot 
//         darkMode={darkMode}
//         showChatbot={showChatbot}
//         setShowChatbot={setShowChatbot}
//         chatMessages={chatMessages}
//         chatMessage={chatMessage}
//         setChatMessage={setChatMessage}
//         sendChatMessage={sendChatMessage}
//         chatEndRef={chatEndRef}
//       />

//       {/* Transaction Modal */}
//       <TransactionModal 
//         darkMode={darkMode}
//         isOpen={showTransactionModal}
//         onClose={() => setShowTransactionModal(false)}
//         type={transactionType}
//         user={user}
//         onSuccess={fetchDashboardData}
//       />
//     </div>
//   );
// };

// export default InvestmentDashboard;
















// src/components/dashboard/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaExclamationCircle, FaDatabase, FaSync, FaShoppingCart,
  FaHistory, FaArrowDown, FaArrowUp, FaCoins, FaClock
} from 'react-icons/fa';
import axios from 'axios';

// Import all dashboard components
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import TransactionSummary from './TransactionSummary';
import ProductsCarousel from './ProductsCarousel';
import ReferralCard from './ReferralCard';
import Chatbot from './Chatbot';
import ChatbotFAB from './ChatbotFAB';
import DataStatus from './DataStatus';
import TransactionModal from '../TransactionModal';

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = window.location.origin;

const InvestmentDashboard = ({ darkMode, toggleDarkMode, onLogout }) => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  // State declarations
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState('loading');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', message: 'Welcome! How can I help you?', time: 'Just now' },
    { id: 2, sender: 'bot', message: 'You can ask about investments, payments, or other services.', time: 'Just now' }
  ]);
  const [notifications, setNotifications] = useState([]);
  
  // Transaction modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');

  useEffect(() => {
    // Verify token on component mount
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Decode token to see who it belongs to
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Current token belongs to:', payload.username, 'ID:', payload.userId);
    } catch (e) {
      console.error('Invalid token');
    }
    
    fetchDashboardData();
  }, []);

  // Helper function to ensure user has all required fields
  const ensureUserFields = (userData) => {
    if (!userData) return null;
    
    const referralLink = `${FRONTEND_URL}/signup?ref=${userData.referralCode || 'APEX000'}`;
    
    return {
      _id: userData._id || '',
      izina_ryogukoresha: userData.izina_ryogukoresha || 'User',
      nimero_yatelefone: userData.nimero_yatelefone || 'No phone',
      email: userData.email || '',
      imyaka: userData.imyaka || 0,
      igitsina: userData.igitsina || '',
      referralCode: userData.referralCode || 'APEX000',
      referralLink: referralLink,
      
      wallets: {
        main: userData.wallets?.main || 0,
        earning: userData.wallets?.earning || 0,
        reserved: userData.wallets?.reserved || 0
      },
      
      stats: {
        totalReferrals: userData.stats?.totalReferrals || 0,
        totalEarned: userData.stats?.totalEarned || 0,
        totalSpent: userData.stats?.totalSpent || 0,
        totalInvestments: userData.stats?.totalInvestments || 0,
        totalWithdrawn: userData.stats?.totalWithdrawn || 0,
        referralEarnings: userData.stats?.referralEarnings || 0,
        totalDeposits: userData.stats?.totalDeposits || 0,
        pendingDeposits: userData.stats?.pendingDeposits || 0,
        pendingWithdrawals: userData.stats?.pendingWithdrawals || 0,
        dailyEarnings: userData.stats?.dailyEarnings || 0
      },
      
      activeInvestments: userData.activeInvestments || [],
      transactions: userData.transactions || [],
      notifications: userData.notifications || [],
      status: userData.status || 'active',
      createdAt: userData.createdAt || new Date(),
      totalDailyProfit: userData.totalDailyProfit || 0,
      activeInvestmentsCount: userData.activeInvestmentsCount || 0
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      // Decode token to verify which user we should be
      let tokenUserId = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        tokenUserId = payload.userId;
        console.log('🔐 Token user ID:', tokenUserId);
      } catch (e) {
        console.error('Could not decode token');
      }

      const response = await axios.get(`${API_URL}/user/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const safeUserData = ensureUserFields(response.data);
        
        if (safeUserData) {
          // Verify that the user from API matches token
          if (tokenUserId && safeUserData._id !== tokenUserId) {
            console.error('❌ USER MISMATCH! Token user:', tokenUserId, 'API user:', safeUserData._id);
            setError('Session inconsistency detected. Please login again.');
            sessionStorage.removeItem('token');
            navigate('/login');
            return;
          }
          
          setDashboardData(safeUserData);
          setUser(safeUserData);
          setDataSource('database');
          
          // DON'T store user data in sessionStorage
          // sessionStorage.setItem('user', JSON.stringify(safeUserData)); // ← REMOVED
          
          if (safeUserData.notifications && safeUserData.notifications.length > 0) {
            setNotifications(safeUserData.notifications.map(notif => ({
              id: notif._id || Date.now(),
              type: 'info',
              message: notif.message,
              time: formatTime(notif.createdAt || new Date()),
              read: false
            })));
          }
        } else {
          throw new Error('Invalid user data received from server');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      // Don't use cached user data
      setDataSource('error');
      setError('Failed to load dashboard data. Please try again.');
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (dateString) => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW').format(amount || 0);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleCopyReferralLink = () => {
    const referralCode = user?.referralCode || 'APEX000';
    const link = `${FRONTEND_URL}/signup?ref=${referralCode}`;
    
    navigator.clipboard.writeText(link).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    }).catch(err => {
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    });
  };

  const handleShare = async () => {
    const referralCode = user?.referralCode || 'APEX000';
    const shareUrl = `${FRONTEND_URL}/signup?ref=${referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Apex Invest',
          text: 'Join Apex Invest and start earning daily!',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      handleCopyReferralLink();
      alert('Link copied to clipboard!');
    }
  };

  const handleQuickAction = (action) => {
    const actions = {
      deposit: () => {
        setTransactionType('deposit');
        setShowTransactionModal(true);
      },
      withdraw: () => {
        setTransactionType('withdraw');
        setShowTransactionModal(true);
      },
      invest: () => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    if (actions[action]) {
      actions[action]();
    }
  };

  const handleTransferEarnings = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const earningBalance = user?.wallets?.earning || 0;
      
      if (!token) {
        alert('Please login first');
        return;
      }

      if (earningBalance <= 0) {
        alert('❌ Nta mafaranga uri earning wallet!');
        return;
      }
      const response = await axios.post(`${API_URL}/user/transfer-earnings`, {
        amount: earningBalance
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Transfer error:', error.response?.data || error.message);
      alert('Transfer failed. Please try again.');
    }
  };

  const handlePurchase = async (productId, productName, price) => {
    try {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const availableBalance = (user?.wallets?.main || 0) - (user?.wallets?.reserved || 0);
      if (availableBalance < price) {
        alert(`❌ Nta mafaranga ahagije! Wukeneye ${price - availableBalance} FRW byongeye kugirango ukomeze.`);
        return;
      }

      const response = await axios.post(`${API_URL}/user/purchase`, {
        productId: productId,
        productName: productName,
        amount: price
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(`✅ Igikorwa cyakozwe neza! ${response.data.message}`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('❌ Purchase error:', error.response?.data || error.message);
      alert('Igikorwa ntabwo cyakozwe. Ongera ugerageze.');
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: chatMessage,
      time: 'Just now'
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    setTimeout(() => {
      const botResponses = [
        "I'm checking on that, I'll respond soon!",
        "I've forwarded your question to our support team!",
        "I'm working on your request!",
        "Your question has been sent to our specialists!"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: chatMessages.length + 2,
        sender: 'bot',
        message: randomResponse,
        time: 'Just now'
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const totalDailyProfit = React.useMemo(() => {
    if (!user || !user.activeInvestments) return 0;
    return (user.activeInvestments || []).reduce((sum, investment) => {
      return sum + (investment.dailyProfit || 0);
    }, 0);
  }, [user]);

  const availableBalance = (user?.wallets?.main || 0) - (user?.wallets?.reserved || 0);
  const earningBalance = user?.wallets?.earning || 0;

  // Loading State
  if (loading && !user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md">
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Connection Error</h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchDashboardData}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white w-full`}
            >
              Retry Connection
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white w-full`}
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar 
        darkMode={darkMode}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        user={user}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        handleQuickAction={handleQuickAction}
        handleTransferEarnings={handleTransferEarnings}
        navigate={navigate}
        dataSource={dataSource}
        formatCurrency={formatCurrency}
        availableBalance={availableBalance}
        earningBalance={earningBalance}
        totalDailyProfit={totalDailyProfit}
        notifications={notifications}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          darkMode={darkMode}
          user={user}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          setShowChatbot={setShowChatbot}
          toggleDarkMode={toggleDarkMode}
          onLogout={onLogout}
          dataSource={dataSource}
          formatCurrency={formatCurrency}
          availableBalance={availableBalance}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          {/* Welcome Banner - Mobile Friendly */}
          <div className={`mb-6 p-4 sm:p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                  Welcome back, <span className="text-blue-500">{user.izina_ryogukoresha || 'User'}</span>! 👋
                </h1>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your investment journey continues. Start earning today!
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                  <div className="flex items-center text-sm">
                    <FaExclamationCircle className="mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{user.nimero_yatelefone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaHistory className="mr-2 text-green-500 flex-shrink-0" />
                    <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} self-start sm:self-center w-full sm:w-auto`}>
                <div className="text-center">
                  <div className="text-xs sm:text-sm opacity-75">Available Balance</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-500">{formatCurrency(user?.wallets?.main || 0)} FRW</div>
                  <div className="text-xs mt-1">Ready for investment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section - Mobile Friendly */}
          <div id="products-section" className="mb-8">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                  <FaShoppingCart className="mr-2 text-green-500" />
                  Investment Products
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm self-start ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
                  25% Daily Return
                </span>
              </div>
              <p className="text-sm opacity-75">Choose from our investment packages</p>
            </div>
            <ProductsCarousel 
              darkMode={darkMode} 
              user={user}
              onPurchase={handlePurchase}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Referral Card */}
          <ReferralCard 
            darkMode={darkMode}
            user={user}
            showCopySuccess={showCopySuccess}
            handleCopyReferralLink={handleCopyReferralLink}
            handleShare={handleShare}
          />

          {/* Transaction Summary Section - Mobile Friendly Cards */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                <FaHistory className="mr-2 text-blue-500" />
                Transaction Summary
              </h2>
              <p className="text-sm opacity-75">Your financial activity overview</p>
            </div>
            
            {/* Summary Cards Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Total Deposits Card */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FaArrowDown className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Total Deposits</span>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-500">
                  {formatCurrency(user?.stats?.totalDeposits || 0)} FRW
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Lifetime deposits
                </div>
              </div>

              {/* Total Withdrawals Card */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <FaArrowUp className="text-green-600 text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Total Withdrawals</span>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-500">
                  {formatCurrency(user?.stats?.totalWithdrawn || 0)} FRW
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Lifetime withdrawals
                </div>
              </div>

              {/* Total Investments Card */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <FaShoppingCart className="text-purple-600 text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Total Investments</span>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-purple-500">
                  {formatCurrency(user?.stats?.totalSpent || 0)} FRW
                </div>
                <div className="text-xs opacity-75 mt-1">
                  {user?.activeInvestmentsCount || 0} Active investments
                </div>
              </div>

              {/* Total Earnings Card */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <FaCoins className="text-yellow-600 text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Total Earnings</span>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                  {formatCurrency(user?.stats?.totalEarned || 0)} FRW
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Lifetime earnings
                </div>
              </div>

              {/* Pending Transactions Card */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <FaClock className="text-orange-600 text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Pending</span>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-orange-500">
                  {formatCurrency((user?.stats?.pendingDeposits || 0) + (user?.stats?.pendingWithdrawals || 0))} FRW
                </div>
                <div className="text-xs opacity-75 mt-1">
                  <span className="block sm:inline">Deposits: {formatCurrency(user?.stats?.pendingDeposits || 0)}</span>
                  <span className="hidden sm:inline mx-1">|</span>
                  <span className="block sm:inline">Withdrawals: {formatCurrency(user?.stats?.pendingWithdrawals || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Status - Mobile Friendly */}
          <DataStatus 
            darkMode={darkMode}
            dataSource={dataSource}
            user={user}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Chatbot FAB */}
      <ChatbotFAB 
        darkMode={darkMode} 
        setShowChatbot={setShowChatbot} 
      />

      {/* Chatbot Modal */}
      <Chatbot 
        darkMode={darkMode}
        showChatbot={showChatbot}
        setShowChatbot={setShowChatbot}
        chatMessages={chatMessages}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        sendChatMessage={sendChatMessage}
        chatEndRef={chatEndRef}
      />

      {/* Transaction Modal */}
      <TransactionModal 
        darkMode={darkMode}
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        type={transactionType}
        user={user}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default InvestmentDashboard;

