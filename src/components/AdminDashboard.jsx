import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  
  const [products] = useState([
    {
      id: 1,
      name: 'Purina Supercoat Adult',
      image: '🐕',
      price: 300.0,
      stock: 50,
    },
    {
      id: 2,
      name: 'Leather Dog Collar',
      image: '🦴',
      price: 700.0,
      stock: 50,
    },
    {
      id: 3,
      name: 'Premium Dog Food',
      image: '🍖',
      price: 450.0,
      stock: 30,
    },
  ])

  const [orders] = useState([
    {
      id: '1234',
      customerName: 'Pirena',
      date: '25-10-2025',
      status: 'Delivered',
    },
    {
      id: '5678',
      customerName: 'Amihan',
      date: '24-10-2025',
      status: 'Pending',
    },
    {
      id: '9012',
      customerName: 'Miguel',
      date: '23-10-2025',
      status: 'Delivered',
    },
  ])

  const stats = {
    totalProducts: 100,
    totalOrders: 70,
    pending: 20,
    completed: 50,
  }

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

  const handleEditProduct = (productId) => {
    console.log('Edit product:', productId)
  }

  const handleDeleteProduct = (productId) => {
    console.log('Delete product:', productId)
  }

  const handleAddProduct = () => {
    navigate('/add-product')
  }

  const handleLogout = async () => {
    try {
      console.log('👋 Admin logging out...')
      await logout()
      console.log('✅ Logout successful, redirecting to login...')
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Admin Header */}
      <header className="bg-white shadow-md px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-amber-600">Pawfect Shop Management</p>
              </div>
            </div>

            {/* Admin Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Admin Badge */}
              <div className="hidden sm:flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-amber-600 font-medium">Admin</p>
                  <p className="text-sm text-amber-900 font-semibold">{user?.email}</p>
                </div>
              </div>

              {/* View Store Button */}
              <button
                onClick={() => navigate('/home')}
                className="hidden sm:flex items-center space-x-2 bg-amber-200 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>View Store</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"/>
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Admin Info */}
          <div className="sm:hidden mt-4 flex items-center justify-between bg-amber-100 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Admin</p>
                <p className="text-sm text-amber-900 font-semibold">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="bg-amber-200 text-amber-900 px-3 py-1 rounded text-sm font-medium"
            >
              View Store
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
            <p className="text-amber-100">Here's what's happening with your store today.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-amber-700 font-medium">Total Products</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-900">{stats.totalProducts}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-amber-700 font-medium">Total Orders</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-900">{stats.totalOrders}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-amber-700 font-medium">Pending</h3>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-amber-700 font-medium">Completed</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-900">{stats.completed}</p>
            </div>
          </div>

          {/* Add New Product Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Management Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Product Management
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Name</th>
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Price</th>
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Stock</th>
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                            {product.image}
                          </div>
                          <span className="font-medium text-amber-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-amber-700 font-medium">₱{Math.round(product.price)}</td>
                      <td className="py-4 px-4 text-amber-700 font-medium">
                        {product.stock}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Management Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Order Management
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Order ID</th>
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Customer Name</th>
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Date</th>
                    <th className="text-left py-4 px-4 text-amber-900 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                      <td className="py-4 px-4 text-amber-700 font-medium">{order.id}</td>
                      <td className="py-4 px-4 text-amber-700 font-medium">{order.customerName}</td>
                      <td className="py-4 px-4 text-amber-700 font-medium">{order.date}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard