// src/components/dashboard/TransactionSummary.jsx
import React from 'react';
import { FaWallet, FaArrowDown, FaArrowUp, FaCoins } from 'react-icons/fa';

const TransactionSummary = ({ darkMode, user, formatCurrency }) => {
  const stats = user?.stats || {};
  const wallets = user?.wallets || {};
  
  const availableBalance = (wallets.main || 0) - (wallets.reserved || 0);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Available Balance Card */}
      <div className={`p-4 md:p-6 rounded-2xl border-2 ${darkMode ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
        <div className="flex items-center mb-3 md:mb-4">
          <FaWallet className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
          <h3 className="font-bold text-sm md:text-base">Available Balance</h3>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
          {formatCurrency(availableBalance)} FRW
        </div>
        <div className="text-xs md:text-sm opacity-75">
          Main: {formatCurrency(wallets.main || 0)} FRW • Reserved: {formatCurrency(wallets.reserved || 0)} FRW
        </div>
      </div>

      {/* Total Deposits Card */}
      <div className={`p-4 md:p-6 rounded-2xl border-2 ${darkMode ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
        <div className="flex items-center mb-3 md:mb-4">
          <FaArrowDown className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
          <h3 className="font-bold text-sm md:text-base">Total Deposits</h3>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
          {formatCurrency(stats.totalDeposits || 0)} FRW
        </div>
        <div className="text-xs md:text-sm opacity-75">
          {stats.pendingDeposits ? `Pending: ${formatCurrency(stats.pendingDeposits)} FRW` : 'No pending deposits'}
        </div>
      </div>

      {/* Total Withdrawals Card */}
      <div className={`p-4 md:p-6 rounded-2xl border-2 ${darkMode ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/30' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'}`}>
        <div className="flex items-center mb-3 md:mb-4">
          <FaArrowUp className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mr-3`} />
          <h3 className="font-bold text-sm md:text-base">Total Withdrawals</h3>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
          {formatCurrency(stats.totalWithdrawn || 0)} FRW
        </div>
        <div className="text-xs md:text-sm opacity-75">
          {stats.pendingWithdrawals ? `Pending: ${formatCurrency(stats.pendingWithdrawals)} FRW` : 'No pending withdrawals'}
        </div>
      </div>

      {/* Earnings Card */}
      <div className={`p-4 md:p-6 rounded-2xl border-2 ${darkMode ? 'bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-700/30' : 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'}`}>
        <div className="flex items-center mb-3 md:mb-4">
          <FaCoins className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
          <h3 className="font-bold text-sm md:text-base">Earnings Wallet</h3>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
          {formatCurrency(wallets.earning || 0)} FRW
        </div>
        <div className="text-xs md:text-sm opacity-75">
          Daily profit: +25% • Total earned: {formatCurrency(stats.totalEarned || 0)} FRW
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;