import { useState } from 'react'
import Header from './Header'

const ProductDetailsPage = ({ product, onBackToHome, onShowLogin, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)

  // Default product data if none provided
  const productData = product || {
    id: 1,
    name: 'Purina Pro Plan',
    description: 'Pro Plan Adult Sensitive Skin and Stomach Medium and Large Breed Dry Dog Food 3kg',
    price: '₱2,997',
    rating: 5,
    image: '🐕'
  }

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = () => {
    console.log('Adding to cart:', { product: productData, quantity })
    if (onAddToCart) {
      onAddToCart({ ...productData, quantity })
    }
  }

  const handleBuyNow = () => {
    console.log('Buying now:', { product: productData, quantity })
    // Handle buy now logic
  }

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
            Back
          </button>

          {/* Product Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Product Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-12 flex items-center justify-center">
                <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* Product Image Placeholder - Replace with actual image */}
                  <div className="text-9xl">{productData.image}</div>
                  
                  {/* Alternative: If you have an actual image URL */}
                  {/* <img 
                    src={productData.imageUrl || '/placeholder-product.jpg'} 
                    alt={productData.name}
                    className="w-full h-full object-contain rounded-lg"
                  /> */}
                </div>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col justify-center">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
                  {productData.name}
                </h1>

                {/* Product Description */}
                <p className="text-base sm:text-lg text-amber-700 mb-6 leading-relaxed">
                  {productData.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          i < productData.rating
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
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-amber-900 font-medium mb-3 text-lg">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleDecreaseQuantity}
                      disabled={quantity === 1}
                      className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-16 sm:w-20 h-10 sm:h-12 border-2 border-amber-200 rounded-lg text-center text-lg font-semibold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    
                    <button
                      onClick={handleIncreaseQuantity}
                      className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900">
                    {productData.price}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-amber-900 font-bold py-4 px-6 rounded-lg border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg"
                  >
                    Add to cart
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-white text-amber-900 font-bold py-4 px-6 rounded-lg border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg"
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetailsPage
