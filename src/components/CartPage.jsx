import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Header from './Header'

const CartPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const {
    cartItems,
    loading,
    updateQuantity,
    toggleSelect,
    removeFromCart,
    getCartTotals
  } = useCart()

  const totals = getCartTotals()

  // Redirect if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Login Required</h2>
            <p className="text-amber-600 mb-6">Please login to view your cart</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (cartItemId, delta) => {
    const item = cartItems.find(i => i.id === cartItemId)
    if (!item) return

    const newQuantity = item.quantity + delta
    
    if (newQuantity < 1) return
    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock`)
      return
    }

    updateQuantity(cartItemId, newQuantity)
  }

  const handleToggleSelect = (cartItemId) => {
    toggleSelect(cartItemId)
  }

  const handleRemoveItem = (cartItemId) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(cartItemId)
    }
  }

  const handleProceedCheckout = () => {
    if (totals.itemCount === 0) {
      alert('Please select at least one item')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Cart Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side - Carts Section */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                My Cart
              </h1>

              {/* Loading State */}
              {loading && cartItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
                  <p className="text-amber-600">Loading cart...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-amber-600 text-lg mb-4">Your cart is empty</p>
                      <button
                        onClick={() => navigate('/home')}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-amber-100 last:border-0 last:pb-0">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="mt-2 w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                        />

                        {/* Product Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-3xl sm:text-4xl">🎁</div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 mr-2">
                              <h3 className="font-semibold text-amber-900 mb-1 text-lg">
                                {item.name}
                              </h3>
                              
                              <p className="text-sm text-amber-600 mb-1 line-clamp-2">
                                {item.description}
                              </p>

                              {/* Color indicator if exists */}
                              {item.color && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs text-amber-700">Color:</span>
                                  <div
                                    className="w-5 h-5 rounded-full border-2 border-amber-300"
                                    style={{ backgroundColor: item.color }}
                                  />
                                </div>
                              )}

                              {/* Stock warning */}
                              {item.stock < 5 && (
                                <p className="text-xs text-red-600 mt-1">
                                  Only {item.stock} left in stock
                                </p>
                              )}
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <span className="text-lg font-bold text-amber-900">
                                ₱{Math.round(item.price)}
                              </span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₱{Math.round(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <span className="w-8 sm:w-10 text-center font-semibold text-amber-900">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                disabled={item.quantity >= item.stock}
                                className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Right Side - Summary Section */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                Summary
              </h2>

              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <div className="space-y-4 mb-6">
                  {/* Item Count */}
                  <div className="flex justify-between">
                    <span className="text-amber-700">Items ({totals.itemCount})</span>
                    <span className="font-semibold text-amber-900">₱{Math.round(totals.subtotal)}</span>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex justify-between">
                    <span className="text-amber-700">Shipping fee</span>
                    <span className="font-semibold text-amber-900">
                      {totals.itemCount > 0 ? `₱${Math.round(totals.shippingFee)}` : '₱0'}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-amber-900">Total</span>
                      <span className="text-lg font-bold text-amber-900">₱{Math.round(totals.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleProceedCheckout}
                  disabled={totals.itemCount === 0 || loading}
                  className="w-full bg-amber-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {totals.itemCount === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
                </button>

                {totals.itemCount > 0 && (
                  <p className="text-xs text-amber-600 text-center mt-3">
                    {totals.itemCount} item{totals.itemCount > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CartPage