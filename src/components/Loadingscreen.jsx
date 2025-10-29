import React from 'react';

const EnhancedLoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center p-4 md:p-8 max-w-md w-full mx-4">
        {/* Animated Icons */}
        <div className="flex justify-center space-x-3 md:space-x-4 mb-4 md:mb-6">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full animate-bounce"></div>
        </div>

        {/* Main Logo */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <div className="relative">
              {/* Main Paw */}
              <div className="w-10 h-10 md:w-16 md:h-16 text-indigo-600 mr-3 md:mr-4 animate-pulse">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-600 rounded-full"></div>
                <div className="flex -mt-3 md:-mt-4 ml-1 md:ml-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-600 rounded-full mx-1"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-600 rounded-full mx-1"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-600 rounded-full mx-1"></div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-indigo-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 font-serif bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pawfect Shop
            </h1>
          </div>
        </div>

        {/* Loading Bars Animation */}
        <div className="flex justify-center space-x-1 md:space-x-2 mb-4 md:mb-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="w-1 h-4 md:w-2 md:h-8 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full animate-bounce"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.5s'
              }}
            ></div>
          ))}
        </div>

        {/* Loading Text */}
        <p className="text-gray-700 text-lg md:text-xl font-medium mb-3 md:mb-4 min-h-[24px] md:min-h-[32px]">
          Loading...
        </p>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 md:h-3 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>

        {/* Progress Percentage */}
        <p className="text-gray-500 text-xs md:text-sm">
          75%
        </p>

        {/* Decorative Paws */}
        <div className="flex justify-between mt-6 md:mt-8 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 md:w-6 md:h-6">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full mx-auto"></div>
              <div className="flex -mt-1 justify-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoadingScreen;