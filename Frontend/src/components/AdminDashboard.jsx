// // src/components/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   FaUsers, 
//   FaMoneyBillWave, 
//   FaChartLine, 
//   FaHistory, 
//   FaUserCheck, 
//   FaUserTimes,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSpinner,
//   FaSearch,
//   FaEye,
//   FaWallet,
//   FaPhone,
//   FaCalendar,
//   FaExclamationTriangle,
//   FaDownload,
//   FaRedo,
//   FaSignOutAlt
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AdminDashboard = ({ darkMode, setDarkMode }) => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [users, setUsers] = useState([]);
//   const [pendingTransactions, setPendingTransactions] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState({
//     users: false,
//     transactions: false,
//     stats: false
//   });
//   const [processing, setProcessing] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [adminNote, setAdminNote] = useState('');
//   const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'suspended'
//   const [adminData, setAdminData] = useState(null);

//   // Get admin token
//   const getToken = () => localStorage.getItem('adminToken');

//   // Fetch all data on component mount
//   useEffect(() => {
//     // Load admin data from localStorage
//     const storedAdmin = localStorage.getItem('admin');
//     if (storedAdmin) {
//       setAdminData(JSON.parse(storedAdmin));
//     }
//     fetchAllData();
//   }, [activeTab]);

//   const fetchAllData = async () => {
//     if (activeTab === 'overview' || activeTab === 'users') {
//       await fetchUsers();
//       await fetchStats();
//     }
//     if (activeTab === 'transactions') {
//       await fetchPendingTransactions();
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, users: true }));
//       const token = getToken();
      
//       const response = await axios.get('http://localhost:5000/api/admin/users', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setUsers(response.data.users);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         handleLogout();
//       } else {
//         alert('Failed to fetch users. Please check if you have admin privileges.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, users: false }));
//     }
//   };

//   const fetchPendingTransactions = async () => {
//     try {
//       setLoading(prev => ({ ...prev, transactions: true }));
//       const token = getToken();
      
//       const response = await axios.get('http://localhost:5000/api/admin/transactions/pending', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setPendingTransactions(response.data.transactions);
//       }
//     } catch (error) {
//       console.error('Error fetching pending transactions:', error);
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         handleLogout();
//       } else {
//         alert('Failed to fetch pending transactions.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, transactions: false }));
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       setLoading(prev => ({ ...prev, stats: true }));
//       const token = getToken();
      
//       const response = await axios.get('http://localhost:5000/api/admin/stats', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setStats(response.data.stats);
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         handleLogout();
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, stats: false }));
//     }
//   };

//   const handleApproveTransaction = async (transactionId) => {
//     if (!adminNote.trim() && !window.confirm('Approve without adding a note?')) {
//       return;
//     }

//     try {
//       setProcessing(prev => ({ ...prev, [transactionId]: 'approve' }));
//       const token = getToken();
      
//       const response = await axios.post(
//         `http://localhost:5000/api/admin/transactions/${transactionId}/approve`,
//         { note: adminNote || 'Transaction approved' },
//         {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }
//       );

//       if (response.data.success) {
//         alert('Transaction approved successfully!');
//         // Remove from pending list
//         setPendingTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
//         // Refresh stats
//         await fetchStats();
//         // Clear note
//         setAdminNote('');
//       }
//     } catch (error) {
//       console.error('Error approving transaction:', error);
//       alert(error.response?.data?.message || 'Failed to approve transaction');
//     } finally {
//       setProcessing(prev => ({ ...prev, [transactionId]: false }));
//     }
//   };

//   const handleRejectTransaction = async (transactionId) => {
//     if (!adminNote.trim()) {
//       alert('Please provide a reason for rejection');
//       return;
//     }

//     try {
//       setProcessing(prev => ({ ...prev, [transactionId]: 'reject' }));
//       const token = getToken();
      
//       const response = await axios.post(
//         `http://localhost:5000/api/admin/transactions/${transactionId}/reject`,
//         { note: adminNote },
//         {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }
//       );

//       if (response.data.success) {
//         alert('Transaction rejected successfully!');
//         // Remove from pending list
//         setPendingTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
//         // Refresh stats
//         await fetchStats();
//         // Clear note
//         setAdminNote('');
//       }
//     } catch (error) {
//       console.error('Error rejecting transaction:', error);
//       alert(error.response?.data?.message || 'Failed to reject transaction');
//     } finally {
//       setProcessing(prev => ({ ...prev, [transactionId]: false }));
//     }
//   };

//   const handleUpdateUserStatus = async (userId, newStatus) => {
//     if (!window.confirm(`Are you sure you want to ${newStatus} this user?`)) {
//       return;
//     }

//     try {
//       setProcessing(prev => ({ ...prev, [userId]: 'status' }));
//       const token = getToken();
      
//       const response = await axios.put(
//         `http://localhost:5000/api/admin/users/${userId}/status`,
//         { status: newStatus },
//         {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }
//       );

//       if (response.data.success) {
//         alert(`User status updated to ${newStatus}`);
//         // Update user in local state
//         setUsers(prev => prev.map(user => 
//           user.id === userId ? { ...user, status: newStatus } : user
//         ));
//         // Refresh stats
//         await fetchStats();
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       alert(error.response?.data?.message || 'Failed to update user status');
//     } finally {
//       setProcessing(prev => ({ ...prev, [userId]: false }));
//     }
//   };

//   const handleViewUserDetails = async (userId) => {
//     try {
//       const token = getToken();
//       const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setSelectedUser(response.data.user);
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         handleLogout();
//       } else {
//         alert('Failed to fetch user details');
//       }
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('admin');
//     navigate('/admin/login');
//   };

//   const exportToCSV = () => {
//     let data = [];
//     let filename = '';
    
//     if (activeTab === 'users') {
//       filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
//       data = [
//         ['ID', 'Username', 'Phone', 'Email', 'Status', 'Registration Date', 'Last Login', 'Main Wallet', 'Earnings Wallet', 'Total Deposits', 'Total Withdrawals'],
//         ...users.map(user => [
//           user.id,
//           user.username,
//           user.phone,
//           user.email || '',
//           user.status,
//           new Date(user.createdAt).toLocaleDateString(),
//           new Date(user.lastLogin).toLocaleDateString(),
//           user.wallets?.main || 0,
//           user.wallets?.earning || 0,
//           user.stats?.totalDeposits || 0,
//           user.stats?.totalWithdrawn || 0
//         ])
//       ];
//     } else if (activeTab === 'transactions') {
//       filename = `pending_transactions_${new Date().toISOString().split('T')[0]}.csv`;
//       data = [
//         ['Transaction ID', 'User', 'Type', 'Amount', 'Payment Method', 'Phone', 'Reference', 'Date'],
//         ...pendingTransactions.map(tx => [
//           tx.transactionId,
//           tx.userName,
//           tx.type,
//           tx.amount,
//           tx.paymentMethod,
//           tx.phoneNumber,
//           tx.reference,
//           new Date(tx.createdAt).toLocaleString()
//         ])
//       ];
//     }

//     const csvContent = data.map(row => row.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     a.click();
//   };

//   // Filter users based on search term and view mode
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone.includes(searchTerm) ||
//       (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesViewMode = 
//       viewMode === 'all' || 
//       (viewMode === 'active' && user.status === 'active') ||
//       (viewMode === 'suspended' && user.status === 'suspended');
    
//     return matchesSearch && matchesViewMode;
//   });

//   // Calculate totals for pending transactions
//   const pendingTotals = pendingTransactions.reduce((totals, tx) => {
//     if (tx.type === 'deposit') {
//       totals.deposits += tx.amount;
//     } else if (tx.type === 'withdraw') {
//       totals.withdrawals += tx.amount;
//     }
//     totals.total += tx.amount;
//     return totals;
//   }, { deposits: 0, withdrawals: 0, total: 0 });

//   return (
//     <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
//             <p className="opacity-75">Manage users, transactions, and system statistics</p>
//             {adminData && (
//               <p className="text-sm mt-2 text-red-400">
//                 Logged in as: {adminData.email} ({adminData.role})
//               </p>
//             )}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center hover:bg-red-600 transition-colors"
//           >
//             <FaSignOutAlt className="mr-2" />
//             Logout
//           </button>
//         </div>
        
//         <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
//           {/* Tabs */}
//           <div className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
//             {[
//               { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
//               { id: 'users', label: 'Users', icon: <FaUsers /> },
//               { id: 'transactions', label: 'Transactions', icon: <FaHistory /> },
//               { id: 'stats', label: 'Statistics', icon: <FaMoneyBillWave /> }
//             ].map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
//                   activeTab === tab.id
//                     ? darkMode 
//                       ? 'bg-blue-600 text-white shadow-lg' 
//                       : 'bg-white text-blue-600 shadow'
//                     : darkMode 
//                       ? 'text-gray-300 hover:text-white' 
//                       : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Refresh Button */}
//           <button
//             onClick={fetchAllData}
//             className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center hover:bg-blue-600 transition-colors"
//           >
//             <FaRedo className="mr-2" />
//             Refresh Data
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="space-y-6">
//         {/* Overview Tab */}
//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             {/* Stats Cards */}
//             {stats && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <div className="flex items-center">
//                     <div className="p-3 rounded-xl bg-blue-500 text-white mr-4">
//                       <FaUsers size={24} />
//                     </div>
//                     <div>
//                       <div className="text-2xl font-bold">{stats.users.total}</div>
//                       <div className="text-sm opacity-75">Total Users</div>
//                       <div className="text-xs mt-1">
//                         <span className="text-green-500">{stats.users.active} active</span>
//                         {' • '}
//                         <span className="text-red-500">{stats.users.suspended} suspended</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <div className="flex items-center">
//                     <div className="p-3 rounded-xl bg-green-500 text-white mr-4">
//                       <FaMoneyBillWave size={24} />
//                     </div>
//                     <div>
//                       <div className="text-2xl font-bold">
//                         {stats.finances.totalMain?.toLocaleString()} FRW
//                       </div>
//                       <div className="text-sm opacity-75">Total Main Wallet</div>
//                       <div className="text-xs mt-1">
//                         Earnings: {stats.finances.totalEarning?.toLocaleString()} FRW
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <div className="flex items-center">
//                     <div className="p-3 rounded-xl bg-purple-500 text-white mr-4">
//                       <FaChartLine size={24} />
//                     </div>
//                     <div>
//                       <div className="text-2xl font-bold">
//                         {stats.transactions.pending}
//                       </div>
//                       <div className="text-sm opacity-75">Pending Transactions</div>
//                       <div className="text-xs mt-1">
//                         {stats.transactions.pendingDeposits} deposits • {stats.transactions.pendingWithdrawals} withdrawals
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <div className="flex items-center">
//                     <div className="p-3 rounded-xl bg-orange-500 text-white mr-4">
//                       <FaHistory size={24} />
//                     </div>
//                     <div>
//                       <div className="text-2xl font-bold">
//                         {stats.transactions.total}
//                       </div>
//                       <div className="text-sm opacity-75">Total Transactions</div>
//                       <div className="text-xs mt-1">
//                         {stats.transactions.deposits} deposits • {stats.transactions.withdrawals} withdrawals
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Quick Actions */}
//             <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//               <h2 className="text-xl font-bold mb-4 flex items-center">
//                 <FaUserCheck className="mr-2" />
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button
//                   onClick={() => {
//                     setActiveTab('transactions');
//                     fetchPendingTransactions();
//                   }}
//                   className={`p-4 rounded-xl text-left transition-all ${
//                     darkMode 
//                       ? 'bg-gray-700 hover:bg-gray-600' 
//                       : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">Review Pending Transactions</div>
//                   <div className="text-sm opacity-75">
//                     {pendingTransactions.length} transactions awaiting approval
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     setActiveTab('users');
//                     fetchUsers();
//                   }}
//                   className={`p-4 rounded-xl text-left transition-all ${
//                     darkMode 
//                       ? 'bg-gray-700 hover:bg-gray-600' 
//                       : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">Manage Users</div>
//                   <div className="text-sm opacity-75">
//                     View and manage all registered users
//                   </div>
//                 </button>

//                 <button
//                   onClick={fetchAllData}
//                   className={`p-4 rounded-xl text-left transition-all ${
//                     darkMode 
//                       ? 'bg-gray-700 hover:bg-gray-600' 
//                       : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">Refresh All Data</div>
//                   <div className="text-sm opacity-75">
//                     Update all statistics and lists
//                   </div>
//                 </button>
//               </div>
//             </div>

//             {/* Recent Pending Transactions */}
//             <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold flex items-center">
//                   <FaExclamationTriangle className="mr-2 text-yellow-500" />
//                   Recent Pending Transactions
//                 </h2>
//                 <button
//                   onClick={() => setActiveTab('transactions')}
//                   className="text-sm text-blue-500 hover:text-blue-600"
//                 >
//                   View All →
//                 </button>
//               </div>
              
//               {loading.transactions ? (
//                 <div className="text-center py-8">
//                   <FaSpinner className="animate-spin mx-auto text-2xl mb-2" />
//                   <p>Loading transactions...</p>
//                 </div>
//               ) : pendingTransactions.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="opacity-75">No pending transactions</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {pendingTransactions.slice(0, 5).map(tx => (
//                     <div
//                       key={tx.transactionId}
//                       className={`p-4 rounded-xl border ${
//                         darkMode 
//                           ? 'bg-gray-700/30 border-gray-600' 
//                           : 'bg-gray-100 border-gray-200'
//                       }`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <div className="font-bold text-lg">
//                             {tx.amount.toLocaleString()} FRW
//                           </div>
//                           <div className="text-sm opacity-75">
//                             {tx.userName} • {tx.type} • {tx.paymentMethod}
//                           </div>
//                           <div className="text-xs mt-1">
//                             {new Date(tx.createdAt).toLocaleString()}
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleApproveTransaction(tx.transactionId)}
//                             className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleRejectTransaction(tx.transactionId)}
//                             className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Users Tab */}
//         {activeTab === 'users' && (
//           <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
//             {/* Users Header */}
//             <div className="p-6 border-b dark:border-gray-700">
//               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold flex items-center">
//                     <FaUsers className="mr-2" />
//                     User Management
//                   </h2>
//                   <p className="opacity-75 mt-1">
//                     {users.length} total users registered in the system
//                   </p>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={exportToCSV}
//                     className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center"
//                   >
//                     <FaDownload className="mr-2" />
//                     Export CSV
//                   </button>
//                 </div>
//               </div>

//               {/* Search and Filter */}
//               <div className="mt-6 flex flex-col md:flex-row gap-4">
//                 <div className="relative flex-1">
//                   <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
//                   <input
//                     type="text"
//                     placeholder="Search users by name, phone, or email..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
//                       darkMode 
//                         ? 'bg-gray-700 border-gray-600 text-white' 
//                         : 'bg-white border-gray-300'
//                     }`}
//                   />
//                 </div>

//                 <div className="flex space-x-2">
//                   {['all', 'active', 'suspended'].map(mode => (
//                     <button
//                       key={mode}
//                       onClick={() => setViewMode(mode)}
//                       className={`px-4 py-2 rounded-lg capitalize ${
//                         viewMode === mode
//                           ? darkMode 
//                             ? 'bg-blue-600 text-white' 
//                             : 'bg-blue-500 text-white'
//                           : darkMode 
//                             ? 'bg-gray-700 text-gray-300' 
//                             : 'bg-gray-200 text-gray-600'
//                       }`}
//                     >
//                       {mode}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Users List */}
//             <div className="overflow-x-auto">
//               {loading.users ? (
//                 <div className="text-center py-12">
//                   <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
//                   <p>Loading users...</p>
//                 </div>
//               ) : filteredUsers.length === 0 ? (
//                 <div className="text-center py-12">
//                   <p className="opacity-75">No users found</p>
//                 </div>
//               ) : (
//                 <table className="w-full">
//                   <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
//                     <tr>
//                       <th className="p-4 text-left">User</th>
//                       <th className="p-4 text-left">Contact</th>
//                       <th className="p-4 text-left">Wallets</th>
//                       <th className="p-4 text-left">Stats</th>
//                       <th className="p-4 text-left">Status</th>
//                       <th className="p-4 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map(user => (
//                       <tr 
//                         key={user.id}
//                         className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
//                       >
//                         <td className="p-4">
//                           <div className="font-bold">{user.username}</div>
//                           <div className="text-sm opacity-75">
//                             Joined: {new Date(user.createdAt).toLocaleDateString()}
//                           </div>
//                           {user.referralCode && (
//                             <div className="text-xs mt-1">
//                               Ref: <code className="bg-black/10 px-2 py-1 rounded">{user.referralCode}</code>
//                             </div>
//                           )}
//                         </td>
                        
//                         <td className="p-4">
//                           <div className="flex items-center mb-1">
//                             <FaPhone className="mr-2 opacity-75" size={12} />
//                             <span>{user.phone}</span>
//                           </div>
//                           {user.email && (
//                             <div className="text-sm opacity-75">{user.email}</div>
//                           )}
//                         </td>
                        
//                         <td className="p-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center">
//                               <FaWallet className="mr-2 text-green-500" size={12} />
//                               <span className="font-bold">{user.wallets?.main?.toLocaleString() || 0} FRW</span>
//                               <span className="text-xs ml-2 opacity-75">Main</span>
//                             </div>
//                             <div className="flex items-center">
//                               <FaWallet className="mr-2 text-blue-500" size={12} />
//                               <span>{user.wallets?.earning?.toLocaleString() || 0} FRW</span>
//                               <span className="text-xs ml-2 opacity-75">Earnings</span>
//                             </div>
//                           </div>
//                         </td>
                        
//                         <td className="p-4">
//                           <div className="space-y-1 text-sm">
//                             <div>Deposits: {user.stats?.totalDeposits?.toLocaleString() || 0} FRW</div>
//                             <div>Withdrawn: {user.stats?.totalWithdrawn?.toLocaleString() || 0} FRW</div>
//                             <div>Earned: {user.stats?.totalEarned?.toLocaleString() || 0} FRW</div>
//                           </div>
//                         </td>
                        
//                         <td className="p-4">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             user.status === 'active'
//                               ? 'bg-green-500/20 text-green-400'
//                               : user.status === 'suspended'
//                               ? 'bg-red-500/20 text-red-400'
//                               : 'bg-yellow-500/20 text-yellow-400'
//                           }`}>
//                             {user.status}
//                           </span>
//                         </td>
                        
//                         <td className="p-4">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewUserDetails(user.id)}
//                               className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm flex items-center"
//                               title="View Details"
//                             >
//                               <FaEye size={12} />
//                             </button>
                            
//                             {user.status === 'active' ? (
//                               <button
//                                 onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
//                                 disabled={processing[user.id]}
//                                 className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm flex items-center"
//                                 title="Suspend User"
//                               >
//                                 {processing[user.id] ? (
//                                   <FaSpinner className="animate-spin" />
//                                 ) : (
//                                   <FaUserTimes size={12} />
//                                 )}
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() => handleUpdateUserStatus(user.id, 'active')}
//                                 disabled={processing[user.id]}
//                                 className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm flex items-center"
//                                 title="Activate User"
//                               >
//                                 {processing[user.id] ? (
//                                   <FaSpinner className="animate-spin" />
//                                 ) : (
//                                   <FaUserCheck size={12} />
//                                 )}
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Transactions Tab */}
//         {activeTab === 'transactions' && (
//           <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
//             {/* Transactions Header */}
//             <div className="p-6 border-b dark:border-gray-700">
//               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold flex items-center">
//                     <FaHistory className="mr-2" />
//                     Pending Transactions
//                   </h2>
//                   <div className="mt-2 flex flex-wrap gap-4">
//                     <div className="flex items-center">
//                       <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
//                       <span className="text-sm">Deposits: {pendingTotals.deposits.toLocaleString()} FRW</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
//                       <span className="text-sm">Withdrawals: {pendingTotals.withdrawals.toLocaleString()} FRW</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
//                       <span className="text-sm">Total: {pendingTotals.total.toLocaleString()} FRW</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={exportToCSV}
//                     className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center"
//                   >
//                     <FaDownload className="mr-2" />
//                     Export CSV
//                   </button>
//                 </div>
//               </div>

//               {/* Admin Note Input */}
//               <div className="mt-6">
//                 <label className="block text-sm font-medium mb-2">
//                   Admin Note (required for rejections, optional for approvals)
//                 </label>
//                 <input
//                   type="text"
//                   value={adminNote}
//                   onChange={(e) => setAdminNote(e.target.value)}
//                   placeholder="Enter note for transaction actions..."
//                   className={`w-full p-3 rounded-lg border ${
//                     darkMode 
//                       ? 'bg-gray-700 border-gray-600 text-white' 
//                       : 'bg-white border-gray-300'
//                   }`}
//                 />
//                 <p className="text-xs opacity-75 mt-1">
//                   This note will be visible to the user and logged in the transaction.
//                 </p>
//               </div>
//             </div>

//             {/* Transactions List */}
//             <div className="overflow-x-auto">
//               {loading.transactions ? (
//                 <div className="text-center py-12">
//                   <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
//                   <p>Loading transactions...</p>
//                 </div>
//               ) : pendingTransactions.length === 0 ? (
//                 <div className="text-center py-12">
//                   <p className="opacity-75">No pending transactions found</p>
//                 </div>
//               ) : (
//                 <div className="divide-y dark:divide-gray-700">
//                   {pendingTransactions.map(tx => (
//                     <div
//                       key={tx.transactionId}
//                       className={`p-6 transition-colors ${
//                         darkMode 
//                           ? 'hover:bg-gray-700/50' 
//                           : 'hover:bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                         {/* Transaction Info */}
//                         <div className="flex-1">
//                           <div className="flex items-start mb-3">
//                             <div className={`p-3 rounded-xl mr-4 ${
//                               tx.type === 'deposit'
//                                 ? darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
//                                 : darkMode ? 'bg-green-900/30' : 'bg-green-100'
//                             }`}>
//                               <FaMoneyBillWave className={
//                                 tx.type === 'deposit' ? 'text-blue-500' : 'text-green-500'
//                               } size={20} />
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex flex-wrap items-center gap-2 mb-2">
//                                 <div className="font-bold text-xl">
//                                   {tx.amount.toLocaleString()} FRW
//                                 </div>
//                                 <div className="text-sm opacity-75 capitalize">
//                                   {tx.type} • {tx.paymentMethod}
//                                 </div>
//                                 <div className="text-sm">
//                                   <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
//                                     Pending
//                                   </span>
//                                 </div>
//                               </div>
                              
//                               <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
//                                 <div className="flex items-center">
//                                   <FaUserCheck className="mr-2 opacity-75" size={12} />
//                                   <span className="font-medium">{tx.userName}</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                   <FaPhone className="mr-2 opacity-75" size={12} />
//                                   <span>{tx.phoneNumber}</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                   <FaCalendar className="mr-2 opacity-75" size={12} />
//                                   <span>{new Date(tx.createdAt).toLocaleString()}</span>
//                                 </div>
//                               </div>
                              
//                               {tx.description && (
//                                 <div className="mt-2 text-sm opacity-75">
//                                   {tx.description}
//                                 </div>
//                               )}
                              
//                               {tx.reference && (
//                                 <div className="mt-2 text-xs">
//                                   Reference: <code className={`px-2 py-1 rounded ${
//                                     darkMode ? 'bg-gray-700' : 'bg-gray-200'
//                                   }`}>
//                                     {tx.reference}
//                                   </code>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
//                           <button
//                             onClick={() => handleApproveTransaction(tx.transactionId)}
//                             disabled={processing[tx.transactionId]}
//                             className="px-6 py-3 rounded-lg bg-green-500 text-white font-medium flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                           >
//                             {processing[tx.transactionId] === 'approve' ? (
//                               <>
//                                 <FaSpinner className="animate-spin mr-2" />
//                                 Processing...
//                               </>
//                             ) : (
//                               <>
//                                 <FaCheckCircle className="mr-2" />
//                                 Approve
//                               </>
//                             )}
//                           </button>
                          
//                           <button
//                             onClick={() => handleRejectTransaction(tx.transactionId)}
//                             disabled={processing[tx.transactionId]}
//                             className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                           >
//                             {processing[tx.transactionId] === 'reject' ? (
//                               <>
//                                 <FaSpinner className="animate-spin mr-2" />
//                                 Processing...
//                               </>
//                             ) : (
//                               <>
//                                 <FaTimesCircle className="mr-2" />
//                                 Reject
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Statistics Tab */}
//         {activeTab === 'stats' && (
//           <div className="space-y-6">
//             {stats ? (
//               <>
//                 {/* Financial Overview */}
//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <h2 className="text-2xl font-bold mb-6 flex items-center">
//                     <FaMoneyBillWave className="mr-2" />
//                     Financial Overview
//                   </h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Total Main Wallet</div>
//                       <div className="text-2xl font-bold text-green-500">
//                         {stats.finances.totalMain?.toLocaleString()} FRW
//                       </div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Total Earnings Wallet</div>
//                       <div className="text-2xl font-bold text-blue-500">
//                         {stats.finances.totalEarning?.toLocaleString()} FRW
//                       </div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Total Deposits</div>
//                       <div className="text-2xl font-bold">
//                         {stats.finances.totalDeposits?.toLocaleString()} FRW
//                       </div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Total Withdrawals</div>
//                       <div className="text-2xl font-bold">
//                         {stats.finances.totalWithdrawals?.toLocaleString()} FRW
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* User Statistics */}
//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <h2 className="text-2xl font-bold mb-6 flex items-center">
//                     <FaUsers className="mr-2" />
//                     User Statistics
//                   </h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Total Users</div>
//                       <div className="text-2xl font-bold">{stats.users.total}</div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Active Users</div>
//                       <div className="text-2xl font-bold text-green-500">{stats.users.active}</div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Suspended Users</div>
//                       <div className="text-2xl font-bold text-red-500">{stats.users.suspended}</div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">New Today</div>
//                       <div className="text-2xl font-bold text-blue-500">{stats.users.today}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transaction Statistics */}
//                 <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//                   <h2 className="text-2xl font-bold mb-6 flex items-center">
//                     <FaHistory className="mr-2" />
//                     Transaction Statistics
//                   </h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Total Transactions</div>
//                       <div className="text-2xl font-bold">{stats.transactions.total}</div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Pending</div>
//                       <div className="text-2xl font-bold text-yellow-500">{stats.transactions.pending}</div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Completed</div>
//                       <div className="text-2xl font-bold text-green-500">{stats.transactions.completed}</div>
//                     </div>
                    
//                     <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                       <div className="text-sm opacity-75 mb-1">Rejected</div>
//                       <div className="text-2xl font-bold text-red-500">{stats.transactions.rejected}</div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
//                 <p>Loading statistics...</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* User Details Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
//           <div className={`relative w-full max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto ${
//             darkMode ? 'bg-gray-800' : 'bg-white'
//           } p-6`}>
//             <div className="flex justify-between items-start mb-6">
//               <h3 className="text-2xl font-bold">User Details</h3>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-6">
//               {/* Basic Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-bold mb-2">Basic Information</h4>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Username:</span>
//                       <span className="font-medium">{selectedUser.username}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Phone:</span>
//                       <span className="font-medium">{selectedUser.phone}</span>
//                     </div>
//                     {selectedUser.email && (
//                       <div className="flex justify-between">
//                         <span className="opacity-75">Email:</span>
//                         <span className="font-medium">{selectedUser.email}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Status:</span>
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         selectedUser.status === 'active'
//                           ? 'bg-green-500/20 text-green-400'
//                           : selectedUser.status === 'suspended'
//                           ? 'bg-red-500/20 text-red-400'
//                           : 'bg-yellow-500/20 text-yellow-400'
//                       }`}>
//                         {selectedUser.status}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Joined:</span>
//                       <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Last Login:</span>
//                       <span className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Wallet Information */}
//                 <div>
//                   <h4 className="font-bold mb-2">Wallet Information</h4>
//                   <div className="space-y-3">
//                     <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
//                       <div className="text-sm opacity-75">Main Wallet</div>
//                       <div className="text-xl font-bold text-green-500">
//                         {selectedUser.wallets?.main?.toLocaleString() || 0} FRW
//                       </div>
//                     </div>
//                     <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
//                       <div className="text-sm opacity-75">Earnings Wallet</div>
//                       <div className="text-xl font-bold text-blue-500">
//                         {selectedUser.wallets?.earning?.toLocaleString() || 0} FRW
//                       </div>
//                     </div>
//                     <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
//                       <div className="text-sm opacity-75">Reserved Funds</div>
//                       <div className="text-xl font-bold text-yellow-500">
//                         {selectedUser.wallets?.reserved?.toLocaleString() || 0} FRW
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Statistics */}
//               <div>
//                 <h4 className="font-bold mb-3">User Statistics</h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                     <div className="text-sm opacity-75">Total Deposits</div>
//                     <div className="text-lg font-bold">
//                       {selectedUser.stats?.totalDeposits?.toLocaleString() || 0} FRW
//                     </div>
//                   </div>
//                   <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                     <div className="text-sm opacity-75">Total Withdrawn</div>
//                     <div className="text-lg font-bold">
//                       {selectedUser.stats?.totalWithdrawn?.toLocaleString() || 0} FRW
//                     </div>
//                   </div>
//                   <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                     <div className="text-sm opacity-75">Total Earned</div>
//                     <div className="text-lg font-bold">
//                       {selectedUser.stats?.totalEarned?.toLocaleString() || 0} FRW
//                     </div>
//                   </div>
//                   <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//                     <div className="text-sm opacity-75">Referral Earnings</div>
//                     <div className="text-lg font-bold">
//                       {selectedUser.stats?.referralEarnings?.toLocaleString() || 0} FRW
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Actions */}
//               <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
//                 <button
//                   onClick={() => {
//                     handleUpdateUserStatus(
//                       selectedUser.id,
//                       selectedUser.status === 'active' ? 'suspended' : 'active'
//                     );
//                     setSelectedUser(null);
//                   }}
//                   className="px-4 py-2 rounded-lg bg-red-500 text-white"
//                 >
//                   {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
//                 </button>
//                 <button
//                   onClick={() => setSelectedUser(null)}
//                   className="px-4 py-2 rounded-lg bg-gray-500 text-white"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

































// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaHistory, 
  FaUserCheck, 
  FaUserTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaEye,
  FaWallet,
  FaPhone,
  FaCalendar,
  FaExclamationTriangle,
  FaDownload,
  FaRedo,
  FaSignOutAlt,
  FaChartPie,
  FaCoins,
  FaClock,
  FaPercentage,
  FaBoxes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState({
    users: false,
    transactions: false,
    investments: false,
    stats: false
  });
  const [processing, setProcessing] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'suspended'
  const [investmentFilter, setInvestmentFilter] = useState('all'); // 'all', 'active', 'completed'
  const [adminData, setAdminData] = useState(null);
  const [dateRange, setDateRange] = useState('all'); // 'all', 'today', 'week', 'month'

  // Get admin token
  const getToken = () => localStorage.getItem('adminToken');

  // Fetch all data on component mount
  useEffect(() => {
    // Load admin data from localStorage
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
    fetchAllData();
  }, [activeTab, dateRange]);

  const fetchAllData = async () => {
    if (activeTab === 'overview' || activeTab === 'users') {
      await fetchUsers();
      await fetchStats();
    }
    if (activeTab === 'transactions') {
      await fetchPendingTransactions();
    }
    if (activeTab === 'investments') {
      await fetchInvestments();
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const token = getToken();
      
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      } else {
        alert('Failed to fetch users. Please check if you have admin privileges.');
      }
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const token = getToken();
      
      const response = await axios.get('http://localhost:5000/api/admin/transactions/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setPendingTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      } else {
        alert('Failed to fetch pending transactions.');
      }
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchInvestments = async () => {
    try {
      setLoading(prev => ({ ...prev, investments: true }));
      const token = getToken();
      
      let url = 'http://localhost:5000/api/admin/investments';
      if (dateRange !== 'all') {
        url += `?dateRange=${dateRange}`;
      }
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setInvestments(response.data.investments);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      } else {
        alert('Failed to fetch investments.');
      }
    } finally {
      setLoading(prev => ({ ...prev, investments: false }));
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const token = getToken();
      
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleApproveTransaction = async (transactionId) => {
    if (!adminNote.trim() && !window.confirm('Approve without adding a note?')) {
      return;
    }

    try {
      setProcessing(prev => ({ ...prev, [transactionId]: 'approve' }));
      const token = getToken();
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/transactions/${transactionId}/approve`,
        { note: adminNote || 'Transaction approved' },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Transaction approved successfully!');
        setPendingTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
        await fetchStats();
        setAdminNote('');
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert(error.response?.data?.message || 'Failed to approve transaction');
    } finally {
      setProcessing(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    if (!adminNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(prev => ({ ...prev, [transactionId]: 'reject' }));
      const token = getToken();
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/transactions/${transactionId}/reject`,
        { note: adminNote },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Transaction rejected successfully!');
        setPendingTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
        await fetchStats();
        setAdminNote('');
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      alert(error.response?.data?.message || 'Failed to reject transaction');
    } finally {
      setProcessing(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this user?`)) {
      return;
    }

    try {
      setProcessing(prev => ({ ...prev, [userId]: 'status' }));
      const token = getToken();
      
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        { status: newStatus },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert(`User status updated to ${newStatus}`);
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        await fetchStats();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const token = getToken();
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      } else {
        alert('Failed to fetch user details');
      }
    }
  };

  const handleViewInvestmentDetails = async (investmentId) => {
    try {
      const token = getToken();
      const response = await axios.get(`http://localhost:5000/api/admin/investments/${investmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedInvestment(response.data.investment);
      }
    } catch (error) {
      console.error('Error fetching investment details:', error);
      alert('Failed to fetch investment details');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const exportToCSV = () => {
    let data = [];
    let filename = '';
    
    if (activeTab === 'users') {
      filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
      data = [
        ['ID', 'Username', 'Phone', 'Email', 'Status', 'Registration Date', 'Last Login', 'Main Wallet', 'Earnings Wallet', 'Total Deposits', 'Total Withdrawals', 'Active Investments', 'Total Invested'],
        ...users.map(user => [
          user.id,
          user.username,
          user.phone,
          user.email || '',
          user.status,
          new Date(user.createdAt).toLocaleDateString(),
          new Date(user.lastLogin).toLocaleDateString(),
          user.wallets?.main || 0,
          user.wallets?.earning || 0,
          user.stats?.totalDeposits || 0,
          user.stats?.totalWithdrawn || 0,
          user.stats?.totalInvestments || 0,
          user.stats?.totalSpent || 0
        ])
      ];
    } else if (activeTab === 'transactions') {
      filename = `pending_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      data = [
        ['Transaction ID', 'User', 'Type', 'Amount', 'Payment Method', 'Phone', 'Reference', 'Date'],
        ...pendingTransactions.map(tx => [
          tx.transactionId,
          tx.userName,
          tx.type,
          tx.amount,
          tx.paymentMethod,
          tx.phoneNumber,
          tx.reference,
          new Date(tx.createdAt).toLocaleString()
        ])
      ];
    } else if (activeTab === 'investments') {
      filename = `investments_${new Date().toISOString().split('T')[0]}.csv`;
      data = [
        ['Investment ID', 'User', 'Product', 'Amount', 'Daily Earning', 'Status', 'Purchase Date', 'End Date', 'Earned So Far', 'Progress %'],
        ...investments.map(inv => [
          inv._id,
          inv.userName,
          inv.productName,
          inv.amount,
          inv.dailyEarning,
          inv.status,
          new Date(inv.purchaseDate).toLocaleDateString(),
          new Date(inv.endDate).toLocaleDateString(),
          inv.totalEarnedSoFar,
          inv.progress || 0
        ])
      ];
    }

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  // Filter users based on search term and view mode
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesViewMode = 
      viewMode === 'all' || 
      (viewMode === 'active' && user.status === 'active') ||
      (viewMode === 'suspended' && user.status === 'suspended');
    
    return matchesSearch && matchesViewMode;
  });

  // Filter investments
  const filteredInvestments = investments.filter(inv => {
    if (investmentFilter === 'all') return true;
    return inv.status === investmentFilter;
  });

  // Calculate totals for pending transactions
  const pendingTotals = pendingTransactions.reduce((totals, tx) => {
    if (tx.type === 'deposit') {
      totals.deposits += tx.amount;
    } else if (tx.type === 'withdraw') {
      totals.withdrawals += tx.amount;
    }
    totals.total += tx.amount;
    return totals;
  }, { deposits: 0, withdrawals: 0, total: 0 });

  // Calculate investment stats
  const investmentStats = investments.reduce((stats, inv) => {
    stats.totalInvested += inv.amount;
    stats.totalEarned += inv.totalEarnedSoFar;
    stats.activeCount += inv.status === 'active' ? 1 : 0;
    stats.completedCount += inv.status === 'completed' ? 1 : 0;
    stats.totalExpectedReturn += inv.totalReturn;
    return stats;
  }, { totalInvested: 0, totalEarned: 0, activeCount: 0, completedCount: 0, totalExpectedReturn: 0 });

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="opacity-75">Manage users, transactions, investments, and system statistics</p>
            {adminData && (
              <p className="text-sm mt-2 text-red-400">
                Logged in as: {adminData.email} ({adminData.role})
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          {/* Tabs */}
          <div className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
            {[
              { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
              { id: 'users', label: 'Users', icon: <FaUsers /> },
              { id: 'transactions', label: 'Transactions', icon: <FaHistory /> },
              { id: 'investments', label: 'Investments', icon: <FaCoins /> },
              { id: 'stats', label: 'Statistics', icon: <FaMoneyBillWave /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-blue-600 shadow'
                    : darkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAllData}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center hover:bg-blue-600 transition-colors"
          >
            <FaRedo className="mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-blue-500 text-white mr-4">
                        <FaUsers size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.users.total}</div>
                        <div className="text-sm opacity-75">Total Users</div>
                        <div className="text-xs mt-1">
                          <span className="text-green-500">{stats.users.active} active</span>
                          {' • '}
                          <span className="text-red-500">{stats.users.suspended} suspended</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-green-500 text-white mr-4">
                        <FaMoneyBillWave size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.finances.totalMain?.toLocaleString()} FRW
                        </div>
                        <div className="text-sm opacity-75">Total Main Wallet</div>
                        <div className="text-xs mt-1">
                          Earnings: {stats.finances.totalEarning?.toLocaleString()} FRW
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-purple-500 text-white mr-4">
                        <FaCoins size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.investments?.totalInvested?.toLocaleString() || 0} FRW
                        </div>
                        <div className="text-sm opacity-75">Total Invested</div>
                        <div className="text-xs mt-1">
                          {stats.investments?.activeCount || 0} active investments
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-orange-500 text-white mr-4">
                        <FaHistory size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.transactions.pending}
                        </div>
                        <div className="text-sm opacity-75">Pending Transactions</div>
                        <div className="text-xs mt-1">
                          {stats.transactions.pendingDeposits} deposits • {stats.transactions.pendingWithdrawals} withdrawals
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="flex items-center">
                      <FaChartLine className="text-green-500 mr-3" size={20} />
                      <div>
                        <div className="text-sm opacity-75">Daily Earnings Paid</div>
                        <div className="text-xl font-bold">
                          {stats.investments?.totalEarned?.toLocaleString() || 0} FRW
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="flex items-center">
                      <FaPercentage className="text-blue-500 mr-3" size={20} />
                      <div>
                        <div className="text-sm opacity-75">Average ROI</div>
                        <div className="text-xl font-bold">
                          {stats.investments?.averageROI || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="flex items-center">
                      <FaClock className="text-yellow-500 mr-3" size={20} />
                      <div>
                        <div className="text-sm opacity-75">Active Investments</div>
                        <div className="text-xl font-bold">
                          {stats.investments?.activeCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Quick Actions */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaUserCheck className="mr-2" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('transactions');
                    fetchPendingTransactions();
                  }}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">Review Transactions</div>
                  <div className="text-sm opacity-75">
                    {pendingTransactions.length} pending
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('users');
                    fetchUsers();
                  }}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">Manage Users</div>
                  <div className="text-sm opacity-75">
                    {users.length} total users
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('investments');
                    fetchInvestments();
                  }}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">View Investments</div>
                  <div className="text-sm opacity-75">
                    Track all user investments
                  </div>
                </button>

                <button
                  onClick={fetchAllData}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">Refresh Data</div>
                  <div className="text-sm opacity-75">
                    Update all statistics
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
            {/* Users Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUsers className="mr-2" />
                    User Management
                  </h2>
                  <p className="opacity-75 mt-1">
                    {users.length} total users • {users.filter(u => u.status === 'active').length} active • {users.filter(u => u.status === 'suspended').length} suspended
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    placeholder="Search users by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div className="flex space-x-2">
                  {['all', 'active', 'suspended'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        viewMode === mode
                          ? darkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="overflow-x-auto">
              {loading.users ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
                  <p>Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="opacity-75">No users found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr>
                      <th className="p-4 text-left">User</th>
                      <th className="p-4 text-left">Contact</th>
                      <th className="p-4 text-left">Wallets</th>
                      <th className="p-4 text-left">Investments</th>
                      <th className="p-4 text-left">Stats</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr 
                        key={user.id}
                        className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <td className="p-4">
                          <div className="font-bold">{user.username}</div>
                          <div className="text-sm opacity-75">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          {user.referralCode && (
                            <div className="text-xs mt-1">
                              Ref: <code className="bg-black/10 px-2 py-1 rounded">{user.referralCode}</code>
                            </div>
                          )}
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center mb-1">
                            <FaPhone className="mr-2 opacity-75" size={12} />
                            <span>{user.phone}</span>
                          </div>
                          {user.email && (
                            <div className="text-sm opacity-75">{user.email}</div>
                          )}
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <FaWallet className="mr-2 text-green-500" size={12} />
                              <span className="font-bold">{user.wallets?.main?.toLocaleString() || 0} FRW</span>
                              <span className="text-xs ml-2 opacity-75">Main</span>
                            </div>
                            <div className="flex items-center">
                              <FaWallet className="mr-2 text-blue-500" size={12} />
                              <span>{user.wallets?.earning?.toLocaleString() || 0} FRW</span>
                              <span className="text-xs ml-2 opacity-75">Earnings</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <FaCoins className="mr-2 text-yellow-500" size={12} />
                              <span className="font-bold">{user.stats?.totalInvestments || 0}</span>
                              <span className="text-xs ml-2 opacity-75">Active</span>
                            </div>
                            <div className="text-sm">
                              Invested: {user.stats?.totalSpent?.toLocaleString() || 0} FRW
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                            <div>Deposits: {user.stats?.totalDeposits?.toLocaleString() || 0} FRW</div>
                            <div>Withdrawn: {user.stats?.totalWithdrawn?.toLocaleString() || 0} FRW</div>
                            <div>Earned: {user.stats?.totalEarned?.toLocaleString() || 0} FRW</div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : user.status === 'suspended'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewUserDetails(user.id)}
                              className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm flex items-center"
                              title="View Details"
                            >
                              <FaEye size={12} />
                            </button>
                            
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                                disabled={processing[user.id]}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm flex items-center"
                                title="Suspend User"
                              >
                                {processing[user.id] ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaUserTimes size={12} />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateUserStatus(user.id, 'active')}
                                disabled={processing[user.id]}
                                className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm flex items-center"
                                title="Activate User"
                              >
                                {processing[user.id] ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaUserCheck size={12} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
            {/* Transactions Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaHistory className="mr-2" />
                    Pending Transactions
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Deposits: {pendingTotals.deposits.toLocaleString()} FRW</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Withdrawals: {pendingTotals.withdrawals.toLocaleString()} FRW</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Total: {pendingTotals.total.toLocaleString()} FRW</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Admin Note Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Admin Note (required for rejections, optional for approvals)
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Enter note for transaction actions..."
                  className={`w-full p-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
                <p className="text-xs opacity-75 mt-1">
                  This note will be visible to the user and logged in the transaction.
                </p>
              </div>
            </div>

            {/* Transactions List */}
            <div className="overflow-x-auto">
              {loading.transactions ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
                  <p>Loading transactions...</p>
                </div>
              ) : pendingTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="opacity-75">No pending transactions found</p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-700">
                  {pendingTransactions.map(tx => (
                    <div
                      key={tx.transactionId}
                      className={`p-6 transition-colors ${
                        darkMode 
                          ? 'hover:bg-gray-700/50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Transaction Info */}
                        <div className="flex-1">
                          <div className="flex items-start mb-3">
                            <div className={`p-3 rounded-xl mr-4 ${
                              tx.type === 'deposit'
                                ? darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                                : darkMode ? 'bg-green-900/30' : 'bg-green-100'
                            }`}>
                              <FaMoneyBillWave className={
                                tx.type === 'deposit' ? 'text-blue-500' : 'text-green-500'
                              } size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <div className="font-bold text-xl">
                                  {tx.amount.toLocaleString()} FRW
                                </div>
                                <div className="text-sm opacity-75 capitalize">
                                  {tx.type} • {tx.paymentMethod}
                                </div>
                                <div className="text-sm">
                                  <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                                    Pending
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div className="flex items-center">
                                  <FaUserCheck className="mr-2 opacity-75" size={12} />
                                  <span className="font-medium">{tx.userName}</span>
                                </div>
                                <div className="flex items-center">
                                  <FaPhone className="mr-2 opacity-75" size={12} />
                                  <span>{tx.phoneNumber}</span>
                                </div>
                                <div className="flex items-center">
                                  <FaCalendar className="mr-2 opacity-75" size={12} />
                                  <span>{new Date(tx.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                              
                              {tx.description && (
                                <div className="mt-2 text-sm opacity-75">
                                  {tx.description}
                                </div>
                              )}
                              
                              {tx.reference && (
                                <div className="mt-2 text-xs">
                                  Reference: <code className={`px-2 py-1 rounded ${
                                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                  }`}>
                                    {tx.reference}
                                  </code>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                          <button
                            onClick={() => handleApproveTransaction(tx.transactionId)}
                            disabled={processing[tx.transactionId]}
                            className="px-6 py-3 rounded-lg bg-green-500 text-white font-medium flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processing[tx.transactionId] === 'approve' ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="mr-2" />
                                Approve
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleRejectTransaction(tx.transactionId)}
                            disabled={processing[tx.transactionId]}
                            className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processing[tx.transactionId] === 'reject' ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="mr-2" />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
            {/* Investments Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaCoins className="mr-2" />
                    Investment Overview
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Active: {investmentStats.activeCount}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Completed: {investmentStats.completedCount}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCoins className="mr-2 text-yellow-500" size={12} />
                      <span className="text-sm">Total Invested: {investmentStats.totalInvested.toLocaleString()} FRW</span>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-2 text-green-500" size={12} />
                      <span className="text-sm">Earned: {investmentStats.totalEarned.toLocaleString()} FRW</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    placeholder="Search investments by user or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div className="flex space-x-2">
                  {['all', 'active', 'completed'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setInvestmentFilter(filter)}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        investmentFilter === filter
                          ? darkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Investments List */}
            <div className="overflow-x-auto">
              {loading.investments ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
                  <p>Loading investments...</p>
                </div>
              ) : filteredInvestments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="opacity-75">No investments found</p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-700">
                  {filteredInvestments.map(inv => {
                    const progress = inv.progress || 0;
                    const daysRemaining = inv.remainingDays || 0;
                    const profitPercentage = ((inv.totalEarnedSoFar / inv.amount) * 100).toFixed(2);
                    
                    return (
                      <div
                        key={inv._id}
                        className={`p-6 transition-colors ${
                          darkMode 
                            ? 'hover:bg-gray-700/50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Investment Info */}
                          <div className="flex-1">
                            <div className="flex items-start mb-3">
                              <div className={`p-3 rounded-xl mr-4 ${
                                inv.status === 'active'
                                  ? darkMode ? 'bg-green-900/30' : 'bg-green-100'
                                  : darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                              }`}>
                                <FaCoins className={
                                  inv.status === 'active' ? 'text-green-500' : 'text-blue-500'
                                } size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <div className="font-bold text-xl">
                                    {inv.amount.toLocaleString()} FRW
                                  </div>
                                  <div className="text-sm opacity-75">
                                    {inv.productName}
                                  </div>
                                  <div className="text-sm">
                                    <span className={`px-2 py-1 rounded-full ${
                                      inv.status === 'active'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                      {inv.status}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <div className="opacity-75">User</div>
                                    <div className="font-medium">{inv.userName}</div>
                                  </div>
                                  <div>
                                    <div className="opacity-75">Daily Earning</div>
                                    <div className="font-medium text-green-500">
                                      {inv.dailyEarning.toLocaleString()} FRW
                                    </div>
                                  </div>
                                  <div>
                                    <div className="opacity-75">Earned So Far</div>
                                    <div className="font-medium text-yellow-500">
                                      {inv.totalEarnedSoFar.toLocaleString()} FRW
                                    </div>
                                  </div>
                                  <div>
                                    <div className="opacity-75">Expected Total</div>
                                    <div className="font-medium text-purple-500">
                                      {inv.totalReturn.toLocaleString()} FRW
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                  <div>
                                    <span className="opacity-75">Purchase:</span>{' '}
                                    {new Date(inv.purchaseDate).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="opacity-75">Ends:</span>{' '}
                                    {new Date(inv.endDate).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="opacity-75">Profit:</span>{' '}
                                    <span className="text-green-500">{profitPercentage}%</span>
                                  </div>
                                  <div>
                                    <span className="opacity-75">Days Left:</span>{' '}
                                    {daysRemaining}
                                  </div>
                                </div>
                                
                                {/* Progress Bar */}
                                {inv.status === 'active' && (
                                  <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Progress</span>
                                      <span>{progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleViewInvestmentDetails(inv._id)}
                              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                              <FaEye className="mr-2" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {stats ? (
              <>
                {/* Financial Overview */}
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    Financial Overview
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Main Wallet</div>
                      <div className="text-2xl font-bold text-green-500">
                        {stats.finances.totalMain?.toLocaleString()} FRW
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Earnings Wallet</div>
                      <div className="text-2xl font-bold text-blue-500">
                        {stats.finances.totalEarning?.toLocaleString()} FRW
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Deposits</div>
                      <div className="text-2xl font-bold">
                        {stats.finances.totalDeposits?.toLocaleString()} FRW
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Withdrawals</div>
                      <div className="text-2xl font-bold">
                        {stats.finances.totalWithdrawals?.toLocaleString()} FRW
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Statistics */}
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaCoins className="mr-2" />
                    Investment Statistics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Invested</div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {stats.investments?.totalInvested?.toLocaleString() || 0} FRW
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Earnings Paid</div>
                      <div className="text-2xl font-bold text-green-500">
                        {stats.investments?.totalEarned?.toLocaleString() || 0} FRW
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Active Investments</div>
                      <div className="text-2xl font-bold text-blue-500">
                        {stats.investments?.activeCount || 0}
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Average ROI</div>
                      <div className="text-2xl font-bold text-purple-500">
                        {stats.investments?.averageROI || 0}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Statistics */}
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaUsers className="mr-2" />
                    User Statistics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Users</div>
                      <div className="text-2xl font-bold">{stats.users.total}</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Active Users</div>
                      <div className="text-2xl font-bold text-green-500">{stats.users.active}</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Investors</div>
                      <div className="text-2xl font-bold text-blue-500">
                        {stats.investments?.investorCount || 0}
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">New Today</div>
                      <div className="text-2xl font-bold text-purple-500">{stats.users.today}</div>
                    </div>
                  </div>
                </div>

                {/* Transaction Statistics */}
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaHistory className="mr-2" />
                    Transaction Statistics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Total Transactions</div>
                      <div className="text-2xl font-bold">{stats.transactions.total}</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Pending</div>
                      <div className="text-2xl font-bold text-yellow-500">{stats.transactions.pending}</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Completed</div>
                      <div className="text-2xl font-bold text-green-500">{stats.transactions.completed}</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">Rejected</div>
                      <div className="text-2xl font-bold text-red-500">{stats.transactions.rejected}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FaSpinner className="animate-spin mx-auto text-3xl mb-4" />
                <p>Loading statistics...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className={`relative w-full max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-6`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="opacity-75">Username:</span>
                      <span className="font-medium">{selectedUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Phone:</span>
                      <span className="font-medium">{selectedUser.phone}</span>
                    </div>
                    {selectedUser.email && (
                      <div className="flex justify-between">
                        <span className="opacity-75">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="opacity-75">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Joined:</span>
                      <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Last Login:</span>
                      <span className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Wallet Information */}
                <div>
                  <h4 className="font-bold mb-2">Wallet Information</h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                      <div className="text-sm opacity-75">Main Wallet</div>
                      <div className="text-xl font-bold text-green-500">
                        {selectedUser.wallets?.main?.toLocaleString() || 0} FRW
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <div className="text-sm opacity-75">Earnings Wallet</div>
                      <div className="text-xl font-bold text-blue-500">
                        {selectedUser.wallets?.earning?.toLocaleString() || 0} FRW
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                      <div className="text-sm opacity-75">Reserved Funds</div>
                      <div className="text-xl font-bold text-yellow-500">
                        {selectedUser.wallets?.reserved?.toLocaleString() || 0} FRW
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Statistics */}
              <div>
                <h4 className="font-bold mb-3">User Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="text-sm opacity-75">Total Deposits</div>
                    <div className="text-lg font-bold">
                      {selectedUser.stats?.totalDeposits?.toLocaleString() || 0} FRW
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="text-sm opacity-75">Total Withdrawn</div>
                    <div className="text-lg font-bold">
                      {selectedUser.stats?.totalWithdrawn?.toLocaleString() || 0} FRW
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="text-sm opacity-75">Total Earned</div>
                    <div className="text-lg font-bold">
                      {selectedUser.stats?.totalEarned?.toLocaleString() || 0} FRW
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="text-sm opacity-75">Referral Earnings</div>
                    <div className="text-lg font-bold">
                      {selectedUser.stats?.referralEarnings?.toLocaleString() || 0} FRW
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Summary */}
              {selectedUser.activeInvestments && selectedUser.activeInvestments.length > 0 && (
                <div>
                  <h4 className="font-bold mb-3">Active Investments</h4>
                  <div className="space-y-2">
                    {selectedUser.activeInvestments.map((inv, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{inv.productName}</div>
                            <div className="text-sm opacity-75">
                              Invested: {inv.purchasePrice?.toLocaleString()} FRW
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">Daily: {inv.dailyEarning?.toLocaleString()} FRW</div>
                            <div className="text-xs opacity-75">
                              {new Date(inv.purchaseDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    handleUpdateUserStatus(
                      selectedUser.id,
                      selectedUser.status === 'active' ? 'suspended' : 'active'
                    );
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white"
                >
                  {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Details Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className={`relative w-full max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-6`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Investment Details</h3>
              <button
                onClick={() => setSelectedInvestment(null)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Investment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Investment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="opacity-75">Product:</span>
                      <span className="font-medium">{selectedInvestment.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Amount:</span>
                      <span className="font-bold text-green-500">
                        {selectedInvestment.amount?.toLocaleString()} FRW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Daily Earning:</span>
                      <span className="font-bold text-yellow-500">
                        {selectedInvestment.dailyEarning?.toLocaleString()} FRW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Total Return:</span>
                      <span className="font-bold text-purple-500">
                        {selectedInvestment.totalReturn?.toLocaleString()} FRW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedInvestment.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {selectedInvestment.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="opacity-75">Purchase Date:</span>
                      <span className="font-medium">
                        {new Date(selectedInvestment.purchaseDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">End Date:</span>
                      <span className="font-medium">
                        {new Date(selectedInvestment.endDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Last Profit:</span>
                      <span className="font-medium">
                        {selectedInvestment.lastProfitDate 
                          ? new Date(selectedInvestment.lastProfitDate).toLocaleString()
                          : 'Not yet'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {selectedInvestment.status === 'active' && (
                <div>
                  <h4 className="font-bold mb-3">Progress</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{selectedInvestment.progress || 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedInvestment.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <div className="text-sm opacity-75">Days Remaining</div>
                        <div className="text-xl font-bold text-blue-500">
                          {selectedInvestment.remainingDays || 0}
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <div className="text-sm opacity-75">Days Completed</div>
                        <div className="text-xl font-bold text-green-500">
                          {30 - (selectedInvestment.remainingDays || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Earnings History */}
              {selectedInvestment.earningsHistory && selectedInvestment.earningsHistory.length > 0 && (
                <div>
                  <h4 className="font-bold mb-3">Earnings History</h4>
                  <div className="space-y-2">
                    {selectedInvestment.earningsHistory.map((earning, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-500">
                            +{earning.amount?.toLocaleString()} FRW
                          </span>
                          <span className="text-sm opacity-75">
                            {new Date(earning.date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setSelectedInvestment(null)}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;