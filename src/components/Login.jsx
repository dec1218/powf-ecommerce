import { useState } from 'react'

const Login = ({ onSwitchToSignup, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple validation for demo purposes
    if (email === 'demo@example.com' && password === 'password') {
      setIsLoggedIn(true)
      setError('')
    } else if (email === '' || password === '') {
      setError('Please fill in all fields')
    } else {
      setError('Invalid credentials. Try demo@example.com / password')
    }
    
    setLoading(false)
  }


  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setError('')
  }

  // Show success message when logged in
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-amber-100 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-900">
                Pawfect Shop
              </h1>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">Login Successful!</span>
              </div>
              <p className="text-sm">Welcome to Pawfect Shop!</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-amber-800 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-800 hover:bg-amber-900 hover:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    )
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

        {/* Demo Instructions */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <p className="font-medium mb-1">Demo Mode:</p>
          <p>Email: <span className="font-mono">demo@example.com</span></p>
          <p>Password: <span className="font-mono">password</span></p>
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
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a 
                href="#" 
                className="text-sm text-amber-800 hover:text-amber-900 underline transition-colors duration-200"
              >
                Forgot Password?
              </a>
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
                onClick={onSwitchToSignup}
                className="text-amber-900 font-medium hover:text-amber-950 underline transition-colors duration-200"
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

