
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

//       console.log('🔐 Changing password using auth endpoint...');
      
//       // CHANGED: Using /auth/change-password instead of /user/change-password
//       const response = await axios.post(`${API_URL}/auth/change-password`, {
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
        
//         // Logout user after password change (security best practice)
//         setTimeout(() => {
//           sessionStorage.removeItem('token');
//           sessionStorage.removeItem('user');
//           navigate('/login');
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('❌ Password change error:', error);
      
//       if (error.response?.status === 401) {
//         setMessage({ type: 'error', text: error.response.data?.message || 'Current password is incorrect or session expired.' });
//         if (error.response.data?.message?.includes('token') || error.response.data?.message?.includes('session')) {
//           setTimeout(() => navigate('/login'), 2000);
//         }
//       } else if (error.response?.status === 400) {
//         setMessage({ type: 'error', text: error.response.data.message || 'Invalid request. Please check your input.' });
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

//             {/* Password strength indicator */}
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
















import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, TrendingUp, Gift, Users, ArrowUp,
  AlertCircle, RefreshCw, Database, Loader,
  ChevronLeft, ChevronRight, Phone, Tablet, Laptop
} from 'lucide-react';
import API_BASE_URL from '../../config'; // Correct import path from src/components to root

const EnhancedProducts = ({ darkMode, user, onPurchase, currentSlide, setCurrentSlide }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [productsFetched, setProductsFetched] = useState(false);

  // Fetch products from database
  useEffect(() => {
    if (!productsFetched) {
      fetchProducts();
    }
  }, [productsFetched]);

  // Auto slide functionality
  useEffect(() => {
    if (products.length <= 3) return;
    
    const interval = setInterval(() => {
      const totalSlides = Math.ceil(products.length / 3);
      if (totalSlides > 1) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length, setCurrentSlide]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setFetchError(null);
      
      console.log('📦 Fetching real products from database...');
      console.log('🔗 Using API URL:', API_BASE_URL);
      
      // Replace this with your actual API endpoint
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.products?.length > 0) {
        const mappedProducts = data.products.map((product) => {
          const icon = getIconForType(product.type);
          const color = getColorForType(product.type);
          
          return {
            ...product,
            icon,
            color
          };
        });
        
        setProducts(mappedProducts);
        setProductsFetched(true);
      } else {
        setProducts([]);
        setFetchError('No investment products available at the moment.');
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setFetchError('Cannot connect to server. Please try again.');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getIconForType = (type) => {
    const icons = {
      'Watch': ShoppingCart,
      'Phone': Phone,
      'Tablet': Tablet,
      'PC': Laptop,
      'Starter': ShoppingCart,
      'Professional': TrendingUp,
      'Premium': Gift,
      'Business': Users,
      'Enterprise': ArrowUp,
      'VIP': Gift,
      'default': ShoppingCart
    };
    return icons[type] || icons.default;
  };

  const getColorForType = (type) => {
    const colors = {
      'Watch': 'blue',
      'Phone': 'green',
      'Tablet': 'yellow',
      'PC': 'purple',
      'Starter': 'blue',
      'Professional': 'green',
      'Premium': 'yellow',
      'Business': 'purple',
      'Enterprise': 'red',
      'VIP': 'pink',
      'default': 'blue'
    };
    return colors[type] || colors.default;
  };

  const handleImageLoad = (productId) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageError = (productId, productName) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
    setImageLoading(prev => ({ ...prev, [productId]: false }));
  };

  const getUserBalance = () => {
    if (!user?.wallets?.main) return 0;
    return user.wallets.main;
  };

  const handlePurchase = async (product) => {
    if (!user?._id) {
      alert('Please login to purchase products');
      return;
    }

    const userBalance = getUserBalance();
    if (userBalance < product.price) {
      alert(`Insufficient balance. You need ${(product.price - userBalance).toLocaleString()} FRW more.`);
      return;
    }

    setSelectedProduct(product);
    setPurchaseLoading(prev => ({ ...prev, [product._id]: true }));
    
    try {
      await onPurchase(product._id, product.name, product.price);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchaseLoading(prev => ({ ...prev, [product._id]: false }));
      setSelectedProduct(null);
    }
  };

  const colorClasses = {
    blue: { 
      bg: darkMode ? 'bg-blue-900/10' : 'bg-blue-50',
      border: darkMode ? 'border-blue-700/20' : 'border-blue-200',
      text: darkMode ? 'text-blue-400' : 'text-blue-600',
      button: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
    },
    green: { 
      bg: darkMode ? 'bg-green-900/10' : 'bg-green-50',
      border: darkMode ? 'border-green-700/20' : 'border-green-200',
      text: darkMode ? 'text-green-400' : 'text-green-600',
      button: darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
    },
    yellow: { 
      bg: darkMode ? 'bg-yellow-900/10' : 'bg-yellow-50',
      border: darkMode ? 'border-yellow-700/20' : 'border-yellow-200',
      text: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      button: darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
    },
    purple: { 
      bg: darkMode ? 'bg-purple-900/10' : 'bg-purple-50',
      border: darkMode ? 'border-purple-700/20' : 'border-purple-200',
      text: darkMode ? 'text-purple-400' : 'text-purple-600',
      button: darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
    },
    red: { 
      bg: darkMode ? 'bg-red-900/10' : 'bg-red-50',
      border: darkMode ? 'border-red-700/20' : 'border-red-200',
      text: darkMode ? 'text-red-400' : 'text-red-600',
      button: darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
    },
    pink: { 
      bg: darkMode ? 'bg-pink-900/10' : 'bg-pink-50',
      border: darkMode ? 'border-pink-700/20' : 'border-pink-200',
      text: darkMode ? 'text-pink-400' : 'text-pink-600',
      button: darkMode ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'
    }
  };

  // Group products into slides (3 per slide for more compact view)
  const slides = [];
  for (let i = 0; i < products.length; i += 3) {
    slides.push(products.slice(i, i + 3));
  }

  const nextSlide = () => {
    const totalSlides = Math.ceil(products.length / 3);
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(products.length / 3);
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  if (loadingProducts) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="flex justify-center mb-4">
          <Loader className="animate-spin h-12 w-12 text-blue-500" />
        </div>
        <p className="font-medium">Loading products...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={`text-center p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-xl`}>
        <AlertCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">Cannot Load Products</h3>
        <p className="text-sm mb-4">{fetchError}</p>
        <button
          onClick={fetchProducts}
          className={`px-4 py-2 rounded-lg font-bold ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white inline-flex items-center`}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-xl`}>
        <AlertCircle className="text-yellow-500 w-12 h-12 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">No Products Available</h3>
        <p className="text-sm mb-4">Check back soon for new investment opportunities.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
            style={{ left: '-0.75rem' }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
            style={{ right: '-0.75rem' }}
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Products Slider */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideProducts, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slideProducts.map((product) => {
                  const classes = colorClasses[product.color] || colorClasses.blue;
                  const Icon = product.icon;
                  const userBalance = getUserBalance();
                  const hasEnoughBalance = userBalance >= product.price;
                  const durationDays = parseInt(product.duration) || 30;
                  const totalReturn = product.dailyEarning * durationDays;
                  
                  return (
                    <div 
                      key={product._id} 
                      className={`rounded-xl p-4 border ${classes.bg} ${classes.border} transition-all hover:scale-[1.02] hover:shadow-lg`}
                    >
                      {/* Compact Image with Loading State */}
                      <div className="mb-3 h-32 overflow-hidden rounded-lg relative">
                        {imageLoading[product._id] !== false && !imageErrors[product._id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <Loader className="animate-spin text-gray-400" size={24} />
                          </div>
                        )}
                        {imageErrors[product._id] ? (
                          <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <Icon className={`${classes.text}`} size={48} />
                          </div>
                        ) : (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className={`w-full h-full object-cover ${imageLoading[product._id] !== false ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                            onLoad={() => handleImageLoad(product._id)}
                            onError={() => handleImageError(product._id, product.name)}
                          />
                        )}
                      </div>

                      {/* Compact Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm mr-2 flex-shrink-0`}>
                            <Icon className={classes.text} size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold truncate">{product.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {product.type}
                            </span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'} flex-shrink-0 ml-2`}>
                          {product.returnRate}
                        </div>
                      </div>

                      {/* Compact Description */}
                      <p className="text-xs opacity-75 mb-3 line-clamp-2">{product.description}</p>

                      {/* Compact Price Info */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs opacity-75">Price</p>
                            <p className="text-lg font-bold text-green-500">{product.price.toLocaleString()} FRW</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-75">Daily</p>
                            <p className="text-sm font-bold">{product.dailyEarning.toLocaleString()} FRW</p>
                          </div>
                        </div>
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'} text-center`}>
                          <p className="text-xs">
                            <span className="font-medium">{product.duration}</span> • 
                            Total: <span className="font-bold text-green-500">{totalReturn.toLocaleString()} FRW</span>
                          </p>
                        </div>
                      </div>

                      {/* Purchase Button */}
                      <button
                        onClick={() => handlePurchase(product)}
                        disabled={!hasEnoughBalance || purchaseLoading[product._id]}
                        className={`w-full py-2 rounded-lg font-bold ${classes.button} text-white text-sm transition-all flex items-center justify-center hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {purchaseLoading[product._id] ? (
                          <>
                            <Loader className="animate-spin mr-2" size={14} />
                            Processing...
                          </>
                        ) : !hasEnoughBalance ? (
                          <>
                            <AlertCircle className="mr-2" size={14} />
                            Insufficient Balance
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2" size={14} />
                            Purchase Now
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${currentSlide === index 
                ? darkMode ? 'bg-blue-500 w-6' : 'bg-blue-600 w-6' 
                : darkMode ? 'bg-gray-700 w-2' : 'bg-gray-300 w-2'}`}
            />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs opacity-75">
          {products.length} products available
        </div>
        <button
          onClick={fetchProducts}
          className={`text-xs px-3 py-1.5 rounded-lg flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <RefreshCw className="mr-1" size={10} /> Refresh
        </button>
      </div>
    </div>
  );
};

export default EnhancedProducts;