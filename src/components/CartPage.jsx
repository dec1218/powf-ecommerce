import { useState } from 'react'
import Header from './Header'

const CartPage = ({ onBackToHome, onShowLogin, onProceedCheckout }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Purina Supercoat Adult',
      description: ['Purina Supercoat Beef', 'Adult Dry Dog Food 3Kg'],
      price: 300.00,
      quantity: 2,
      image: '🐕',
      selected: true
    },
    {
      id: 2,
      name: 'Leather Collar',
      description: ['Large Durable Personalized Dog', 'Collar PU Leather Padded Pet ID'],
      price: 700.00,
      quantity: 1,
      image: '🦴',
      selected: true,
      colorOptions: ['brown', 'black'],
      selectedColor: 'brown'
    }
  ])

  const shippingFee = 150.00

  const handleQuantityChange = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const handleToggleSelect = (id) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const handleColorChange = (itemId, color) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, selectedColor: color } : item
      )
    )
  }

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const selectedItems = cartItems.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + shippingFee

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

          {/* Cart Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side - Carts Section */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                Carts
              </h1>

              {/* Cart Items */}
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-amber-600 text-lg">Your cart is empty</p>
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
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-3xl sm:text-4xl">{item.image}</div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-900 mb-1 text-lg">
                          {item.name}
                        </h3>
                        
                        {item.description.map((line, index) => (
                          <p key={index} className="text-sm text-amber-600 mb-1">
                            {line}
                          </p>
                        ))}

                        {/* Color Options */}
                        {item.colorOptions && (
                          <div className="flex items-center space-x-2 mt-2">
                            {item.colorOptions.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleColorChange(item.id, color)}
                                className={`w-6 h-6 rounded-full border-2 ${
                                  item.selectedColor === color
                                    ? 'border-amber-800 ring-2 ring-amber-300'
                                    : 'border-gray-300'
                                }`}
                                style={{
                                  backgroundColor: color === 'brown' ? '#8B4513' : '#000000'
                                }}
                                aria-label={`Select ${color} color`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-bold text-amber-900">
                            ₱{Math.round(item.price)}
                          </span>

                          {/* Quantity Selector */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 transition-colors duration-200"
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
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-200 rounded-lg flex items-center justify-center text-amber-900 font-bold hover:bg-amber-50 transition-colors duration-200"
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
            </div>

            {/* Right Side - Summary Section */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                Summary
              </h2>

              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-amber-700">Sub total</span>
                    <span className="font-semibold text-amber-900">₱{Math.round(subtotal)}</span>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex justify-between">
                    <span className="text-amber-700">Shiping fee</span>
                    <span className="font-semibold text-amber-900">₱{Math.round(shippingFee)}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-amber-900">Total</span>
                      <span className="text-lg font-bold text-amber-900">₱{Math.round(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={onProceedCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-amber-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Proceed Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CartPage
