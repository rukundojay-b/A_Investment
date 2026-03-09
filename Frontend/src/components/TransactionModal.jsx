







// // src/components/TransactionModal.jsx
// import React, { useState, useEffect } from 'react';
// import { FaTimes, FaArrowDown, FaArrowUp, FaSpinner, FaCheckCircle, FaWallet, FaCoins, FaClock, FaExclamationTriangle, FaHistory, FaPhone, FaCopy, FaCheck, FaUser } from 'react-icons/fa';
// import axios from 'axios';

// const TransactionModal = ({ darkMode, isOpen, onClose, type, user, onSuccess }) => {
//   const [amount, setAmount] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('mtn');
//   const [phoneNumber, setPhoneNumber] = useState(user?.nimero_yatelefone || '');
//   const [senderPhone, setSenderPhone] = useState('');
//   const [senderName, setSenderName] = useState('');
//   const [receiverName, setReceiverName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [step, setStep] = useState(1);
//   const [pendingTransactions, setPendingTransactions] = useState([]);
//   const [checkingPending, setCheckingPending] = useState(true);
//   const [hasPending, setHasPending] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [feeBreakdown, setFeeBreakdown] = useState({ serviceFee: 0, tax: 0, netAmount: 0 });

//   const API_URL = 'http://localhost:5000/api';
//   const DEPOSIT_NUMBER = '+250 796430592';
//   const DEPOSIT_NAME = 'Liberathe NYIRANSABIMANA';
//   const MTN_USSD = '*182*1*1*0796430592*';

//   // Calculate fees when amount changes for withdrawals
//   useEffect(() => {
//     if (type === 'withdraw' && amount && !isNaN(amount) && amount > 0) {
//       const numAmount = parseFloat(amount);
//       const serviceFee = numAmount * 0.15;
//       const tax = numAmount * 0.05;
//       const netAmount = numAmount - serviceFee - tax;
      
//       setFeeBreakdown({
//         serviceFee: serviceFee,
//         tax: tax,
//         netAmount: netAmount
//       });
//     } else {
//       setFeeBreakdown({ serviceFee: 0, tax: 0, netAmount: 0 });
//     }
//   }, [amount, type]);

//   // Reset form when modal opens/closes
//   useEffect(() => {
//     if (isOpen) {
//       setAmount('');
//       setPaymentMethod('mtn');
//       setPhoneNumber(user?.nimero_yatelefone || '');
//       setSenderPhone('');
//       setSenderName('');
//       setReceiverName('');
//       setError('');
//       setSuccess('');
//       setStep(1);
//       setCheckingPending(true);
//       setHasPending(false);
//       setPendingTransactions([]);
//       setCopied(false);
//       setFeeBreakdown({ serviceFee: 0, tax: 0, netAmount: 0 });
      
//       checkPendingTransactions();
//     }
//   }, [isOpen, user, type]);

//   const checkPendingTransactions = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         console.log('No token found for pending check');
//         setStep(2);
//         return;
//       }

//       const response = await axios.get(`${API_URL}/transactions/pending`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const pending = response.data.transactions || [];
        
//         const typePending = pending.filter(t => 
//           (type === 'deposit' && t.type === 'deposit') ||
//           (type === 'withdraw' && t.type === 'withdraw')
//         );

//         if (typePending.length > 0) {
//           setPendingTransactions(typePending);
//           setHasPending(true);
//         } else {
//           setHasPending(false);
//           setStep(2);
//         }
//       }
//     } catch (error) {
//       console.error('Error checking pending transactions:', error);
//       setStep(2);
//     } finally {
//       setCheckingPending(false);
//     }
//   };

//   const availableMain = user?.wallets?.main - (user?.wallets?.reserved || 0);
//   const earningBalance = user?.wallets?.earning || 0;

//   const handleCopyNumber = () => {
//     navigator.clipboard.writeText(DEPOSIT_NUMBER);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 3000);
//   };

//   const handleInitiateUSSD = () => {
//     window.location.href = `tel:${MTN_USSD}${amount}`;
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     setError('');
    
//     if (!amount || amount <= 0) {
//       setError('Please enter a valid amount');
//       return;
//     }

//     // Validation for deposits - NO MINIMUM
//     if (type === 'deposit') {
//       if (!senderPhone || senderPhone.length < 10) {
//         setError('Please enter your phone number used for sending money');
//         return;
//       }
//       if (!senderName || senderName.trim().length < 3) {
//         setError('Please enter the name associated with your phone number');
//         return;
//       }
//     }

//     // Validation for withdrawals
//     if (type === 'withdraw') {
//       const minAmount = 2500;
//       if (amount < minAmount) {
//         setError(`Minimum withdrawal amount is ${minAmount.toLocaleString()} FRW`);
//         return;
//       }

//       if (amount > earningBalance) {
//         setError(`Insufficient Balance. Available: ${earningBalance.toLocaleString()} FRW`);
//         return;
//       }

//       if (phoneNumber !== user?.nimero_yatelefone) {
//         setError('Phone number must match your registered phone number');
//         return;
//       }

//       if (!receiverName || receiverName.trim().length < 3) {
//         setError('Please enter the name associated with your withdrawal number');
//         return;
//       }
//     }

//     setStep(3);
//   };

//   const confirmTransaction = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = sessionStorage.getItem('token');
      
//       if (!token) {
//         setError('No authentication token found. Please login again.');
//         setStep(2);
//         setLoading(false);
//         return;
//       }

//       const endpoint = type === 'deposit' ? 'deposit' : 'withdraw';
      
//       const metadata = {};
//       if (type === 'deposit') {
//         metadata.senderPhone = senderPhone;
//         metadata.senderName = senderName;
//       } else {
//         metadata.receiverName = receiverName;
//         metadata.fees = feeBreakdown;
//       }

//       const response = await axios.post(`${API_URL}/user/${endpoint}`, {
//         amount: parseFloat(amount),
//         paymentMethod: paymentMethod,
//         phoneNumber: type === 'withdraw' ? phoneNumber : DEPOSIT_NUMBER,
//         description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request`,
//         metadata: metadata
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setSuccess('Transaction request submitted successfully!');
//         setStep(4);
        
//         setTimeout(() => {
//           if (onSuccess) onSuccess();
//           onClose();
//         }, 3000);
//       } else {
//         setError(response.data.message || 'Failed to submit transaction');
//         setStep(2);
//       }
//     } catch (error) {
//       console.error('Transaction error:', error);
      
//       if (error.response?.status === 401) {
//         setError('Session expired. Please login again.');
//         sessionStorage.removeItem('token');
//       } else {
//         setError(error.response?.data?.message || 'Failed to submit transaction. Please try again.');
//       }
//       setStep(2);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goBack = () => {
//     if (step === 3) {
//       setStep(2);
//     } else if (step === 2) {
//       setStep(1);
//     }
//     setError('');
//   };

//   const proceedAnyway = () => {
//     setStep(2);
//   };

//   if (!isOpen) return null;

//   const title = type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds';
//   const icon = type === 'deposit' ? FaArrowDown : FaArrowUp;
//   const iconColor = type === 'deposit' ? 'text-blue-500' : 'text-green-500';
//   const buttonColor = type === 'deposit' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600';
  
//   const balanceInfo = type === 'deposit' 
//     ? `Available: ${availableMain.toLocaleString()} FRW`
//     : `Available: ${earningBalance.toLocaleString()} FRW`;

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-RW').format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-RW', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Step 4: Success Screen
//   if (step === 4) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
//         <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="p-8 text-center">
//             <div className="mb-6">
//               <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
//               <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
//               <p className="opacity-75">
//                 Your {type} request for {parseInt(amount).toLocaleString()} FRW has been sent to admin.
//               </p>
//             </div>
            
//             <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//               <h4 className="font-bold mb-2">Transaction Details:</h4>
//               <ul className="text-sm space-y-2 text-left">
//                 {type === 'deposit' ? (
//                   <>
//                     <li className="flex items-start">
//                       <span className="mr-2">📞</span>
//                       <span>Sender: {senderName} ({senderPhone})</span>
//                     </li>
//                     <li className="flex items-start">
//                       <span className="mr-2">💰</span>
//                       <span>Amount: {formatCurrency(amount)} FRW</span>
//                     </li>
//                     <li className="flex items-start">
//                       <span className="mr-2">📋</span>
//                       <span>Payment Method: {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'}</span>
//                     </li>
//                   </>
//                 ) : (
//                   <>
//                     <li className="flex items-start">
//                       <span className="mr-2">📞</span>
//                       <span>Receiver: {receiverName} ({phoneNumber})</span>
//                     </li>
//                     <li className="flex items-start">
//                       <span className="mr-2">💰</span>
//                       <span>Amount: {formatCurrency(amount)} FRW</span>
//                     </li>
//                     <li className="flex items-start mt-3 pt-3 border-t border-dashed">
//                       <span className="mr-2">💰</span>
//                       <div className="w-full">
//                         <span className="font-bold text-yellow-500">Fee Breakdown:</span><br />
//                         <div className="flex justify-between mt-2">
//                           <span>Service Fee (15%):</span>
//                           <span className="text-red-500">-{formatCurrency(feeBreakdown.serviceFee)} FRW</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Tax (5%):</span>
//                           <span className="text-red-500">-{formatCurrency(feeBreakdown.tax)} FRW</span>
//                         </div>
//                         <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed">
//                           <span>You'll receive:</span>
//                           <span className="text-green-500">{formatCurrency(feeBreakdown.netAmount)} FRW</span>
//                         </div>
//                       </div>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </div>
            
//             <div className={`p-3 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
//               <h4 className="font-bold mb-2 text-sm">Next Steps:</h4>
//               <ul className="text-xs space-y-1 text-left">
//                 <li>• Admin will review your request within 1-3 hours</li>
//                 <li>• You'll receive a notification when processed</li>
//                 <li>• Contact support if you have questions</li>
//               </ul>
//             </div>
            
//             <button
//               onClick={onClose}
//               className={`w-full py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} font-medium`}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   // Step 3: Confirmation Screen - FIXED WITH SCROLLING (compact design)
//   if (step === 3) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
//         <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[80vh] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           {/* Header - Fixed at top */}
//           <div className={`p-4 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
//             <div className="flex items-center">
//               <div className={`${iconColor} mr-2 text-lg`}>
//                 {React.createElement(icon)}
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold">Confirm {title}</h3>
//                 <p className="text-xs opacity-75">Review your transaction</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
//             >
//               <FaTimes size={16} />
//             </button>
//           </div>

//           {/* Scrollable Content - Compact */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {/* Transaction Details Card */}
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
//               <h4 className="font-bold text-xs mb-2 uppercase opacity-75">Transaction Details</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="opacity-75">Type:</span>
//                   <span className="font-medium capitalize">{type}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="opacity-75">Amount:</span>
//                   <span className="font-bold text-green-500">{parseInt(amount).toLocaleString()} FRW</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="opacity-75">Method:</span>
//                   <span className="font-medium">{paymentMethod === 'mtn' ? 'MTN' : 'Airtel'}</span>
//                 </div>
                
//                 {type === 'deposit' ? (
//                   <>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Deposit To:</span>
//                       <div className="text-right">
//                         <div className="font-medium text-blue-500 text-xs">{DEPOSIT_NUMBER}</div>
//                         <div className="text-[10px] opacity-75">{DEPOSIT_NAME}</div>
//                       </div>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Sender Phone:</span>
//                       <span className="font-medium text-xs">{senderPhone}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Sender Name:</span>
//                       <span className="font-medium text-xs">{senderName}</span>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Withdraw To:</span>
//                       <span className="font-medium text-xs">{phoneNumber}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="opacity-75">Receiver:</span>
//                       <span className="font-medium text-xs">{receiverName}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="opacity-75">Service Fee (15%):</span>
//                       <span className="text-red-500">-{formatCurrency(feeBreakdown.serviceFee)}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="opacity-75">Tax (5%):</span>
//                       <span className="text-red-500">-{formatCurrency(feeBreakdown.tax)}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed">
//                       <span>Net Amount:</span>
//                       <span className="text-green-500">{formatCurrency(feeBreakdown.netAmount)}</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* USSD Section - Compact */}
//             {type === 'deposit' && (
//               <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="font-bold text-xs flex items-center">
//                     <FaPhone className="mr-1 text-green-500" size={10} />
//                     Quick USSD
//                   </h4>
//                   <button
//                     onClick={handleInitiateUSSD}
//                     className="px-2 py-1 bg-green-500 text-white rounded text-xs"
//                   >
//                     Call
//                   </button>
//                 </div>
//                 <code className="text-xs font-mono bg-black/10 p-2 rounded block text-center">
//                   {MTN_USSD}{amount}
//                 </code>
//                 <p className="text-[10px] mt-1 opacity-75">After payment, return and confirm</p>
//               </div>
//             )}

//             {/* Important Notes - Compact */}
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
//               <h4 className="font-bold text-xs mb-1">Important Notes:</h4>
//               <ul className="text-[10px] space-y-0.5">
//                 {type === 'deposit' ? (
//                   <>
//                     <li>• Send to: <span className="font-bold">{DEPOSIT_NUMBER}</span></li>
//                     <li>• Account: {DEPOSIT_NAME}</li>
//                     <li>• Verification: 1-3 hours</li>
//                   </>
//                 ) : (
//                   <>
//                     <li>• Admin approval required</li>
//                     <li>• Processing: 1-3 business days</li>
//                     <li>• Fees deducted upon approval</li>
//                   </>
//                 )}
//               </ul>
//             </div>

//             {error && (
//               <div className={`p-2 rounded-lg text-xs ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} text-red-600`}>
//                 {error}
//               </div>
//             )}
//           </div>

//           {/* Footer with Buttons - Fixed at bottom */}
//           <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
//             <div className="flex space-x-2">
//               <button
//                 onClick={goBack}
//                 disabled={loading}
//                 className={`flex-1 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 Back
//               </button>
//               <button
//                 onClick={confirmTransaction}
//                 disabled={loading}
//                 className={`flex-1 py-2.5 rounded-lg text-sm ${buttonColor} text-white font-bold flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {loading ? (
//                   <>
//                     <FaSpinner className="animate-spin mr-1" size={12} />
//                     <span className="text-xs">Processing...</span>
//                   </>
//                 ) : (
//                   'Confirm'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Step 1: Pending Transactions Check (KEPT ORIGINAL DESIGN)
//   if (step === 1) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
//         <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ maxHeight: '90vh' }}>
//           <div className={`p-6 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
//             <div className="flex items-center">
//               <FaExclamationTriangle className="text-yellow-500 mr-3 text-xl" />
//               <div>
//                 <h3 className="text-xl font-bold">Pending {type === 'deposit' ? 'Deposit' : 'Withdrawal'}</h3>
//                 <p className="text-sm opacity-75">Check pending transactions</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6">
//             {checkingPending ? (
//               <div className="text-center py-8">
//                 <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
//                 <p className="text-lg">Checking...</p>
//               </div>
//             ) : hasPending ? (
//               <>
//                 <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
//                   <div className="flex items-center">
//                     <FaClock className="text-yellow-500 mr-2" />
//                     <div className="text-sm">
//                       <span className="font-bold">{pendingTransactions.length} pending {type}(s) found</span>
//                       <p className="mt-1">Complete pending transactions first for better processing</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <h5 className="font-bold mb-3 text-sm uppercase tracking-wide opacity-75">Pending Transactions:</h5>
//                   <div className="space-y-2 max-h-40 overflow-y-auto">
//                     {pendingTransactions.slice(0, 5).map((transaction, index) => (
//                       <div 
//                         key={transaction._id || index}
//                         className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'} flex items-center justify-between`}
//                       >
//                         <div className="flex-1">
//                           <div className="flex items-center">
//                             <span className="font-bold text-green-500">{formatCurrency(transaction.amount)} FRW</span>
//                             <span className="mx-2 opacity-50">•</span>
//                             <span className="text-xs opacity-75">
//                               {transaction.createdAt ? formatDate(transaction.createdAt) : 'Recent'}
//                             </span>
//                           </div>
//                           <div className="text-xs mt-1 opacity-75">
//                             Ref: {transaction.reference?.substring(0, 8) || 'N/A'} • 
//                             {transaction.paymentMethod === 'mtn' ? ' MTN' : ' Airtel'}
//                           </div>
//                         </div>
//                         <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
//                           Pending
//                         </span>
//                       </div>
//                     ))}
//                     {pendingTransactions.length > 5 && (
//                       <div className="text-center text-sm opacity-75">
//                         + {pendingTransactions.length - 5} more pending transactions
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
//                   <h5 className="font-bold mb-2 text-sm">
//                     {type === 'deposit' ? '📥 Deposit Instructions' : '📤 Withdrawal Info'}
//                   </h5>
//                   <ul className="text-xs space-y-1">
//                     {type === 'deposit' ? (
//                       <>
//                         <li>1. Send money to: <span className="font-bold">{DEPOSIT_NUMBER}</span></li>
//                         <li>2. Account name: <span className="font-bold">{DEPOSIT_NAME}</span></li>
//                         <li>3. Provide your sender details for verification</li>
//                       </>
//                     ) : (
//                       <>
//                         <li>1. Minimum withdrawal: 2,500 FRW</li>
//                         <li>2. Fees apply (15% service + 5% tax)</li>
//                         <li>3. 1-3 business days processing</li>
//                       </>
//                     )}
//                   </ul>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
//                 <h4 className="text-xl font-bold mb-2">All Clear!</h4>
//                 <p className="opacity-75 mb-6">
//                   No pending {type}s found. You can proceed.
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
//             <div className="grid grid-cols-2 gap-3">
//               {hasPending ? (
//                 <>
//                   <button
//                     onClick={() => onClose()}
//                     className={`py-3 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
//                   >
//                     <FaHistory className="mr-2" />
//                     View All
//                   </button>
                  
//                   <button
//                     onClick={proceedAnyway}
//                     className={`py-3 rounded-lg ${darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-bold`}
//                   >
//                     Continue
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => setStep(2)}
//                   className={`col-span-2 py-3 rounded-lg ${buttonColor} text-white font-bold`}
//                 >
//                   Continue to {title}
//                 </button>
//               )}
//             </div>
            
//             {hasPending && (
//               <button
//                 onClick={onClose}
//                 className={`w-full mt-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} text-sm`}
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Step 2: Input Screen (KEPT ORIGINAL DESIGN)
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
//       <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ maxHeight: '90vh' }}>
//         <div className={`p-6 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
//           <div className="flex items-center">
//             <div className={`${iconColor} mr-3 text-xl`}>
//               {React.createElement(icon)}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold">{title}</h3>
//               <p className="text-sm opacity-75">
//                 {type === 'deposit' ? 'Add funds to your account' : 'Withdraw your earnings'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
//           >
//             <FaTimes />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6">
//           {hasPending && (
//             <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
//               <div className="flex items-center">
//                 <FaExclamationTriangle className="text-yellow-500 mr-2 flex-shrink-0" />
//                 <div className="text-sm">
//                   <span className="font-bold">Note:</span> You have {pendingTransactions.length} pending {type}(s)
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300'}`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 {type === 'deposit' ? (
//                   <FaWallet className="text-blue-500 mr-2" />
//                 ) : (
//                   <FaCoins className="text-green-500 mr-2" />
//                 )}
//                 <span className="font-medium">
//                   {type === 'deposit' ? 'Main Balance' : 'Earnings Balance'}
//                 </span>
//               </div>
//               <span className="text-xl font-bold text-green-500">
//                 {type === 'deposit' 
//                   ? availableMain.toLocaleString() 
//                   : earningBalance.toLocaleString()} FRW
//               </span>
//             </div>
//             <div className="text-xs mt-2 opacity-75">
//               {type === 'deposit' 
//                 ? 'No minimum deposit'
//                 : 'Min: 2,500 FRW'}
//             </div>
//           </div>

//           {type === 'deposit' && (
//             <div className={`mb-6 p-5 rounded-xl ${darkMode ? 'bg-blue-900/20 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500'}`}>
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center">
//                   <FaPhone className="text-blue-500 text-xl mr-2" />
//                   <span className="font-bold text-lg">Deposit To</span>
//                 </div>
//                 <button
//                   onClick={handleCopyNumber}
//                   className={`flex items-center px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} text-sm`}
//                 >
//                   {copied ? (
//                     <>
//                       <FaCheck className="text-green-500 mr-1" />
//                       Copied!
//                     </>
//                   ) : (
//                     <>
//                       <FaCopy className="mr-1" />
//                       Copy
//                     </>
//                   )}
//                 </button>
//               </div>
//               <div className={`text-2xl font-mono font-bold text-center p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border-2 border-blue-500`}>
//                 {DEPOSIT_NUMBER}
//               </div>
//               <div className="text-center mt-2 font-medium">
//                 {DEPOSIT_NAME}
//               </div>
//               <p className="text-xs mt-3 text-center opacity-75">
//                 Send money to this MTN number and provide your details below
//               </p>
//             </div>
//           )}

//           {error && (
//             <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'} text-red-600 text-sm`}>
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-sm">Amount (FRW)</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className={`w-full p-3 pl-12 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                   placeholder={type === 'deposit' ? 'Enter amount' : '2500'}
//                   min={type === 'withdraw' ? '2500' : '0'}
//                   step="100"
//                   required
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                   FRW
//                 </div>
//               </div>
//               <div className="mt-1 text-xs opacity-75">
//                 {balanceInfo}
//               </div>
//             </div>

//             <div>
//               <label className="block mb-1 font-medium text-sm">Payment Method</label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                 required
//               >
//                 <option value="mtn">MTN Mobile Money</option>
//                 <option value="airtel">Airtel Money</option>
//               </select>
//             </div>

//             {/* Deposit-specific fields */}
//             {type === 'deposit' && (
//               <>
//                 <div>
//                   <label className="block mb-1 font-medium text-sm flex items-center">
//                     <FaPhone className="mr-2 text-blue-500" />
//                     Your Phone Number (Used for sending)
//                   </label>
//                   <input
//                     type="tel"
//                     value={senderPhone}
//                     onChange={(e) => setSenderPhone(e.target.value)}
//                     className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                     placeholder="078XXXXXXX"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium text-sm flex items-center">
//                     <FaUser className="mr-2 text-blue-500" />
//                     Name on Your Account
//                   </label>
//                   <input
//                     type="text"
//                     value={senderName}
//                     onChange={(e) => setSenderName(e.target.value)}
//                     className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                     placeholder="Full name as registered with mobile money"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             {/* Withdrawal-specific fields */}
//             {type === 'withdraw' && (
//               <>
//                 <div>
//                   <label className="block mb-1 font-medium text-sm">Withdrawal Phone</label>
//                   <input
//                     type="tel"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${phoneNumber !== user?.nimero_yatelefone ? 'border-yellow-500' : ''}`}
//                     placeholder="078XXXXXXX"
//                     required
//                   />
//                   {phoneNumber !== user?.nimero_yatelefone && (
//                     <p className="text-xs mt-1 text-yellow-500">
//                       ⚠️ Phone number doesn't match your registered number
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium text-sm flex items-center">
//                     <FaUser className="mr-2 text-green-500" />
//                     Receiver Name (Name on the account)
//                   </label>
//                   <input
//                     type="text"
//                     value={receiverName}
//                     onChange={(e) => setReceiverName(e.target.value)}
//                     className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                     placeholder="Full name as registered with mobile money"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             <div className="pt-2">
//               <p className="text-xs opacity-75 mb-2">Quick Amounts:</p>
//               <div className="grid grid-cols-3 gap-2">
//                 {type === 'deposit' 
//                   ? [1000, 5000, 10000, 25000, 50000, 100000].map((quickAmount) => (
//                       <button
//                         key={quickAmount}
//                         type="button"
//                         onClick={() => setAmount(quickAmount.toString())}
//                         className={`py-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
//                       >
//                         {quickAmount >= 1000 ? `${quickAmount/1000}K` : quickAmount}
//                       </button>
//                     ))
//                   : [2500, 5000, 10000, 25000, 50000, 100000].map((quickAmount) => (
//                       <button
//                         key={quickAmount}
//                         type="button"
//                         onClick={() => setAmount(quickAmount.toString())}
//                         className={`py-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
//                       >
//                         {quickAmount >= 1000 ? `${quickAmount/1000}K` : quickAmount}
//                       </button>
//                     ))
//                 }
//               </div>
//             </div>

//             {type === 'deposit' && (
//               <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'}`}>
//                 <p className="text-sm font-medium mb-2">📱 Quick USSD Deposit:</p>
//                 <div className="flex items-center justify-between bg-black/10 p-2 rounded-lg">
//                   <code className="text-sm font-mono">{MTN_USSD}{amount || 'AMOUNT'}</code>
//                   <button
//                     type="button"
//                     onClick={handleInitiateUSSD}
//                     className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
//                     disabled={!amount}
//                   >
//                     Call
//                   </button>
//                 </div>
//                 <p className="text-xs mt-2 opacity-75">After payment, return and complete your request</p>
//               </div>
//             )}
//           </form>
//         </div>

//         <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
//           <div className="flex space-x-3">
//             <button
//               type="button"
//               onClick={goBack}
//               className={`flex-1 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className={`flex-1 py-3 rounded-lg ${buttonColor} text-white font-bold`}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionModal;














// src/components/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowDown, FaArrowUp, FaSpinner, FaCheckCircle, FaWallet, FaCoins, FaClock, FaExclamationTriangle, FaHistory, FaPhone, FaCopy, FaCheck, FaUser } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config'; // Correct import path from src/components to root

const TransactionModal = ({ darkMode, isOpen, onClose, type, user, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState(user?.nimero_yatelefone || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [checkingPending, setCheckingPending] = useState(true);
  const [hasPending, setHasPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feeBreakdown, setFeeBreakdown] = useState({ serviceFee: 0, tax: 0, netAmount: 0 });

  // Remove this line:
  // const API_URL = 'http://localhost:5000/api';
  
  const DEPOSIT_NUMBER = '+250 796430592';
  const DEPOSIT_NAME = 'Liberathe NYIRANSABIMANA';
  const MTN_USSD = '*182*1*1*0796430592*';

  // Calculate fees when amount changes for withdrawals
  useEffect(() => {
    if (type === 'withdraw' && amount && !isNaN(amount) && amount > 0) {
      const numAmount = parseFloat(amount);
      const serviceFee = numAmount * 0.15;
      const tax = numAmount * 0.05;
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
      setSenderPhone('');
      setSenderName('');
      setReceiverName('');
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

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(DEPOSIT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleInitiateUSSD = () => {
    window.location.href = `tel:${MTN_USSD}${amount}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Validation for deposits - NO MINIMUM
    if (type === 'deposit') {
      if (!senderPhone || senderPhone.length < 10) {
        setError('Please enter your phone number used for sending money');
        return;
      }
      if (!senderName || senderName.trim().length < 3) {
        setError('Please enter the name associated with your phone number');
        return;
      }
    }

    // Validation for withdrawals
    if (type === 'withdraw') {
      const minAmount = 2500;
      if (amount < minAmount) {
        setError(`Minimum withdrawal amount is ${minAmount.toLocaleString()} FRW`);
        return;
      }

      if (amount > earningBalance) {
        setError(`Insufficient Balance. Available: ${earningBalance.toLocaleString()} FRW`);
        return;
      }

      if (phoneNumber !== user?.nimero_yatelefone) {
        setError('Phone number must match your registered phone number');
        return;
      }

      if (!receiverName || receiverName.trim().length < 3) {
        setError('Please enter the name associated with your withdrawal number');
        return;
      }
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
      
      const metadata = {};
      if (type === 'deposit') {
        metadata.senderPhone = senderPhone;
        metadata.senderName = senderName;
      } else {
        metadata.receiverName = receiverName;
        metadata.fees = feeBreakdown;
      }

      const response = await axios.post(`${API_BASE_URL}/user/${endpoint}`, {
        amount: parseFloat(amount),
        paymentMethod: paymentMethod,
        phoneNumber: type === 'withdraw' ? phoneNumber : DEPOSIT_NUMBER,
        description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request`,
        metadata: metadata
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
              <h4 className="font-bold mb-2">Transaction Details:</h4>
              <ul className="text-sm space-y-2 text-left">
                {type === 'deposit' ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-2">📞</span>
                      <span>Sender: {senderName} ({senderPhone})</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">💰</span>
                      <span>Amount: {formatCurrency(amount)} FRW</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">📋</span>
                      <span>Payment Method: {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'}</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="mr-2">📞</span>
                      <span>Receiver: {receiverName} ({phoneNumber})</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">💰</span>
                      <span>Amount: {formatCurrency(amount)} FRW</span>
                    </li>
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
                  </>
                )}
              </ul>
            </div>
            
            <div className={`p-3 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
              <h4 className="font-bold mb-2 text-sm">Next Steps:</h4>
              <ul className="text-xs space-y-1 text-left">
                <li>• Admin will review your request within 1-3 hours</li>
                <li>• You'll receive a notification when processed</li>
                <li>• Contact support if you have questions</li>
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
  
  // Step 3: Confirmation Screen - FIXED WITH SCROLLING (compact design)
  if (step === 3) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[80vh] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header - Fixed at top */}
          <div className={`p-4 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
            <div className="flex items-center">
              <div className={`${iconColor} mr-2 text-lg`}>
                {React.createElement(icon)}
              </div>
              <div>
                <h3 className="text-lg font-bold">Confirm {title}</h3>
                <p className="text-xs opacity-75">Review your transaction</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Scrollable Content - Compact */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Transaction Details Card */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h4 className="font-bold text-xs mb-2 uppercase opacity-75">Transaction Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-75">Type:</span>
                  <span className="font-medium capitalize">{type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-75">Amount:</span>
                  <span className="font-bold text-green-500">{parseInt(amount).toLocaleString()} FRW</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-75">Method:</span>
                  <span className="font-medium">{paymentMethod === 'mtn' ? 'MTN' : 'Airtel'}</span>
                </div>
                
                {type === 'deposit' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="opacity-75">Deposit To:</span>
                      <div className="text-right">
                        <div className="font-medium text-blue-500 text-xs">{DEPOSIT_NUMBER}</div>
                        <div className="text-[10px] opacity-75">{DEPOSIT_NAME}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Sender Phone:</span>
                      <span className="font-medium text-xs">{senderPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Sender Name:</span>
                      <span className="font-medium text-xs">{senderName}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="opacity-75">Withdraw To:</span>
                      <span className="font-medium text-xs">{phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Receiver:</span>
                      <span className="font-medium text-xs">{receiverName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-75">Service Fee (15%):</span>
                      <span className="text-red-500">-{formatCurrency(feeBreakdown.serviceFee)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-75">Tax (5%):</span>
                      <span className="text-red-500">-{formatCurrency(feeBreakdown.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed">
                      <span>Net Amount:</span>
                      <span className="text-green-500">{formatCurrency(feeBreakdown.netAmount)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* USSD Section - Compact */}
            {type === 'deposit' && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs flex items-center">
                    <FaPhone className="mr-1 text-green-500" size={10} />
                    Quick USSD
                  </h4>
                  <button
                    onClick={handleInitiateUSSD}
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                  >
                    Call
                  </button>
                </div>
                <code className="text-xs font-mono bg-black/10 p-2 rounded block text-center">
                  {MTN_USSD}{amount}
                </code>
                <p className="text-[10px] mt-1 opacity-75">After payment, return and confirm</p>
              </div>
            )}

            {/* Important Notes - Compact */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
              <h4 className="font-bold text-xs mb-1">Important Notes:</h4>
              <ul className="text-[10px] space-y-0.5">
                {type === 'deposit' ? (
                  <>
                    <li>• Send to: <span className="font-bold">{DEPOSIT_NUMBER}</span></li>
                    <li>• Account: {DEPOSIT_NAME}</li>
                    <li>• Verification: 1-3 hours</li>
                  </>
                ) : (
                  <>
                    <li>• Admin approval required</li>
                    <li>• Processing: 1-3 business days</li>
                    <li>• Fees deducted upon approval</li>
                  </>
                )}
              </ul>
            </div>

            {error && (
              <div className={`p-2 rounded-lg text-xs ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} text-red-600`}>
                {error}
              </div>
            )}
          </div>

          {/* Footer with Buttons - Fixed at bottom */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex-shrink-0`}>
            <div className="flex space-x-2">
              <button
                onClick={goBack}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Back
              </button>
              <button
                onClick={confirmTransaction}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-lg text-sm ${buttonColor} text-white font-bold flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-1" size={12} />
                    <span className="text-xs">Processing...</span>
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Pending Transactions Check (KEPT ORIGINAL DESIGN)
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
                        <li>2. Account name: <span className="font-bold">{DEPOSIT_NAME}</span></li>
                        <li>3. Provide your sender details for verification</li>
                      </>
                    ) : (
                      <>
                        <li>1. Minimum withdrawal: 2,500 FRW</li>
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

  // Step 2: Input Screen (KEPT ORIGINAL DESIGN)
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
                : 'Min: 2,500 FRW'}
            </div>
          </div>

          {type === 'deposit' && (
            <div className={`mb-6 p-5 rounded-xl ${darkMode ? 'bg-blue-900/20 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaPhone className="text-blue-500 text-xl mr-2" />
                  <span className="font-bold text-lg">Deposit To</span>
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
              <div className={`text-2xl font-mono font-bold text-center p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border-2 border-blue-500`}>
                {DEPOSIT_NUMBER}
              </div>
              <div className="text-center mt-2 font-medium">
                {DEPOSIT_NAME}
              </div>
              <p className="text-xs mt-3 text-center opacity-75">
                Send money to this MTN number and provide your details below
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
                  placeholder={type === 'deposit' ? 'Enter amount' : '2500'}
                  min={type === 'withdraw' ? '2500' : '0'}
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

            {/* Deposit-specific fields */}
            {type === 'deposit' && (
              <>
                <div>
                  <label className="block mb-1 font-medium text-sm flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    Your Phone Number (Used for sending)
                  </label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="078XXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Name on Your Account
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Full name as registered with mobile money"
                    required
                  />
                </div>
              </>
            )}

            {/* Withdrawal-specific fields */}
            {type === 'withdraw' && (
              <>
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

                <div>
                  <label className="block mb-1 font-medium text-sm flex items-center">
                    <FaUser className="mr-2 text-green-500" />
                    Receiver Name (Name on the account)
                  </label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Full name as registered with mobile money"
                    required
                  />
                </div>
              </>
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
                  : [2500, 5000, 10000, 25000, 50000, 100000].map((quickAmount) => (
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