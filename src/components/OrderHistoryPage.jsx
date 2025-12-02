import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../context/OrderContext'
import Header from './Header'

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('history')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  const navigate = useNavigate()
  const { orders, loading, getOrderByNumber } = useOrders()

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-purple-600 bg-purple-100'
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'refunded':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleTrackOrder = () => {
    if (!trackingNumber.trim()) {
      alert('Please enter an order number')
      return
    }

    const order = getOrderByNumber(trackingNumber.trim())
    
    if (order) {
      setTrackingResult(order)
    } else {
      setTrackingResult(null)
      alert('Order not found. Please check your order number.')
    }
  }

  const getOrderStatus = (status) => {
    const statuses = {
      pending: { step: 1, text: 'Order Placed', icon: '📋' },
      confirmed: { step: 2, text: 'Confirmed', icon: '✅' },
      processing: { step: 3, text: 'Processing', icon: '📦' },
      shipped: { step: 4, text: 'Shipped', icon: '🚚' },
      delivered: { step: 5, text: 'Delivered', icon: '🎉' },
      cancelled: { step: 0, text: 'Cancelled', icon: '❌' }
    }
    return statuses[status?.toLowerCase()] || statuses.pending
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button and Title */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-amber-700 hover:text-amber-900 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900">
              Order History
            </h1>
            
            <div className="w-20"></div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-white text-amber-900 shadow-lg border-2 border-amber-200'
                  : 'bg-transparent text-amber-700 border-2 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'track'
                  ? 'bg-white text-amber-900 shadow-lg border-2 border-amber-200'
                  : 'bg-transparent text-amber-700 border-2 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Track Order
            </button>
          </div>

          {/* Order Content */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
                  <p className="text-amber-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">No Orders Yet</h3>
                  <p className="text-amber-600 mb-6">Start shopping to see your orders here!</p>
                  <button
                    onClick={() => navigate('/home')}
                    className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-amber-200">
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Order #</th>
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Date</th>
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Items</th>
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Total</th>
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Payment</th>
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Status</th>
                        <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0
                        const firstItem = order.order_items?.[0]
                        
                        return (
                          <tr key={order.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-semibold text-amber-900 text-sm">
                                  {order.order_number}
                                </div>
                                <div className="text-xs text-amber-600">
                                  {order.payment_method}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-amber-700 font-medium">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {firstItem?.products?.images?.[0] && (
                                  <img
                                    src={firstItem.products.images[0]}
                                    alt={firstItem.products.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-amber-900">
                                    {firstItem?.products?.name || 'Product'}
                                  </div>
                                  <div className="text-xs text-amber-600">
                                    {itemCount} item{itemCount !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-amber-700 font-bold">
                              ₱{Math.round(parseFloat(order.total_amount))}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                                {order.payment_status?.toUpperCase() || 'PENDING'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => {
                                  setActiveTab('track')
                                  setTrackingNumber(order.order_number)
                                  setTrackingResult(order)
                                }}
                                className="text-amber-800 hover:text-amber-900 font-medium text-sm underline"
                              >
                                Track
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'track' && (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Track Your Order</h3>
                  <p className="text-amber-600">Enter your order number to track your shipment</p>
                </div>
                
                <div className="mb-6">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                    placeholder="Enter order number (e.g., ORD-1234567890)"
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={handleTrackOrder}
                    className="w-full mt-4 bg-amber-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-900 transition-colors duration-200"
                  >
                    Track Order
                  </button>
                </div>

                {/* Tracking Result */}
                {trackingResult && (
                  <div className="mt-8 border-2 border-amber-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-amber-900">
                          Order #{trackingResult.order_number}
                        </h4>
                        <p className="text-sm text-amber-600">
                          Placed on {formatDate(trackingResult.created_at)}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingResult.status)}`}>
                        {trackingResult.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    {/* Order Status Timeline */}
                    <div className="space-y-4">
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((statusKey, index) => {
                        const currentStatus = getOrderStatus(trackingResult.status)
                        const statusInfo = getOrderStatus(statusKey)
                        const isActive = currentStatus.step >= statusInfo.step
                        const isCurrent = trackingResult.status?.toLowerCase() === statusKey
                        
                        return (
                          <div key={statusKey} className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-amber-800 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {isActive ? '✓' : index + 1}
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold ${isCurrent ? 'text-amber-900' : isActive ? 'text-amber-700' : 'text-gray-500'}`}>
                                {statusInfo.icon} {statusInfo.text}
                              </div>
                              {isCurrent && (
                                <div className="text-xs text-amber-600 mt-1">Current status</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Order Items */}
                    <div className="mt-6 pt-6 border-t border-amber-200">
                      <h5 className="font-semibold text-amber-900 mb-4">Order Items</h5>
                      <div className="space-y-3">
                        {trackingResult.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 bg-amber-50 p-3 rounded-lg">
                            {item.products?.images?.[0] && (
                              <img
                                src={item.products.images[0]}
                                alt={item.products.name}
                                className="w-16 h-16 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-amber-900">{item.products?.name}</div>
                              <div className="text-sm text-amber-600">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-bold text-amber-900">
                              ₱{Math.round(parseFloat(item.unit_price) * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-amber-200">
                      <div className="space-y-2">
                        <div className="flex justify-between text-amber-700">
                          <span>Subtotal</span>
                          <span className="font-semibold">
                            ₱{Math.round(parseFloat(trackingResult.total_amount) - parseFloat(trackingResult.shipping_fee || 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-amber-700">
                          <span>Shipping Fee</span>
                          <span className="font-semibold">₱{Math.round(parseFloat(trackingResult.shipping_fee || 0))}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-amber-900 pt-2 border-t border-amber-200">
                          <span>Total</span>
                          <span>₱{Math.round(parseFloat(trackingResult.total_amount))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-6 pt-6 border-t border-amber-200">
                      <h5 className="font-semibold text-amber-900 mb-2">Shipping Address</h5>
                      <div className="text-sm text-amber-700">
                        <p>{trackingResult.shipping_address?.fullName}</p>
                        <p>{trackingResult.shipping_address?.address}</p>
                        <p>{trackingResult.shipping_address?.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default OrderHistoryPage