// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaLock, 
  FaSave, 
  FaArrowLeft,
  FaKey,
  FaShieldAlt,
  FaUserShield,
  FaBell,
  FaLanguage,
  FaPalette
} from 'react-icons/fa';
import axios from 'axios';

const Settings = ({ darkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    izina_ryogukoresha: '',
    nimero_yatelefone: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setFormData({
          izina_ryogukoresha: userData.izina_ryogukoresha || '',
          nimero_yatelefone: userData.nimero_yatelefone || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        fetchUserData(token);
      }
    } else {
      fetchUserData(token);
    }

    setLoading(false);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          izina_ryogukoresha: userData.izina_ryogukoresha || '',
          nimero_yatelefone: userData.nimero_yatelefone || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Failed to load user data' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      // Prepare update data
      const updateData = {
        izina_ryogukoresha: formData.izina_ryogukoresha,
        nimero_yatelefone: formData.nimero_yatelefone,
        email: formData.email
      };

      // If changing password, include password fields
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setSaving(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
          setSaving(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put('http://localhost:5000/api/user/profile', updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        
        // Update local storage
        const updatedUser = { ...user, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Update failed' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>User not found. Please login.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b py-4 px-6`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg mr-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
              <span className="font-bold">{user.izina_ryogukoresha?.charAt(0) || 'U'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' 
            ? darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200' 
            : darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'}`}>
            <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Profile Information Card */}
        <div className={`rounded-2xl p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center mb-6">
            <FaUserShield className="text-blue-500 text-xl mr-3" />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaUser className="mr-2" /> Username
              </label>
              <input
                type="text"
                name="izina_ryogukoresha"
                value={formData.izina_ryogukoresha}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaPhone className="mr-2" /> Phone Number
              </label>
              <input
                type="tel"
                name="nimero_yatelefone"
                value={formData.nimero_yatelefone}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaEnvelope className="mr-2" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            {/* Change Password Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FaKey className="text-yellow-500 text-xl mr-3" />
                <h3 className="text-lg font-bold">Change Password</h3>
              </div>

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 rounded-lg font-bold ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center justify-center disabled:opacity-50`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Additional Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Settings */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-green-500 text-xl mr-3" />
              <h3 className="font-bold">Security</h3>
            </div>
            <div className="space-y-3">
              <button className={`w-full p-3 rounded-lg text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                Two-Factor Authentication
              </button>
              <button className={`w-full p-3 rounded-lg text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                Login History
              </button>
              <button className={`w-full p-3 rounded-lg text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                Active Sessions
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaBell className="text-purple-500 text-xl mr-3" />
              <h3 className="font-bold">Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <div className={`w-12 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} relative`}>
                  <div className={`w-6 h-6 rounded-full absolute top-0 left-0 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} transition-transform`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>SMS Notifications</span>
                <div className={`w-12 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} relative`}>
                  <div className={`w-6 h-6 rounded-full absolute top-0 left-0 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} transition-transform`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Investment Alerts</span>
                <div className={`w-12 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} relative`}>
                  <div className={`w-6 h-6 rounded-full absolute top-0 left-6 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} transition-transform`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaLanguage className="text-yellow-500 text-xl mr-3" />
              <h3 className="font-bold">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <option>English</option>
                  <option>Kinyarwanda</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <option>Rwandan Franc (FRW)</option>
                  <option>US Dollar ($)</option>
                  <option>Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaPalette className="text-pink-500 text-xl mr-3" />
              <h3 className="font-bold">Appearance</h3>
            </div>
            <div className="space-y-3">
              <button className={`w-full p-3 rounded-lg text-left ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                Dark Mode
              </button>
              <button className={`w-full p-3 rounded-lg text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                Light Mode
              </button>
              <button className={`w-full p-3 rounded-lg text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                System Default
              </button>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className={`mt-8 rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className="font-bold mb-4">Account Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-700/30">
              <div className="text-2xl font-bold text-green-500">Active</div>
              <div className="text-sm opacity-75">Status</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-700/30">
              <div className="text-2xl font-bold">{new Date(user.createdAt).toLocaleDateString()}</div>
              <div className="text-sm opacity-75">Joined</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-700/30">
              <div className="text-2xl font-bold">{user.referrals?.count || 0}</div>
              <div className="text-sm opacity-75">Referrals</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-700/30">
              <div className="text-2xl font-bold">{(user.wallets?.main || 0).toLocaleString()} FRW</div>
              <div className="text-sm opacity-75">Balance</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;