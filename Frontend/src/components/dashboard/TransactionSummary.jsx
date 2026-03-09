





// src/components/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowDown, FaArrowUp, FaSpinner, FaCheckCircle, FaWallet, FaCoins, FaClock, FaExclamationTriangle, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../../config'; // Correct import path from src/components to src/config.js

const TransactionModal = ({ darkMode, isOpen, onClose, type, user, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [checkingPending, setCheckingPending] = useState(true);
  const [hasPending, setHasPending] = useState(false);

  // Remove this line:
  // const API_URL = 'http://localhost:5000/api';

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && user) {
      setAmount('');
      setPaymentMethod('mtn');
      setPhoneNumber(user.nimero_yatelefone || ''); // ✅ Use user's phone from props
      setDescription('');
      setError('');
      setSuccess('');
      setStep(1);
      setCheckingPending(true);
      setHasPending(false);
      setPendingTransactions([]);
      
      // Debug: Log user info
      console.log('🔍 TransactionModal opened for user:', {
        id: user._id,
        name: user.izina_ryogukoresha,
        phone: user.nimero_yatelefone
      });
      
      checkPendingTransactions();
    }
  }, [isOpen, user]);

  const checkPendingTransactions = async () => {
    try {
      // ✅ FIX: Use sessionStorage, not localStorage
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/transactions/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const pending = response.data.transactions || [];
        
        const typePending = pending.filter(t => 
          (type === 'deposit' && t.type === 'deposit') ||
          (type === 'withdraw' && t.type === 'withdraw')
        );

        if (typePending.length > 0) {
          setPendingTransactions(typePending);
          setHasPending(true);
        } else {
          setHasPending(false);
          setStep(2);
        }
      }
    } catch (error) {
      console.error('Error checking pending transactions:', error);
      setStep(2);
    } finally {
      setCheckingPending(false);
    }
  };

  const availableMain = user?.wallets?.main - (user?.wallets?.reserved || 0);
  const earningBalance = user?.wallets?.earning || 0;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    // Validation
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const minAmount = type === 'deposit' ? 1000 : 5000;
    if (amount < minAmount) {
      setError(`Minimum amount is ${minAmount.toLocaleString()} FRW`);
      return;
    }

    if (type === 'withdraw') {
      if (amount > earningBalance) {
        setError(`Insufficient earnings. Available: ${earningBalance.toLocaleString()} FRW`);
        return;
      }
    }

    // ✅ Verify phone number matches user
    if (phoneNumber !== user?.nimero_yatelefone) {
      console.error('Phone mismatch:', {
        formPhone: phoneNumber,
        userPhone: user?.nimero_yatelefone,
        userName: user?.izina_ryogukoresha
      });
      setError('Phone number does not match your registered phone');
      return;
    }

    setStep(3);
  };

  const confirmTransaction = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ FIX: Use sessionStorage, not localStorage
      const token = sessionStorage.getItem('token');
      
      // ✅ FIX: Use the correct endpoint
      const endpoint = type === 'deposit' ? 'deposit' : 'withdraw';
      
      console.log('📤 Sending transaction request:', {
        endpoint,
        amount: parseFloat(amount),
        paymentMethod,
        phoneNumber,
        description: description || `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request`
      });
      
      const response = await axios.post(`${API_BASE_URL}/user/${endpoint}`, {
        amount: parseFloat(amount),
        paymentMethod: paymentMethod,
        phoneNumber: phoneNumber,
        description: description || `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request`
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess('Transaction request submitted successfully!');
        setStep(4);
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to submit transaction');
        setStep(2);
      }
    } catch (error) {
      console.error('Transaction error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to submit transaction. Please try again.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
    setError('');
  };

  const proceedAnyway = () => {
    setStep(2);
  };

  if (!isOpen) return null;

  const title = type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds';
  const icon = type === 'deposit' ? FaArrowDown : FaArrowUp;
  const iconColor = type === 'deposit' ? 'text-blue-500' : 'text-green-500';
  const buttonColor = type === 'deposit' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600';
  
  const balanceInfo = type === 'deposit' 
    ? `Available: ${availableMain.toLocaleString()} FRW`
    : `Available: ${earningBalance.toLocaleString()} FRW`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW').format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-RW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Step 4: Success Screen
  if (step === 4) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-8 text-center">
            <div className="mb-6">
              <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
              <p className="opacity-75">
                Your {type} request for {parseInt(amount).toLocaleString()} FRW has been sent to admin.
              </p>
            </div>
            
            <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h4 className="font-bold mb-2">Next Steps:</h4>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-start">
                  <span className="mr-2">📋</span>
                  <span>Admin will review your request within 1-3 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⏱️</span>
                  <span>You'll receive a notification when processed</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📞</span>
                  <span>Contact support if you have questions</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} font-medium`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation Screen
  if (step === 3) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-6 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <div className={`${iconColor} mr-3 text-xl`}>
                {React.createElement(icon)}
              </div>
              <div>
                <h3 className="text-xl font-bold">Confirm {title}</h3>
                <p className="text-sm opacity-75">Review your transaction details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-6">
            {/* Transaction Details in Card */}
            <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
              <h4 className="font-bold mb-4">Transaction Details:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-75">Type:</span>
                  <span className="font-bold capitalize">{type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-75">Amount:</span>
                  <span className="text-xl font-bold text-green-500">{parseInt(amount).toLocaleString()} FRW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-75">Payment Method:</span>
                  <span className="font-medium">
                    {paymentMethod === 'mtn' ? 'MTN' : 
                     paymentMethod === 'airtel' ? 'Airtel' : 'Bank'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-75">Phone Number:</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
                {description && (
                  <div className="flex justify-between items-start">
                    <span className="opacity-75">Description:</span>
                    <span className="font-medium text-right max-w-xs break-words">{description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className={`mb-6 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <h4 className="font-bold mb-2 text-sm">Important Notes:</h4>
              <ul className="text-xs space-y-1">
                {type === 'deposit' ? (
                  <>
                    <li>• Send {parseInt(amount).toLocaleString()} FRW to agent: 0781234567</li>
                    <li>• Include username in payment note</li>
                    <li>• Admin verification: 1-3 hours</li>
                  </>
                ) : (
                  <>
                    <li>• Withdrawal requires admin approval</li>
                    <li>• Processing time: 1-3 business days</li>
                    <li>• Funds sent to: {phoneNumber}</li>
                  </>
                )}
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'} text-red-600 text-sm`}>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8">
              <button
                onClick={goBack}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Edit Details
              </button>
              <button
                onClick={confirmTransaction}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg ${buttonColor} text-white font-bold flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Pending Transactions Check
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ maxHeight: '90vh' }}>
          {/* Header */}
          <div className={`p-6 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-500 mr-3 text-xl" />
              <div>
                <h3 className="text-xl font-bold">Pending {type === 'deposit' ? 'Deposit' : 'Withdrawal'}</h3>
                <p className="text-sm opacity-75">Check pending transactions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <FaTimes />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {checkingPending ? (
              <div className="text-center py-8">
                <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
                <p className="text-lg">Checking...</p>
              </div>
            ) : hasPending ? (
              <>
                {/* Warning Banner */}
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex items-center">
                    <FaClock className="text-yellow-500 mr-2" />
                    <div className="text-sm">
                      <span className="font-bold">{pendingTransactions.length} pending {type}(s) found</span>
                      <p className="mt-1">Complete pending transactions first for better processing</p>
                    </div>
                  </div>
                </div>

                {/* Pending Transactions List */}
                <div className="mb-4">
                  <h5 className="font-bold mb-3 text-sm uppercase tracking-wide opacity-75">Pending Transactions:</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {pendingTransactions.slice(0, 5).map((transaction, index) => (
                      <div 
                        key={transaction._id || index}
                        className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'} flex items-center justify-between`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-bold text-green-500">{formatCurrency(transaction.amount)} FRW</span>
                            <span className="mx-2 opacity-50">•</span>
                            <span className="text-xs opacity-75">
                              {transaction.createdAt ? formatDate(transaction.createdAt) : 'Recent'}
                            </span>
                          </div>
                          <div className="text-xs mt-1 opacity-75">
                            Ref: {transaction.reference?.substring(0, 8) || 'N/A'} • 
                            {transaction.paymentMethod === 'mtn' ? ' MTN' : 
                             transaction.paymentMethod === 'airtel' ? ' Airtel' : ' Bank'}
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                          Pending
                        </span>
                      </div>
                    ))}
                    {pendingTransactions.length > 5 && (
                      <div className="text-center text-sm opacity-75">
                        + {pendingTransactions.length - 5} more pending transactions
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
                  <h5 className="font-bold mb-2 text-sm">
                    {type === 'deposit' ? '📥 Deposit Instructions' : '📤 Withdrawal Info'}
                  </h5>
                  <ul className="text-xs space-y-1">
                    {type === 'deposit' ? (
                      <>
                        <li>1. Send money to: 0781234567</li>
                        <li>2. Include reference in payment note</li>
                        <li>3. Wait 1-3 hours for verification</li>
                      </>
                    ) : (
                      <>
                        <li>1. Admin approval required</li>
                        <li>2. 1-3 business days processing</li>
                        <li>3. Contact support for urgent requests</li>
                      </>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">All Clear!</h4>
                <p className="opacity-75 mb-6">
                  No pending {type}s found. You can proceed.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
            <div className="grid grid-cols-2 gap-3">
              {hasPending ? (
                <>
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className={`py-3 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    <FaHistory className="mr-2" />
                    View All
                  </button>
                  
                  <button
                    onClick={proceedAnyway}
                    className={`py-3 rounded-lg ${darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-bold`}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setStep(2)}
                  className={`col-span-2 py-3 rounded-lg ${buttonColor} text-white font-bold`}
                >
                  Continue to {title}
                </button>
              )}
            </div>
            
            {hasPending && (
              <button
                onClick={onClose}
                className={`w-full mt-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} text-sm`}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Input Screen
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className={`p-6 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
          <div className="flex items-center">
            <div className={`${iconColor} mr-3 text-xl`}>
              {React.createElement(icon)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm opacity-75">
                {type === 'deposit' ? 'Add funds' : 'Withdraw earnings'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Pending Warning */}
          {hasPending && (
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-bold">Note:</span> You have {pendingTransactions.length} pending {type}(s)
                </div>
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {type === 'deposit' ? (
                  <FaWallet className="text-blue-500 mr-2" />
                ) : (
                  <FaCoins className="text-green-500 mr-2" />
                )}
                <span className="font-medium">
                  {type === 'deposit' ? 'Main Balance' : 'Earnings Balance'}
                </span>
              </div>
              <span className="text-xl font-bold text-green-500">
                {type === 'deposit' 
                  ? availableMain.toLocaleString() 
                  : earningBalance.toLocaleString()} FRW
              </span>
            </div>
            <div className="text-xs mt-2 opacity-75">
              {type === 'deposit' 
                ? 'Min: 1,000 FRW • Instant'
                : 'Min: 5,000 FRW • 1-3 days'}
            </div>
          </div>

          {/* Debug Info */}
          <div className="mb-4 p-2 bg-blue-900/20 text-xs rounded">
            <p>User: {user?.izina_ryogukoresha} (ID: {user?._id?.substring(0,8)}...)</p>
            <p>Your Phone: {user?.nimero_yatelefone}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'} text-red-600 text-sm`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block mb-1 font-medium text-sm">Amount (FRW)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full p-3 pl-12 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder={type === 'deposit' ? '1000' : '5000'}
                  min={type === 'deposit' ? '1000' : '5000'}
                  step="100"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  FRW
                </div>
              </div>
              <div className="mt-1 text-xs opacity-75">
                {balanceInfo}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block mb-1 font-medium text-sm">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              >
                <option value="mtn">MTN Mobile Money</option>
                <option value="airtel">Airtel Money</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Phone Number - Pre-filled and Disabled */}
            <div>
              <label className="block mb-1 font-medium text-sm">
                {type === 'deposit' ? 'Your Phone' : 'Withdrawal Phone'}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="0781234567"
                required
                readOnly // ✅ Make it read-only to prevent changes
              />
              <p className="text-xs mt-1 opacity-75">This is your registered phone number</p>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-sm">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder={type === 'deposit' ? 'e.g., Deposit for investment' : 'e.g., Withdrawal'}
                rows="2"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="pt-2">
              <p className="text-xs opacity-75 mb-2">Quick Amounts:</p>
              <div className="grid grid-cols-3 gap-2">
                {type === 'deposit' 
                  ? [1000, 5000, 10000, 25000, 50000, 100000].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`py-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {quickAmount >= 1000 ? `${quickAmount/1000}K` : quickAmount}
                      </button>
                    ))
                  : [5000, 10000, 25000, 50000, 100000, 250000].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`py-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {quickAmount >= 1000 ? `${quickAmount/1000}K` : quickAmount}
                      </button>
                    ))
                }
              </div>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={goBack}
              className={`flex-1 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`flex-1 py-3 rounded-lg ${buttonColor} text-white font-bold`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;