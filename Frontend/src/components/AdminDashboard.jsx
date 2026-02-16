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
//   FaFilter,
//   FaEye,
//   FaWallet,
//   FaPhone,
//   FaCalendar,
//   FaExclamationTriangle,
//   FaDownload

// } from 'react-icons/fa';
// import axios from 'axios';

// const AdminDashboard = ({ darkMode }) => {
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

//   // Fetch all data on component mount
//   useEffect(() => {
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
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get('http://localhost:5000/api/admin/users', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setUsers(response.data.users);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       alert('Failed to fetch users. Please check if you have admin privileges.');
//     } finally {
//       setLoading(prev => ({ ...prev, users: false }));
//     }
//   };

//   const fetchPendingTransactions = async () => {
//     try {
//       setLoading(prev => ({ ...prev, transactions: true }));
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get('http://localhost:5000/api/admin/transactions/pending', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setPendingTransactions(response.data.transactions);
//       }
//     } catch (error) {
//       console.error('Error fetching pending transactions:', error);
//       alert('Failed to fetch pending transactions.');
//     } finally {
//       setLoading(prev => ({ ...prev, transactions: false }));
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       setLoading(prev => ({ ...prev, stats: true }));
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get('http://localhost:5000/api/admin/stats', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setStats(response.data.stats);
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
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
//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(
//         `http://localhost:5000/api/admin/transactions/approve/${transactionId}`,
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
//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(
//         `http://localhost:5000/api/admin/transactions/reject/${transactionId}`,
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
//       const token = localStorage.getItem('token');
      
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
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setSelectedUser(response.data.user);
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       alert('Failed to fetch user details');
//     }
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
//         <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
//         <p className="opacity-75">Manage users, transactions, and system statistics</p>
        
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
//             <FaRefresh className="mr-2" />
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
//                           : 'bg-red-500/20 text-red-400'
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
  FaRedo // Changed from FaRefresh to FaRedo
} from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState({
    users: false,
    transactions: false,
    stats: false
  });
  const [processing, setProcessing] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'suspended'

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    if (activeTab === 'overview' || activeTab === 'users') {
      await fetchUsers();
      await fetchStats();
    }
    if (activeTab === 'transactions') {
      await fetchPendingTransactions();
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please check if you have admin privileges.');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/admin/transactions/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setPendingTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      alert('Failed to fetch pending transactions.');
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/transactions/approve/${transactionId}`,
        { note: adminNote || 'Transaction approved' },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Transaction approved successfully!');
        // Remove from pending list
        setPendingTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
        // Refresh stats
        await fetchStats();
        // Clear note
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
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/transactions/reject/${transactionId}`,
        { note: adminNote },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Transaction rejected successfully!');
        // Remove from pending list
        setPendingTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
        // Refresh stats
        await fetchStats();
        // Clear note
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
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        { status: newStatus },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert(`User status updated to ${newStatus}`);
        // Update user in local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        // Refresh stats
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
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details');
    }
  };

  const exportToCSV = () => {
    let data = [];
    let filename = '';
    
    if (activeTab === 'users') {
      filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
      data = [
        ['ID', 'Username', 'Phone', 'Email', 'Status', 'Registration Date', 'Last Login', 'Main Wallet', 'Earnings Wallet', 'Total Deposits', 'Total Withdrawals'],
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
          user.stats?.totalWithdrawn || 0
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

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="opacity-75">Manage users, transactions, and system statistics</p>
        
        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          {/* Tabs */}
          <div className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
            {[
              { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
              { id: 'users', label: 'Users', icon: <FaUsers /> },
              { id: 'transactions', label: 'Transactions', icon: <FaHistory /> },
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
            <FaRedo className="mr-2" /> {/* Changed from FaRefresh to FaRedo */}
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
                      <FaChartLine size={24} />
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

                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-orange-500 text-white mr-4">
                      <FaHistory size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.transactions.total}
                      </div>
                      <div className="text-sm opacity-75">Total Transactions</div>
                      <div className="text-xs mt-1">
                        {stats.transactions.deposits} deposits • {stats.transactions.withdrawals} withdrawals
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaUserCheck className="mr-2" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="text-lg font-bold mb-1">Review Pending Transactions</div>
                  <div className="text-sm opacity-75">
                    {pendingTransactions.length} transactions awaiting approval
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
                    View and manage all registered users
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
                  <div className="text-lg font-bold mb-1">Refresh All Data</div>
                  <div className="text-sm opacity-75">
                    Update all statistics and lists
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Pending Transactions */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FaExclamationTriangle className="mr-2 text-yellow-500" />
                  Recent Pending Transactions
                </h2>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  View All →
                </button>
              </div>
              
              {loading.transactions ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin mx-auto text-2xl mb-2" />
                  <p>Loading transactions...</p>
                </div>
              ) : pendingTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="opacity-75">No pending transactions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTransactions.slice(0, 5).map(tx => (
                    <div
                      key={tx.transactionId}
                      className={`p-4 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700/30 border-gray-600' 
                          : 'bg-gray-100 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-lg">
                            {tx.amount.toLocaleString()} FRW
                          </div>
                          <div className="text-sm opacity-75">
                            {tx.userName} • {tx.type} • {tx.paymentMethod}
                          </div>
                          <div className="text-xs mt-1">
                            {new Date(tx.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveTransaction(tx.transactionId)}
                            className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectTransaction(tx.transactionId)}
                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
                          >
                            Reject
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
                    {users.length} total users registered in the system
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
                      <div className="text-sm opacity-75 mb-1">Suspended Users</div>
                      <div className="text-2xl font-bold text-red-500">{stats.users.suspended}</div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="text-sm opacity-75 mb-1">New Today</div>
                      <div className="text-2xl font-bold text-blue-500">{stats.users.today}</div>
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
    </div>
  );
};

export default AdminDashboard;