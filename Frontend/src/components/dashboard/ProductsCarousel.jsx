// src/components/dashboard/ProductsCarousel.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaShoppingCart, FaChartLine, FaGift, FaUsers, FaShieldAlt, FaRobot,
  FaPhone, FaTablet, FaLaptop, FaSpinner, FaSync, FaExclamationCircle,
  FaChevronLeft, FaChevronRight, FaDatabase, FaClock, FaCoins, FaPercentage,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import axios from 'axios';

// Custom Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? FaCheckCircle : FaTimesCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-xl ${bgColor} text-white animate-slideIn`}>
      <Icon className="text-xl mr-3" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <FaTimesCircle className="text-lg" />
      </button>
    </div>
  );
};

const ProductsCarousel = ({ 
  darkMode, user, onPurchase, currentSlide, setCurrentSlide, formatCurrency 
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState({});
  const [productsFetched, setProductsFetched] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!productsFetched) {
      fetchProducts();
    }
  }, [productsFetched]);

  useEffect(() => {
    if (products.length <= 2) return;
    
    const interval = setInterval(() => {
      const totalSlides = Math.ceil(products.length / 2);
      if (totalSlides > 1) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [products.length, setCurrentSlide]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setFetchError(null);
      
      console.log('📦 Fetching real products from database...');
      const response = await axios.get('http://localhost:5000/api/products', {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
      });

      console.log('📦 Products API Response:', response.data);

      if (response.data.success && response.data.products && response.data.products.length > 0) {
        const mappedProducts = response.data.products.map((product) => {
          if (!product._id || !product.name || !product.price) {
            console.warn('⚠️ Product missing required fields:', product);
            return null;
          }

          let icon = FaShoppingCart;
          let color = 'blue';
          
          const type = (product.type || product.name || '').toLowerCase();
          if (type.includes('phone') || type.includes('professional')) {
            icon = FaChartLine;
            color = 'green';
          } else if (type.includes('tablet') || type.includes('premium')) {
            icon = FaGift;
            color = 'yellow';
          } else if (type.includes('pc') || type.includes('business') || type.includes('laptop') || type.includes('desktop')) {
            icon = FaUsers;
            color = 'purple';
          } else if (type.includes('enterprise') || type.includes('streaming')) {
            icon = FaShieldAlt;
            color = 'red';
          } else if (type.includes('vip') || type.includes('watch')) {
            icon = FaRobot;
            color = 'pink';
          }
          
          return {
            _id: product._id,
            name: product.name,
            type: product.type,
            price: product.price,
            image: product.image,
            dailyEarning: product.dailyEarning,
            totalReturn: product.totalReturn,
            description: product.description,
            duration: product.duration || "30 days",
            returnRate: product.returnRate,
            icon: icon,
            color: color
          };
        }).filter(product => product !== null);
        
        console.log('✅ Mapped Products:', mappedProducts);
        setProducts(mappedProducts);
        setProductsFetched(true);
        
        if (mappedProducts.length === 0) {
          setFetchError('No valid products found in the database.');
        }
      } else {
        console.log('⚠️ No products found in database response');
        setProducts([]);
        setFetchError('No investment products available at the moment.');
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      
      if (error.code === 'ECONNABORTED') {
        setFetchError('Connection timeout. Please check if the backend server is running.');
      } else if (error.response) {
        if (error.response.status === 404) {
          setFetchError('Products endpoint not found. Make sure the backend API is correct.');
        } else if (error.response.status >= 500) {
          setFetchError('Server error. Please try again later.');
        } else {
          setFetchError(`Failed to load products: ${error.response.data.message || error.response.statusText}`);
        }
      } else if (error.request) {
        setFetchError('Cannot connect to server. Make sure the backend is running at http://localhost:5000');
      } else {
        setFetchError(`Error: ${error.message}`);
      }
      
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const slides = [];
  for (let i = 0; i < products.length; i += 2) {
    slides.push(products.slice(i, i + 2));
  }

  const getUserBalance = () => {
    if (!user) return 0;
    return (user.wallets?.main || 0) - (user.wallets?.reserved || 0);
  };

  const handlePurchaseClick = (product) => {
    const availableBalance = getUserBalance();
    
    // Check balance with professional toast notification
    if (availableBalance < product.price) {
      const neededAmount = formatCurrency(product.price - availableBalance);
      showToast(
        `Insufficient balance. You need ${neededAmount} FRW more to purchase ${product.name}. Recharge and continue`,
        'error'
      );
      return;
    }
    
    // Professional confirmation modal
    const netProfit = product.totalReturn - product.price;
    const dailyROI = ((product.dailyEarning / product.price) * 100).toFixed(2);
    
    const confirmMessage = 
`📱 ${product.name}
════════════════════
💰 PRICE: ${formatCurrency(product.price)} FRW
📈 DAILY RETURN: ${formatCurrency(product.dailyEarning)} FRW (${dailyROI}%)
⏱️ DURATION: ${product.duration || "30 days"}
💵 TOTAL RETURN (30 days): ${formatCurrency(product.totalReturn)} FRW
💹 NET PROFIT: ${formatCurrency(netProfit)} FRW
════════════════════
Do you want to proceed with this investment?`;

    if (window.confirm(confirmMessage)) {
      handlePurchase(product);
    }
  };

  const handlePurchase = async (product) => {
    if (!user || !user._id) {
      showToast('Please login to purchase products', 'error');
      return;
    }

    setSelectedProduct(product);
    setPurchaseLoading(prev => ({ ...prev, [product._id]: true }));
    
    try {
      await onPurchase(product._id, product.name, product.price);
      showToast('Investment purchased successfully! Your 30-day earning period has started.', 'success');
    } catch (error) {
      console.error('Purchase error:', error);
      showToast('Failed to complete purchase. Please try again.', 'error');
    } finally {
      setPurchaseLoading(prev => ({ ...prev, [product._id]: false }));
      setSelectedProduct(null);
    }
  };

  const colorClasses = {
    blue: { 
      bg: darkMode ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20' : 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: darkMode ? 'border-blue-700/30' : 'border-blue-200',
      text: darkMode ? 'text-blue-400' : 'text-blue-600',
      button: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
    },
    green: { 
      bg: darkMode ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20' : 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: darkMode ? 'border-green-700/30' : 'border-green-200',
      text: darkMode ? 'text-green-400' : 'text-green-600',
      button: darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
    },
    yellow: { 
      bg: darkMode ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20' : 'bg-gradient-to-br from-yellow-50 to-amber-50',
      border: darkMode ? 'border-yellow-700/30' : 'border-yellow-200',
      text: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      button: darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
    },
    purple: { 
      bg: darkMode ? 'bg-gradient-to-br from-purple-900/20 to-violet-900/20' : 'bg-gradient-to-br from-purple-50 to-violet-50',
      border: darkMode ? 'border-purple-700/30' : 'border-purple-200',
      text: darkMode ? 'text-purple-400' : 'text-purple-600',
      button: darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
    },
    red: { 
      bg: darkMode ? 'bg-gradient-to-br from-red-900/20 to-rose-900/20' : 'bg-gradient-to-br from-red-50 to-rose-50',
      border: darkMode ? 'border-red-700/30' : 'border-red-200',
      text: darkMode ? 'text-red-400' : 'text-red-600',
      button: darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
    },
    pink: { 
      bg: darkMode ? 'bg-gradient-to-br from-pink-900/20 to-rose-900/20' : 'bg-gradient-to-br from-pink-50 to-rose-50',
      border: darkMode ? 'border-pink-700/30' : 'border-pink-200',
      text: darkMode ? 'text-pink-400' : 'text-pink-600',
      button: darkMode ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'
    }
  };

  if (loadingProducts) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium mb-2">Loading investment products...</p>
        <div className="flex items-center justify-center">
          <FaDatabase className="mr-2 text-blue-500" />
          <span className="text-sm">Fetching from database...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Cannot Load Products</h3>
        <p className="mb-6 max-w-md mx-auto text-sm">{fetchError}</p>
        <button
          onClick={fetchProducts}
          className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          <FaSync className="inline mr-2" /> Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <FaExclamationCircle className="text-yellow-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No Products Available</h3>
        <p className="mb-6">There are currently no investment products in the database.</p>
        <button
          onClick={fetchProducts}
          className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          <FaSync className="inline mr-2" /> Refresh Products
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="relative px-4 md:px-8">
        {/* Slide Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 md:p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <FaChevronLeft />
            </button>
            
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 md:p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Slides */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slideProducts, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {slideProducts.map((product) => {
                    const classes = colorClasses[product.color] || colorClasses.blue;
                    const Icon = product.icon;
                    
                    return (
                      <div 
                        key={product._id} 
                        className={`rounded-2xl p-4 md:p-6 border-2 ${classes.bg} ${classes.border} transition-all hover:scale-[1.02] hover:shadow-xl`}
                      >
                        {/* Product Image */}
                        <div className="mb-4 h-40 md:h-48 overflow-hidden rounded-xl">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/500x300/2d3748/ffffff?text=${encodeURIComponent(product.name)}`;
                            }}
                          />
                        </div>

                        {/* Product Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`p-2 md:p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg mr-3`}>
                              <Icon className={`text-lg md:text-xl ${classes.text}`} />
                            </div>
                            <div>
                              <h3 className="text-lg md:text-xl font-bold">{product.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                {product.type}
                              </span>
                            </div>
                          </div>
                          <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'} font-bold`}>
                            {product.returnRate}
                          </div>
                        </div>

                        {/* Price and Earnings */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-xs opacity-75">Price:</p>
                              <p className="text-xl md:text-2xl font-bold text-green-500">{formatCurrency(product.price)} FRW</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs opacity-75">Daily Return:</p>
                              <p className="text-lg md:text-xl font-bold text-yellow-500">{formatCurrency(product.dailyEarning)} FRW</p>
                            </div>
                          </div>
                          
                          {/* Total Return - Updated to 30 days */}
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} mt-3`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm opacity-75">Total Return (30 days):</span>
                              <span className="text-lg font-bold text-green-500">{formatCurrency(product.totalReturn)} FRW</span>
                            </div>
                          </div>
                          
                          {/* Duration */}
                          <div className="flex items-center text-sm mt-3">
                            <FaClock className="mr-2 text-blue-500" />
                            <span>Duration: {product.duration || "30 days"}</span>
                          </div>

                          {/* Net Profit */}
                          <div className="flex items-center text-sm mt-2">
                            <FaCoins className="mr-2 text-purple-500" />
                            <span>Net Profit: <span className="font-bold text-purple-500">{formatCurrency(product.totalReturn - product.price)} FRW</span></span>
                          </div>
                        </div>

                        {/* Purchase Button */}
                        <button
                          onClick={() => handlePurchaseClick(product)}
                          disabled={purchaseLoading[product._id]}
                          className={`w-full py-2 md:py-3 rounded-xl font-bold ${classes.button} text-white transition-all flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base`}
                        >
                          {purchaseLoading[product._id] ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaShoppingCart className="mr-2" />
                              Purchase Product 
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
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${currentSlide === index 
                  ? darkMode ? 'bg-blue-500 w-4 md:w-8' : 'bg-blue-600 w-4 md:w-8' 
                  : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductsCarousel;