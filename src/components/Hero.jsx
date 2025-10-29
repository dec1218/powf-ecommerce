const Hero = () => {
  return (
    <section className="bg-white mx-4 sm:mx-6 lg:mx-8 rounded-2xl shadow-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="max-w-lg">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-4">
              Everything your pet deserves
              <span className="text-red-500 ml-2">❤️</span>
            </h2>
            <p className="text-lg text-amber-700 mb-6 leading-relaxed">
              Shop quality foods, toys, grooming tools, and accessories for your pet friend.
            </p>
            <button className="bg-amber-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-900 transition-colors duration-200 transform hover:scale-105">
              Shop Now
            </button>
          </div>
        </div>

        {/* Right Content - Dog Image */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="relative">
            {/* Placeholder for dog image - you can replace with actual image */}
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-8 text-center">
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-amber-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-amber-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-amber-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9H21ZM4 10H20V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10Z"/>
                    </svg>
                  </div>
                  <p className="text-amber-800 font-medium">Three Happy Huskies</p>
                  <p className="text-amber-600 text-sm">Your perfect companions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
