

// // src/components/dashboard/Sidebar.jsx
// import React from 'react';
// import { 
//   FaWallet, FaCoins, FaUsers, FaChartLine,
//   FaHistory, FaBell, FaCog, FaShieldAlt,
//   FaArrowDown, FaArrowUp, FaExchangeAlt,
//   FaTimes, FaSync, FaDatabase, FaGift
// } from 'react-icons/fa';

// const Sidebar = ({ 
//   darkMode, showSidebar, setShowSidebar, user, 
//   refreshing, handleRefresh, handleQuickAction, handleTransferEarnings,
//   navigate, dataSource, formatCurrency, totalDailyProfit,
//   notifications
// }) => {
  
//   // Calculate wallet values correctly
//   const mainBalance = user?.wallets?.main || 0;
//   const earningBalance = user?.wallets?.earning || 0;
//   const reservedBalance = user?.wallets?.reserved || 0;
  
//   // Get bonus info
//   const bonusAmount = user?.bonus?.amount || 0;
//   const bonusLocked = !user?.bonus?.canWithdraw;
  
//   return (
//     <>
//       {/* Mobile Overlay */}
//       {showSidebar && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-20 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}
      
//       <div className={`
//         fixed md:relative h-full z-30 
//         transition-transform duration-300 
//         ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
//         ${darkMode ? 'bg-gray-800' : 'bg-white'} 
//         border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} 
//         w-80 flex-shrink-0 overflow-y-auto
//       `}>
//         <div className="p-6 h-full flex flex-col">
//           {/* Sidebar Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center">
//               <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center`}>
//                 <span className="text-white font-bold text-lg">AG</span>
//               </div>
//               <div className="ml-3">
//                 <h2 className="text-xl font-bold">Apex Growth</h2>
//                 {dataSource === 'database' && (
//                   <div className="flex items-center text-xs text-green-500">
//                     <FaDatabase className="mr-1" /> Live Data
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center">
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className={`p-2 rounded-lg mr-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 title="Refresh Data"
//               >
//                 <FaSync className={refreshing ? 'animate-spin' : ''} />
//               </button>
//               <button
//                 onClick={() => setShowSidebar(false)}
//                 className={`p-2 rounded-lg md:hidden ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               >
//                 <FaTimes />
//               </button>
//             </div>
//           </div>

//           {/* Main Wallet Card - For Investments Only */}
//           <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <FaWallet className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//                 <span className="font-medium">Main Wallet</span>
//               </div>
//               <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
//                 For Investments
//               </span>
//             </div>
//             <div className="mb-4">
//               <div className="text-2xl font-bold text-blue-500">{formatCurrency(mainBalance)} FRW</div>
//               <div className="text-sm opacity-75 mt-1">Total Deposits: {formatCurrency(user?.stats?.totalDeposits || 0)} FRW</div>
//             </div>
//             <button
//               onClick={() => handleQuickAction('deposit')}
//               className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors flex items-center justify-center`}
//             >
//               <FaArrowDown className="mr-2" />
//               Add to Main Wallet
//             </button>
//           </div>

//           {/* Reserved Wallet Card - Pending Withdrawals */}
//           <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/30' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'}`}>
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <FaWallet className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                 <span className="font-medium">Reserved Wallet</span>
//               </div>
//               <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
//                 Pending
//               </span>
//             </div>
//             <div className="mb-4">
//               <div className="text-2xl font-bold text-yellow-500">{formatCurrency(reservedBalance)} FRW</div>
//               <div className="text-sm opacity-75 mt-1">Awaiting Admin Approval</div>
//             </div>
//           </div>

//           {/* Earning Wallet Card - Withdrawable Funds (Includes Bonus) */}
//           <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <FaCoins className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
//                 <span className="font-medium">Earning Wallet</span>
//               </div>
//               <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
//                 Withdrawable
//               </span>
//             </div>
            
//             {/* Total Earning Balance */}
//             <div className="mb-3">
//               <div className="text-2xl font-bold text-green-500">{formatCurrency(earningBalance)} FRW</div>
//               <div className="text-sm opacity-75 mt-1">Daily Earnings: +{formatCurrency(totalDailyProfit)} FRW</div>
//               <div className="text-sm opacity-75">Total Earned: {formatCurrency(user?.stats?.totalEarned || 0)} FRW</div>
//             </div>

//             {/* Bonus Section - Informational Only */}
//             {bonusAmount > 0 && (
//               <div className={`mt-2 mb-3 p-2 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <FaGift className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                     <span className="text-sm font-medium">Welcome Bonus</span>
//                   </div>
//                   <span className="font-bold text-yellow-500">{formatCurrency(bonusAmount)} FRW</span>
//                 </div>
                
//                 {bonusLocked && (
//                   <div className="text-xs mt-1 text-yellow-500">
//                     ⚠️ First investment required to withdraw bonus
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Action Buttons - Both Always Active */}
//             <div className="space-y-2">
//               <button
//                 onClick={() => handleQuickAction('withdraw')}
//                 className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors flex items-center justify-center`}
//               >
//                 <FaArrowUp className="mr-2" />
//                 Withdraw from Earning
//               </button>
              
//               <button
//                 onClick={handleTransferEarnings}
//                 disabled={earningBalance <= 0}
//                 className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center justify-center ${earningBalance <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 <FaExchangeAlt className="mr-2" />
//                 Transfer to Main Wallet
//               </button>
//             </div>
//           </div>

//           {/* Referral Stats */}
//           <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
//             <div className="flex items-center mb-3">
//               <FaUsers className="text-purple-500 mr-2" />
//               <span className="font-medium">Referral Stats</span>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                 <div className="text-lg font-bold">{user?.stats?.totalReferrals || 0}</div>
//                 <div className="text-xs opacity-75">Total Referrals</div>
//               </div>
//               <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                 <div className="text-lg font-bold">{formatCurrency(user?.stats?.referralEarnings || 0)} FRW</div>
//                 <div className="text-xs opacity-75">Referral Earnings</div>
//               </div>
//             </div>
//           </div>

//           {/* Daily Profit */}
//           <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-r from-green-900/20 to-teal-900/20 border-green-700/30' : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'}`}>
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center">
//                 <FaChartLine className="text-green-500 mr-2" />
//                 <span className="font-medium">Daily Profit</span>
//               </div>
//               <FaArrowUp className="text-green-500" />
//             </div>
//             <div className="text-2xl font-bold text-green-500">
//               {formatCurrency(totalDailyProfit)} FRW
//             </div>
//             <div className="text-sm opacity-75 mt-1">Earned Today (+14.29%)</div>
//           </div>

//           {/* Quick Actions */}
//           <div className="mb-6">
//             <h3 className="font-bold mb-3">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => handleQuickAction('deposit')}
//                 className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-blue-900/30 hover:bg-blue-800/30 border border-blue-700/30' : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'}`}
//               >
//                 <FaArrowDown className="text-blue-500 mb-1" />
//                 <span className="text-sm">Deposit</span>
//               </button>
//               <button
//                 onClick={() => handleQuickAction('withdraw')}
//                 className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-green-900/30 hover:bg-green-800/30 border border-green-700/30' : 'bg-green-50 hover:bg-green-100 border border-green-200'}`}
//               >
//                 <FaArrowUp className="text-green-500 mb-1" />
//                 <span className="text-sm">Withdraw</span>
//               </button>
//               <button
//                 onClick={() => handleQuickAction('invest')}
//                 className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-purple-900/30 hover:bg-purple-800/30 border border-purple-700/30' : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'}`}
//               >
//                 <FaChartLine className="text-purple-500 mb-1" />
//                 <span className="text-sm">Invest</span>
//               </button>
//               <button
//                 onClick={() => navigate('/history')}
//                 className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-yellow-900/30 hover:bg-yellow-800/30 border border-yellow-700/30' : 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'}`}
//               >
//                 <FaHistory className="text-yellow-500 mb-1" />
//                 <span className="text-sm">History</span>
//               </button>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <div className="mt-6 space-y-2">
//             <SidebarNavItem
//               icon={FaHistory}
//               text="Transaction History"
//               onClick={() => navigate('/history')}
//               darkMode={darkMode}
//             />
//             <SidebarNavItem
//               icon={FaChartLine}
//               text="Statistics & Reports"
//               onClick={() => navigate('/statistics')}
//               darkMode={darkMode}
//             />
//             <SidebarNavItem
//               icon={FaUsers}
//               text="Team Members"
//               onClick={() => navigate('/team')}
//               darkMode={darkMode}
//             />
//             <SidebarNavItem
//               icon={FaBell}
//               text="Notifications"
//               onClick={() => navigate('/notifications')}
//               darkMode={darkMode}
//               badge={notifications?.filter(n => !n.read).length || 0}
//             />
//             <SidebarNavItem
//               icon={FaCog}
//               text="Settings"
//               onClick={() => navigate('/settings')}
//               darkMode={darkMode}
//             />
//             <SidebarNavItem
//               icon={FaShieldAlt}
//               text="Security"
//               onClick={() => navigate('/security')}
//               darkMode={darkMode}
//             />
//           </div>

//           {/* Footer */}
//           <div className="mt-auto pt-6 border-t border-gray-700/50">
//             <p className="text-xs opacity-75 text-center">
//               Apex Growth © {new Date().getFullYear()}
//               <br />
//               <span className="text-green-500">Min. Investment: 6,600 FRW</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Sidebar Nav Item Component
// const SidebarNavItem = ({ icon: Icon, text, onClick, darkMode, badge }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//   >
//     <div className="flex items-center">
//       <Icon className="mr-3 opacity-75" />
//       <span>{text}</span>
//     </div>
//     {badge > 0 && (
//       <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-red-600' : 'bg-red-500'} text-white`}>
//         {badge}
//       </span>
//     )}
//   </button>
// );

// export default Sidebar;

// src/components/dashboard/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaWallet, FaCoins, FaUsers, FaChartLine,
  FaHistory, FaBell, FaCog, FaShieldAlt,
  FaArrowDown, FaArrowUp, FaExchangeAlt,
  FaTimes, FaSync, FaDatabase, FaGift
} from 'react-icons/fa';

const Sidebar = ({ 
  darkMode, showSidebar, setShowSidebar, user, 
  refreshing, handleRefresh, handleQuickAction, handleTransferEarnings,
  navigate, dataSource, formatCurrency, totalDailyProfit,
  notifications
}) => {
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate wallet values correctly
  const mainBalance = user?.wallets?.main || 0;
  const earningBalance = user?.wallets?.earning || 0;
  const reservedBalance = user?.wallets?.reserved || 0;
  
  // Get bonus info
  const bonusAmount = user?.bonus?.amount || 0;
  const bonusLocked = !user?.bonus?.canWithdraw;
  
  // Handle navigation with mobile close
  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) setShowSidebar(false);
  };

  // Handle quick action with mobile close
  const handleAction = (action) => {
    handleQuickAction(action);
    if (isMobile) setShowSidebar(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        h-full border-r overflow-y-auto
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        ${isMobile 
          ? `fixed top-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
             ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`
          : 'w-80 flex-shrink-0'
        }
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">AG</span>
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold">Apex Growth</h2>
                {dataSource === 'database' && (
                  <div className="flex items-center text-xs text-green-500">
                    <FaDatabase className="mr-1" /> Live Data
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`p-2 rounded-lg mr-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Refresh Data"
              >
                <FaSync className={refreshing ? 'animate-spin' : ''} />
              </button>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className={`p-2 rounded-lg md:hidden ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Main Wallet Card - For Investments Only */}
          <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FaWallet className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="font-medium">Main Wallet</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                For Investments
              </span>
            </div>
            <div className="mb-4">
              <div className="text-2xl font-bold text-blue-500">{formatCurrency(mainBalance)} FRW</div>
              <div className="text-sm opacity-75 mt-1">Total Deposits: {formatCurrency(user?.stats?.totalDeposits || 0)} FRW</div>
            </div>
            <button
              onClick={() => handleAction('deposit')}
              className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors flex items-center justify-center`}
            >
              <FaArrowDown className="mr-2" />
              Add to Main Wallet
            </button>
          </div>

          {/* Reserved Wallet Card - Pending Withdrawals */}
          <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/30' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FaWallet className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span className="font-medium">Reserved Wallet</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                Pending
              </span>
            </div>
            <div className="mb-4">
              <div className="text-2xl font-bold text-yellow-500">{formatCurrency(reservedBalance)} FRW</div>
              <div className="text-sm opacity-75 mt-1">Awaiting Admin Approval</div>
            </div>
          </div>

          {/* Earning Wallet Card - Withdrawable Funds (Includes Bonus) */}
          <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FaCoins className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className="font-medium">Earning Wallet</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                Withdrawable
              </span>
            </div>
            
            {/* Total Earning Balance */}
            <div className="mb-3">
              <div className="text-2xl font-bold text-green-500">{formatCurrency(earningBalance)} FRW</div>
              <div className="text-sm opacity-75 mt-1">Daily Earnings: +{formatCurrency(totalDailyProfit)} FRW</div>
              <div className="text-sm opacity-75">Total Earned: {formatCurrency(user?.stats?.totalEarned || 0)} FRW</div>
            </div>

            {/* Bonus Section - Informational Only */}
            {bonusAmount > 0 && (
              <div className={`mt-2 mb-3 p-2 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaGift className={`mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className="text-sm font-medium">Welcome Bonus</span>
                  </div>
                  <span className="font-bold text-yellow-500">{formatCurrency(bonusAmount)} FRW</span>
                </div>
                
                {bonusLocked && (
                  <div className="text-xs mt-1 text-yellow-500">
                    ⚠️ First investment required to withdraw bonus
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons - Both Always Active */}
            <div className="space-y-2">
              <button
                onClick={() => handleAction('withdraw')}
                className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors flex items-center justify-center`}
              >
                <FaArrowUp className="mr-2" />
                Withdraw from Earning
              </button>
              
              <button
                onClick={() => {
                  handleTransferEarnings();
                  if (isMobile) setShowSidebar(false);
                }}
                disabled={earningBalance <= 0}
                className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center justify-center ${earningBalance <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaExchangeAlt className="mr-2" />
                Transfer to Main Wallet
              </button>
            </div>
          </div>

          {/* Referral Stats */}
          <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <FaUsers className="text-purple-500 mr-2" />
              <span className="font-medium">Referral Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-lg font-bold">{user?.stats?.totalReferrals || 0}</div>
                <div className="text-xs opacity-75">Total Referrals</div>
              </div>
              <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-lg font-bold">{formatCurrency(user?.stats?.referralEarnings || 0)} FRW</div>
                <div className="text-xs opacity-75">Referral Earnings</div>
              </div>
            </div>
          </div>

          {/* Daily Profit */}
          <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gradient-to-r from-green-900/20 to-teal-900/20 border-green-700/30' : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaChartLine className="text-green-500 mr-2" />
                <span className="font-medium">Daily Profit</span>
              </div>
              <FaArrowUp className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(totalDailyProfit)} FRW
            </div>
            <div className="text-sm opacity-75 mt-1">Earned Today (+14.29%)</div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAction('deposit')}
                className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-blue-900/30 hover:bg-blue-800/30 border border-blue-700/30' : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'}`}
              >
                <FaArrowDown className="text-blue-500 mb-1" />
                <span className="text-sm">Deposit</span>
              </button>
              <button
                onClick={() => handleAction('withdraw')}
                className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-green-900/30 hover:bg-green-800/30 border border-green-700/30' : 'bg-green-50 hover:bg-green-100 border border-green-200'}`}
              >
                <FaArrowUp className="text-green-500 mb-1" />
                <span className="text-sm">Withdraw</span>
              </button>
              <button
                onClick={() => handleAction('invest')}
                className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-purple-900/30 hover:bg-purple-800/30 border border-purple-700/30' : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'}`}
              >
                <FaChartLine className="text-purple-500 mb-1" />
                <span className="text-sm">Invest</span>
              </button>
              <button
                onClick={() => handleNavClick('/history')}
                className={`p-3 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-yellow-900/30 hover:bg-yellow-800/30 border border-yellow-700/30' : 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'}`}
              >
                <FaHistory className="text-yellow-500 mb-1" />
                <span className="text-sm">History</span>
              </button>
            </div>
          </div>

          {/* Navigation Links - RESTORED */}
          <div className="mt-6 space-y-2">
            <SidebarNavItem
              icon={FaHistory}
              text="Transaction History"
              onClick={() => handleNavClick('/history')}
              darkMode={darkMode}
            />
            <SidebarNavItem
              icon={FaChartLine}
              text="Statistics & Reports"
              onClick={() => handleNavClick('/statistics')}
              darkMode={darkMode}
            />
            <SidebarNavItem
              icon={FaUsers}
              text="Team Members"
              onClick={() => handleNavClick('/team')}
              darkMode={darkMode}
            />
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs opacity-75 text-center">
              Apex Growth © {new Date().getFullYear()}
              <br />
              <span className="text-green-500">Min. Investment: 6,600 FRW</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Sidebar Nav Item Component
const SidebarNavItem = ({ icon: Icon, text, onClick, darkMode, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
  >
    <div className="flex items-center">
      <Icon className="mr-3 opacity-75" />
      <span>{text}</span>
    </div>
    {badge > 0 && (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${darkMode ? 'bg-red-600' : 'bg-red-500'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;