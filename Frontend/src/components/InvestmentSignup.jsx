// src/components/InvestmentSignup.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaSun, FaMoon, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const InvestmentSignup = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    izina_ryogukoresha: '',
    nimero_yatelefone: '',
    ijambo_banga: '',
    subiramo_ijambobanga: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validation, setValidation] = useState({
    usernameValid: false,
    phoneValid: false,
    passwordValid: false,
    confirmValid: false,
    phoneAvailable: null,
    usernameAvailable: null
  });

  const API_URL = 'http://localhost:5000/api';

  // Log referral code when component mounts
  useEffect(() => {
    if (referralCode) {
      console.log('🔗 Referred by:', referralCode);
    }
  }, [referralCode]);

  useEffect(() => {
    const newValidation = {
      usernameValid: formData.izina_ryogukoresha.length >= 3,
      phoneValid: /^(?:\+250|0)?[78][0-9]{8}$/.test(formData.nimero_yatelefone),
      passwordValid: formData.ijambo_banga.length >= 6,
      confirmValid: formData.ijambo_banga === formData.subiramo_ijambobanga && formData.ijambo_banga.length > 0,
      phoneAvailable: validation.phoneAvailable,
      usernameAvailable: validation.usernameAvailable
    };
    setValidation(newValidation);
  }, [formData]);

  useEffect(() => {
    const checkPhone = async () => {
      if (validation.phoneValid && formData.nimero_yatelefone) {
        try {
          const response = await axios.get(`${API_URL}/auth/check-phone/${formData.nimero_yatelefone}`);
          setValidation(prev => ({
            ...prev,
            phoneAvailable: response.data.available
          }));
        } catch (error) {
          console.error('Error checking phone:', error);
        }
      }
    };

    const timeoutId = setTimeout(checkPhone, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.nimero_yatelefone]);

  useEffect(() => {
    const checkUsername = async () => {
      if (validation.usernameValid && formData.izina_ryogukoresha) {
        try {
          const response = await axios.get(`${API_URL}/auth/check-username/${formData.izina_ryogukoresha}`);
          setValidation(prev => ({
            ...prev,
            usernameAvailable: response.data.available
          }));
        } catch (error) {
          console.error('Error checking username:', error);
        }
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.izina_ryogukoresha]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validation.usernameValid) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (!validation.phoneValid) {
      setError('Invalid phone number format. Please use format: 0781234567');
      setLoading(false);
      return;
    }

    if (validation.phoneAvailable === false) {
      setError('Phone number is already registered. Please use a different number.');
      setLoading(false);
      return;
    }

    if (validation.usernameAvailable === false) {
      setError('Username is already taken. Please choose a different username.');
      setLoading(false);
      return;
    }

    if (!validation.passwordValid) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!validation.confirmValid) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const weakPasswords = ['password', '123456', 'qwerty', 'letmein', 'admin', '000000', '111111', '222222', '333333'];
    if (weakPasswords.includes(formData.ijambo_banga.toLowerCase())) {
      setError('Password is too weak. Please choose a stronger password.');
      setLoading(false);
      return;
    }

    try {
      // Prepare signup data
      const signupData = {
        izina_ryogukoresha: formData.izina_ryogukoresha.trim(),
        nimero_yatelefone: formData.nimero_yatelefone,
        ijambo_banga: formData.ijambo_banga
      };

      // Add referral code if it exists
      if (referralCode) {
        signupData.referredBy = referralCode;
        console.log('📝 Sending referral code to backend:', referralCode);
      }

      const response = await axios.post(`${API_URL}/auth/signup`, signupData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.success) {
        const user = response.data.user;
        const userReferralCode = user.referralCode || '';
        const referralLink = `${window.location.origin}/signup?ref=${userReferralCode}`;
        
        setSuccess('Registration successful! Welcome to Apex Growth.');
        
        setTimeout(() => {
          // Show different message if user was referred
          const referralMessage = referralCode 
            ? `\n\n🎁 Referred by: ${referralCode}\nThank you for joining Apex Growth through a referral!` 
            : '';
          
          alert(`🎉 Welcome to Apex Growth!

👤 Username: ${user.izina_ryogukoresha}
📱 Phone: ${user.nimero_yatelefone}
🔗 Referral Code: ${userReferralCode}
🔗 Referral Link: ${referralLink}
${referralMessage}
💰 Welcome Bonus: 400 FRW has been added to your account

📍 Sign in now to start your growth journey!`);

          navigate('/login');
        }, 500);
      }
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data || err.message);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Invalid information provided');
            break;
          case 409:
            setError(err.response.data.message || 'Phone number is already registered.');
            break;
          default:
            setError(err.response.data?.message || 'An error occurred. Please try again.');
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please check if backend is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      izina_ryogukoresha: '',
      nimero_yatelefone: '',
      ijambo_banga: '',
      subiramo_ijambobanga: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">AG</span>
        </div>
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Apex Growth</h1>
        <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start your wealth journey today</p>
      </div>

      {/* Back to login */}
      <div className="mb-6">
        <Link
          to="/login"
          className={`inline-flex items-center font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          ← Back to Sign In
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        {/* Referral Badge - Show if there's a referral code */}
        {referralCode && (
          <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
            <p className={`text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              <span className="font-bold">Referred by: {referralCode}</span>
              <span className="block text-sm mt-1">Welcome! You've been invited by a friend.</span>
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            <div className="flex items-start">
              <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700'}`}>
            <div className="flex items-start">
              <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success!</p>
                <p className="text-sm mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                type="text"
                name="izina_ryogukoresha"
                value={formData.izina_ryogukoresha}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.usernameAvailable === false ? 'focus:ring-red-500 border-red-500' : validation.usernameAvailable === true ? 'focus:ring-green-500 border-green-500' : 'focus:ring-blue-500'}`}
                placeholder="Choose a username"
                required
              />
              {formData.izina_ryogukoresha && (
                <p className={`text-sm mt-2 ${validation.usernameAvailable === false ? 'text-red-600' : validation.usernameAvailable === true ? 'text-green-600' : validation.usernameValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.usernameAvailable === false ? '❌ Username is already taken' : 
                   validation.usernameAvailable === true ? '✅ Username is available' : 
                   validation.usernameValid ? '✅ Username format valid' : '❌ Username must be at least 3 characters'}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone Number
              </label>
              <input
                type="tel"
                name="nimero_yatelefone"
                value={formData.nimero_yatelefone}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.phoneAvailable === false ? 'focus:ring-red-500 border-red-500' : validation.phoneAvailable === true ? 'focus:ring-green-500 border-green-500' : 'focus:ring-blue-500'}`}
                placeholder="0781234567"
                required
              />
              {formData.nimero_yatelefone && (
                <p className={`text-sm mt-2 ${validation.phoneAvailable === false ? 'text-red-600' : validation.phoneAvailable === true ? 'text-green-600' : validation.phoneValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.phoneAvailable === false ? '❌ Phone number is already registered' : 
                   validation.phoneAvailable === true ? '✅ Phone number is available' : 
                   validation.phoneValid ? '✅ Phone number format valid' : '❌ Invalid phone number (format: 0781234567)'}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="ijambo_banga"
                  value={formData.ijambo_banga}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.passwordValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
                  placeholder="Password (min. 6 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.ijambo_banga && (
                <p className={`text-sm mt-2 ${validation.passwordValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.passwordValid ? '✅ Password meets requirements' : '❌ Password must be at least 6 characters'}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="subiramo_ijambobanga"
                  value={formData.subiramo_ijambobanga}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.confirmValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.subiramo_ijambobanga && (
                <p className={`text-sm mt-2 ${validation.confirmValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.confirmValid ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className={`flex-1 py-3 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading || !Object.values(validation).every(v => v !== false)}
                className={`flex-1 py-3 rounded-lg font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50 transition-colors`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Bonus Message at Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`font-bold text-lg ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                💰 Welcome Bonus: 400 FRW
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-yellow-200' : 'text-yellow-600'}`}>
                Get 400 FRW instantly to start your growth journey!
              </p>
            </div>
          </div>

          {/* Already have account */}
          <div className="mt-4 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSignup;