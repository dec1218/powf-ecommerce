import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const { signup, isAuthenticated, authChecked } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (authChecked && isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [authChecked, isAuthenticated, navigate])

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Starting signup process...')
      const res = await signup({ email, password })
      
      if (res.error) {
        console.error('❌ Signup error:', res.error)
        setError(res.error.message || 'Signup failed')
        setLoading(false)
      } else {
        console.log('✅ Signup successful!')
        setSuccessMessage('Account created successfully! Redirecting to login...')
        
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        
        // Redirect to login after short delay
        setTimeout(() => {
          console.log('🔀 Redirecting to login page')
          navigate('/login')
        }, 1500)
      }
    } catch (err) {
      console.error('❌ Signup error:', err)
      setError(err.message || 'Signup failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md bg-amber-100 rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">
            Pawfect Shop
          </h1>
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9H21ZM4 10H20V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10Z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <p className="font-medium mb-1">Create User Account:</p>
          <p>Sign up creates a regular user account. Admin accounts can only be created in Supabase database.</p>
        </div>

        {/* Signup Form Container */}
        <div className="bg-amber-200 rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="signup-email" className="block text-amber-900 font-medium mb-2">
                Email:
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-800 bg-white text-amber-900 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="signup-password" className="block text-amber-900 font-medium mb-2">
                Password:
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-800 bg-white text-amber-900 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Create a password (min 6 characters)"
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-amber-900 font-medium mb-2">
                Confirm Password:
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-800 bg-white text-amber-900 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-800 hover:bg-amber-900 hover:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-sm text-amber-800">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-amber-900 font-medium hover:text-amber-950 underline transition-colors duration-200"
                disabled={loading}
              >
                Log in
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup