// // src/components/pages/Security.jsx
// import React, { useState } from 'react';
// import { 
//   FaShieldAlt, FaLock, FaArrowLeft, FaKey,
//   FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle,
//   FaSpinner
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Security = ({ darkMode }) => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const API_URL = 'http://localhost:5000/api';

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     setMessage({ type: '', text: '' });
    
//     // Validation
//     if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
//       setMessage({ type: 'error', text: 'All fields are required' });
//       return;
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setMessage({ type: 'error', text: 'New passwords do not match' });
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
//       return;
//     }

//     if (passwordData.newPassword === passwordData.currentPassword) {
//       setMessage({ type: 'error', text: 'New password must be different from current password' });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         setMessage({ type: 'error', text: 'No authentication token found. Please login again.' });
//         setTimeout(() => navigate('/login'), 2000);
//         return;
//       }

//       console.log('🔐 Changing password...');
      
//       const response = await axios.post(`${API_URL}/user/change-password`, {
//         currentPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword
//       }, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('✅ Password change response:', response.data);

//       if (response.data.success) {
//         setMessage({ 
//           type: 'success', 
//           text: response.data.message || 'Password changed successfully! Please login with your new password.' 
//         });
        
//         // Clear form
//         setPasswordData({ 
//           currentPassword: '', 
//           newPassword: '', 
//           confirmPassword: '' 
//         });
        
//         // Optional: Logout user after password change (security best practice)
//         setTimeout(() => {
//           sessionStorage.removeItem('token');
//           sessionStorage.removeItem('user');
//           navigate('/login');
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('❌ Password change error:', error);
      
//       if (error.response?.status === 401) {
//         setMessage({ type: 'error', text: 'Session expired. Please login again.' });
//         setTimeout(() => navigate('/login'), 2000);
//       } else if (error.response?.status === 400) {
//         setMessage({ type: 'error', text: error.response.data.message || 'Current password is incorrect' });
//       } else if (error.response?.status === 404) {
//         setMessage({ type: 'error', text: 'Change password endpoint not found. Please check backend.' });
//       } else if (error.code === 'ECONNABORTED') {
//         setMessage({ type: 'error', text: 'Connection timeout. Please try again.' });
//       } else if (!error.response) {
//         setMessage({ type: 'error', text: 'Cannot connect to server. Make sure backend is running.' });
//       } else {
//         setMessage({ 
//           type: 'error', 
//           text: error.response?.data?.message || 'Failed to change password. Please try again.' 
//         });
//       }
//     } finally {
//       setLoading(false);
//       // Auto-hide message after 5 seconds (except success which stays longer)
//       if (message.type !== 'success') {
//         setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//       }
//     }
//   };

//   return (
//     <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Header with Back Button */}
//       <div className="flex items-center mb-6">
//         <button
//           onClick={() => navigate('/dashboard')}
//           className={`mr-4 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
//           title="Back to Dashboard"
//         >
//           <FaArrowLeft className="text-xl" />
//         </button>
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold flex items-center">
//             <FaShieldAlt className="mr-3 text-green-500" />
//             Security Settings
//           </h1>
//           <p className="opacity-75 mt-1">Change your password and secure your account</p>
//         </div>
//       </div>

//       {/* Message Alert */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg flex items-center ${
//           message.type === 'success' 
//             ? darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
//             : darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
//         }`}>
//           {message.type === 'success' ? (
//             <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
//           ) : (
//             <FaTimesCircle className="text-red-500 mr-3 flex-shrink-0" />
//           )}
//           <span className="text-sm">{message.text}</span>
//         </div>
//       )}

//       {/* Change Password Card - Centered */}
//       <div className="max-w-2xl mx-auto">
//         <div className={`p-6 md:p-8 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//           <div className="flex items-center mb-6">
//             <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-4`}>
//               <FaKey className="text-yellow-500 text-xl" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">Change Password</h2>
//               <p className="text-sm opacity-75">Update your password to keep your account secure</p>
//             </div>
//           </div>

//           <form onSubmit={handlePasswordChange} className="space-y-5">
//             {/* Current Password */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Current Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showCurrentPassword ? 'text' : 'password'}
//                   value={passwordData.currentPassword}
//                   onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
//                   className={`w-full p-3 pr-10 rounded-lg border ${
//                     darkMode 
//                       ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
//                       : 'bg-white border-gray-300 focus:border-blue-500'
//                   } focus:outline-none focus:ring-1 focus:ring-blue-500`}
//                   placeholder="Enter current password"
//                   required
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   disabled={loading}
//                 >
//                   {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* New Password */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 New Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showNewPassword ? 'text' : 'password'}
//                   value={passwordData.newPassword}
//                   onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
//                   className={`w-full p-3 pr-10 rounded-lg border ${
//                     darkMode 
//                       ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
//                       : 'bg-white border-gray-300 focus:border-blue-500'
//                   } focus:outline-none focus:ring-1 focus:ring-blue-500`}
//                   placeholder="Enter new password (min. 6 characters)"
//                   required
//                   disabled={loading}
//                   minLength={6}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   disabled={loading}
//                 >
//                   {showNewPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               <p className="text-xs opacity-50 mt-1">
//                 Password must be at least 6 characters long
//               </p>
//             </div>

//             {/* Confirm New Password */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Confirm New Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={passwordData.confirmPassword}
//                   onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
//                   className={`w-full p-3 pr-10 rounded-lg border ${
//                     darkMode 
//                       ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
//                       : 'bg-white border-gray-300 focus:border-blue-500'
//                   } focus:outline-none focus:ring-1 focus:ring-blue-500`}
//                   placeholder="Confirm new password"
//                   required
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   disabled={loading}
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Password strength indicator (optional) */}
//             {passwordData.newPassword && passwordData.newPassword.length > 0 && (
//               <div className="mt-2">
//                 <div className="flex items-center justify-between text-xs mb-1">
//                   <span>Password strength:</span>
//                   <span className={
//                     passwordData.newPassword.length < 6 ? 'text-red-500' :
//                     passwordData.newPassword.length < 8 ? 'text-yellow-500' :
//                     'text-green-500'
//                   }>
//                     {passwordData.newPassword.length < 6 ? 'Too short' :
//                      passwordData.newPassword.length < 8 ? 'Good' :
//                      'Strong'}
//                   </span>
//                 </div>
//                 <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full rounded-full ${
//                       passwordData.newPassword.length < 6 ? 'bg-red-500 w-1/3' :
//                       passwordData.newPassword.length < 8 ? 'bg-yellow-500 w-2/3' :
//                       'bg-green-500 w-full'
//                     }`}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
//                 darkMode 
//                   ? 'bg-blue-600 hover:bg-blue-700' 
//                   : 'bg-blue-500 hover:bg-blue-600'
//               } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6`}
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin mr-2" />
//                   Updating Password...
//                 </>
//               ) : (
//                 <>
//                   <FaKey className="mr-2" />
//                   Change Password
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Security Tips */}
//           <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
//             <h3 className="font-bold mb-2 flex items-center">
//               <FaLock className="mr-2 text-yellow-500 text-sm" />
//               Password Tips:
//             </h3>
//             <ul className="space-y-1 text-xs opacity-75">
//               <li className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 Use at least 6 characters
//               </li>
//               <li className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 Mix letters, numbers, and symbols
//               </li>
//               <li className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 Don't use common or easily guessed passwords
//               </li>
//               <li className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 Never share your password with anyone
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Security;







// src/components/pages/Security.jsx
import React, { useState } from 'react';
import { 
  FaShieldAlt, FaLock, FaArrowLeft, FaKey,
  FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Security = ({ darkMode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = 'http://localhost:5000/api';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'No authentication token found. Please login again.' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      console.log('🔐 Changing password using auth endpoint...');
      
      // CHANGED: Using /auth/change-password instead of /user/change-password
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Password change response:', response.data);

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: response.data.message || 'Password changed successfully! Please login with your new password.' 
        });
        
        // Clear form
        setPasswordData({ 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '' 
        });
        
        // Logout user after password change (security best practice)
        setTimeout(() => {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Password change error:', error);
      
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: error.response.data?.message || 'Current password is incorrect or session expired.' });
        if (error.response.data?.message?.includes('token') || error.response.data?.message?.includes('session')) {
          setTimeout(() => navigate('/login'), 2000);
        }
      } else if (error.response?.status === 400) {
        setMessage({ type: 'error', text: error.response.data.message || 'Invalid request. Please check your input.' });
      } else if (error.response?.status === 404) {
        setMessage({ type: 'error', text: 'Change password endpoint not found. Please check backend.' });
      } else if (error.code === 'ECONNABORTED') {
        setMessage({ type: 'error', text: 'Connection timeout. Please try again.' });
      } else if (!error.response) {
        setMessage({ type: 'error', text: 'Cannot connect to server. Make sure backend is running.' });
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to change password. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className={`mr-4 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
          title="Back to Dashboard"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FaShieldAlt className="mr-3 text-green-500" />
            Security Settings
          </h1>
          <p className="opacity-75 mt-1">Change your password and secure your account</p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
            : darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
          ) : (
            <FaTimesCircle className="text-red-500 mr-3 flex-shrink-0" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Change Password Card - Centered */}
      <div className="max-w-2xl mx-auto">
        <div className={`p-6 md:p-8 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-4`}>
              <FaKey className="text-yellow-500 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Change Password</h2>
              <p className="text-sm opacity-75">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className={`w-full p-3 pr-10 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter current password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className={`w-full p-3 pr-10 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter new password (min. 6 characters)"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs opacity-50 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className={`w-full p-3 pr-10 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {passwordData.newPassword && passwordData.newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Password strength:</span>
                  <span className={
                    passwordData.newPassword.length < 6 ? 'text-red-500' :
                    passwordData.newPassword.length < 8 ? 'text-yellow-500' :
                    'text-green-500'
                  }>
                    {passwordData.newPassword.length < 6 ? 'Too short' :
                     passwordData.newPassword.length < 8 ? 'Good' :
                     'Strong'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      passwordData.newPassword.length < 6 ? 'bg-red-500 w-1/3' :
                      passwordData.newPassword.length < 8 ? 'bg-yellow-500 w-2/3' :
                      'bg-green-500 w-full'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                <>
                  <FaKey className="mr-2" />
                  Change Password
                </>
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
            <h3 className="font-bold mb-2 flex items-center">
              <FaLock className="mr-2 text-yellow-500 text-sm" />
              Password Tips:
            </h3>
            <ul className="space-y-1 text-xs opacity-75">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Use at least 6 characters
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Mix letters, numbers, and symbols
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Don't use common or easily guessed passwords
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Never share your password with anyone
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;