// src/components/pages/Security.jsx
import React, { useState } from 'react';
import { 
  FaShieldAlt, FaLock, FaMobile, FaHistory,
  FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash,
  FaArrowLeft, FaKey, FaFingerprint, FaEnvelope,
  FaSave, FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Security = ({ darkMode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Kigali, Rwanda',
      ip: '192.168.1.1',
      lastActive: 'Just now',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Kigali, Rwanda',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      current: false
    }
  ]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:5000/api/user/sessions/${sessionId}/terminate`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setMessage({ type: 'success', text: 'Session terminated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to terminate session' });
    }
  };

  const toggleTwoFactor = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/user/2fa/toggle', {
        enabled: !twoFactorEnabled
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setTwoFactorEnabled(!twoFactorEnabled);
        setMessage({ 
          type: 'success', 
          text: `2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully` 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle 2FA' });
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`mr-4 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FaShieldAlt className="mr-3 text-green-500" />
            Security Settings
          </h1>
          <p className="opacity-75 mt-1">Manage your account security</p>
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
            <FaCheckCircle className="text-green-500 mr-3" />
          ) : (
            <FaTimesCircle className="text-red-500 mr-3" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaKey className="mr-2 text-yellow-500" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className={`w-full p-3 pr-10 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className={`w-full p-3 pr-10 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className={`w-full p-3 pr-10 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <FaFingerprint className="mr-2 text-purple-500" />
                Two-Factor Authentication
              </h2>
              <button
                onClick={toggleTwoFactor}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  twoFactorEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="opacity-75 text-sm mb-4">
              Add an extra layer of security to your account. Once enabled, you'll need to enter a code from your authenticator app in addition to your password.
            </p>
            {twoFactorEnabled && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p className="text-sm font-medium mb-2">Recovery Codes</p>
                <p className="text-xs opacity-75 mb-3">
                  Save these codes in a secure place. They can be used to access your account if you lose your phone.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456'].map((code, index) => (
                    <code key={index} className={`p-2 text-center text-sm rounded ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Active Sessions */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaHistory className="mr-2 text-blue-500" />
              Active Sessions
            </h2>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <FaMobile className={`mr-3 mt-1 ${session.current ? 'text-green-500' : ''}`} />
                      <div>
                        <div className="font-medium flex items-center">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm opacity-75">{session.location}</div>
                        <div className="text-xs opacity-50 mt-1">
                          IP: {session.ip} • Last active: {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => terminateSession(session.id)}
                        className={`px-3 py-1 text-sm rounded ${
                          darkMode ? 'bg-red-600/30 hover:bg-red-600/50' : 'bg-red-100 hover:bg-red-200'
                        } text-red-500`}
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Notifications */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaEnvelope className="mr-2 text-green-500" />
              Security Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Email me on new login</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Email me on password change</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Email me on withdrawal requests</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Email me on investment purchases</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" defaultChecked />
              </label>
            </div>
          </div>

          {/* Security Tips */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaLock className="mr-2 text-yellow-500" />
              Security Tips
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Use a strong, unique password
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Enable two-factor authentication
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Never share your password with anyone
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Log out from shared devices
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Monitor your active sessions regularly
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;