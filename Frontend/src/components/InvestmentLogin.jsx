// // // // src/components/InvestmentLogin.jsx
// // // import React, { useState } from 'react'
// // // import { Link, useNavigate } from 'react-router-dom'
// // // import axios from 'axios'
// // // import { FaSun, FaMoon, FaPhone, FaLock } from 'react-icons/fa'

// // // const InvestmentLogin = ({ darkMode, setDarkMode }) => {
// // //   const navigate = useNavigate()

// // //   const [formData, setFormData] = useState({
// // //     nimero_yatelefone: '',
// // //     ijambo_banga: ''
// // //   })
// // //   const [loading, setLoading] = useState(false)
// // //   const [error, setError] = useState('')

// // //   const API_URL = 'http://localhost:5000/api/auth'

// // //   const handleChange = (e) => {
// // //     setFormData({ ...formData, [e.target.name]: e.target.value })
// // //     setError('')
// // //   }

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()
// // //     setLoading(true)

// // //     try {
// // //       const res = await axios.post(`${API_URL}/login`, formData)

// // //       if (res.data.success) {
// // //         localStorage.setItem('token', res.data.token)
// // //         navigate('/dashboard')
// // //       }
// // //     } catch (err) {
// // //       setError(err.response?.data?.message || 'Login failed')
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   return (
// // //     <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
// // //       {/* Theme Toggle */}
// // //       <div className="absolute top-4 right-4">
// // //         <button
// // //           onClick={() => setDarkMode(!darkMode)}
// // //           className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
// // //         >
// // //           {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
// // //         </button>
// // //       </div>

// // //       {/* Logo & Header */}
// // //       <div className="text-center mb-8">
// // //         <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // //           <span className="text-white text-3xl font-bold">AI</span>
// // //         </div>
// // //         <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
// // //           Apex Invest
// // //         </h1>
// // //         <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
// // //           Injira muri konti yawe
// // //         </p>
// // //       </div>

// // //       {/* Form Container */}
// // //       <div className="w-full max-w-md">
// // //         {/* Error Message */}
// // //         {error && (
// // //           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
// // //             {error}
// // //           </div>
// // //         )}

// // //         {/* Login Form */}
// // //         <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
// // //           <form onSubmit={handleSubmit} className="space-y-6">
// // //             {/* Phone Number Field */}
// // //             <div>
// // //               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// // //                 <div className="flex items-center">
// // //                   <FaPhone className="mr-2" />
// // //                   Numero ya telefone *
// // //                 </div>
// // //               </label>
// // //               <input
// // //                 type="tel"
// // //                 name="nimero_yatelefone"
// // //                 placeholder="0781234567"
// // //                 value={formData.nimero_yatelefone}
// // //                 onChange={handleChange}
// // //                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
// // //                 required
// // //               />
// // //             </div>

// // //             {/* Password Field */}
// // //             <div>
// // //               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// // //                 <div className="flex items-center">
// // //                   <FaLock className="mr-2" />
// // //                   Ijambo banga *
// // //                 </div>
// // //               </label>
// // //               <input
// // //                 type="password"
// // //                 name="ijambo_banga"
// // //                 placeholder="Shyiramo ijambo banga"
// // //                 value={formData.ijambo_banga}
// // //                 onChange={handleChange}
// // //                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
// // //                 required
// // //               />
// // //             </div>

// // //             {/* Submit Button */}
// // //             <button
// // //               type="submit"
// // //               disabled={loading}
// // //               className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50 transition-colors`}
// // //             >
// // //               {loading ? (
// // //                 <span className="flex items-center justify-center">
// // //                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                   </svg>
// // //                   Injira...
// // //                 </span>
// // //               ) : (
// // //                 'Injira'
// // //               )}
// // //             </button>
// // //           </form>

// // //           {/* Signup Link */}
// // //           <div className="mt-6 pt-4 border-t border-gray-700 text-center">
// // //             <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
// // //               Ntabwo ufite konti?{' '}
// // //               <Link 
// // //                 to="/signup" 
// // //                 className={`font-medium ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
// // //               >
// // //                 Iyandikishe hano
// // //               </Link>
// // //             </p>
// // //           </div>
// // //         </div>

       
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default InvestmentLogin








// // // src/components/InvestmentLogin.jsx
// // import React, { useState, useEffect } from 'react'
// // import { Link, useNavigate } from 'react-router-dom'
// // import axios from 'axios'
// // import { FaSun, FaMoon, FaPhone, FaLock, FaExclamationCircle, FaUserPlus } from 'react-icons/fa'

// // const InvestmentLogin = ({ darkMode, setDarkMode }) => {
// //   const navigate = useNavigate()

// //   const [formData, setFormData] = useState({
// //     nimero_yatelefone: '',
// //     ijambo_banga: ''
// //   })
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')
// //   const [debugInfo, setDebugInfo] = useState('')
// //   const [backendStatus, setBackendStatus] = useState('unknown')

// //   const API_URL = 'http://localhost:5000/api'

// //   // Check backend status on component mount
// //   useEffect(() => {
// //     checkBackendStatus()
// //   }, [])

// //   const checkBackendStatus = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/health`)
// //       if (response.data) {
// //         setBackendStatus('connected')
// //         console.log('✅ Backend connected:', response.data)
// //       }
// //     } catch (error) {
// //       setBackendStatus('disconnected')
// //       console.error('❌ Backend not reachable:', error.message)
// //     }
// //   }

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value })
// //     setError('')
// //     setDebugInfo('')
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     setError('')
// //     setDebugInfo('')

// //     // Basic validation
// //     if (!formData.nimero_yatelefone.trim() || !formData.ijambo_banga.trim()) {
// //       setError('Nimero ya telefone n\'ijambo banga byombi birakenewe')
// //       setLoading(false)
// //       return
// //     }

// //     try {
// //       console.log('🔄 Attempting login with:', {
// //         phone: formData.nimero_yatelefone,
// //         passwordLength: formData.ijambo_banga.length
// //       })

// //       const response = await axios.post(`${API_URL}/auth/login`, formData, {
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       })

// //       console.log('✅ Login response:', response.data)

// //       if (response.data.success) {
// //         const { token, user } = response.data
        
// //         // Save token and user data
// //         localStorage.setItem('token', token)
// //         localStorage.setItem('user', JSON.stringify(user))
        
// //         // Set debug info
// //         setDebugInfo(`Login successful! Welcome ${user.izina_ryogukoresha || 'User'}`)
        
// //         // Redirect to dashboard
// //         setTimeout(() => {
// //           navigate('/dashboard')
// //         }, 1000)
// //       } else {
// //         setError(response.data.message || 'Login failed')
// //       }
// //     } catch (err) {
// //       console.error('❌ Login error:', err.response?.data || err.message)
      
// //       // Handle different error types
// //       if (err.response) {
// //         // Server responded with error
// //         setError(err.response.data?.message || `Server error: ${err.response.status}`)
        
// //         // If backend says no user found, suggest test login
// //         if (err.response.status === 401 && err.response.data?.message?.includes('not found')) {
// //           setDebugInfo('💡 Try test login: Use 0781234567 / testpassword123')
// //         }
// //       } else if (err.request) {
// //         // No response received
// //         setError('Ntabwo twashoboye guhura na seriveri. Reba niba backend iri gukora.')
// //         setDebugInfo('Make sure backend is running at http://localhost:5000')
// //       } else {
// //         // Other errors
// //         setError('Login failed: ' + err.message)
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Test login function (for development)
// //   const handleTestLogin = async () => {
// //     setLoading(true)
// //     setError('')
// //     setDebugInfo('Attempting test login...')

// //     try {
// //       console.log('🔄 Attempting test login...')
      
// //       const response = await axios.post(`${API_URL}/test/test-login`, {
// //         username: 'testuser',
// //         phone: '0781234567'
// //       })

// //       console.log('✅ Test login response:', response.data)

// //       if (response.data.success) {
// //         const { token, user } = response.data
        
// //         localStorage.setItem('token', token)
// //         localStorage.setItem('user', JSON.stringify(user))
        
// //         setDebugInfo(`✅ Test login successful! Welcome ${user.izina_ryogukoresha}`)
        
// //         setTimeout(() => {
// //           navigate('/dashboard')
// //         }, 1000)
// //       }
// //     } catch (error) {
// //       console.error('❌ Test login failed:', error)
// //       setError('Test login failed. Make sure test route exists in backend.')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

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

// //       {/* Backend Status Indicator */}
// //       <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm ${backendStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
// //         Backend: {backendStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
// //       </div>

// //       {/* Logo & Header */}
// //       <div className="text-center mb-8">
// //         <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //           <span className="text-white text-3xl font-bold">AI</span>
// //         </div>
// //         <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
// //           Apex Invest
// //         </h1>
// //         <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
// //           Injira muri konti yawe
// //         </p>
// //       </div>

// //       {/* Form Container */}
// //       <div className="w-full max-w-md">
// //         {/* Debug Info */}
// //         {debugInfo && (
// //           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700'}`}>
// //             {debugInfo}
// //           </div>
// //         )}

// //         {/* Error Message */}
// //         {error && (
// //           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
// //             <div className="flex items-start">
// //               <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
// //               <div>
// //                 <p className="font-medium">Login Failed</p>
// //                 <p className="text-sm mt-1">{error}</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Login Form */}
// //         <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {/* Phone Number Field */}
// //             <div>
// //               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                 <div className="flex items-center">
// //                   <FaPhone className="mr-2" />
// //                   Numero ya telefone *
// //                 </div>
// //               </label>
// //               <input
// //                 type="tel"
// //                 name="nimero_yatelefone"
// //                 placeholder="0781234567"
// //                 value={formData.nimero_yatelefone}
// //                 onChange={handleChange}
// //                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
// //                 required
// //               />
// //               <p className="text-xs mt-1 opacity-75">Shyiramo numero ya telefone yakoreshejwe mwandikisha</p>
// //             </div>

// //             {/* Password Field */}
// //             <div>
// //               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                 <div className="flex items-center">
// //                   <FaLock className="mr-2" />
// //                   Ijambo banga *
// //                 </div>
// //               </label>
// //               <input
// //                 type="password"
// //                 name="ijambo_banga"
// //                 placeholder="Shyiramo ijambo banga"
// //                 value={formData.ijambo_banga}
// //                 onChange={handleChange}
// //                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
// //                 required
// //               />
// //               <p className="text-xs mt-1 opacity-75">Ijambo banga wabitswe mwandikisha</p>
// //             </div>

// //             {/* Submit Button */}
// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50 transition-colors flex items-center justify-center`}
// //             >
// //               {loading ? (
// //                 <>
// //                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                   </svg>
// //                   Injira...
// //                 </>
// //               ) : (
// //                 'Injira'
// //               )}
// //             </button>
// //           </form>

// //           {/* Test Login Button (For Development Only) */}
// //           {process.env.NODE_ENV === 'development' && (
// //             <button
// //               onClick={handleTestLogin}
// //               disabled={loading}
// //               className={`w-full mt-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50 transition-colors text-sm`}
// //             >
// //               🔧 Test Login (Development Only)
// //             </button>
// //           )}

// //           {/* Signup Link */}
// //           <div className="mt-6 pt-4 border-t border-gray-700 text-center">
// //             <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
// //               Ntabwo ufite konti?{' '}
// //               <Link 
// //                 to="/signup" 
// //                 className={`font-medium ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} flex items-center justify-center`}
// //               >
// //                 <FaUserPlus className="mr-2" />
// //                 Iyandikishe hano
// //               </Link>
// //             </p>
// //           </div>

// //           {/* Development Info */}
// //           <div className={`mt-4 p-3 rounded text-xs ${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
// //             <p className="font-medium mb-1">🔧 Development Info:</p>
// //             <p>• Backend: {API_URL}</p>
// //             <p>• Status: {backendStatus}</p>
// //             <p>• Test Credentials: 0781234567 / testpassword123</p>
// //             <p className="mt-1">Make sure backend is running at http://localhost:5000</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default InvestmentLogin














// // src/components/InvestmentLogin.jsx
// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { FaSun, FaMoon, FaPhone, FaLock, FaExclamationCircle, FaUserPlus, FaPlug, FaServer } from 'react-icons/fa'

// const InvestmentLogin = ({ darkMode, setDarkMode }) => {
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     nimero_yatelefone: '',
//     ijambo_banga: ''
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [debugInfo, setDebugInfo] = useState('')
//   const [backendStatus, setBackendStatus] = useState('unknown')
//   const [showDebug, setShowDebug] = useState(false)

//   const API_URL = 'http://localhost:5000/api'

//   // Check backend status on component mount
//   useEffect(() => {
//     checkBackendStatus()
//   }, [])

//   const checkBackendStatus = async () => {
//     try {
//       console.log('🔍 Checking backend status at:', API_URL + '/health')
//       const response = await axios.get(`${API_URL}/health`, { timeout: 3000 })
//       if (response.data) {
//         setBackendStatus('connected')
//         console.log('✅ Backend connected:', response.data)
//         setDebugInfo('✅ Backend connected successfully')
//       }
//     } catch (error) {
//       console.error('❌ Backend not reachable:', error.message)
//       setBackendStatus('disconnected')
//       setDebugInfo('❌ Backend not reachable. Make sure server is running at http://localhost:5000')
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//     setError('')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setDebugInfo('')

//     // Basic validation
//     if (!formData.nimero_yatelefone.trim() || !formData.ijambo_banga.trim()) {
//       setError('Nimero ya telefone n\'ijambo banga byombi birakenewe')
//       setLoading(false)
//       return
//     }

//     // Validate phone format
//     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/
//     if (!phoneRegex.test(formData.nimero_yatelefone)) {
//       setError('Numero ya telefone ntabwo ari yo. Andika nka: 0781234567')
//       setLoading(false)
//       return
//     }

//     try {
//       console.log('🔄 Attempting login with:', {
//         phone: formData.nimero_yatelefone,
//         passwordLength: formData.ijambo_banga.length,
//         endpoint: `${API_URL}/auth/login`
//       })

//       // Test if endpoint exists first
//       console.log('🔍 Testing endpoint availability...')
      
//       const response = await axios.post(`${API_URL}/auth/login`, formData, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         timeout: 10000
//       })

//       console.log('📥 Login response received:', response.status)
//       console.log('📊 Response data:', response.data)

//       if (response.data.success) {
//         const { token, user } = response.data
        
//         // Validate response structure
//         if (!token) {
//           throw new Error('No token received from server')
//         }
        
//         // Save token and user data
//         localStorage.setItem('token', token)
//         localStorage.setItem('user', JSON.stringify(user))
        
//         console.log('✅ Token saved:', token.substring(0, 20) + '...')
//         console.log('✅ User data saved:', user)
        
//         setDebugInfo(`✅ Login successful! Welcome ${user.izina_ryogukoresha || 'User'}`)
        
//         // Redirect to dashboard after short delay
//         setTimeout(() => {
//           navigate('/dashboard')
//         }, 1500)
//       } else {
//         setError(response.data.message || 'Login failed (success: false)')
//         setDebugInfo('Server returned success: false')
//       }
//     } catch (err) {
//       console.error('❌ Login error:', err)
//       console.error('❌ Error details:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         code: err.code
//       })
      
//       // Handle different error types
//       if (err.response) {
//         // Server responded with error status
//         console.error('Response error:', err.response.status, err.response.data)
        
//         switch (err.response.status) {
//           case 400:
//             setError(err.response.data?.message || 'Invalid request format')
//             break
//           case 401:
//             setError(err.response.data?.message || 'Numero ya telefone cyangwa ijambo banga ntabwo byahuye')
//             setDebugInfo('💡 Try: 0781234567 / test123')
//             break
//           case 404:
//             setError('Login endpoint not found')
//             setDebugInfo(`Endpoint ${API_URL}/auth/login returned 404. Check if auth routes are loaded.`)
//             break
//           case 500:
//             setError('Server error. Please try again later')
//             setDebugInfo('Backend server error. Check server logs.')
//             break
//           default:
//             setError(err.response.data?.message || `Server error: ${err.response.status}`)
//         }
//       } else if (err.request) {
//         // No response received
//         console.error('No response received:', err.request)
//         setError('Ntabwo twashoboye guhura na seriveri.')
//         setDebugInfo('Check: 1) Backend running? 2) Port 5000 open? 3) CORS enabled?')
//       } else if (err.code === 'ECONNABORTED') {
//         // Request timeout
//         setError('Request timeout. Server is taking too long to respond.')
//         setDebugInfo('Backend might be busy or not running properly.')
//       } else {
//         // Other errors
//         setError('Login failed: ' + err.message)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Direct test of auth endpoint
//   const testAuthEndpoint = async () => {
//     setDebugInfo('Testing auth endpoint...')
//     try {
//       const response = await axios.get(`${API_URL}`, { timeout: 3000 })
//       setDebugInfo(`API root OK: ${response.data.message}`)
//     } catch (error) {
//       setDebugInfo(`API test failed: ${error.message}`)
//     }
//   }

//   // Create test user
//   const createTestUser = async () => {
//     setDebugInfo('Creating test user...')
//     try {
//       const response = await axios.post(`${API_URL}/test/create-test-user`, {}, { timeout: 5000 })
//       setDebugInfo(`Test user created: ${response.data.message}`)
//     } catch (error) {
//       setDebugInfo(`Failed to create test user: ${error.message}`)
//     }
//   }

//   // Test login with predefined credentials
//   const quickTestLogin = () => {
//     setFormData({
//       nimero_yatelefone: '0781234567',
//       ijambo_banga: 'test123'
//     })
//     setDebugInfo('Test credentials loaded. Click "Injira" to login.')
//   }

//   return (
//     <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       {/* Theme Toggle */}
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
//           title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//         >
//           {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
//         </button>
//       </div>

//       {/* Debug Toggle */}
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
//       >
//         <FaPlug className="mr-1" />
//         {showDebug ? 'Hide Debug' : 'Show Debug'}
//       </button>

//       {/* Backend Status */}
//       <div className={`absolute top-16 left-4 px-3 py-1 rounded-full text-sm flex items-center ${backendStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//         <FaServer className="mr-1" />
//         Backend: {backendStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
//       </div>

//       {/* Logo & Header */}
//       <div className="text-center mb-8">
//         <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <span className="text-white text-3xl font-bold">AI</span>
//         </div>
//         <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//           Apex Invest
//         </h1>
//         <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           Injira muri konti yawe
//         </p>
//       </div>

//       {/* Debug Panel */}
//       {showDebug && (
//         <div className={`w-full max-w-md mb-4 rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-300'}`}>
//           <div className="flex justify-between items-center mb-3">
//             <h3 className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>🔧 Debug Panel</h3>
//             <button
//               onClick={checkBackendStatus}
//               className={`px-3 py-1 rounded text-xs ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
//             >
//               Test Connection
//             </button>
//           </div>
          
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>API URL:</span>
//               <code className={darkMode ? 'text-blue-300' : 'text-blue-600'}>{API_URL}</code>
//             </div>
//             <div className="flex justify-between">
//               <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
//               <span className={backendStatus === 'connected' ? 'text-green-500' : 'text-red-500'}>
//                 {backendStatus}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Login Endpoint:</span>
//               <code className={darkMode ? 'text-blue-300' : 'text-blue-600'}>{API_URL}/auth/login</code>
//             </div>
            
//             <div className="pt-2 mt-2 border-t border-gray-700/50">
//               <div className="flex space-x-2">
//                 <button
//                   onClick={testAuthEndpoint}
//                   className={`flex-1 py-2 rounded text-xs ${darkMode ? 'bg-green-600/30 hover:bg-green-600/50 text-green-300' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
//                 >
//                   Test API
//                 </button>
//                 <button
//                   onClick={createTestUser}
//                   className={`flex-1 py-2 rounded text-xs ${darkMode ? 'bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-300' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'}`}
//                 >
//                   Create Test User
//                 </button>
//                 <button
//                   onClick={quickTestLogin}
//                   className={`flex-1 py-2 rounded text-xs ${darkMode ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
//                 >
//                   Load Test Creds
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Form Container */}
//       <div className="w-full max-w-md">
//         {/* Debug Info */}
//         {debugInfo && (
//           <div className={`mb-4 p-3 rounded ${debugInfo.includes('✅') ? (darkMode ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700') : (darkMode ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-300' : 'bg-yellow-100 border border-yellow-400 text-yellow-700')}`}>
//             {debugInfo}
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
//             <div className="flex items-start">
//               <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Login Failed</p>
//                 <p className="text-sm mt-1">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Login Form */}
//         <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Phone Number Field */}
//             <div>
//               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 <div className="flex items-center">
//                   <FaPhone className="mr-2" />
//                   Numero ya telefone *
//                 </div>
//               </label>
//               <input
//                 type="tel"
//                 name="nimero_yatelefone"
//                 placeholder="0781234567"
//                 value={formData.nimero_yatelefone}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 required
//                 pattern="^(?:\+250|0)?[78][0-9]{8}$"
//                 title="Andika numero ya telefone nka: 0781234567"
//               />
//               <p className="text-xs mt-1 opacity-75">Shyiramo numero ya telefone yakoreshejwe mwandikisha (nk: 0781234567)</p>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 <div className="flex items-center">
//                   <FaLock className="mr-2" />
//                   Ijambo banga *
//                 </div>
//               </label>
//               <input
//                 type="password"
//                 name="ijambo_banga"
//                 placeholder="Shyiramo ijambo banga"
//                 value={formData.ijambo_banga}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 required
//                 minLength="6"
//               />
//               <p className="text-xs mt-1 opacity-75">Ijambo banga wabitswe mwandikisha (nibura inyuguti 6)</p>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50 transition-colors flex items-center justify-center`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Injira...
//                 </>
//               ) : (
//                 'Injira'
//               )}
//             </button>
//           </form>

//           {/* Quick Actions */}
//           <div className="mt-6 pt-4 border-t border-gray-700/30">
//             <div className="flex justify-between">
//               <button
//                 onClick={quickTestLogin}
//                 className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
//               >
//                 Load Test Credentials
//               </button>
//               <button
//                 onClick={() => setShowDebug(!showDebug)}
//                 className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
//               >
//                 {showDebug ? 'Hide' : 'Show'} Debug
//               </button>
//             </div>
//           </div>

//           {/* Signup Link */}
//           <div className="mt-6 pt-4 border-t border-gray-700 text-center">
//             <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
//               Ntabwo ufite konti?{' '}
//               <Link 
//                 to="/signup" 
//                 className={`font-medium ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} flex items-center justify-center`}
//               >
//                 <FaUserPlus className="mr-2" />
//                 Iyandikishe hano
//               </Link>
//             </p>
//           </div>

//           {/* Quick Help */}
//           <div className={`mt-4 p-3 rounded text-xs ${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
//             <p className="font-medium mb-1">💡 Quick Help:</p>
//             <p>• Test Credentials: 0781234567 / test123</p>
//             <p>• Backend: http://localhost:5000</p>
//             <p>• Check server is running: <code>npm start</code> in backend folder</p>
//             {backendStatus === 'disconnected' && (
//               <p className="text-red-400 mt-1">❌ Backend not connected. Check if server is running!</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default InvestmentLogin
















// src/components/InvestmentLogin.jsx (Simplified version)
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaSun, FaMoon, FaPhone, FaLock, FaExclamationCircle, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa'

const InvestmentLogin = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nimero_yatelefone: '',
    ijambo_banga: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTime, setLockTime] = useState(0)

  const API_URL = 'http://localhost:5000/api'

  useEffect(() => {
    checkLoginLock()
  }, [])

  const checkLoginLock = () => {
    const lockUntil = localStorage.getItem('loginLockUntil')
    if (lockUntil) {
      const now = Date.now()
      const lockUntilTime = parseInt(lockUntil)
      if (now < lockUntilTime) {
        setIsLocked(true)
        const remainingSeconds = Math.ceil((lockUntilTime - now) / 1000)
        setLockTime(remainingSeconds)
        
        const interval = setInterval(() => {
          const newRemaining = Math.ceil((lockUntilTime - Date.now()) / 1000)
          if (newRemaining <= 0) {
            setIsLocked(false)
            localStorage.removeItem('loginLockUntil')
            localStorage.removeItem('loginAttempts')
            clearInterval(interval)
          } else {
            setLockTime(newRemaining)
          }
        }, 1000)
        
        return () => clearInterval(interval)
      } else {
        localStorage.removeItem('loginLockUntil')
        localStorage.removeItem('loginAttempts')
        setIsLocked(false)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isLocked) {
      setError(`Login locked. Please wait ${lockTime} seconds before trying again.`)
      return
    }
    
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.nimero_yatelefone.trim() || !formData.ijambo_banga.trim()) {
      setError('Nimero ya telefone n\'ijambo banga byombi birakenewe')
      setLoading(false)
      return
    }

    const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/
    if (!phoneRegex.test(formData.nimero_yatelefone)) {
      setError('Numero ya telefone ntabwo ari yo. Andika nka: 0781234567')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      })

      if (response.data.success) {
        const { token, user } = response.data
        
        // Save token and user data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Reset login attempts on successful login
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginLockUntil')
        setLoginAttempts(0)
        
        // Redirect to dashboard
        navigate('/dashboard')
      }
    } catch (err) {
      // Handle failed login attempt
      const attempts = loginAttempts + 1
      setLoginAttempts(attempts)
      localStorage.setItem('loginAttempts', attempts.toString())
      
      // Lock after 5 failed attempts for 5 minutes
      if (attempts >= 5) {
        const lockUntil = Date.now() + (5 * 60 * 1000)
        localStorage.setItem('loginLockUntil', lockUntil.toString())
        setIsLocked(true)
        setLockTime(300)
        
        const interval = setInterval(() => {
          const newRemaining = Math.ceil((lockUntil - Date.now()) / 1000)
          if (newRemaining <= 0) {
            setIsLocked(false)
            localStorage.removeItem('loginLockUntil')
            localStorage.removeItem('loginAttempts')
            setLoginAttempts(0)
            clearInterval(interval)
          } else {
            setLockTime(newRemaining)
          }
        }, 1000)
      }
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Numero ya telefone cyangwa ijambo banga ntabwo byahuye')
            break
          default:
            setError(err.response.data?.message || 'Habaye ikibazo. Ongera ugerageze.')
        }
      } else if (err.request) {
        setError('Ntabwo twashoboye guhura na seriveri. Reba niba backend iri gukora.')
      } else {
        setError('Habaye ikibazo. Ongera ugerageze.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = () => {
    setFormData(prev => ({ ...prev, ijambo_banga: '' }))
    setError('')
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
      </div>

      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">AI</span>
        </div>
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Apex Invest
        </h1>
        <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Injira muri konti yawe
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        {/* Error Message */}
        {error && (
          <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            <div className="flex items-start">
              <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Login Failed</p>
                <p className="text-sm mt-1">{error}</p>
                {isLocked && (
                  <p className="text-sm mt-1 font-bold">
                    🔒 Locked for: {Math.floor(lockTime / 60)}:{String(lockTime % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Field */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <FaPhone className="mr-2" />
                  Numero ya telefone *
                </div>
              </label>
              <input
                type="tel"
                name="nimero_yatelefone"
                placeholder="0781234567"
                value={formData.nimero_yatelefone}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
                pattern="^(?:\+250|0)?[78][0-9]{8}$"
                title="Andika numero ya telefone nka: 0781234567"
                disabled={isLocked}
              />
              <p className="text-xs mt-1 opacity-75">Shyiramo numero ya telefone yakoreshejwe mwandikisha (nk: 0781234567)</p>
            </div>

            {/* Password Field */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <FaLock className="mr-2" />
                  Ijambo banga *
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="ijambo_banga"
                  placeholder="Shyiramo ijambo banga"
                  value={formData.ijambo_banga}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  required
                  minLength="6"
                  disabled={isLocked}
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
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs opacity-75">Ijambo banga wabitswe mwandikisha (nibura inyuguti 6)</p>
                <button
                  type="button"
                  onClick={resetPassword}
                  className="text-xs text-blue-500 hover:text-blue-600"
                  disabled={isLocked}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Login Attempts Warning */}
            {loginAttempts >= 3 && loginAttempts < 5 && (
              <div className={`p-3 rounded ${darkMode ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-300' : 'bg-yellow-100 border border-yellow-400 text-yellow-700'}`}>
                <p className="text-sm font-medium">⚠️ Warning: {5 - loginAttempts} attempts remaining before lock</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50 transition-colors flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Injira...
                </>
              ) : isLocked ? (
                '🔒 Login Locked'
              ) : (
                'Injira'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 pt-4 border-t border-gray-700 text-center">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Ntabwo ufite konti?{' '}
              <Link 
                to="/signup" 
                className={`font-medium ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} flex items-center justify-center`}
              >
                <FaUserPlus className="mr-2" />
                Iyandikishe hano
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default InvestmentLogin