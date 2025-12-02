import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Header from './Header'

const ProductDetailsPage = ({ onShowLogin, onAddToCart }) => {
  const { id } = useParams() // Get product ID from URL
  const navigate = useNavigate()
  const { getProductById } = useProducts()
  const { addToCart, loading: cartLoading } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    // Fetch product when component mounts
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const productData = getProductById(id)
        if (productData) {
          setProduct(productData)
        } else {
          console.error('Product not found')
          // Optionally redirect to home or show error
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, getProductById])

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    } else if (product && product.stock <= 0) {
      alert('Product is out of stock')
    } else {
      alert(`Only ${product?.stock} items available`)
    }
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }
    
    const success = await addToCart(product, quantity)
    if (success) {
      alert(`✅ Added ${quantity} ${product.name} to cart!`)
      setQuantity(1) // Reset quantity after adding
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    
    console.log('Buying now:', { product, quantity })
    // Redirect to checkout with product
    navigate('/checkout', { 
      state: { 
        items: [{ ...product, quantity }] 
      } 
    })
  }

  const handleBackToHome = () => {
    navigate('/home')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header onShowLogin={onShowLogin} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
            <p className="text-amber-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header onShowLogin={onShowLogin} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Product Not Found</h2>
            <p className="text-amber-600 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={handleBackToHome}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate display price
  const displayPrice = product.sale_price || product.price
  const hasDiscount = product.sale_price && product.sale_price < product.price

  return (
    <div className="min-h-screen bg-amber-50">
      <Header onShowLogin={onShowLogin} />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Product Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Product Images */}
            <div className="flex flex-col justify-center">
              <div className="w-full bg-white rounded-xl shadow-lg p-8 sm:p-12">
                {/* Main Image */}
                <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-9xl">🎁</div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-amber-800 ring-2 ring-amber-300'
                            : 'border-gray-300 hover:border-amber-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col justify-center">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-2">
                  {product.name}
                </h1>

                {/* Category Badge */}
                {product.category && (
                  <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    {product.category}
                  </span>
                )}

                {/* Product Description */}
                <p className="text-base sm:text-lg text-amber-700 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          i < Math.floor(product.rating || 0)
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
                  <span className="ml-2 text-amber-700">({product.rating || 0})</span>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-amber-900">
                    Stock: {' '}
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                  </p>
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
                      disabled={product.stock <= 0}
                      className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900">
                      ₱{Math.round(displayPrice)}
                    </div>
                    {hasDiscount && (
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-500 line-through">
                          ₱{Math.round(product.price)}
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          Save ₱{Math.round(product.price - product.sale_price)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || cartLoading}
                    className="w-full bg-white text-amber-900 font-bold py-4 px-6 rounded-lg border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg"
                  >
                    {cartLoading ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to cart'}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="w-full bg-amber-800 text-white font-bold py-4 px-6 rounded-lg border-2 border-amber-800 hover:bg-amber-900 hover:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg"
                  >
                    {product.stock <= 0 ? 'Out of Stock' : 'Buy now'}
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