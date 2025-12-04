import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Header from './Header'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { getSelectedItems, getCartTotals, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    contactNumber: ''
  })
  const [selectedPayment, setSelectedPayment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedItems = getSelectedItems()
  const totals = getCartTotals()

  // Redirect if not logged in or no items
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (selectedItems.length === 0) {
      alert('No items selected for checkout')
      navigate('/cart')
    }
  }, [isAuthenticated, selectedItems.length, navigate])

  // Load user profile data
  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()

      if (data) {
        setFormData(prev => ({
          ...prev,
          fullName: data.full_name || '',
          contactNumber: data.phone || ''
        }))
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!formData.address.trim()) {
      setError('Please enter your address')
      return false
    }
    if (!formData.city.trim()) {
      setError('Please enter your city')
      return false
    }
    if (!formData.province.trim()) {
      setError('Please enter your province')
      return false
    }
    if (!formData.contactNumber.trim()) {
      setError('Please enter your contact number')
      return false
    }
    if (!selectedPayment) {
      setError('Please select a payment method')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('📦 Creating order...')

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Prepare shipping address
      const shippingAddress = {
        name: formData.fullName,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        phone: formData.contactNumber
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: totals.total,
          shipping_fee: totals.shippingFee,
          shipping_address: shippingAddress,
          payment_method: selectedPayment,
          payment_status: 'pending',
          currency: 'PHP',
          subtotal: totals.subtotal,
          shipping_amount: totals.shippingFee
        }])
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        throw new Error('Failed to create order')
      }

      console.log('✅ Order created:', orderData.order_number)

      // Create order items
      const orderItems = selectedItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        color: item.color || null
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items error:', itemsError)
        throw new Error('Failed to save order items')
      }

      console.log('✅ Order items saved')

      // Handle payment method
      if (selectedPayment === 'stripe') {
        // Redirect to Stripe payment page
        console.log('🔵 Redirecting to Stripe payment...')
        navigate(`/payment/${orderData.id}`)
      } else {
        // For COD or other methods - mark as confirmed
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            payment_status: selectedPayment === 'cod' ? 'pending' : 'pending'
          })
          .eq('id', orderData.id)

        if (updateError) {
          console.warn('Status update error:', updateError)
        }

        // Clear cart
        await clearCart()

        // Navigate to receipt
        navigate('/receipt', { 
          state: { 
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            paymentMethod: selectedPayment,
            shippingAddress,
            items: selectedItems,
            shippingFee: totals.shippingFee,
            date: new Date().toLocaleDateString('en-PH')
          } 
        })
      }

    } catch (err) {
      console.error('❌ Checkout error:', err)
      setError(err.message || 'Failed to process order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || selectedItems.length === 0) {
    return null // Will redirect in useEffect
  }

  const paymentMethods = [
    { 
      id: 'stripe', 
      name: 'Credit/Debit Card', 
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: '💳'
    },
    { 
      id: 'cod', 
      name: 'Cash on Delivery', 
      color: 'bg-green-600 hover:bg-green-700',
      icon: '💵'
    }
  ]

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>

          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-8 text-center">
            Checkout
          </h1>

          {/* Error Message */}
          {error && (
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {/* Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side - Shipping Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                  Shipping Information
                </h2>

                <form className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Full Name: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Street Address: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="House no., Street, Barangay"
                      required
                    />
                  </div>

                  {/* City & Province */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-900 font-medium mb-2">
                        City: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-amber-900 font-medium mb-2">
                        Province: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                        placeholder="Province"
                        required
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Postal Code:
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter postal code (optional)"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Contact Number: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="09XX XXX XXXX"
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-4">
                      Payment Method: <span className="text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          disabled={loading}
                          className={`px-6 py-4 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 ${
                            selectedPayment === method.id
                              ? `${method.color} ring-4 ring-amber-300`
                              : method.color
                          }`}
                        >
                          <span className="text-2xl">{method.icon}</span>
                          <span>{method.name}</span>
                        </button>
                      ))}
                    </div>
                    {selectedPayment === 'stripe' && (
                      <p className="text-xs text-amber-600 mt-2">
                        💳 You'll be redirected to secure payment page
                      </p>
                    )}
                    {selectedPayment === 'cod' && (
                      <p className="text-xs text-amber-600 mt-2">
                        💵 Pay when your order arrives
                      </p>
                    )}
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
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-amber-100 last:border-0">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-2xl">🎁</div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-900 mb-1 text-sm truncate">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-amber-700">₱{Math.round(item.price)}</span>
                          <span className="text-amber-600">x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 pt-4 border-t border-amber-200">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Subtotal</span>
                    <span className="font-semibold text-amber-900">₱{Math.round(totals.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-amber-700">Shipping fee</span>
                    <span className="font-semibold text-amber-900">₱{Math.round(totals.shippingFee)}</span>
                  </div>

                  <div className="border-t border-amber-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-amber-900">Total</span>
                      <span className="text-lg font-bold text-amber-900">₱{Math.round(totals.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-amber-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="text-xs text-amber-600 text-center mt-3">
                  By placing order, you agree to our terms
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CheckoutPage