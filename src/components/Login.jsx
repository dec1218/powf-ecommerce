import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, isAuthenticated, role, authChecked } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (authChecked && isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    }
  }, [authChecked, isAuthenticated, role, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      console.log('🔑 Starting login process...')

      // Call login - returns user with role
      const user = await login({ email, password })
      
      console.log('✅ Login successful, user:', user)
      console.log('👤 User role:', user?.role)
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Navigate based on role
      if (user?.role === 'admin') {
        console.log('🔀 Navigating to /admin')
        navigate('/admin', { replace: true })
      } else {
        console.log('🔀 Navigating to /home')
        navigate('/home', { replace: true })
      }
      
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Invalid email or password')
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

       

        {/* Login Form Container */}
        <div className="bg-amber-200 rounded-xl p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-amber-900 font-medium mb-2">
                Email:
              </label>
              <input
                id="email"
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
              <label htmlFor="password" className="block text-amber-900 font-medium mb-2">
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-800 bg-white text-amber-900 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-800 hover:bg-amber-900 hover:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-sm text-amber-800">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-amber-900 font-medium hover:text-amber-950 underline transition-colors duration-200"
                disabled={loading}
              >
                Sign up
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login