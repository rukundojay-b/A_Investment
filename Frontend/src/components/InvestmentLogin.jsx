// // src/components/InvestmentLogin.jsx
// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { FaSun, FaMoon, FaPhone, FaLock, FaExclamationCircle, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa'

// const InvestmentLogin = ({ darkMode, setDarkMode, onLogin }) => {
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     nimero_yatelefone: '',
//     ijambo_banga: ''
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [loginAttempts, setLoginAttempts] = useState(0)
//   const [isLocked, setIsLocked] = useState(false)
//   const [lockTime, setLockTime] = useState(0)

//   const API_URL = 'http://localhost:5000/api'

//   useEffect(() => {
//     checkLoginLock()
//   }, [])

//   const checkLoginLock = () => {
//     const lockUntil = localStorage.getItem('loginLockUntil')
//     if (lockUntil) {
//       const now = Date.now()
//       const lockUntilTime = parseInt(lockUntil)
//       if (now < lockUntilTime) {
//         setIsLocked(true)
//         const remainingSeconds = Math.ceil((lockUntilTime - now) / 1000)
//         setLockTime(remainingSeconds)
        
//         const interval = setInterval(() => {
//           const newRemaining = Math.ceil((lockUntilTime - Date.now()) / 1000)
//           if (newRemaining <= 0) {
//             setIsLocked(false)
//             localStorage.removeItem('loginLockUntil')
//             localStorage.removeItem('loginAttempts')
//             clearInterval(interval)
//           } else {
//             setLockTime(newRemaining)
//           }
//         }, 1000)
        
//         return () => clearInterval(interval)
//       } else {
//         localStorage.removeItem('loginLockUntil')
//         localStorage.removeItem('loginAttempts')
//         setIsLocked(false)
//       }
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//     setError('')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (isLocked) {
//       setError(`Login locked. Please wait ${lockTime} seconds before trying again.`)
//       return
//     }
    
//     setLoading(true)
//     setError('')

//     // Basic validation
//     if (!formData.nimero_yatelefone.trim() || !formData.ijambo_banga.trim()) {
//       setError('Nimero ya telefone n\'ijambo banga byombi birakenewe')
//       setLoading(false)
//       return
//     }

//     const phoneRegex = /^(?:\+250|0)?[78][0-9]{8}$/
//     if (!phoneRegex.test(formData.nimero_yatelefone)) {
//       setError('Numero ya telefone ntabwo ari yo. Andika nka: 0781234567')
//       setLoading(false)
//       return
//     }

//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, formData, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000
//       })

//       if (response.data.success) {
//         const { token, user } = response.data
        
//         // ✅ Call onLogin with both user and token
//         if (onLogin) {
//           onLogin(user, token)
//         }
        
//         // Reset login attempts on successful login
//         localStorage.removeItem('loginAttempts')
//         localStorage.removeItem('loginLockUntil')
//         setLoginAttempts(0)
        
//         // Redirect to dashboard
//         navigate('/dashboard')
//       }
//     } catch (err) {
//       // Handle failed login attempt
//       const attempts = loginAttempts + 1
//       setLoginAttempts(attempts)
//       localStorage.setItem('loginAttempts', attempts.toString())
      
//       // Lock after 5 failed attempts for 5 minutes
//       if (attempts >= 5) {
//         const lockUntil = Date.now() + (5 * 60 * 1000)
//         localStorage.setItem('loginLockUntil', lockUntil.toString())
//         setIsLocked(true)
//         setLockTime(300)
        
//         const interval = setInterval(() => {
//           const newRemaining = Math.ceil((lockUntil - Date.now()) / 1000)
//           if (newRemaining <= 0) {
//             setIsLocked(false)
//             localStorage.removeItem('loginLockUntil')
//             localStorage.removeItem('loginAttempts')
//             setLoginAttempts(0)
//             clearInterval(interval)
//           } else {
//             setLockTime(newRemaining)
//           }
//         }, 1000)
//       }
      
//       if (err.response) {
//         switch (err.response.status) {
//           case 401:
//             setError('Numero ya telefone cyangwa ijambo banga ntabwo byahuye')
//             break
//           default:
//             setError(err.response.data?.message || 'Habaye ikibazo. Ongera ugerageze.')
//         }
//       } else if (err.request) {
//         setError('Ntabwo twashoboye guhura na seriveri. Reba niba backend iri gukora.')
//       } else {
//         setError('Habaye ikibazo. Ongera ugerageze.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const resetPassword = () => {
//     setFormData(prev => ({ ...prev, ijambo_banga: '' }))
//     setError('')
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

//       {/* Form Container */}
//       <div className="w-full max-w-md">
//         {/* Error Message */}
//         {error && (
//           <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
//             <div className="flex items-start">
//               <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Login Failed</p>
//                 <p className="text-sm mt-1">{error}</p>
//                 {isLocked && (
//                   <p className="text-sm mt-1 font-bold">
//                     🔒 Locked for: {Math.floor(lockTime / 60)}:{String(lockTime % 60).padStart(2, '0')}
//                   </p>
//                 )}
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
//                 disabled={isLocked}
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
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="ijambo_banga"
//                   placeholder="Shyiramo ijambo banga"
//                   value={formData.ijambo_banga}
//                   onChange={handleChange}
//                   className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
//                   required
//                   minLength="6"
//                   disabled={isLocked}
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
//               <div className="flex justify-between items-center mt-1">
//                 <p className="text-xs opacity-75">Ijambo banga wabitswe mwandikisha (nibura inyuguti 6)</p>
//                 <button
//                   type="button"
//                   onClick={resetPassword}
//                   className="text-xs text-blue-500 hover:text-blue-600"
//                   disabled={isLocked}
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>

//             {/* Login Attempts Warning */}
//             {loginAttempts >= 3 && loginAttempts < 5 && (
//               <div className={`p-3 rounded ${darkMode ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-300' : 'bg-yellow-100 border border-yellow-400 text-yellow-700'}`}>
//                 <p className="text-sm font-medium">⚠️ Warning: {5 - loginAttempts} attempts remaining before lock</p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading || isLocked}
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
//               ) : isLocked ? (
//                 '🔒 Login Locked'
//               ) : (
//                 'Injira'
//               )}
//             </button>
//           </form>

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
//         </div>
//       </div>
//     </div>
//   )
// }
// export default InvestmentLogin














// src/components/InvestmentLogin.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaSun, FaMoon, FaPhone, FaLock, FaExclamationCircle, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa'

const InvestmentLogin = ({ darkMode, setDarkMode, onLogin }) => {
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
        
        // ✅ FIX: ONLY store the token, NOT user data
        sessionStorage.setItem('token', token)
        
        // ❌ REMOVE this line - don't store user separately
        // sessionStorage.setItem('user', JSON.stringify(user))
        
        // Reset login attempts on successful login
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginLockUntil')
        setLoginAttempts(0)
        
        // Call onLogin if provided (for backward compatibility)
        if (onLogin) {
          onLogin(user, token)
        }
        
        // Redirect to dashboard - it will fetch fresh data using token
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