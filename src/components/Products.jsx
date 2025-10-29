const Products = ({ onProductClick }) => {
  const products = [
    {
      id: 1,
      name: 'Purina Pro Plan',
      description: 'Pro Plan Adult Sensitive Skin and Stomach Medium and Large Breed Dry Dog Food 3kg',
      price: 'P2,997',
      image: '🐕',
      rating: 5
    },
    {
      id: 2,
      name: 'Interactive Toy Set',
      description: 'Engaging toys to keep your pet active and happy',
      price: '$19.99',
      image: '🎾',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Grooming Kit',
      description: 'Complete grooming set for maintaining your pet\'s hygiene',
      price: '$34.99',
      image: '✂️',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Comfort Collar',
      description: 'Soft and adjustable collar for your pet\'s comfort',
      price: '$24.99',
      image: '🦴',
      rating: 4.7
    }
  ]

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 bg-amber-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-8 text-center">
          Top selling products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 group"
            >
              <button
                onClick={() => onProductClick && onProductClick(product)}
                className="w-full text-left"
              >
                <div className="aspect-square bg-amber-100 flex items-center justify-center p-8">
                  <div className="text-6xl">{product.image}</div>
                </div>
              </button>
              
              <div className="p-4">
                <button
                  onClick={() => onProductClick && onProductClick(product)}
                  className="w-full text-left"
                >
                  <h3 className="font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                </button>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-amber-600 ml-2">({product.rating})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-900">{product.price}</span>
                  <button 
                    onClick={() => onProductClick && onProductClick(product)}
                    className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors duration-200 text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products
