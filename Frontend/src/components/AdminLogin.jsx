// // src/components/AdminLogin.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FaLock, 
//   FaEnvelope, 
//   FaEye, 
//   FaEyeSlash,
//   FaExclamationCircle,
//   FaSpinner,
//   FaShieldAlt
// } from 'react-icons/fa';
// import axios from 'axios';

// const AdminLogin = ({ darkMode, setDarkMode }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const API_URL = 'http://localhost:5000/api';

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!formData.email || !formData.password) {
//       setError('Email and password are required');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_URL}/admin/login`, formData, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000
//       });

//       if (response.data.success) {
//         const { token, admin } = response.data;
        
//         // Store admin token and data
//         localStorage.setItem('adminToken', token);
//         localStorage.setItem('admin', JSON.stringify(admin));
        
//         // Redirect to admin dashboard
//         navigate('/admin/dashboard');
//       }
//     } catch (err) {
//       console.error('Admin login error:', err);
      
//       if (err.response?.status === 401) {
//         setError('Invalid email or password');
//       } else if (err.response?.status === 404) {
//         setError('Admin account not found');
//       } else if (err.code === 'ECONNABORTED') {
//         setError('Connection timeout. Please try again.');
//       } else if (!err.response) {
//         setError('Cannot connect to server. Make sure backend is running.');
//       } else {
//         setError(err.response?.data?.message || 'Login failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
//       {/* Theme Toggle */}
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'}`}
//         >
//           {darkMode ? '☀️' : '🌙'}
//         </button>
//       </div>

//       <div className="w-full max-w-md">
//         {/* Logo and Header */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <FaShieldAlt className="text-white text-4xl" />
//           </div>
//           <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             Admin Portal
//           </h1>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//             Secure access for administrators only
//           </p>
//         </div>

//         {/* Login Form */}
//         <div className={`rounded-2xl shadow-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           {/* Error Message */}
//           {error && (
//             <div className={`mb-6 p-4 rounded-lg flex items-start ${
//               darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
//             }`}>
//               <FaExclamationCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
//               <span className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
//                 {error}
//               </span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 <div className="flex items-center">
//                   <FaEnvelope className="mr-2" />
//                   Email Address
//                 </div>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="admin@example.com"
//                 className={`w-full p-3 rounded-lg border ${
//                   darkMode 
//                     ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//                     : 'bg-white border-gray-300 placeholder-gray-500'
//                 } focus:outline-none focus:ring-2 focus:ring-red-500`}
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 <div className="flex items-center">
//                   <FaLock className="mr-2" />
//                   Password
//                 </div>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className={`w-full p-3 pr-10 rounded-lg border ${
//                     darkMode 
//                       ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//                       : 'bg-white border-gray-300 placeholder-gray-500'
//                   } focus:outline-none focus:ring-2 focus:ring-red-500`}
//                   required
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                   tabIndex="-1"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
//                 darkMode 
//                   ? 'bg-red-600 hover:bg-red-700' 
//                   : 'bg-red-500 hover:bg-red-600'
//               } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin mr-2" />
//                   Authenticating...
//                 </>
//               ) : (
//                 'Access Dashboard'
//               )}
//             </button>
//           </form>

//           {/* Security Notice */}
//           <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//             <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               <FaLock className="inline mr-1" />
//               This area is restricted to authorized personnel only.
//               <br />
//               All access attempts are logged and monitored.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
















// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaLock, 
  FaEnvelope, 
  FaEye, 
  FaEyeSlash,
  FaExclamationCircle,
  FaSpinner,
  FaShieldAlt
} from 'react-icons/fa';
import axios from 'axios';

const AdminLogin = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/admin/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.success) {
        const { token, admin } = response.data;
        
        // Store admin token and data
        localStorage.setItem('adminToken', token);
        localStorage.setItem('admin', JSON.stringify(admin));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 404) {
        setError('Admin account not found');
      } else if (err.code === 'ECONNABORTED') {
        setError('Connection timeout. Please try again.');
      } else if (!err.response) {
        setError('Cannot connect to server. Make sure backend is running.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaShieldAlt className="text-white text-4xl" />
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Admin Portal
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Secure access for administrators only
          </p>
        </div>

        {/* Login Form */}
        <div className={`rounded-2xl shadow-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
            }`}>
              <FaExclamationCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={`w-full p-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500`}
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <FaLock className="mr-2" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full p-3 pr-10 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                darkMode 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-500 hover:bg-red-600'
              } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FaLock className="inline mr-1" />
              This area is restricted to authorized personnel only.
              <br />
              All access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;