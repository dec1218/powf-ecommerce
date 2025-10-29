import { useState } from 'react'
import Header from './Header'

const OrderHistoryPage = ({ onBackToHome, onShowLogin, onShowCart }) => {
  const [activeTab, setActiveTab] = useState('history')

  // Sample order data
  const orders = [
    {
      id: 1,
      product: 'Purina Supercoat Adult',
      date: '25-10-2025',
      total: 300.00,
      status: 'Pending'
    },
    {
      id: 2,
      product: 'Leather Dog Collar',
      date: '24-10-2025',
      total: 700.00,
      status: 'Delivered'
    },
    {
      id: 3,
      product: 'Premium Dog Food',
      date: '23-10-2025',
      total: 450.00,
      status: 'Delivered'
    }
  ]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header onShowLogin={onShowLogin} onShowCart={onShowCart} />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button and Title */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBackToHome}
              className="flex items-center text-amber-700 hover:text-amber-900 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900">
              Order History
            </h1>
            
            <div className="w-20"></div> {/* Spacer for centering */}
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
              {/* Order Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-amber-200">
                      <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Product</th>
                      <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Date</th>
                      <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Total</th>
                      <th className="text-left py-4 px-4 text-amber-900 font-bold text-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-amber-100 last:border-0">
                        <td className="py-4 px-4 text-amber-700 font-medium">{order.product}</td>
                        <td className="py-4 px-4 text-amber-700 font-medium">{order.date}</td>
                        <td className="py-4 px-4 text-amber-700 font-medium">
                          ₱{order.total.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'track' && (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Track Your Order</h3>
                <p className="text-amber-600">Enter your order number to track your shipment</p>
                
                <div className="max-w-md mx-auto mt-6">
                  <input
                    type="text"
                    placeholder="Enter order number"
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                  <button className="w-full mt-4 bg-amber-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-900 transition-colors duration-200">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default OrderHistoryPage
