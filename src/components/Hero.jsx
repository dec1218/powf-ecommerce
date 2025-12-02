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

              <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-8 text-center">

                {/* Replace placeholder with responsive image */}
                <div className="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
                  <img
                    src="huskies.jpg"
                    alt="Three Happy Huskies"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center mt-4">
                  <p className="text-amber-800 font-medium">Three Happy Huskies</p>
                  <p className="text-amber-600 text-sm">Your perfect companions</p>
                </div>

              </div>
            </div>
          </div>
                </div>
              </section>
  )
}

export default Hero
