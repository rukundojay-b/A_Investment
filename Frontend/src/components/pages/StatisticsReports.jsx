// src/components/pages/StatisticsReports.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, FaCalendarAlt, FaDownload, FaSpinner,
  FaWallet, FaCoins, FaUsers, FaArrowUp, FaArrowDown,
  FaClock, FaCheckCircle, FaTimesCircle, FaPercent,
  FaHistory, FaChartBar, FaChartPie
} from 'react-icons/fa';
import axios from 'axios';

const StatisticsReports = ({ darkMode, formatCurrency }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    wallets: { main: 0, earning: 0 },
    totalInvested: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    totalDeposits: 0,
    activeInvestments: 0,
    totalReferrals: 0,
    referralEarnings: 0,
    dailyEarnings: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    rejectedTransactions: 0,
    avgInvestment: 0,
    avgDailyEarning: 0,
    bestDay: 0
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/user/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data;
        
        // Calculate additional stats
        const totalTransactions = data.transactions?.length || 0;
        const completedTransactions = data.transactions?.filter(t => t.status === 'completed').length || 0;
        const pendingTransactions = data.transactions?.filter(t => t.status === 'pending').length || 0;
        const rejectedTransactions = data.transactions?.filter(t => t.status === 'rejected').length || 0;
        
        const avgInvestment = data.activeInvestmentsCount > 0 
          ? (data.stats?.totalSpent || 0) / data.activeInvestmentsCount 
          : 0;
        
        const avgDailyEarning = data.activeInvestmentsCount > 0
          ? (data.stats?.dailyEarnings || 0) / data.activeInvestmentsCount
          : 0;

        // Find best day (you can implement this based on your data)
        const bestDay = data.stats?.dailyEarnings || 0;

        setStats({
          wallets: data.wallets || { main: 0, earning: 0 },
          totalInvested: data.stats?.totalSpent || 0,
          totalEarned: data.stats?.totalEarned || 0,
          totalWithdrawn: data.stats?.totalWithdrawn || 0,
          totalDeposits: data.stats?.totalDeposits || 0,
          activeInvestments: data.activeInvestmentsCount || 0,
          totalReferrals: data.stats?.totalReferrals || 0,
          referralEarnings: data.stats?.referralEarnings || 0,
          dailyEarnings: data.stats?.dailyEarnings || 0,
          pendingDeposits: data.stats?.pendingDeposits || 0,
          pendingWithdrawals: data.stats?.pendingWithdrawals || 0,
          totalTransactions,
          completedTransactions,
          pendingTransactions,
          rejectedTransactions,
          avgInvestment,
          avgDailyEarning,
          bestDay
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = (invested, earned) => {
    if (!invested || invested === 0) return 0;
    return ((earned / invested) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
            <p>Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FaChartLine className="mr-3 text-purple-500" />
            Statistics & Reports
          </h1>
          <p className="opacity-75 mt-1">Detailed analysis of your investment performance</p>
        </div>
        <button
          onClick={() => window.print()}
          className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${
            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          <FaDownload className="mr-2" />
          Download Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Balance */}
        <MetricCard
          darkMode={darkMode}
          icon={<FaWallet className="text-2xl" />}
          title="Total Balance"
          value={formatCurrency((stats.wallets?.main || 0) + (stats.wallets?.earning || 0))}
          subtitle="Main + Earnings"
          color="blue"
        />

        {/* Total Invested */}
        <MetricCard
          darkMode={darkMode}
          icon={<FaChartLine className="text-2xl" />}
          title="Total Invested"
          value={formatCurrency(stats.totalInvested)}
          subtitle="Active Investments"
          color="purple"
        />

        {/* Total Earned */}
        <MetricCard
          darkMode={darkMode}
          icon={<FaCoins className="text-2xl" />}
          title="Total Earned"
          value={formatCurrency(stats.totalEarned)}
          subtitle="All-time profits"
          color="green"
        />

        {/* ROI Percentage */}
        <MetricCard
          darkMode={darkMode}
          icon={<FaPercent className="text-2xl" />}
          title="ROI"
          value={`${calculateROI(stats.totalInvested, stats.totalEarned)}%`}
          subtitle="Return on Investment"
          color="yellow"
        />
      </div>

      {/* Performance Charts - Keeping your design but with real data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Earnings Chart */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaChartBar className="mr-2 text-blue-500" />
            Daily Performance
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="opacity-75">Daily Earnings:</span>
              <span className="text-xl font-bold text-green-500">{formatCurrency(stats.dailyEarnings)} FRW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-75">Best Day:</span>
              <span className="text-lg font-bold text-yellow-500">{formatCurrency(stats.bestDay)} FRW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-75">Average Daily:</span>
              <span className="text-lg font-bold text-blue-500">{formatCurrency(stats.avgDailyEarning)} FRW</span>
            </div>
          </div>
        </div>

        {/* Investment Distribution */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaChartPie className="mr-2 text-purple-500" />
            Investment Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="opacity-75">Active Investments:</span>
              <span className="text-xl font-bold text-purple-500">{stats.activeInvestments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-75">Average Investment:</span>
              <span className="text-lg font-bold text-blue-500">{formatCurrency(stats.avgInvestment)} FRW</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${stats.activeInvestments > 0 ? 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Transaction Stats */}
        <StatsCard
          darkMode={darkMode}
          title="Transaction Statistics"
          items={[
            { label: 'Total Transactions', value: stats.totalTransactions },
            { label: 'Completed', value: stats.completedTransactions, color: 'text-green-500' },
            { label: 'Pending', value: stats.pendingTransactions, color: 'text-yellow-500' },
            { label: 'Rejected', value: stats.rejectedTransactions, color: 'text-red-500' },
          ]}
        />

        {/* Referral Stats */}
        <StatsCard
          darkMode={darkMode}
          title="Referral Statistics"
          items={[
            { label: 'Total Referrals', value: stats.totalReferrals },
            { label: 'Active Referrals', value: stats.totalReferrals, color: 'text-green-500' },
            { label: 'Referral Earnings', value: formatCurrency(stats.referralEarnings) + ' FRW' },
            { label: 'Commission Rate', value: '10%', color: 'text-purple-500' },
          ]}
        />

        {/* Investment Stats */}
        <StatsCard
          darkMode={darkMode}
          title="Investment Details"
          items={[
            { label: 'Active Investments', value: stats.activeInvestments },
            { label: 'Average Investment', value: formatCurrency(stats.avgInvestment) + ' FRW' },
            { label: 'Daily Average', value: formatCurrency(stats.avgDailyEarning) + ' FRW' },
            { label: 'Best Day', value: formatCurrency(stats.bestDay) + ' FRW', color: 'text-green-500' },
          ]}
        />
      </div>

      {/* Performance Timeline - Keeping your design */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/20">
            <div className="font-medium">Total Invested</div>
            <div className="flex items-center">
              <FaArrowDown className="text-blue-500 mr-2" size={12} />
              <span className="text-sm">{formatCurrency(stats.totalInvested)} FRW</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/20">
            <div className="font-medium">Total Earned</div>
            <div className="flex items-center">
              <FaArrowUp className="text-green-500 mr-2" size={12} />
              <span className="text-sm">{formatCurrency(stats.totalEarned)} FRW</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/20">
            <div className="font-medium">Total Withdrawn</div>
            <div className="flex items-center">
              <FaArrowUp className="text-red-500 mr-2" size={12} />
              <span className="text-sm">{formatCurrency(stats.totalWithdrawn)} FRW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component - Keeping your design
const MetricCard = ({ darkMode, icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500'
  };

  return (
    <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className={colorClasses[color]}>{icon}</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm opacity-75 mb-1">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs opacity-50 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

// Stats Card Component - Keeping your design
const StatsCard = ({ darkMode, title, items }) => (
  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="opacity-75">{item.label}</span>
          <span className={`font-bold ${item.color || ''}`}>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default StatisticsReports;