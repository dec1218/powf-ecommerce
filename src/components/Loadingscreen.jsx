import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loadingscreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), 5000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-amber-50 flex items-center justify-center">
      <div className="w-[88%] sm:w-[400px] md:w-[440px] bg-[#dfc6ad] rounded-md border-2 border-amber-900/40 shadow-lg p-10 relative">
        {/* left paw trail */}
        <div className="absolute left-6 top-8 space-y-4 opacity-70">
          {[0,1,2,3].map(i => (
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

        {/* right paw trail */}
        <div className="absolute right-6 bottom-8 space-y-4 opacity-70">
          {[0,1,2,3].map(i => (
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

        {/* center paw and text */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-28 h-28 md:w-32 md:h-32 relative">
            <div className="w-20 h-16 bg-black rounded-b-full mx-auto"></div>
            <div className="flex justify-center -mt-2 space-x-2">
              <div className="w-4 h-6 bg-black rounded-full"></div>
              <div className="w-4 h-6 bg-black rounded-full"></div>
              <div className="w-4 h-6 bg-black rounded-full"></div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <h1 className="text-xl font-extrabold text-amber-900 tracking-wide">Pawfect</h1>
            <h2 className="-mt-1 text-xl font-extrabold text-amber-900 tracking-wide">Shop</h2>
            <p className="mt-2 text-sm text-amber-800">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loadingscreen