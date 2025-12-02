import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Loadingscreen = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2 // Increment by 2% every 100ms = 5 seconds total
      })
    }, 100)

    // Navigate after 5 seconds
    const navigationTimer = setTimeout(() => {
      navigate('/home', { replace: true })
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(navigationTimer)
    }
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-amber-50 flex items-center justify-center">
      <div className="w-[88%] sm:w-[400px] md:w-[440px] bg-[#dfc6ad] rounded-md border-2 border-amber-900/40 shadow-lg p-10 relative">
        {/* Left paw trail */}
        <div className="absolute left-6 top-8 space-y-4 opacity-70">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 text-amber-800/40">
              <div className="w-4 h-4 bg-amber-700/30 rounded-full mx-auto"></div>
              <div className="flex -mt-2 justify-center">
                <div className="w-1.5 h-1.5 bg-amber-700/30 rounded-full mx-0.5"></div>
                <div className="w-1.5 h-1.5 bg-amber-700/30 rounded-full mx-0.5"></div>
                <div className="w-1.5 h-1.5 bg-amber-700/30 rounded-full mx-0.5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right paw trail */}
        <div className="absolute right-6 bottom-8 space-y-4 opacity-70">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 text-amber-800/40">
              <div className="w-4 h-4 bg-amber-700/30 rounded-full mx-auto"></div>
              <div className="flex -mt-2 justify-center">
                <div className="w-1.5 h-1.5 bg-amber-700/30 rounded-full mx-0.5"></div>
                <div className="w-1.5 h-1.5 bg-amber-700/30 rounded-full mx-0.5"></div>
                <div className="w-1.5 h-1.5 bg-amber-700/30 rounded-full mx-0.5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center justify-center">
          {/* Dog paw icon */}
          <div className="w-28 h-28 md:w-32 md:h-32 relative animate-pulse">
            <svg 
              className="w-full h-full text-amber-900" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2.5 8c0-2.5 2.24-4.5 5-4.5s5 2 5 4.5V20H8.5v-2zm-3-4c-1.1 0-2 .9-2 2v2h3v-2c0-.37.04-.72.11-1.07-.95-.3-1.76-.88-2.11-1.93zm15 0c.35 1.05-.15 1.63-1.11 1.93.07.35.11.7.11 1.07v2h3v-2c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>

          {/* Title */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-extrabold text-amber-900 tracking-wide">Pawfect</h1>
            <h2 className="-mt-1 text-2xl font-extrabold text-amber-900 tracking-wide">Shop</h2>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full">
            <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-800 h-2.5 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-sm text-amber-800 font-medium">
              Loading... {progress}%
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loadingscreen