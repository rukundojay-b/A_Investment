// src/components/pages/TransactionsHistory.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaHistory, FaArrowDown, FaArrowUp, FaCoins, FaUsers,
  FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
  FaFilter, FaDownload, FaEye, FaWallet, FaChartLine,
  FaSearch, FaCalendarAlt, FaChevronLeft, FaChevronRight,
  FaInfoCircle, FaBan, FaExchangeAlt, FaTimes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransactionsHistory = ({ darkMode, formatCurrency }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
    totalEarnings: 0,
    totalReferrals: 0,
    pendingCount: 0,
    completedCount: 0,
    rejectedCount: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, filterStatus, searchTerm, dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/user/transactions?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const allTransactions = response.data.transactions || [];
        setTransactions(allTransactions);
        calculateStats(allTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactions) => {
    const stats = transactions.reduce((acc, t) => {
      // Amount totals
      if (t.type === 'deposit' && t.status === 'completed') {
        acc.totalDeposits += t.amount || 0;
      } else if (t.type === 'withdraw' && t.status === 'completed') {
        acc.totalWithdrawals += t.amount || 0;
      } else if (t.type === 'investment') {
        acc.totalInvestments += t.amount || 0;
      } else if (t.type === 'earning') {
        acc.totalEarnings += t.amount || 0;
      } else if (t.type === 'referral') {
        acc.totalReferrals += t.amount || 0;
      }

      // Status counts
      if (t.status === 'pending') acc.pendingCount++;
      else if (t.status === 'completed') acc.completedCount++;
      else if (t.status === 'rejected') acc.rejectedCount++;

      return acc;
    }, {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalInvestments: 0,
      totalEarnings: 0,
      totalReferrals: 0,
      pendingCount: 0,
      completedCount: 0,
      rejectedCount: 0
    });

    setStats(stats);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount?.toString().includes(searchTerm)
      );
    }

    // Filter by date range
    const now = new Date();
    if (dateRange === 'today') {
      const today = new Date().setHours(0,0,0,0);
      filtered = filtered.filter(t => new Date(t.createdAt) >= today);
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(t => new Date(t.createdAt) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(t => new Date(t.createdAt) >= monthAgo);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit': return <FaArrowDown className="text-green-500" />;
      case 'withdraw': return <FaArrowUp className="text-red-500" />;
      case 'investment': return <FaChartLine className="text-purple-500" />;
      case 'earning': return <FaCoins className="text-yellow-500" />;
      case 'referral': return <FaUsers className="text-blue-500" />;
      case 'transfer': return <FaExchangeAlt className="text-cyan-500" />;
      default: return <FaHistory className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 flex items-center">
          <FaClock className="mr-1" /> Pending
        </span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center">
          <FaCheckCircle className="mr-1" /> Completed
        </span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 flex items-center">
          <FaTimesCircle className="mr-1" /> Rejected
        </span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">
          {status}
        </span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const csvData = filteredTransactions.map(t => ({
      Date: formatDate(t.createdAt),
      Type: t.type,
      Amount: t.amount,
      Status: t.status,
      Reference: t.reference,
      Description: t.description || ''
    }));

    const headers = ['Date', 'Type', 'Amount', 'Status', 'Reference', 'Description'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
            <p>Loading your transactions...</p>
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
            <FaHistory className="mr-3 text-blue-500" />
            Transaction History
          </h1>
          <p className="opacity-75 mt-1">View all your financial activities</p>
        </div>
        <button
          onClick={exportToCSV}
          className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${
            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          <FaDownload className="mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <StatCard 
          darkMode={darkMode}
          icon={<FaArrowDown />}
          label="Deposits"
          value={formatCurrency(stats.totalDeposits)}
          color="green"
        />
        <StatCard 
          darkMode={darkMode}
          icon={<FaArrowUp />}
          label="Withdrawals"
          value={formatCurrency(stats.totalWithdrawals)}
          color="red"
        />
        <StatCard 
          darkMode={darkMode}
          icon={<FaChartLine />}
          label="Investments"
          value={formatCurrency(stats.totalInvestments)}
          color="purple"
        />
        <StatCard 
          darkMode={darkMode}
          icon={<FaCoins />}
          label="Earnings"
          value={formatCurrency(stats.totalEarnings)}
          color="yellow"
        />
        <StatCard 
          darkMode={darkMode}
          icon={<FaUsers />}
          label="Referrals"
          value={formatCurrency(stats.totalReferrals)}
          color="blue"
        />
        <StatCard 
          darkMode={darkMode}
          icon={<FaClock />}
          label="Pending"
          value={stats.pendingCount}
          color="yellow"
        />
        <StatCard 
          darkMode={darkMode}
          icon={<FaCheckCircle />}
          label="Completed"
          value={stats.completedCount}
          color="green"
        />
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center mb-4">
          <FaFilter className="mr-2" />
          <h3 className="font-bold">Filter Transactions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Search by reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
            <option value="investment">Investments</option>
            <option value="earning">Earnings</option>
            <option value="referral">Referrals</option>
            <option value="transfer">Transfers</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <FaInfoCircle className="mx-auto text-3xl mb-3 opacity-50" />
                    <p>No transactions found</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((transaction) => (
                  <tr 
                    key={transaction._id}
                    className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="p-4 text-sm">
                      <div>{formatDate(transaction.createdAt)}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getTransactionIcon(transaction.type)}</span>
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      {transaction.amount?.toLocaleString()} FRW
                    </td>
                    <td className="p-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="p-4 text-sm">
                      <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {transaction.reference || 'N/A'}
                      </code>
                    </td>
                    <td className="p-4 text-sm opacity-75 max-w-xs truncate">
                      {transaction.description || '-'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailsModal(true);
                        }}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="p-4 flex items-center justify-between border-t dark:border-gray-700">
            <div className="text-sm opacity-75">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50`}
              >
                <FaChevronLeft />
              </button>
              <span className="px-4 py-2 rounded-lg bg-blue-500 text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          darkMode={darkMode}
          onClose={() => setShowDetailsModal(false)}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          getTransactionIcon={getTransactionIcon}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ darkMode, icon, label, value, color }) => {
  const colorClasses = {
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500'
  };

  return (
    <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`text-2xl mb-1 ${colorClasses[color]}`}>{icon}</div>
      <div className="text-xs opacity-75">{label}</div>
      <div className="font-bold text-sm truncate">{value}</div>
    </div>
  );
};

// Transaction Details Modal
const TransactionDetailsModal = ({ transaction, darkMode, onClose, formatCurrency, getStatusBadge, getTransactionIcon, formatDate }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
    <div className={`relative w-full max-w-2xl rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">Transaction Details</h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center p-4 rounded-lg bg-blue-500/10">
          <div className={`p-3 rounded-xl mr-4 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            {getTransactionIcon(transaction.type)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold capitalize">{transaction.type}</h3>
              {getStatusBadge(transaction.status)}
            </div>
            <p className="opacity-75">{transaction.description || 'No description'}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Amount" value={`${formatCurrency(transaction.amount)} FRW`} darkMode={darkMode} />
          <DetailItem label="Date" value={formatDate(transaction.createdAt)} darkMode={darkMode} />
          <DetailItem label="Reference" value={transaction.reference || 'N/A'} darkMode={darkMode} />
          <DetailItem label="Payment Method" value={transaction.paymentMethod || 'System'} darkMode={darkMode} capitalize />
          {transaction.phoneNumber && (
            <DetailItem label="Phone Number" value={transaction.phoneNumber} darkMode={darkMode} />
          )}
          {transaction.adminNote && (
            <DetailItem label="Admin Note" value={transaction.adminNote} darkMode={darkMode} />
          )}
          {transaction.processedAt && (
            <DetailItem label="Processed At" value={formatDate(transaction.processedAt)} darkMode={darkMode} />
          )}
        </div>

        {/* Raw Data */}
        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <p className="text-xs opacity-75 mb-2">Transaction ID: {transaction._id}</p>
          {transaction.metadata && (
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(transaction.metadata, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Detail Item Component
const DetailItem = ({ label, value, darkMode, capitalize }) => (
  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
    <div className="text-xs opacity-75 mb-1">{label}</div>
    <div className={`font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</div>
  </div>
);

// ✅ ADD THIS DEFAULT EXPORT AT THE BOTTOM
export default TransactionsHistory;