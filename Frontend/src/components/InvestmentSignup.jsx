// // // src/components/InvestmentSignup.jsx
// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { FaSun, FaMoon, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

// // const InvestmentSignup = ({ darkMode, setDarkMode }) => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [formData, setFormData] = useState({
// //     izina_ryogukoresha: '',
// //     nimero_yatelefone: '',
// //     ijambo_banga: '',
// //     subiramo_ijambobanga: ''
// //   });
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [validation, setValidation] = useState({
// //     usernameValid: false,
// //     phoneValid: false,
// //     passwordValid: false,
// //     confirmValid: false
// //   });

// //   const API_URL = 'http://localhost:5000/api/auth';

// //   useEffect(() => {
// //     // Validate form fields
// //     const newValidation = {
// //       usernameValid: formData.izina_ryogukoresha.length >= 3,
// //       phoneValid: /^(?:\+250|0)?[78][0-9]{8}$/.test(formData.nimero_yatelefone),
// //       passwordValid: formData.ijambo_banga.length >= 6,
// //       confirmValid: formData.ijambo_banga === formData.subiramo_ijambobanga && formData.ijambo_banga.length > 0
// //     };
// //     setValidation(newValidation);
// //   }, [formData]);

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //     setError('');
// //     setSuccess('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');
// //     setSuccess('');

// //     // Client-side validation
// //     if (!formData.izina_ryogukoresha.trim()) {
// //       setError('Izina ryogukoresha rirakenewe');
// //       setLoading(false);
// //       return;
// //     }

// //     if (formData.izina_ryogukoresha.length < 3) {
// //       setError('Izina ryogukoresha rigomba kuba nibura inyuguti 3');
// //       setLoading(false);
// //       return;
// //     }

// //     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/;
// //     if (!phoneRegex.test(formData.nimero_yatelefone)) {
// //       setError('Numero ya telefone ntabwo ari yo. Andika nka: 0781234567');
// //       setLoading(false);
// //       return;
// //     }

// //     if (formData.ijambo_banga.length < 6) {
// //       setError('Ijambo banga rigomba kuba nibura inyuguti 6');
// //       setLoading(false);
// //       return;
// //     }

// //     if (formData.ijambo_banga !== formData.subiramo_ijambobanga) {
// //       setError('Ijambo banga n\'ijambo banga wongeyeho ntabwo byahuye');
// //       setLoading(false);
// //       return;
// //     }

// //     // Check for common weak passwords
// //     const weakPasswords = ['password', '123456', 'qwerty', 'letmein', 'admin'];
// //     if (weakPasswords.includes(formData.ijambo_banga.toLowerCase())) {
// //       setError('Ijambo banga ryoroshye cyane. Hitamo irindi rijya');
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       // Prepare data for backend
// //       const signupData = {
// //         izina_ryogukoresha: formData.izina_ryogukoresha.trim(),
// //         nimero_yatelefone: formData.nimero_yatelefone,
// //         ijambo_banga: formData.ijambo_banga
// //         // Note: Backend should handle email if needed
// //       };

// //       console.log('🔄 Attempting signup:', signupData);

// //       const response = await axios.post(`${API_URL}/signup`, signupData, {
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         timeout: 10000
// //       });

// //       console.log('📥 Signup response:', response.data);

// //       if (response.data.success) {
// //         const user = response.data.user;
// //         const referralCode = user.referralCode || '';
// //         const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

// //         setSuccess(`Urabyemewe! Urakozwe kwiyandikisha.`);

// //         // Store user data (but not token - user needs to login)
// //         localStorage.setItem('pendingUser', JSON.stringify(user));

// //         // Show success message with details
// //         setTimeout(() => {
// //           alert(`🎉 Urakozwe kwiyandikisha muri Apex Invest!

// // 👤 Izina: ${user.izina_ryogukoresha}
// // 📱 Nimero: ${user.nimero_yatelefone}
// // 🔗 Kode yo kugana: ${referralCode}

// // 💰 Bonus: 400 RWF yashyizwe mu konti yawe
// // 🔗 Koresha link iyi kugana abandi:
// // ${referralLink}

// // 📍 Injira noneho kugirango ukore amasoko!`);

// //           navigate('/login');
// //         }, 500);
// //       } else {
// //         setError(response.data.message || 'Habaye ikibazo. Ongera ugerageze.');
// //       }
// //     } catch (err) {
// //       console.error('❌ Signup error:', err);
      
// //       if (err.response) {
// //         switch (err.response.status) {
// //           case 400:
// //             setError(err.response.data?.message || 'Amakuru atari yo. Reba neza.');
// //             break;
// //           case 409:
// //             setError('Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.');
// //             break;
// //           case 500:
// //             setError('Server error. Ongera ugerageze nyuma.');
// //             break;
// //           default:
// //             setError(err.response.data?.message || 'Habaye ikibazo. Ongera ugerageze.');
// //         }
// //       } else if (err.request) {
// //         setError('Ntabwo twashoboye guhura na seriveri. Reba niba backend iri gukora.');
// //       } else if (err.code === 'ECONNABORTED') {
// //         setError('Byagiye kubira. Ongera ugerageze.');
// //       } else {
// //         setError('Habaye ikibazo. Ongera ugerageze.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       izina_ryogukoresha: '',
// //       nimero_yatelefone: '',
// //       ijambo_banga: '',
// //       subiramo_ijambobanga: ''
// //     });
// //     setError('');
// //     setSuccess('');
// //   };

// //   const loadTestData = () => {
// //     setFormData({
// //       izina_ryogukoresha: 'Test User',
// //       nimero_yatelefone: '0781234567',
// //       ijambo_banga: 'test123',
// //       subiramo_ijambobanga: 'test123'
// //     });
// //     setError('');
// //     setSuccess('Test data loaded. Click "Kwiyandikisha" to register.');
// //   };

// //   return (
// //     <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
// //       {/* Theme Toggle */}
// //       <div className="absolute top-4 right-4">
// //         <button
// //           onClick={() => setDarkMode(!darkMode)}
// //           className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
// //         >
// //           {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
// //         </button>
// //       </div>

// //       {/* Header */}
// //       <div className="text-center mb-8">
// //         <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
// //           <span className="text-white text-3xl font-bold">AI</span>
// //         </div>
// //         <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Apex Invest</h1>
// //         <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fungura konti yawe</p>
// //       </div>

// //       {/* Back to login */}
// //       <div className="mb-6">
// //         <Link
// //           to="/login"
// //           className={`inline-flex items-center font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
// //         >
// //           ← Subira kwinjira
// //         </Link>
// //       </div>

// //       {/* Form */}
// //       <div className="w-full max-w-md">
// //         {error && (
// //           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
// //             <div className="flex items-start">
// //               <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
// //               <div>
// //                 <p className="font-medium">Ikosa</p>
// //                 <p className="text-sm mt-1">{error}</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {success && (
// //           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700'}`}>
// //             <div className="flex items-start">
// //               <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
// //               <div>
// //                 <p className="font-medium">Byakunze!</p>
// //                 <p className="text-sm mt-1">{success}</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {/* Username */}
// //             <div>
// //               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                 Izina ryogukoresha *
// //               </label>
// //               <input
// //                 type="text"
// //                 name="izina_ryogukoresha"
// //                 value={formData.izina_ryogukoresha}
// //                 onChange={handleChange}
// //                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.usernameValid ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
// //                 placeholder="Andika izina ryogukoresha"
// //                 required
// //               />
// //               {formData.izina_ryogukoresha && (
// //                 <p className={`text-xs mt-1 ${validation.usernameValid ? 'text-green-600' : 'text-red-600'}`}>
// //                   {validation.usernameValid ? '✅ Izina ryemewe' : '❌ Izina rigomba kuba nibura inyuguti 3'}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Phone */}
// //             <div>
// //               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                 Numero ya telefone *
// //               </label>
// //               <input
// //                 type="tel"
// //                 name="nimero_yatelefone"
// //                 value={formData.nimero_yatelefone}
// //                 onChange={handleChange}
// //                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.phoneValid ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
// //                 placeholder="0781234567"
// //                 required
// //               />
// //               {formData.nimero_yatelefone && (
// //                 <p className={`text-xs mt-1 ${validation.phoneValid ? 'text-green-600' : 'text-red-600'}`}>
// //                   {validation.phoneValid ? '✅ Nimero yemewe' : '❌ Nimero ntabwo ari yo (nk: 0781234567)'}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Password */}
// //             <div>
// //               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                 Ijambo banga *
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   name="ijambo_banga"
// //                   value={formData.ijambo_banga}
// //                   onChange={handleChange}
// //                   className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.passwordValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
// //                   placeholder="Ijambo banga (inyuguti 6)"
// //                   required
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
// //                   tabIndex="-1"
// //                 >
// //                   {showPassword ? <FaEyeSlash /> : <FaEye />}
// //                 </button>
// //               </div>
// //               {formData.ijambo_banga && (
// //                 <p className={`text-xs mt-1 ${validation.passwordValid ? 'text-green-600' : 'text-red-600'}`}>
// //                   {validation.passwordValid ? '✅ Ijambo banga ryemewe' : '❌ Ijambo banga rigomba kuba nibura inyuguti 6'}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Confirm password */}
// //             <div>
// //               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                 Subiramo ijambo banga *
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showConfirmPassword ? "text" : "password"}
// //                   name="subiramo_ijambobanga"
// //                   value={formData.subiramo_ijambobanga}
// //                   onChange={handleChange}
// //                   className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.confirmValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
// //                   placeholder="Subiramo ijambo banga"
// //                   required
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
// //                   tabIndex="-1"
// //                 >
// //                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
// //                 </button>
// //               </div>
// //               {formData.subiramo_ijambobanga && (
// //                 <p className={`text-xs mt-1 ${validation.confirmValid ? 'text-green-600' : 'text-red-600'}`}>
// //                   {validation.confirmValid ? '✅ Ijambo banga bihuye' : '❌ Ijambo banga ntabwo bihuye'}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Form Actions */}
// //             <div className="flex space-x-2 pt-2">
// //               <button
// //                 type="button"
// //                 onClick={loadTestData}
// //                 className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
// //               >
// //                 Test Data
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={resetForm}
// //                 className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-red-600/30 hover:bg-red-600/50 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
// //               >
// //                 Reset
// //               </button>
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={loading || !Object.values(validation).every(v => v)}
// //               className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50 transition-colors mt-4`}
// //             >
// //               {loading ? (
// //                 <span className="flex items-center justify-center">
// //                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                   </svg>
// //                   Iyandikisha...
// //                 </span>
// //               ) : (
// //                 'Kwiyandikisha'
// //               )}
// //             </button>
// //           </form>

// //           {/* Terms and Conditions */}
// //           <div className={`mt-6 pt-4 border-t border-gray-700 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
// //             <p className="mb-2">💡 <strong>Amakuru yo kwemeza:</strong></p>
// //             <ul className="list-disc pl-4 space-y-1">
// //               <li>Urabyemewe kwinjira noneho nyuma yo kwiyandikisha</li>
// //               <li>Urihabwa 400 RWF nk'ingunza yo kwiyandikisha</li>
// //               <li>Ushobora kugana abandi ukagurira 1,000 RWF buri wundi</li>
// //               <li>Amakuru yawe arabitswe kandi nta wundi abisanga</li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InvestmentSignup;


















// // src/components/InvestmentSignup.jsx (Simplified)
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaSun, FaMoon, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

// const InvestmentSignup = ({ darkMode, setDarkMode }) => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState({
//     izina_ryogukoresha: '',
//     nimero_yatelefone: '',
//     ijambo_banga: '',
//     subiramo_ijambobanga: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [validation, setValidation] = useState({
//     usernameValid: false,
//     phoneValid: false,
//     passwordValid: false,
//     confirmValid: false,
//     phoneAvailable: null,
//     usernameAvailable: null
//   });

//   const API_URL = 'http://localhost:5000/api';

//   useEffect(() => {
//     // Validate form fields
//     const newValidation = {
//       usernameValid: formData.izina_ryogukoresha.length >= 3,
//       phoneValid: /^(?:\+250|0)?[78][0-9]{8}$/.test(formData.nimero_yatelefone),
//       passwordValid: formData.ijambo_banga.length >= 6,
//       confirmValid: formData.ijambo_banga === formData.subiramo_ijambobanga && formData.ijambo_banga.length > 0,
//       phoneAvailable: validation.phoneAvailable,
//       usernameAvailable: validation.usernameAvailable
//     };
//     setValidation(newValidation);
//   }, [formData]);

//   // Check phone availability
//   useEffect(() => {
//     const checkPhone = async () => {
//       if (validation.phoneValid && formData.nimero_yatelefone) {
//         try {
//           const response = await axios.get(`${API_URL}/auth/check-phone/${formData.nimero_yatelefone}`);
//           setValidation(prev => ({
//             ...prev,
//             phoneAvailable: response.data.available
//           }));
//         } catch (error) {
//           console.error('Error checking phone:', error);
//         }
//       }
//     };

//     const timeoutId = setTimeout(checkPhone, 500);
//     return () => clearTimeout(timeoutId);
//   }, [formData.nimero_yatelefone]);

//   // Check username availability
//   useEffect(() => {
//     const checkUsername = async () => {
//       if (validation.usernameValid && formData.izina_ryogukoresha) {
//         try {
//           const response = await axios.get(`${API_URL}/auth/check-username/${formData.izina_ryogukoresha}`);
//           setValidation(prev => ({
//             ...prev,
//             usernameAvailable: response.data.available
//           }));
//         } catch (error) {
//           console.error('Error checking username:', error);
//         }
//       }
//     };

//     const timeoutId = setTimeout(checkUsername, 500);
//     return () => clearTimeout(timeoutId);
//   }, [formData.izina_ryogukoresha]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//     setSuccess('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     // Client-side validation
//     if (!validation.usernameValid) {
//       setError('Izina ryogukoresha rigomba kuba nibura inyuguti 3');
//       setLoading(false);
//       return;
//     }

//     if (!validation.phoneValid) {
//       setError('Numero ya telefone ntabwo ari yo. Andika nka: 0781234567');
//       setLoading(false);
//       return;
//     }

//     if (validation.phoneAvailable === false) {
//       setError('Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.');
//       setLoading(false);
//       return;
//     }

//     if (validation.usernameAvailable === false) {
//       setError('Izina ryogukoresha risanzwe rikoreshwa');
//       setLoading(false);
//       return;
//     }

//     if (!validation.passwordValid) {
//       setError('Ijambo banga rigomba kuba nibura inyuguti 6');
//       setLoading(false);
//       return;
//     }

//     if (!validation.confirmValid) {
//       setError('Ijambo banga n\'ijambo banga wongeyeho ntabwo byahuye');
//       setLoading(false);
//       return;
//     }

//     try {
//       const signupData = {
//         izina_ryogukoresha: formData.izina_ryogukoresha.trim(),
//         nimero_yatelefone: formData.nimero_yatelefone,
//         ijambo_banga: formData.ijambo_banga
//       };

//       const response = await axios.post(`${API_URL}/auth/signup`, signupData, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000
//       });

//       if (response.data.success) {
//         const user = response.data.user;
//         setSuccess('Urabyemewe! Urakozwe kwiyandikisha.');
        
//         setTimeout(() => {
//           alert(`🎉 Urakozwe kwiyandikisha muri Apex Invest!

// 👤 Izina: ${user.izina_ryogukoresha}
// 📱 Nimero: ${user.nimero_yatelefone}
// 💰 Bonus: 400 RWF yashyizwe mu konti yawe

// 📍 Injira noneho kugirango ukore amasoko!`);

//           navigate('/login');
//         }, 500);
//       }
//     } catch (err) {
//       if (err.response) {
//         switch (err.response.status) {
//           case 409:
//             setError(err.response.data.message || 'Numero ya telefone isanzwe ikoreshwa.');
//             break;
//           default:
//             setError(err.response.data?.message || 'Habaye ikibazo. Ongera ugerageze.');
//         }
//       } else if (err.request) {
//         setError('Ntabwo twashoboye guhura na seriveri. Reba niba backend iri gukora.');
//       } else {
//         setError('Habaye ikibazo. Ongera ugerageze.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       {/* Theme Toggle */}
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
//         >
//           {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
//         </button>
//       </div>

//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
//           <span className="text-white text-3xl font-bold">AI</span>
//         </div>
//         <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Apex Invest</h1>
//         <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fungura konti yawe</p>
//       </div>

//       {/* Back to login */}
//       <div className="mb-6">
//         <Link
//           to="/login"
//           className={`inline-flex items-center font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
//         >
//           ← Subira kwinjira
//         </Link>
//       </div>

//       {/* Form */}
//       <div className="w-full max-w-md">
//         {error && (
//           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
//             <div className="flex items-start">
//               <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Ikosa</p>
//                 <p className="text-sm mt-1">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {success && (
//           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700'}`}>
//             <div className="flex items-start">
//               <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Byakunze!</p>
//                 <p className="text-sm mt-1">{success}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Username */}
//             <div>
//               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Izina ryogukoresha *
//               </label>
//               <input
//                 type="text"
//                 name="izina_ryogukoresha"
//                 value={formData.izina_ryogukoresha}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.usernameAvailable === false ? 'focus:ring-red-500 border-red-500' : validation.usernameAvailable === true ? 'focus:ring-green-500 border-green-500' : 'focus:ring-green-500'}`}
//                 placeholder="Andika izina ryogukoresha"
//                 required
//               />
//               {formData.izina_ryogukoresha && (
//                 <p className={`text-xs mt-1 ${validation.usernameAvailable === false ? 'text-red-600' : validation.usernameAvailable === true ? 'text-green-600' : 'text-gray-600'}`}>
//                   {validation.usernameAvailable === false ? '❌ Izina risanzwe rikoreshwa' : 
//                    validation.usernameAvailable === true ? '✅ Izina rirashobora gukoreshwa' : 
//                    validation.usernameValid ? '✅ Izina ryemewe' : '❌ Izina rigomba kuba nibura inyuguti 3'}
//                 </p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Numero ya telefone *
//               </label>
//               <input
//                 type="tel"
//                 name="nimero_yatelefone"
//                 value={formData.nimero_yatelefone}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.phoneAvailable === false ? 'focus:ring-red-500 border-red-500' : validation.phoneAvailable === true ? 'focus:ring-green-500 border-green-500' : 'focus:ring-green-500'}`}
//                 placeholder="0781234567"
//                 required
//               />
//               {formData.nimero_yatelefone && (
//                 <p className={`text-xs mt-1 ${validation.phoneAvailable === false ? 'text-red-600' : validation.phoneAvailable === true ? 'text-green-600' : 'text-gray-600'}`}>
//                   {validation.phoneAvailable === false ? '❌ Numero isanzwe ikoreshwa' : 
//                    validation.phoneAvailable === true ? '✅ Numero irashobora gukoreshwa' : 
//                    validation.phoneValid ? '✅ Nimero yemewe' : '❌ Nimero ntabwo ari yo (nk: 0781234567)'}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Ijambo banga *
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="ijambo_banga"
//                   value={formData.ijambo_banga}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.passwordValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
//                   placeholder="Ijambo banga (inyuguti 6)"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
//                   tabIndex="-1"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {formData.ijambo_banga && (
//                 <p className={`text-xs mt-1 ${validation.passwordValid ? 'text-green-600' : 'text-red-600'}`}>
//                   {validation.passwordValid ? '✅ Ijambo banga ryemewe' : '❌ Ijambo banga rigomba kuba nibura inyuguti 6'}
//                 </p>
//               )}
//             </div>

//             {/* Confirm password */}
//             <div>
//               <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Subiramo ijambo banga *
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="subiramo_ijambobanga"
//                   value={formData.subiramo_ijambobanga}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.confirmValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
//                   placeholder="Subiramo ijambo banga"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
//                   tabIndex="-1"
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {formData.subiramo_ijambobanga && (
//                 <p className={`text-xs mt-1 ${validation.confirmValid ? 'text-green-600' : 'text-red-600'}`}>
//                   {validation.confirmValid ? '✅ Ijambo banga bihuye' : '❌ Ijambo banga ntabwo bihuye'}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading || !Object.values(validation).every(v => v !== false)}
//               className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50 transition-colors mt-4`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Iyandikisha...
//                 </span>
//               ) : (
//                 'Kwiyandikisha'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvestmentSignup;



// src/components/InvestmentSignup.jsx
// src/components/InvestmentSignup.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSun, FaMoon, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const InvestmentSignup = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
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
      setError('Izina ryogukoresha rigomba kuba nibura inyuguti 3');
      setLoading(false);
      return;
    }

    if (!validation.phoneValid) {
      setError('Numero ya telefone ntabwo ari yo. Andika nka: 0781234567');
      setLoading(false);
      return;
    }

    if (validation.phoneAvailable === false) {
      setError('Numero ya telefone isanzwe ikoreshwa. Wongera ubone izindi.');
      setLoading(false);
      return;
    }

    if (validation.usernameAvailable === false) {
      setError('Izina ryogukoresha risanzwe rikoreshwa');
      setLoading(false);
      return;
    }

    if (!validation.passwordValid) {
      setError('Ijambo banga rigomba kuba nibura inyuguti 6');
      setLoading(false);
      return;
    }

    if (!validation.confirmValid) {
      setError('Ijambo banga n\'ijambo banga wongeyeho ntabwo byahuye');
      setLoading(false);
      return;
    }

    const weakPasswords = ['password', '123456', 'qwerty', 'letmein', 'admin', '000000', '111111', '222222', '333333'];
    if (weakPasswords.includes(formData.ijambo_banga.toLowerCase())) {
      setError('Ijambo banga ryoroshye cyane. Hitamo irindi rijya');
      setLoading(false);
      return;
    }

    try {
      const signupData = {
        izina_ryogukoresha: formData.izina_ryogukoresha.trim(),
        nimero_yatelefone: formData.nimero_yatelefone,
        ijambo_banga: formData.ijambo_banga
      };

      const response = await axios.post(`${API_URL}/auth/signup`, signupData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.success) {
        const user = response.data.user;
        const referralCode = user.referralCode || '';
        const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
        
        setSuccess('Urabyemewe! Urakozwe kwiyandikisha.');
        
        setTimeout(() => {
          alert(`🎉 Urakozwe kwiyandikisha muri Apex Invest!

👤 Izina: ${user.izina_ryogukoresha}
📱 Nimero: ${user.nimero_yatelefone}
🔗 Kode yo kugana: ${referralCode}
🔗 Link yo kugana: ${referralLink}

💰 Bonus: 400 RWF yashyizwe mu konti yawe

📍 Injira noneho kugirango ukore amasoko!`);

          navigate('/login');
        }, 500);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 409:
            setError(err.response.data.message || 'Numero ya telefone isanzwe ikoreshwa.');
            break;
          default:
            setError(err.response.data?.message || 'Habaye ikibazo. Ongera ugerageze.');
        }
      } else if (err.request) {
        setError('Ntabwo twashoboye guhura na seriveri. Reba niba backend iri gukora.');
      } else {
        setError('Habaye ikibazo. Ongera ugerageze.');
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
          <span className="text-white text-3xl font-bold">AI</span>
        </div>
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Apex Invest</h1>
        <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fungura konti yawe</p>
      </div>

      {/* Back to login */}
      <div className="mb-6">
        <Link
          to="/login"
          className={`inline-flex items-center font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          ← Subira kwinjira
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        {/* Error Message */}
        {error && (
          <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            <div className="flex items-start">
              <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Ikosa</p>
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
                <p className="font-medium">Byakunze!</p>
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
                Izina ryogukoresha
              </label>
              <input
                type="text"
                name="izina_ryogukoresha"
                value={formData.izina_ryogukoresha}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.usernameAvailable === false ? 'focus:ring-red-500 border-red-500' : validation.usernameAvailable === true ? 'focus:ring-green-500 border-green-500' : 'focus:ring-blue-500'}`}
                placeholder="Andika izina ryogukoresha"
                required
              />
              {formData.izina_ryogukoresha && (
                <p className={`text-sm mt-2 ${validation.usernameAvailable === false ? 'text-red-600' : validation.usernameAvailable === true ? 'text-green-600' : validation.usernameValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.usernameAvailable === false ? '❌ Izina risanzwe rikoreshwa' : 
                   validation.usernameAvailable === true ? '✅ Izina rirashobora gukoreshwa' : 
                   validation.usernameValid ? '✅ Izina ryemewe' : '❌ Izina rigomba kuba nibura inyuguti 3'}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Numero ya telefone
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
                  {validation.phoneAvailable === false ? '❌ Numero isanzwe ikoreshwa' : 
                   validation.phoneAvailable === true ? '✅ Numero irashobora gukoreshwa' : 
                   validation.phoneValid ? '✅ Nimero yemewe' : '❌ Nimero ntabwo ari yo (nk: 0781234567)'}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ijambo banga
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="ijambo_banga"
                  value={formData.ijambo_banga}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.passwordValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
                  placeholder="Ijambo banga (inyuguti 6)"
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
                  {validation.passwordValid ? '✅ Ijambo banga ryemewe' : '❌ Ijambo banga rigomba kuba nibura inyuguti 6'}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Subiramo ijambo banga
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="subiramo_ijambobanga"
                  value={formData.subiramo_ijambobanga}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 ${validation.confirmValid ? 'focus:ring-green-500' : 'focus:ring-red-500'} pr-10`}
                  placeholder="Subiramo ijambo banga"
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
                  {validation.confirmValid ? '✅ Ijambo banga bihuye' : '❌ Ijambo banga ntabwo bihuye'}
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
                Oza amakuru
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
                    Iyandikisha...
                  </span>
                ) : (
                  'Kwiyandikisha'
                )}
              </button>
            </div>
          </form>

          {/* Bonus Message at Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`font-bold text-lg ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                💰 Urahabwa Ishimwe (Bonus) 400 FRW Yokwiyandikisha
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-yellow-200' : 'text-yellow-600'}`}>
                Koresha ayo mafaranga gutangira gukora amasoko!
              </p>
            </div>
          </div>

          {/* Already have account */}
          <div className="mt-4 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ufite konti?{' '}
              <Link 
                to="/login" 
                className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Injira hano
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSignup;