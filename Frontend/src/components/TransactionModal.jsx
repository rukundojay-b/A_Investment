// src/components/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowDown, FaArrowUp, FaSpinner, FaCheckCircle, FaWallet, FaCoins, FaClock, FaExclamationTriangle, FaHistory, FaPhone, FaCopy, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const TransactionModal = ({ darkMode, isOpen, onClose, type, user, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState(user?.nimero_yatelefone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [checkingPending, setCheckingPending] = useState(true);
  const [hasPending, setHasPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feeBreakdown, setFeeBreakdown] = useState({ serviceFee: 0, tax: 0, netAmount: 0 });

  const API_URL = 'http://localhost:5000/api';
  const DEPOSIT_NUMBER = '0794133572';
  const MTN_USSD = '*182*1*1*0794133572*';

  // Calculate fees when amount changes for withdrawals (but don't display)
  useEffect(() => {
    if (type === 'withdraw' && amount && !isNaN(amount) && amount > 0) {
      const numAmount = parseFloat(amount);
      const serviceFee = numAmount * 0.15; // 15% service fee
      const tax = numAmount * 0.05; // 5% tax
      const netAmount = numAmount - serviceFee - tax;
      
      setFeeBreakdown({
        serviceFee: serviceFee,
        tax: tax,
        netAmount: netAmount
      });
    } else {
      setFeeBreakdown({ serviceFee: 0, tax: 0, netAmount: 0 });
    }
  }, [amount, type]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setPaymentMethod('mtn');
      setPhoneNumber(user?.nimero_yatelefone || '');
      setError('');
      setSuccess('');
      setStep(1);
      setCheckingPending(true);
      setHasPending(false);
      setPendingTransactions([]);
      setCopied(false);
      setFeeBreakdown({ serviceFee: 0, tax: 0, netAmount: 0 });
      
      checkPendingTransactions();
    }
  }, [isOpen, user, type]);

  const checkPendingTransactions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.log('No token found for pending check');
        setStep(2);
        return;
      }

      const response = await axios.get(`${API_URL}/transactions/pending`, {
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

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(DEPOSIT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleInitiateUSSD = () => {
    // For mobile devices, open the USSD dialer
    window.location.href = `tel:${MTN_USSD}${amount}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // No minimum for deposits
    if (type === 'withdraw') {
      const minAmount = 1000; // Minimum 1000 for withdrawals
      if (amount < minAmount) {
        setError(`Minimum withdrawal amount is ${minAmount.toLocaleString()} FRW`);
        return;
      }

      if (amount > earningBalance) {
        setError(`Insufficient Balance. Available: ${earningBalance.toLocaleString()} FRW`);
        return;
      }
    }

    if (type === 'withdraw' && phoneNumber !== user?.nimero_yatelefone) {
      setError('Phone number must match your registered phone number');
      return;
    }

    setStep(3);
  };

  const confirmTransaction = async () => {
    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setStep(2);
        setLoading(false);
        return;
      }

      const endpoint = type === 'deposit' ? 'deposit' : 'withdraw';
      
      console.log(`📤 Submitting ${type} request...`);
      
      const response = await axios.post(`${API_URL}/user/${endpoint}`, {
        amount: parseFloat(amount),
        paymentMethod: paymentMethod,
        phoneNumber: type === 'withdraw' ? phoneNumber : DEPOSIT_NUMBER,
        description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request`
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
      console.error('Transaction error:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        sessionStorage.removeItem('token');
      } else {
        setError(error.response?.data?.message || 'Failed to submit transaction. Please try again.');
      }
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
                {type === 'withdraw' && (
                  <li className="flex items-start mt-3 pt-3 border-t border-dashed">
                    <span className="mr-2">💰</span>
                    <div className="w-full">
                      <span className="font-bold text-yellow-500">Fee Breakdown:</span><br />
                      <div className="flex justify-between mt-2">
                        <span>Service Fee (15%):</span>
                        <span className="text-red-500">-{formatCurrency(feeBreakdown.serviceFee)} FRW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (5%):</span>
                        <span className="text-red-500">-{formatCurrency(feeBreakdown.tax)} FRW</span>
                      </div>
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed">
                        <span>You'll receive:</span>
                        <span className="text-green-500">{formatCurrency(feeBreakdown.netAmount)} FRW</span>
                      </div>
                    </div>
                  </li>
                )}
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
                    {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'}
                  </span>
                </div>
                {type === 'deposit' ? (
                  <div className="flex justify-between items-center">
                    <span className="opacity-75">Deposit To:</span>
                    <span className="font-medium text-blue-500">{DEPOSIT_NUMBER}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="opacity-75">Withdraw To:</span>
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {type === 'deposit' && (
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'}`}>
                <h4 className="font-bold mb-3 flex items-center">
                  <FaPhone className="mr-2 text-green-500" />
                  Quick Deposit via USSD
                </h4>
                <p className="text-sm mb-3">Dial the code below to pay directly:</p>
                <div className="flex items-center justify-between bg-black/10 p-3 rounded-lg mb-3">
                  <code className="text-lg font-mono">{MTN_USSD}{amount}</code>
                  <button
                    onClick={handleInitiateUSSD}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                  >
                    Call
                  </button>
                </div>
                <p className="text-xs opacity-75">After payment, return and confirm your request</p>
              </div>
            )}

            <div className={`mb-6 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <h4 className="font-bold mb-2 text-sm">Important Notes:</h4>
              <ul className="text-xs space-y-1">
                {type === 'deposit' ? (
                  <>
                    <li>• Send money to MTN number: <span className="font-bold text-blue-500">{DEPOSIT_NUMBER}</span></li>
                    <li>• Include your username in payment note</li>
                    <li>• Admin verification: 1-3 hours</li>
                  </>
                ) : (
                  <>
                    <li>• Withdrawal requires admin approval</li>
                    <li>• Processing time: 1-3 business days</li>
                    <li>• Fees will be applied upon approval</li>
                  </>
                )}
              </ul>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'} text-red-600 text-sm`}>
                {error}
              </div>
            )}

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

          <div className="flex-1 overflow-y-auto p-6">
            {checkingPending ? (
              <div className="text-center py-8">
                <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
                <p className="text-lg">Checking...</p>
              </div>
            ) : hasPending ? (
              <>
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex items-center">
                    <FaClock className="text-yellow-500 mr-2" />
                    <div className="text-sm">
                      <span className="font-bold">{pendingTransactions.length} pending {type}(s) found</span>
                      <p className="mt-1">Complete pending transactions first for better processing</p>
                    </div>
                  </div>
                </div>

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
                            {transaction.paymentMethod === 'mtn' ? ' MTN' : ' Airtel'}
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

                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
                  <h5 className="font-bold mb-2 text-sm">
                    {type === 'deposit' ? '📥 Deposit Instructions' : '📤 Withdrawal Info'}
                  </h5>
                  <ul className="text-xs space-y-1">
                    {type === 'deposit' ? (
                      <>
                        <li>1. Send money to: <span className="font-bold">{DEPOSIT_NUMBER}</span></li>
                        <li>2. Include your username in payment note</li>
                        <li>3. Wait 1-3 hours for verification</li>
                      </>
                    ) : (
                      <>
                        <li>1. Admin approval required</li>
                        <li>2. Fees apply (15% service + 5% tax)</li>
                        <li>3. 1-3 business days processing</li>
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

          <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
            <div className="grid grid-cols-2 gap-3">
              {hasPending ? (
                <>
                  <button
                    onClick={() => onClose()}
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
        <div className={`p-6 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
          <div className="flex items-center">
            <div className={`${iconColor} mr-3 text-xl`}>
              {React.createElement(icon)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm opacity-75">
                {type === 'deposit' ? 'Add funds to your account' : 'Withdraw your earnings'}
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

        <div className="flex-1 overflow-y-auto p-6">
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
                ? 'No minimum deposit'
                : 'Min: 1,000 FRW'}
            </div>
          </div>

          {type === 'deposit' && (
            <div className={`mb-6 p-5 rounded-xl ${darkMode ? 'bg-blue-900/20 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaPhone className="text-blue-500 text-xl mr-2" />
                  <span className="font-bold text-lg">Deposit Number</span>
                </div>
                <button
                  onClick={handleCopyNumber}
                  className={`flex items-center px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} text-sm`}
                >
                  {copied ? (
                    <>
                      <FaCheck className="text-green-500 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className={`text-3xl font-mono font-bold text-center p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border-2 border-blue-500`}>
                {DEPOSIT_NUMBER}
              </div>
              <p className="text-xs mt-3 text-center opacity-75">
                Send money to this MTN number and include your username in the payment note
              </p>
            </div>
          )}

          {error && (
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'} text-red-600 text-sm`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Amount (FRW)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full p-3 pl-12 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder={type === 'deposit' ? 'Enter amount' : '1000'}
                  min={type === 'withdraw' ? '1000' : '0'}
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
              </select>
            </div>

            {type === 'withdraw' && (
              <div>
                <label className="block mb-1 font-medium text-sm">Withdrawal Phone</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${phoneNumber !== user?.nimero_yatelefone ? 'border-yellow-500' : ''}`}
                  placeholder="078XXXXXXX"
                  required
                />
                {phoneNumber !== user?.nimero_yatelefone && (
                  <p className="text-xs mt-1 text-yellow-500">
                    ⚠️ Phone number doesn't match your registered number
                  </p>
                )}
              </div>
            )}

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
                  : [1000, 5000, 10000, 25000, 50000, 100000].map((quickAmount) => (
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

            {type === 'deposit' && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'}`}>
                <p className="text-sm font-medium mb-2">📱 Quick USSD Deposit:</p>
                <div className="flex items-center justify-between bg-black/10 p-2 rounded-lg">
                  <code className="text-sm font-mono">{MTN_USSD}{amount || 'AMOUNT'}</code>
                  <button
                    type="button"
                    onClick={handleInitiateUSSD}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
                    disabled={!amount}
                  >
                    Call
                  </button>
                </div>
                <p className="text-xs mt-2 opacity-75">After payment, return and complete your request</p>
              </div>
            )}
          </form>
        </div>

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