import { useState } from 'react'

const AdminDashboard = ({ onShowAddProduct, onLogout }) => {
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

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header - simplified (logo/search/profile/cart removed) */}
      <header className="bg-amber-50 px-4 py-4 sm:px-6 lg:px-8 border-b-2 border-amber-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-900">
            Dashboard
          </h2>
          <button
            onClick={onLogout}
            className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-medium"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-amber-700 font-medium mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-amber-900">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-amber-700 font-medium mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-amber-900">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-amber-700 font-medium mb-2">Pending</h3>
              <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-amber-700 font-medium mb-2">Completed</h3>
              <p className="text-3xl font-bold text-amber-900">
                {stats.completed}
              </p>
            </div>
          </div>

          {/* Add New Product Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onShowAddProduct}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-semibold"
            >
              Add New Product
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
                    <tr key={product.id} className="border-b border-amber-100 last:border-0">
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
                      <td className="py-4 px-4 text-amber-700 font-medium">
                        P{product.price.toFixed(2)}
                      </td>
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
                    <tr key={order.id} className="border-b border-amber-100 last:border-0">
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
