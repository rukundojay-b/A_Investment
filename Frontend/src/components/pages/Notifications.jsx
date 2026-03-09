// // src/components/pages/Notifications.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle,
//   FaExclamationTriangle, FaSpinner, FaCheck, FaTrash,
//   FaClock, FaArrowLeft, FaFilter, FaEye
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';


// const Notifications = ({ darkMode, formatCurrency }) => {
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all'); // all, unread, read


//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get('http://localhost:5000/api/user/notifications', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setNotifications(response.data.notifications || []);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.put(`http://localhost:5000/api/user/notifications/${notificationId}/read`, {}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setNotifications(prev => 
//         prev.map(n => 
//           n._id === notificationId ? { ...n, read: true } : n
//         )
//       );
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.put('http://localhost:5000/api/user/notifications/read-all', {}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//     }
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.delete(`http://localhost:5000/api/user/notifications/${notificationId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.filter(n => n._id !== notificationId));
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   const deleteAllRead = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.delete('http://localhost:5000/api/user/notifications/read', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.filter(n => !n.read));
//     } catch (error) {
//       console.error('Error deleting read notifications:', error);
//     }
//   };

//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'success':
//         return <FaCheckCircle className="text-green-500 text-xl" />;
//       case 'warning':
//         return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
//       case 'error':
//         return <FaTimesCircle className="text-red-500 text-xl" />;
//       default:
//         return <FaInfoCircle className="text-blue-500 text-xl" />;
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
//     if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   const filteredNotifications = notifications.filter(n => {
//     if (filter === 'unread') return !n.read;
//     if (filter === 'read') return n.read;
//     return true;
//   });

//   const unreadCount = notifications.filter(n => !n.read).length;

//   if (loading) {
//     return (
//       <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
//             <p>Loading notifications...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <div className="flex items-center">
//           <button
//             onClick={() => navigate(-1)}
//             className={`mr-4 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
//           >
//             <FaArrowLeft />
//           </button>
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold flex items-center">
//               <FaBell className="mr-3 text-yellow-500" />
//               Notifications
//             </h1>
//             <p className="opacity-75 mt-1">Stay updated with your account activity</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-3 mt-4 md:mt-0">
//           {unreadCount > 0 && (
//             <button
//               onClick={markAllAsRead}
//               className={`px-4 py-2 rounded-lg flex items-center ${
//                 darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
//               } text-white`}
//             >
//               <FaCheck className="mr-2" />
//               Mark All Read
//             </button>
//           )}
//           <button
//             onClick={deleteAllRead}
//             className={`px-4 py-2 rounded-lg flex items-center ${
//               darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
//             } text-white`}
//           >
//             <FaTrash className="mr-2" />
//             Clear Read
//           </button>
//         </div>
//       </div>

//       {/* Filter Tabs */}
//       <div className="flex space-x-2 mb-6">
//         <FilterButton
//           label="All"
//           active={filter === 'all'}
//           onClick={() => setFilter('all')}
//           count={notifications.length}
//           darkMode={darkMode}
//         />
//         <FilterButton
//           label="Unread"
//           active={filter === 'unread'}
//           onClick={() => setFilter('unread')}
//           count={unreadCount}
//           darkMode={darkMode}
//         />
//         <FilterButton
//           label="Read"
//           active={filter === 'read'}
//           onClick={() => setFilter('read')}
//           count={notifications.length - unreadCount}
//           darkMode={darkMode}
//         />
//       </div>

//       {/* Notifications List */}
//       <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//         {filteredNotifications.length === 0 ? (
//           <div className="p-12 text-center">
//             <FaBell className="mx-auto text-5xl mb-4 opacity-30" />
//             <h3 className="text-xl font-bold mb-2">No notifications</h3>
//             <p className="opacity-75">You're all caught up!</p>
//           </div>
//         ) : (
//           <div className="divide-y dark:divide-gray-700">
//             {filteredNotifications.map((notification) => (
//               <div
//                 key={notification._id}
//                 className={`p-4 transition-colors ${
//                   !notification.read 
//                     ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
//                     : ''
//                 } ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
//               >
//                 <div className="flex items-start">
//                   <div className="mr-4 mt-1">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <p className={`text-base ${!notification.read ? 'font-bold' : ''}`}>
//                           {notification.message}
//                         </p>
//                         <div className="flex items-center mt-2 text-sm opacity-75">
//                           <FaClock className="mr-1" size={12} />
//                           {formatTime(notification.createdAt)}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2 ml-4">
//                         {!notification.read && (
//                           <button
//                             onClick={() => markAsRead(notification._id)}
//                             className={`p-2 rounded-lg ${
//                               darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
//                             }`}
//                             title="Mark as read"
//                           >
//                             <FaEye size={14} />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => deleteNotification(notification._id)}
//                           className={`p-2 rounded-lg ${
//                             darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
//                           }`}
//                           title="Delete"
//                         >
//                           <FaTrash size={14} className="text-red-500" />
//                         </button>
//                       </div>
//                     </div>
//                     {notification.data && (
//                       <div className={`mt-3 p-3 rounded-lg text-sm ${
//                         darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
//                       }`}>
//                         <pre className="whitespace-pre-wrap">
//                           {JSON.stringify(notification.data, null, 2)}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Summary */}
//       <div className="mt-6 text-center text-sm opacity-75">
//         {unreadCount} unread • {notifications.length} total
//       </div>
//     </div>
//   );
// };

// // Filter Button Component
// const FilterButton = ({ label, active, onClick, count, darkMode }) => (
//   <button
//     onClick={onClick}
//     className={`px-4 py-2 rounded-lg flex items-center ${
//       active
//         ? darkMode 
//           ? 'bg-blue-600 text-white' 
//           : 'bg-blue-500 text-white'
//         : darkMode 
//           ? 'bg-gray-700 hover:bg-gray-600' 
//           : 'bg-gray-200 hover:bg-gray-300'
//     }`}
//   >
//     <span>{label}</span>
//     {count > 0 && (
//       <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
//         active
//           ? 'bg-white/20'
//           : darkMode ? 'bg-gray-600' : 'bg-gray-300'
//       }`}>
//         {count}
//       </span>
//     )}
//   </button>
// );

// export default Notifications;














// src/components/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle,
  FaExclamationTriangle, FaSpinner, FaCheck, FaTrash,
  FaClock, FaArrowLeft, FaFilter, FaEye
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../../config'; // Correct import path from src/components/pages to root

const Notifications = ({ darkMode, formatCurrency }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/user/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_BASE_URL}/user/notifications/${notificationId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_BASE_URL}/user/notifications/read-all`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_BASE_URL}/user/notifications/${notificationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_BASE_URL}/user/notifications/read`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => !n.read));
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-xl" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-xl" />;
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
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className={`mr-4 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <FaBell className="mr-3 text-yellow-500" />
              Notifications
            </h1>
            <p className="opacity-75 mt-1">Stay updated with your account activity</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className={`px-4 py-2 rounded-lg flex items-center ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              <FaCheck className="mr-2" />
              Mark All Read
            </button>
          )}
          <button
            onClick={deleteAllRead}
            className={`px-4 py-2 rounded-lg flex items-center ${
              darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            <FaTrash className="mr-2" />
            Clear Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <FilterButton
          label="All"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          count={notifications.length}
          darkMode={darkMode}
        />
        <FilterButton
          label="Unread"
          active={filter === 'unread'}
          onClick={() => setFilter('unread')}
          count={unreadCount}
          darkMode={darkMode}
        />
        <FilterButton
          label="Read"
          active={filter === 'read'}
          onClick={() => setFilter('read')}
          count={notifications.length - unreadCount}
          darkMode={darkMode}
        />
      </div>

      {/* Notifications List */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <FaBell className="mx-auto text-5xl mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2">No notifications</h3>
            <p className="opacity-75">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 transition-colors ${
                  !notification.read 
                    ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                    : ''
                } ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-base ${!notification.read ? 'font-bold' : ''}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-sm opacity-75">
                          <FaClock className="mr-1" size={12} />
                          {formatTime(notification.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className={`p-2 rounded-lg ${
                              darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                            }`}
                            title="Mark as read"
                          >
                            <FaEye size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className={`p-2 rounded-lg ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="Delete"
                        >
                          <FaTrash size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    {notification.data && (
                      <div className={`mt-3 p-3 rounded-lg text-sm ${
                        darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                      }`}>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(notification.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 text-center text-sm opacity-75">
        {unreadCount} unread • {notifications.length} total
      </div>
    </div>
  );
};

// Filter Button Component
const FilterButton = ({ label, active, onClick, count, darkMode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center ${
      active
        ? darkMode 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-500 text-white'
        : darkMode 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-200 hover:bg-gray-300'
    }`}
  >
    <span>{label}</span>
    {count > 0 && (
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
        active
          ? 'bg-white/20'
          : darkMode ? 'bg-gray-600' : 'bg-gray-300'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default Notifications;