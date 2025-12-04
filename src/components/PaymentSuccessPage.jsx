import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Header from './Header'

const PaymentSuccessPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { clearCart } = useCart()
  
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadOrderDetails()
  }, [orderId, isAuthenticated])

  const loadOrderDetails = async () => {
    try {
      console.log('📦 Loading order details:', orderId)

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (orderError || !orderData) {
        throw new Error('Order not found')
      }

      setOrder(orderData)
      console.log('✅ Order loaded:', orderData.order_number)

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            images
          )
        `)
        .eq('order_id', orderId)

      if (itemsError) {
        console.error('Error loading items:', itemsError)
      } else {
        setOrderItems(itemsData || [])
      }

      // Clear cart after successful payment
      await clearCart()
      console.log('🛒 Cart cleared')

    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message || 'Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-900 font-semibold">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Error</h2>
            <p className="text-amber-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/order-history')}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-amber-700 text-lg">
              Thank you for your order!
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            {/* Order Number */}
            <div className="mb-6 pb-6 border-b border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-700 font-medium">Order Number</span>
                <span className="text-amber-900 font-bold text-lg">{order?.order_number}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-700 font-medium">Payment Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  ✓ Paid
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-700 font-medium">Order Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {order?.status === 'confirmed' ? '✓ Confirmed' : order?.status}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 pb-6 border-b border-amber-200">
              <h2 className="text-xl font-bold text-amber-900 mb-3">Shipping Address</h2>
              <div className="text-amber-700 space-y-1">
                <p className="font-semibold">{order?.shipping_address?.name}</p>
                <p>{order?.shipping_address?.address}</p>
                <p>
                  {order?.shipping_address?.city}, {order?.shipping_address?.province}
                  {order?.shipping_address?.postalCode && ` ${order.shipping_address.postalCode}`}
                </p>
                <p>📞 {order?.shipping_address?.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6 pb-6 border-b border-amber-200">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.products?.images && item.products.images.length > 0 ? (
                        <img
                          src={item.products.images[0]}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-2xl">🎁</div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 mb-1">
                        {item.products?.name || 'Product'}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-amber-700">
                        <span>₱{Math.round(item.unit_price)} × {item.quantity}</span>
                        <span className="font-semibold">₱{Math.round(item.unit_price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-amber-700">
                <span>Subtotal</span>
                <span className="font-semibold">₱{Math.round(order?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Shipping Fee</span>
                <span className="font-semibold">₱{Math.round(order?.shipping_fee || 0)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-amber-900 pt-3 border-t border-amber-200">
                <span>Total Paid</span>
                <span>₱{Math.round(order?.total_amount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/order-history')}
              className="bg-amber-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-900 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Orders
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-white text-amber-800 font-bold py-3 px-6 rounded-lg border-2 border-amber-800 hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Continue Shopping
            </button>
          </div>

          {/* Email Notification */}
          <div className="mt-6 bg-amber-100 border border-amber-300 rounded-lg p-4 text-center">
            <p className="text-amber-800 text-sm">
              📧 A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentSuccessPage