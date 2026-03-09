// // // src/components/Portfolio.jsx
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   FaChartLine, FaTimes, FaSpinner, FaClock, FaCalendarAlt,
// //   FaCoins, FaPercentage, FaArrowUp, FaArrowDown, FaInfoCircle,
// //   FaChevronDown, FaChevronUp, FaWallet, FaHistory, FaBoxes,
// //   FaExclamationTriangle, FaCheckCircle, FaGift
// // } from 'react-icons/fa';
// // import axios from 'axios';

// // const Portfolio = ({ darkMode, user, formatCurrency, onClose }) => {
// //   const [investments, setInvestments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [expandedCard, setExpandedCard] = useState(null);

// //   const API_URL = 'http://localhost:5000/api';

// //   useEffect(() => {
// //     fetchInvestments();
// //   }, []);

// //   const fetchInvestments = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const token = sessionStorage.getItem('token');
      
// //       console.log('📊 Fetching investments...');
// //       const response = await axios.get(`${API_URL}/user/active-investments`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       });

// //       console.log('📊 Investments response:', response.data);

// //       if (response.data.success) {
// //         const userInvestments = response.data.activeInvestments || [];
        
// //         // Process investments with proper calculations
// //         const processedInvestments = processInvestments(userInvestments);
// //         console.log('✅ Processed investments:', processedInvestments);
// //         setInvestments(processedInvestments);
// //       } else {
// //         setError('Failed to load investments');
// //       }
// //     } catch (error) {
// //       console.error('❌ Error fetching investments:', error);
// //       setError(error.response?.data?.message || 'Failed to load investments');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const processInvestments = (investments) => {
// //     const today = new Date();
    
// //     return investments.map(inv => {
// //       // Use fields from your Investment model
// //       const purchaseDate = new Date(inv.purchaseDate);
// //       const endDate = new Date(inv.endDate);
// //       const lastProfitDate = inv.lastProfitDate ? new Date(inv.lastProfitDate) : null;
      
// //       // Calculate days since purchase
// //       const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
      
// //       // Calculate remaining days safely
// //       const diffTime = endDate - today;
// //       const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
// //       // Calculate progress (should be between 0 and 100)
// //       const totalDays = 30;
// //       const daysElapsed = Math.min(totalDays, Math.max(0, daysSincePurchase));
// //       const progress = (daysElapsed / totalDays) * 100;
      
// //       // Get values from investment document
// //       const amount = inv.amount || 0;
// //       const dailyEarning = inv.dailyEarning || 0;
// //       const totalEarnedSoFar = inv.totalEarnedSoFar || 0;
// //       const totalReturn = inv.totalReturn || (amount + (dailyEarning * 30));
      
// //       // Calculate expected values
// //       const expectedTotal = totalReturn;
// //       const remainingEarnings = Math.max(0, expectedTotal - totalEarnedSoFar);
      
// //       // Calculate ROI percentages
// //       const currentROI = amount > 0 ? ((totalEarnedSoFar / amount) * 100).toFixed(1) : '0.0';
// //       const expectedROI = amount > 0 ? ((expectedTotal / amount) * 100).toFixed(1) : '0.0';
// //       const dailyROI = amount > 0 ? ((dailyEarning / amount) * 100).toFixed(2) : '0.00';
      
// //       // Check if investment is active
// //       const isActive = inv.status === 'active' && today < endDate;
      
// //       // Check if purchased today
// //       const isToday = purchaseDate.toDateString() === today.toDateString();
      
// //       return {
// //         id: inv._id,
// //         productName: inv.productName,
// //         amount,
// //         dailyEarning,
// //         totalEarnedSoFar,
// //         totalReturn: expectedTotal,
// //         status: inv.status,
// //         purchaseDate,
// //         endDate,
// //         lastProfitDate,
// //         daysSincePurchase: Math.max(0, daysSincePurchase),
// //         daysRemaining,
// //         progress: Math.min(100, Math.max(0, progress)),
// //         currentROI,
// //         expectedROI,
// //         dailyROI,
// //         remainingEarnings,
// //         isActive,
// //         isToday,
// //         earningsHistory: inv.earningsHistory || []
// //       };
// //     });
// //   };

// //   const calculateStats = () => {
// //     const activeInvestments = investments.filter(inv => inv.isActive);
    
// //     const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
// //     const totalEarned = activeInvestments.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0);
// //     const dailyEarnings = activeInvestments.reduce((sum, inv) => sum + inv.dailyEarning, 0);
// //     const totalExpected = activeInvestments.reduce((sum, inv) => sum + inv.totalReturn, 0);
    
// //     const averageROI = totalInvested > 0 
// //       ? ((totalExpected / totalInvested) * 100).toFixed(1)
// //       : '0.0';

// //     return {
// //       totalInvested,
// //       todayInvested: 0,
// //       totalEarned,
// //       dailyEarnings,
// //       activeCount: activeInvestments.length,
// //       averageReturn: averageROI,
// //       totalExpected
// //     };
// //   };

// //   const stats = calculateStats();

// //   const InvestmentCard = ({ investment, isExpanded, onToggle }) => {
// //     if (!investment.isActive) return null;

// //     return (
// //       <div className={`rounded-xl border overflow-hidden transition-all ${
// //         darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
// //       } ${isExpanded ? 'shadow-lg' : ''}`}>
// //         {/* Card Header */}
// //         <div 
// //           className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-colors"
// //           onClick={onToggle}
// //         >
// //           <div className="flex items-center flex-1 min-w-0">
// //             <div className={`p-2 rounded-lg mr-3 ${
// //               darkMode ? 'bg-green-900/30' : 'bg-green-100'
// //             }`}>
// //               <FaChartLine className="text-green-500 text-sm" />
// //             </div>
// //             <div className="min-w-0 flex-1">
// //               <h4 className="font-bold text-sm truncate">{investment.productName}</h4>
// //               <div className="flex items-center text-xs mt-1">
// //                 <span className={`px-2 py-0.5 rounded-full text-[10px] ${
// //                   investment.isActive
// //                     ? 'bg-green-500/20 text-green-400'
// //                     : 'bg-gray-500/20 text-gray-400'
// //                 }`}>
// //                   {investment.status}
// //                 </span>
// //                 <span className="ml-2 opacity-75">
// //                   Day {Math.min(30, investment.daysSincePurchase)}/30
// //                 </span>
// //                 {investment.isToday && (
// //                   <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[8px]">
// //                     New
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div className="flex items-center">
// //             <div className="text-right mr-3">
// //               <div className="text-xs opacity-75">Daily</div>
// //               <div className="text-sm font-bold text-green-500">
// //                 {formatCurrency(investment.dailyEarning)} FRW
// //               </div>
// //             </div>
// //             {isExpanded ? (
// //               <FaChevronUp className="opacity-50 text-xs" />
// //             ) : (
// //               <FaChevronDown className="opacity-50 text-xs" />
// //             )}
// //           </div>
// //         </div>

// //         {/* Expanded Details */}
// //         {isExpanded && (
// //           <div className="p-4 pt-0 border-t border-gray-600/30 mt-2">
// //             {/* Stats Grid */}
// //             <div className="grid grid-cols-2 gap-3 mb-4">
// //               <StatBox
// //                 label="Invested"
// //                 value={formatCurrency(investment.amount)}
// //                 valueColor="text-blue-500"
// //                 darkMode={darkMode}
// //               />
// //               <StatBox
// //                 label="Earned So Far"
// //                 value={formatCurrency(investment.totalEarnedSoFar)}
// //                 valueColor="text-green-500"
// //                 darkMode={darkMode}
// //               />
// //               <StatBox
// //                 label="Expected Total"
// //                 value={formatCurrency(investment.totalReturn)}
// //                 valueColor="text-purple-500"
// //                 darkMode={darkMode}
// //               />
// //               <StatBox
// //                 label="Remaining"
// //                 value={formatCurrency(investment.remainingEarnings)}
// //                 valueColor="text-yellow-500"
// //                 darkMode={darkMode}
// //               />
// //             </div>

// //             {/* Progress Bar */}
// //             <div className="mb-4">
// //               <div className="flex justify-between text-xs mb-1">
// //                 <span>Progress</span>
// //                 <span>{Math.round(investment.progress)}%</span>
// //               </div>
// //               <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
// //                 <div 
// //                   className="h-full bg-green-500 rounded-full transition-all duration-500"
// //                   style={{ width: `${investment.progress}%` }}
// //                 />
// //               </div>
// //             </div>

// //             {/* Dates and ROI */}
// //             <div className="space-y-3 text-sm">
// //               <div className="grid grid-cols-2 gap-2">
// //                 <DateInfo
// //                   icon={<FaCalendarAlt className="text-blue-500" size={12} />}
// //                   label="Started"
// //                   date={investment.purchaseDate}
// //                   darkMode={darkMode}
// //                 />
// //                 <DateInfo
// //                   icon={<FaCalendarAlt className="text-red-500" size={12} />}
// //                   label="Ends"
// //                   date={investment.endDate}
// //                   darkMode={darkMode}
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-2">
// //                 <ROIBox
// //                   label="Current ROI"
// //                   value={`${investment.currentROI}%`}
// //                   color="text-green-500"
// //                   darkMode={darkMode}
// //                 />
// //                 <ROIBox
// //                   label="Expected ROI"
// //                   value={`${investment.expectedROI}%`}
// //                   color="text-purple-500"
// //                   darkMode={darkMode}
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-2">
// //                 <InfoBox
// //                   label="Days Left"
// //                   value={investment.daysRemaining}
// //                   icon={<FaArrowDown className="text-red-500" size={12} />}
// //                   darkMode={darkMode}
// //                 />
// //                 <InfoBox
// //                   label="Daily Rate"
// //                   value={`${investment.dailyROI}%`}
// //                   icon={<FaPercentage className="text-blue-500" size={12} />}
// //                   darkMode={darkMode}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Helper Components
// //   const StatBox = ({ label, value, valueColor, darkMode }) => (
// //     <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
// //       <div className="text-xs opacity-75">{label}</div>
// //       <div className={`text-sm font-bold truncate ${valueColor}`}>
// //         {value}
// //       </div>
// //     </div>
// //   );

// //   const DateInfo = ({ icon, label, date, darkMode }) => (
// //     <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
// //       <div className="flex items-center text-xs opacity-75 mb-1">
// //         {icon}
// //         <span className="ml-1">{label}</span>
// //       </div>
// //       <div className="text-xs font-medium">
// //         {date.toLocaleDateString()}
// //       </div>
// //     </div>
// //   );

// //   const ROIBox = ({ label, value, color, darkMode }) => (
// //     <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
// //       <div className="text-xs opacity-75 mb-1">{label}</div>
// //       <div className={`text-sm font-bold ${color}`}>
// //         {value}
// //       </div>
// //     </div>
// //   );

// //   const InfoBox = ({ label, value, icon, darkMode }) => (
// //     <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
// //       <div className="flex items-center text-xs opacity-75 mb-1">
// //         {icon}
// //         <span className="ml-1">{label}</span>
// //       </div>
// //       <div className="text-sm font-medium">
// //         {value}
// //       </div>
// //     </div>
// //   );

// //   if (loading) {
// //     return (
// //       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
// //         <div className={`relative w-full max-w-4xl rounded-2xl p-8 ${
// //           darkMode ? 'bg-gray-800' : 'bg-white'
// //         }`}>
// //           <div className="text-center py-12">
// //             <FaSpinner className="animate-spin mx-auto text-4xl mb-4 text-purple-500" />
// //             <p className="text-lg">Loading your portfolio...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
// //         <div className={`relative w-full max-w-4xl rounded-2xl p-8 ${
// //           darkMode ? 'bg-gray-800' : 'bg-white'
// //         }`}>
// //           <div className="text-center py-12">
// //             <FaExclamationTriangle className="mx-auto text-5xl mb-4 text-red-500" />
// //             <h3 className="text-xl font-bold mb-2">Error Loading Portfolio</h3>
// //             <p className="text-sm opacity-75 mb-6">{error}</p>
// //             <div className="flex justify-center space-x-4">
// //               <button
// //                 onClick={onClose}
// //                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
// //               >
// //                 Close
// //               </button>
// //               <button
// //                 onClick={fetchInvestments}
// //                 className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
// //               >
// //                 Try Again
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const activeInvestments = investments.filter(inv => inv.isActive);
// //   const hasInvestments = activeInvestments.length > 0;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70">
// //       <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl ${
// //         darkMode ? 'bg-gray-800' : 'bg-white'
// //       } p-4 sm:p-6`}>
// //         {/* Header */}
// //         <div className="flex justify-between items-start mb-6 sticky top-0 bg-inherit z-10 pb-4 border-b border-gray-700/30">
// //           <div>
// //             <h2 className="text-xl sm:text-2xl font-bold flex items-center">
// //               <FaChartLine className="mr-2 text-purple-500" />
// //               Investment Portfolio
// //             </h2>
// //             <p className="text-xs sm:text-sm opacity-75 mt-1">
// //               Track your active investments and daily earnings
// //             </p>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
// //           >
// //             <FaTimes />
// //           </button>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
// //           <StatCard
// //             label="Total Invested"
// //             value={stats.totalInvested > 0 ? formatCurrency(stats.totalInvested) : '0'}
// //             subValue="FRW"
// //             color="blue"
// //             darkMode={darkMode}
// //           />
// //           <StatCard
// //             label="Earned"
// //             value={stats.totalEarned > 0 ? formatCurrency(stats.totalEarned) : '0'}
// //             subValue="FRW"
// //             color="green"
// //             darkMode={darkMode}
// //           />
// //           <StatCard
// //             label="Daily"
// //             value={stats.dailyEarnings > 0 ? formatCurrency(stats.dailyEarnings) : '0'}
// //             subValue="FRW"
// //             color="yellow"
// //             darkMode={darkMode}
// //           />
// //           <StatCard
// //             label="Avg ROI"
// //             value={stats.averageReturn !== '0.0' ? `${stats.averageReturn}%` : '0%'}
// //             subValue="expected"
// //             color="purple"
// //             darkMode={darkMode}
// //           />
// //           <StatCard
// //             label="Active"
// //             value={stats.activeCount}
// //             subValue={stats.activeCount === 1 ? 'investment' : 'investments'}
// //             color="pink"
// //             darkMode={darkMode}
// //           />
// //         </div>

// //         {/* Bonus Status */}
// //         {user?.bonus && !user.bonus.canWithdraw && (
// //           <div className={`mb-6 p-4 rounded-lg ${
// //             darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'
// //           }`}>
// //             <div className="flex items-start">
// //               <FaGift className="text-yellow-500 mr-3 mt-1 text-xl" />
// //               <div>
// //                 <h4 className="font-bold text-sm mb-1">🎁 Welcome Bonus: 2,500 FRW</h4>
// //                 <p className="text-xs opacity-75">
// //                   Make your first investment to unlock your bonus! Once you invest, your 2,500 FRW bonus becomes available for withdrawal.
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Investments List */}
// //         {!hasInvestments ? (
// //           <EmptyState darkMode={darkMode} onClose={onClose} />
// //         ) : (
// //           <div className="space-y-3 sm:space-y-4">
// //             <h3 className="text-base sm:text-lg font-semibold mb-4">
// //               Active Investments ({activeInvestments.length})
// //             </h3>
// //             {activeInvestments.map((investment, index) => (
// //               <InvestmentCard
// //                 key={investment.id}
// //                 investment={investment}
// //                 isExpanded={expandedCard === index}
// //                 onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
// //               />
// //             ))}
// //           </div>
// //         )}

// //         {/* Footer */}
// //         <div className="mt-6 pt-4 border-t border-gray-700/30 flex justify-end">
// //           <button
// //             onClick={onClose}
// //             className={`px-4 sm:px-6 py-2 rounded-lg text-sm ${
// //               darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
// //             }`}
// //           >
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Stat Card Component
// // const StatCard = ({ label, value, subValue, color, darkMode }) => {
// //   const colorClasses = {
// //     blue: 'text-blue-500',
// //     cyan: 'text-cyan-500',
// //     green: 'text-green-500',
// //     yellow: 'text-yellow-500',
// //     purple: 'text-purple-500',
// //     pink: 'text-pink-500',
// //     red: 'text-red-500'
// //   };

// //   return (
// //     <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
// //       <div className="text-xs opacity-75 mb-1">{label}</div>
// //       <div className={`text-sm sm:text-base font-bold truncate ${colorClasses[color] || ''}`}>
// //         {value}
// //       </div>
// //       <div className="text-[10px] opacity-50 mt-1">{subValue}</div>
// //     </div>
// //   );
// // };

// // // Empty State Component
// // const EmptyState = ({ darkMode, onClose }) => (
// //   <div className="text-center py-8 sm:py-12">
// //     <FaBoxes className="mx-auto text-4xl sm:text-5xl mb-4 opacity-30" />
// //     <h3 className="text-lg sm:text-xl font-bold mb-2">No Active Investments</h3>
// //     <p className="text-xs sm:text-sm opacity-75 mb-6 max-w-md mx-auto px-4">
// //       You haven't made any investments yet. Start by purchasing an investment product to grow your wealth!
// //     </p>
// //     <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 px-4">
// //       <button
// //         onClick={onClose}
// //         className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
// //       >
// //         Close
// //       </button>
// //       <button
// //         onClick={() => {
// //           onClose();
// //           setTimeout(() => {
// //             document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
// //           }, 300);
// //         }}
// //         className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
// //       >
// //         Browse Products
// //       </button>
// //     </div>
// //   </div>
// // );

// // export default Portfolio;



// // src/components/Portfolio.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   FaChartLine, FaTimes, FaSpinner, FaCalendarAlt,
//   FaPercentage, FaArrowUp, FaArrowDown,
//   FaChevronDown, FaChevronUp, FaBoxes,
//   FaExclamationTriangle, FaGift
// } from 'react-icons/fa';
// import axios from 'axios';

// const Portfolio = ({ darkMode, user, formatCurrency, onClose }) => {
//   const [investments, setInvestments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedCard, setExpandedCard] = useState(null);
  
//   const API_URL = 'http://localhost:5000/api';

//   useEffect(() => {
//     fetchInvestments();
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, []);

//   const fetchInvestments = async () => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem('token');
      
//       const response = await axios.get(`${API_URL}/user/active-investments`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const userInvestments = response.data.activeInvestments || [];
//         const processedInvestments = processInvestments(userInvestments);
//         setInvestments(processedInvestments);
//       }
//     } catch (error) {
//       console.error('Error fetching investments:', error);
//       setError('Failed to load investments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processInvestments = (investments) => {
//     const today = new Date();
    
//     return investments.map(inv => {
//       const purchaseDate = new Date(inv.purchaseDate);
//       const endDate = new Date(inv.endDate);
      
//       const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
//       const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
//       const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
//       const amount = inv.amount || 0;
//       const dailyEarning = inv.dailyEarning || 0;
//       const totalEarnedSoFar = inv.totalEarnedSoFar || 0;
//       const totalReturn = inv.totalReturn || (amount + (dailyEarning * 30));
      
//       const currentROI = amount > 0 ? ((totalEarnedSoFar / amount) * 100).toFixed(1) : '0.0';
//       const expectedROI = amount > 0 ? ((totalReturn / amount) * 100).toFixed(1) : '0.0';
      
//       return {
//         id: inv._id,
//         productName: inv.productName,
//         amount,
//         dailyEarning,
//         totalEarnedSoFar,
//         totalReturn,
//         purchaseDate,
//         endDate,
//         daysRemaining,
//         progress,
//         currentROI,
//         expectedROI,
//         isActive: inv.status === 'active' && today < endDate
//       };
//     });
//   };

//   const calculateStats = () => {
//     const activeInvestments = investments.filter(inv => inv.isActive);
    
//     const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
//     const totalEarned = activeInvestments.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0);
//     const dailyEarnings = activeInvestments.reduce((sum, inv) => sum + inv.dailyEarning, 0);
//     const totalExpected = activeInvestments.reduce((sum, inv) => sum + inv.totalReturn, 0);
    
//     const averageROI = totalInvested > 0 ? ((totalExpected / totalInvested) * 100).toFixed(1) : '0.0';

//     return { 
//       totalInvested, 
//       totalEarned, 
//       dailyEarnings, 
//       activeCount: activeInvestments.length, 
//       averageROI 
//     };
//   };

//   const stats = calculateStats();

//   const InvestmentCard = ({ investment, isExpanded, onToggle }) => (
//     <div className={`rounded-xl border overflow-hidden mb-4 ${
//       darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
//     }`}>
//       {/* Header */}
//       <div 
//         className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-colors"
//         onClick={onToggle}
//       >
//         <div className="flex items-center flex-1 min-w-0">
//           <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
//             <FaChartLine className="text-green-500" size={16} />
//           </div>
//           <div>
//             <h4 className="font-bold text-base">{investment.productName}</h4>
//             <div className="flex items-center text-xs mt-1">
//               <span className={`px-2 py-0.5 rounded-full ${
//                 investment.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
//               }`}>
//                 active
//               </span>
//               <span className="ml-2 opacity-75">
//                 Day {Math.min(30, Math.max(0, Math.floor((new Date() - new Date(investment.purchaseDate)) / (1000*60*60*24))))}/30
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center">
//           <div className="text-right mr-3">
//             <div className="text-xs opacity-75">Daily</div>
//             <div className="text-base font-bold text-green-500">{formatCurrency(investment.dailyEarning)}</div>
//           </div>
//           {isExpanded ? <FaChevronUp className="opacity-50" size={14} /> : <FaChevronDown className="opacity-50" size={14} />}
//         </div>
//       </div>

//       {/* Expanded Details */}
//       {isExpanded && (
//         <div className="p-4 pt-0 border-t border-gray-600/30 mt-2">
//           <div className="grid grid-cols-2 gap-3 text-sm mb-3">
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
//               <div className="text-xs opacity-75 mb-1">Invested</div>
//               <div className="font-bold text-blue-500 text-base">{formatCurrency(investment.amount)}</div>
//             </div>
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
//               <div className="text-xs opacity-75 mb-1">Earned So Far</div>
//               <div className="font-bold text-green-500 text-base">{formatCurrency(investment.totalEarnedSoFar)}</div>
//             </div>
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
//               <div className="text-xs opacity-75 mb-1">Expected Total</div>
//               <div className="font-bold text-purple-500 text-base">{formatCurrency(investment.totalReturn)}</div>
//             </div>
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
//               <div className="text-xs opacity-75 mb-1">Remaining</div>
//               <div className="font-bold text-yellow-500 text-base">{formatCurrency(investment.totalReturn - investment.totalEarnedSoFar)}</div>
//             </div>
//           </div>

//           <div className="mb-3">
//             <div className="flex justify-between text-xs mb-1">
//               <span>Progress</span>
//               <span>{Math.round(investment.progress)}%</span>
//             </div>
//             <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
//               <div className="h-full bg-green-500 rounded-full" style={{ width: `${investment.progress}%` }} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-sm mb-3">
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
//               <div className="opacity-75 mb-1 flex items-center">
//                 <FaCalendarAlt className="mr-1 text-blue-500" size={12} />
//                 Started
//               </div>
//               <div className="font-medium">{new Date(investment.purchaseDate).toLocaleDateString()}</div>
//             </div>
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
//               <div className="opacity-75 mb-1 flex items-center">
//                 <FaCalendarAlt className="mr-1 text-red-500" size={12} />
//                 Ends
//               </div>
//               <div className="font-medium">{new Date(investment.endDate).toLocaleDateString()}</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-sm">
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
//               <div className="opacity-75 mb-1">Current ROI</div>
//               <div className="font-bold text-green-500">{investment.currentROI}%</div>
//             </div>
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
//               <div className="opacity-75 mb-1">Expected ROI</div>
//               <div className="font-bold text-purple-500">{investment.expectedROI}%</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-sm mt-3">
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
//               <div className="opacity-75 mb-1">Days Left</div>
//               <div className="font-bold text-red-500">{investment.daysRemaining}</div>
//             </div>
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
//               <div className="opacity-75 mb-1">Daily Rate</div>
//               <div className="font-bold text-blue-500">{((investment.dailyEarning / investment.amount) * 100).toFixed(2)}%</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
//         <div className={`relative w-96 rounded-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <FaSpinner className="animate-spin mx-auto text-4xl mb-4 text-purple-500" />
//           <p className="text-center text-base">Loading your portfolio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
//         <div className={`relative w-96 rounded-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-red-500" />
//           <h3 className="text-lg font-bold mb-3 text-center">Error</h3>
//           <p className="text-sm text-center mb-6">{error}</p>
//           <button 
//             onClick={onClose} 
//             className="w-full py-3 bg-purple-500 text-white rounded-xl text-base font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const activeInvestments = investments.filter(inv => inv.isActive);

//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto" onClick={onClose}>
//       <div 
//         className="min-h-screen px-4 py-8 flex items-center justify-center"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div 
//           className="relative w-full max-w-3xl rounded-2xl shadow-2xl"
//           style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff' }}
//         >
//           {/* Header with Close Button */}
//           <div className="sticky top-0 z-10 p-6 border-b flex justify-between items-center rounded-t-2xl" 
//             style={{ 
//               backgroundColor: darkMode ? '#1f2937' : '#ffffff',
//               borderColor: darkMode ? '#374151' : '#e5e7eb'
//             }}
//           >
//             <h2 className="text-2xl font-bold flex items-center">
//               <FaChartLine className="mr-3 text-purple-500" size={24} />
//               Investment Portfolio
//             </h2>
//             <button
//               onClick={onClose}
//               className="p-3 rounded-full hover:bg-black/10 transition-colors"
//               style={{ color: darkMode ? '#ffffff' : '#1f2937' }}
//             >
//               <FaTimes size={20} />
//             </button>
//           </div>

//           {/* Scrollable Content - THIS IS THE KEY PART */}
//           <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
//             {/* Stats Grid */}
//             <div className="p-6 grid grid-cols-5 gap-3 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
//               <StatCard 
//                 label="Total Invested" 
//                 value={stats.totalInvested > 0 ? formatCurrency(stats.totalInvested) : '0'} 
//                 subValue="FRW" 
//                 color="blue" 
//                 darkMode={darkMode} 
//               />
//               <StatCard 
//                 label="Earned" 
//                 value={stats.totalEarned > 0 ? formatCurrency(stats.totalEarned) : '0'} 
//                 subValue="FRW" 
//                 color="green" 
//                 darkMode={darkMode} 
//               />
//               <StatCard 
//                 label="Daily" 
//                 value={stats.dailyEarnings > 0 ? formatCurrency(stats.dailyEarnings) : '0'} 
//                 subValue="FRW" 
//                 color="yellow" 
//                 darkMode={darkMode} 
//               />
//               <StatCard 
//                 label="Avg ROI" 
//                 value={stats.averageROI !== '0.0' ? `${stats.averageROI}%` : '0%'} 
//                 subValue="expected" 
//                 color="purple" 
//                 darkMode={darkMode} 
//               />
//               <StatCard 
//                 label="Active" 
//                 value={stats.activeCount} 
//                 subValue={stats.activeCount === 1 ? 'investment' : 'investments'} 
//                 color="pink" 
//                 darkMode={darkMode} 
//               />
//             </div>

//             {/* Bonus Status */}
//             {user?.bonus && !user.bonus.canWithdraw && (
//               <div className="mx-6 mt-6 p-4 rounded-xl" style={{ 
//                 backgroundColor: darkMode ? 'rgba(251, 191, 36, 0.1)' : '#fef3c7',
//                 border: darkMode ? '1px solid #b45309' : '1px solid #fcd34d'
//               }}>
//                 <div className="flex items-start">
//                   <FaGift className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
//                   <div>
//                     <h4 className="font-bold text-base mb-1">🎁 Welcome Bonus: 2,500 FRW</h4>
//                     <p className="text-sm opacity-75">
//                       Make your first investment to unlock your bonus!
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Investments List */}
//             <div className="p-6">
//               {!activeInvestments.length ? (
//                 <div className="text-center py-12">
//                   <FaBoxes className="mx-auto text-5xl mb-4 opacity-30" />
//                   <h3 className="text-xl font-bold mb-3">No Active Investments</h3>
//                   <p className="text-sm opacity-75 mb-6 max-w-md mx-auto">
//                     You haven't made any investments yet. Start by purchasing an investment product to grow your wealth!
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <h3 className="text-lg font-semibold mb-4">
//                     Active Investments ({activeInvestments.length})
//                   </h3>
//                   {activeInvestments.map((investment, index) => (
//                     <InvestmentCard
//                       key={investment.id}
//                       investment={investment}
//                       isExpanded={expandedCard === index}
//                       onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
//                     />
//                   ))}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Footer Close Button */}
//           <div className="sticky bottom-0 p-6 border-t rounded-b-2xl" style={{ 
//             backgroundColor: darkMode ? '#1f2937' : '#ffffff',
//             borderColor: darkMode ? '#374151' : '#e5e7eb'
//           }}>
//             <button
//               onClick={onClose}
//               className="w-full py-3 bg-purple-500 text-white rounded-xl text-base font-medium hover:bg-purple-600 transition-colors"
//             >
//               Close Portfolio
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Stat Card Component
// const StatCard = ({ label, value, subValue, color, darkMode }) => {
//   const colorClasses = {
//     blue: 'text-blue-500',
//     green: 'text-green-500',
//     yellow: 'text-yellow-500',
//     purple: 'text-purple-500',
//     pink: 'text-pink-500'
//   };

//   return (
//     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//       <div className="text-xs opacity-75 mb-1">{label}</div>
//       <div className={`text-lg font-bold truncate ${colorClasses[color] || ''}`}>
//         {value}
//       </div>
//       <div className="text-xs opacity-50 mt-1">{subValue}</div>
//     </div>
//   );
// };

// export default Portfolio;























// src/components/Portfolio.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, FaTimes, FaSpinner, FaCalendarAlt,
  FaPercentage, FaArrowUp, FaArrowDown,
  FaChevronDown, FaChevronUp, FaBoxes,
  FaExclamationTriangle, FaGift
} from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config'; // Correct import path from src/components to root

const Portfolio = ({ darkMode, user, formatCurrency, onClose }) => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Remove this line:
  // const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchInvestments();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/user/active-investments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const userInvestments = response.data.activeInvestments || [];
        const processedInvestments = processInvestments(userInvestments);
        setInvestments(processedInvestments);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      setError('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const processInvestments = (investments) => {
    const today = new Date();
    
    return investments.map(inv => {
      const purchaseDate = new Date(inv.purchaseDate);
      const endDate = new Date(inv.endDate);
      
      const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
      const progress = Math.min(100, (daysSincePurchase / 30) * 100);
      
      const amount = inv.amount || 0;
      const dailyEarning = inv.dailyEarning || 0;
      const totalEarnedSoFar = inv.totalEarnedSoFar || 0;
      const totalReturn = inv.totalReturn || (amount + (dailyEarning * 30));
      
      const currentROI = amount > 0 ? ((totalEarnedSoFar / amount) * 100).toFixed(1) : '0.0';
      const expectedROI = amount > 0 ? ((totalReturn / amount) * 100).toFixed(1) : '0.0';
      
      return {
        id: inv._id,
        productName: inv.productName,
        amount,
        dailyEarning,
        totalEarnedSoFar,
        totalReturn,
        purchaseDate,
        endDate,
        daysRemaining,
        progress,
        currentROI,
        expectedROI,
        isActive: inv.status === 'active' && today < endDate
      };
    });
  };

  const calculateStats = () => {
    const activeInvestments = investments.filter(inv => inv.isActive);
    
    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalEarned = activeInvestments.reduce((sum, inv) => sum + inv.totalEarnedSoFar, 0);
    const dailyEarnings = activeInvestments.reduce((sum, inv) => sum + inv.dailyEarning, 0);
    const totalExpected = activeInvestments.reduce((sum, inv) => sum + inv.totalReturn, 0);
    
    const averageROI = totalInvested > 0 ? ((totalExpected / totalInvested) * 100).toFixed(1) : '0.0';

    return { 
      totalInvested, 
      totalEarned, 
      dailyEarnings, 
      activeCount: activeInvestments.length, 
      averageROI 
    };
  };

  const stats = calculateStats();

  const InvestmentCard = ({ investment, isExpanded, onToggle }) => (
    <div className={`rounded-xl border overflow-hidden mb-4 ${
      darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <FaChartLine className="text-green-500" size={16} />
          </div>
          <div>
            <h4 className="font-bold text-base">{investment.productName}</h4>
            <div className="flex items-center text-xs mt-1">
              <span className={`px-2 py-0.5 rounded-full ${
                investment.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                active
              </span>
              <span className="ml-2 opacity-75">
                Day {Math.min(30, Math.max(0, Math.floor((new Date() - new Date(investment.purchaseDate)) / (1000*60*60*24))))}/30
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-3">
            <div className="text-xs opacity-75">Daily</div>
            <div className="text-base font-bold text-green-500">{formatCurrency(investment.dailyEarning)}</div>
          </div>
          {isExpanded ? <FaChevronUp className="opacity-50" size={14} /> : <FaChevronDown className="opacity-50" size={14} />}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-600/30 mt-2">
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
              <div className="text-xs opacity-75 mb-1">Invested</div>
              <div className="font-bold text-blue-500 text-base">{formatCurrency(investment.amount)}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
              <div className="text-xs opacity-75 mb-1">Earned So Far</div>
              <div className="font-bold text-green-500 text-base">{formatCurrency(investment.totalEarnedSoFar)}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
              <div className="text-xs opacity-75 mb-1">Expected Total</div>
              <div className="font-bold text-purple-500 text-base">{formatCurrency(investment.totalReturn)}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
              <div className="text-xs opacity-75 mb-1">Remaining</div>
              <div className="font-bold text-yellow-500 text-base">{formatCurrency(investment.totalReturn - investment.totalEarnedSoFar)}</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{Math.round(investment.progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${investment.progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
              <div className="opacity-75 mb-1 flex items-center">
                <FaCalendarAlt className="mr-1 text-blue-500" size={12} />
                Started
              </div>
              <div className="font-medium">{new Date(investment.purchaseDate).toLocaleDateString()}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
              <div className="opacity-75 mb-1 flex items-center">
                <FaCalendarAlt className="mr-1 text-red-500" size={12} />
                Ends
              </div>
              <div className="font-medium">{new Date(investment.endDate).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
              <div className="opacity-75 mb-1">Current ROI</div>
              <div className="font-bold text-green-500">{investment.currentROI}%</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
              <div className="opacity-75 mb-1">Expected ROI</div>
              <div className="font-bold text-purple-500">{investment.expectedROI}%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mt-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
              <div className="opacity-75 mb-1">Days Left</div>
              <div className="font-bold text-red-500">{investment.daysRemaining}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
              <div className="opacity-75 mb-1">Daily Rate</div>
              <div className="font-bold text-blue-500">{((investment.dailyEarning / investment.amount) * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className={`relative w-96 rounded-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <FaSpinner className="animate-spin mx-auto text-4xl mb-4 text-purple-500" />
          <p className="text-center text-base">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className={`relative w-96 rounded-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-red-500" />
          <h3 className="text-lg font-bold mb-3 text-center">Error</h3>
          <p className="text-sm text-center mb-6">{error}</p>
          <button 
            onClick={onClose} 
            className="w-full py-3 bg-purple-500 text-white rounded-xl text-base font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const activeInvestments = investments.filter(inv => inv.isActive);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto" onClick={onClose}>
      <div 
        className="min-h-screen px-4 py-8 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative w-full max-w-3xl rounded-2xl shadow-2xl"
          style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff' }}
        >
          {/* Header with Close Button */}
          <div className="sticky top-0 z-10 p-6 border-b flex justify-between items-center rounded-t-2xl" 
            style={{ 
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb'
            }}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <FaChartLine className="mr-3 text-purple-500" size={24} />
              Investment Portfolio
            </h2>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-black/10 transition-colors"
              style={{ color: darkMode ? '#ffffff' : '#1f2937' }}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {/* Stats Grid */}
            <div className="p-6 grid grid-cols-5 gap-3 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
              <StatCard 
                label="Total Invested" 
                value={stats.totalInvested > 0 ? formatCurrency(stats.totalInvested) : '0'} 
                subValue="FRW" 
                color="blue" 
                darkMode={darkMode} 
              />
              <StatCard 
                label="Earned" 
                value={stats.totalEarned > 0 ? formatCurrency(stats.totalEarned) : '0'} 
                subValue="FRW" 
                color="green" 
                darkMode={darkMode} 
              />
              <StatCard 
                label="Daily" 
                value={stats.dailyEarnings > 0 ? formatCurrency(stats.dailyEarnings) : '0'} 
                subValue="FRW" 
                color="yellow" 
                darkMode={darkMode} 
              />
              <StatCard 
                label="Avg ROI" 
                value={stats.averageROI !== '0.0' ? `${stats.averageROI}%` : '0%'} 
                subValue="expected" 
                color="purple" 
                darkMode={darkMode} 
              />
              <StatCard 
                label="Active" 
                value={stats.activeCount} 
                subValue={stats.activeCount === 1 ? 'investment' : 'investments'} 
                color="pink" 
                darkMode={darkMode} 
              />
            </div>

            {/* Bonus Status */}
            {user?.bonus && !user.bonus.canWithdraw && (
              <div className="mx-6 mt-6 p-4 rounded-xl" style={{ 
                backgroundColor: darkMode ? 'rgba(251, 191, 36, 0.1)' : '#fef3c7',
                border: darkMode ? '1px solid #b45309' : '1px solid #fcd34d'
              }}>
                <div className="flex items-start">
                  <FaGift className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-base mb-1">🎁 Welcome Bonus: 2,500 FRW</h4>
                    <p className="text-sm opacity-75">
                      Make your first investment to unlock your bonus!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Investments List */}
            <div className="p-6">
              {!activeInvestments.length ? (
                <div className="text-center py-12">
                  <FaBoxes className="mx-auto text-5xl mb-4 opacity-30" />
                  <h3 className="text-xl font-bold mb-3">No Active Investments</h3>
                  <p className="text-sm opacity-75 mb-6 max-w-md mx-auto">
                    You haven't made any investments yet. Start by purchasing an investment product to grow your wealth!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">
                    Active Investments ({activeInvestments.length})
                  </h3>
                  {activeInvestments.map((investment, index) => (
                    <InvestmentCard
                      key={investment.id}
                      investment={investment}
                      isExpanded={expandedCard === index}
                      onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="sticky bottom-0 p-6 border-t rounded-b-2xl" style={{ 
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderColor: darkMode ? '#374151' : '#e5e7eb'
          }}>
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-500 text-white rounded-xl text-base font-medium hover:bg-purple-600 transition-colors"
            >
              Close Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, subValue, color, darkMode }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500'
  };

  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
      <div className="text-xs opacity-75 mb-1">{label}</div>
      <div className={`text-lg font-bold truncate ${colorClasses[color] || ''}`}>
        {value}
      </div>
      <div className="text-xs opacity-50 mt-1">{subValue}</div>
    </div>
  );
};

export default Portfolio;