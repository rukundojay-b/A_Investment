
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, TrendingUp, Gift, Users, ArrowUp,
  AlertCircle, RefreshCw, Database, Loader,
  ChevronLeft, ChevronRight, Phone, Tablet, Laptop
} from 'lucide-react';

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
      
      // Replace this with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/products', {
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