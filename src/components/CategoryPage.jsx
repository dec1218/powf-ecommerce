import { useState } from 'react'
import Header from './Header'

const CategoryPage = ({ categoryName, onBackToHome, onShowLogin, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  // Sample products for the category
  const products = [
    {
      id: 1,
      name: 'Premium Dog Food',
      price: '$29.99',
      image: '🐕',
      rating: 4.8,
      description: 'High-quality nutrition for your pet'
    },
    {
      id: 2,
      name: 'Grain-Free Cat Food',
      price: '$24.99',
      image: '🐱',
      rating: 4.6,
      description: 'Natural ingredients for healthy cats'
    },
    {
      id: 3,
      name: 'Puppy Formula',
      price: '$19.99',
      image: '🐶',
      rating: 4.9,
      description: 'Specially formulated for growing puppies'
    },
    {
      id: 4,
      name: 'Senior Dog Food',
      price: '$34.99',
      image: '🐕‍🦺',
      rating: 4.7,
      description: 'Gentle nutrition for older dogs'
    },
    {
      id: 5,
      name: 'Wet Cat Food',
      price: '$14.99',
      image: '🥫',
      rating: 4.5,
      description: 'Delicious wet food variety pack'
    },
    {
      id: 6,
      name: 'Organic Treats',
      price: '$12.99',
      image: '🦴',
      rating: 4.8,
      description: 'Natural treats for training'
    }
  ]

  return (
    <div className="min-h-screen bg-amber-50">
      <Header onShowLogin={onShowLogin} />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBackToHome}
            className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          {/* Category Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 uppercase">
              {categoryName}
            </h1>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 group"
              >
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-gray-200 flex items-center justify-center p-8">
                  <div className="text-6xl">{product.image}</div>
                </div>
                
                {/* Product Details */}
                <div className="p-6">
                  <h3 className="font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors text-lg">
                    {product.name}
                  </h3>
                  
                  <p className="text-amber-600 text-sm mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mb-4">
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
                    <span className="text-2xl font-bold text-amber-900">{product.price}</span>
                    <button 
                      onClick={() => onProductClick && onProductClick(product)}
                      className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-amber-200 text-amber-900 font-semibold py-3 px-8 rounded-lg hover:bg-amber-300 transition-colors duration-200">
              Load More Products
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CategoryPage
