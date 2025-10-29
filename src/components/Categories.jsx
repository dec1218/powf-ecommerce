const Categories = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      name: 'Foods',
      icon: (
        <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-amber-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: 'Toys',
      icon: (
        <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-pink-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: 'Grooming Tools',
      icon: (
        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-red-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
        </div>
      )
    },
    {
      id: 4,
      name: 'Accessories',
      icon: (
        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-8 text-center">
          Categories
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.name)}
              className="flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-amber-100 transition-colors duration-200 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <span className="text-sm sm:text-base font-medium text-amber-900 group-hover:text-amber-700">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
