// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import InvestmentLogin from './components/InvestmentLogin';
import InvestmentSignup from './components/InvestmentSignup';
import InvestmentDashboard from './components/dashboard';
import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';

// Import all page components
import StatisticsReports from './components/pages/StatisticsReports';
import TeamMembers from './components/pages/TeamMembers';
import Notifications from './components/pages/Notifications';
import Security from './components/pages/Security';
import TransactionsHistory from './components/pages/TransactionsHistory';

// Helper function for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-RW').format(amount || 0);
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });
  const [user, setUser] = useState(null);

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // ✅ FIXED: Single function to handle dark mode toggling
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Protect routes - check if user is authenticated
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            user ? (
              user.isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <InvestmentLogin
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogin={handleLogin}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !user ? (
              <InvestmentSignup
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onSignup={handleLogin}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* PROTECTED ROUTES - Require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InvestmentDashboard
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode} // ✅ Pass only toggleDarkMode
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <TransactionsHistory
                darkMode={darkMode}
                formatCurrency={formatCurrency}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <StatisticsReports
                darkMode={darkMode}
                formatCurrency={formatCurrency}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <TeamMembers
                darkMode={darkMode}
                formatCurrency={formatCurrency}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications
                darkMode={darkMode}
                formatCurrency={formatCurrency}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <Security
                darkMode={darkMode}
                formatCurrency={formatCurrency}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings 
                darkMode={darkMode}
                formatCurrency={formatCurrency}
              />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            user?.isAdmin ? (
              <AdminDashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/admin-test"
          element={
            user?.isAdmin ? (
              <AdminDashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            user ? (
              user.isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
              <div className="text-center max-w-md px-4">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-2xl mb-4">Page Not Found</p>
                <p className="opacity-75 mb-8">The page you're looking for doesn't exist.</p>
                <button
                  onClick={() => window.location.href = user ? (user.isAdmin ? '/admin' : '/dashboard') : '/login'}
                  className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold`}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;