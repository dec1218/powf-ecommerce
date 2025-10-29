import { useState } from 'react'

const CheckoutPage = ({ onBackToHome, onShowLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    contactNumber: ''
  })
  const [selectedPayment, setSelectedPayment] = useState('')

  // Sample order items (can be passed as props from cart)
  const orderItems = [
    {
      id: 1,
      name: 'Purina Supercoat Adult',
      price: 300.00,
      quantity: 2,
      image: '🐕'
    },
    {
      id: 2,
      name: 'Leather Dog Collar',
      price: 700.00,
      quantity: 1,
      image: '🦴'
    }
  ]

  const shippingFee = 150.00
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + shippingFee

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.address || !formData.contactNumber || !selectedPayment) {
      alert('Please fill in all fields and select a payment method')
      return
    }
    console.log('Placing order:', { formData, selectedPayment, orderItems, total })
    // Handle order placement
  }

  const paymentMethods = [
    { id: 'bi', name: 'BI SCAN', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'maya', name: 'maya', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'cash', name: 'CASH DELIVERY', color: 'bg-blue-700 hover:bg-blue-800' }
  ]

  return (
    <div className="min-h-screen bg-amber-50">

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-amber-700 font-medium">Payment Process</span>
              <button
                onClick={onBackToHome}
                className="text-amber-700 hover:text-amber-900 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">Check Out</h1>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9H21ZM4 10H20V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10Z"/>
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-900">fect Shop</h2>
            </div>
          </div>

          {/* Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side - Shipping Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                  Shipping information
                </h2>

                <form className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Address:
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your address"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Contact number:
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your contact number"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-4">
                      Payment Method:
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 ${
                            selectedPayment === method.id
                              ? `${method.color} ring-2 ring-amber-300`
                              : method.color
                          }`}
                        >
                          {method.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-amber-100 last:border-0 last:pb-0">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-2xl sm:text-3xl">{item.image}</div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-900 mb-1 text-sm sm:text-base">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-amber-700 font-semibold text-sm sm:text-base">
                            P{item.price.toFixed(2)}
                          </span>

                          {/* Quantity Display */}
                          <div className="flex items-center space-x-2">
                            <span className="text-amber-700 font-semibold">-</span>
                            <span className="w-6 text-center font-semibold text-amber-900">
                              {item.quantity}
                            </span>
                            <span className="text-amber-700 font-semibold">+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 pt-4 border-t border-amber-200">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Sub total</span>
                    <span className="font-semibold text-amber-900">P{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-amber-700">Shipping fee</span>
                    <span className="font-semibold text-amber-900">P{shippingFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-amber-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-amber-900">Total</span>
                      <span className="text-lg font-bold text-amber-900">P{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-white text-amber-900 font-bold py-4 px-6 rounded-lg border-2 border-amber-800 hover:bg-amber-50 hover:border-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CheckoutPage
