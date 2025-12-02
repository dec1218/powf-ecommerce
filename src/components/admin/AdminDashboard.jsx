import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import AdminHeader from './AdminHeader'
import StatsCards from './StatsCards'
import ProductManagement from './ProductManagement'
import OrderManagement from './OrderManagement'
import PaymentManagement from './PaymentManagement'
import AddProductModal from './AddProductModal'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { getAllProducts, addProduct, deleteProduct } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get products from context
  const products = getAllProducts()

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

  const [payments] = useState([
    {
      id: 1,
      transactionId: 'TXN-001',
      customerName: 'Pirena',
      amount: 600.0,
      paymentMethod: 'BI SCAN',
      status: 'Paid',
      date: '25-10-2025',
    },
    {
      id: 2,
      transactionId: 'TXN-002',
      customerName: 'Amihan',
      amount: 700.0,
      paymentMethod: 'Maya',
      status: 'Pending',
      date: '24-10-2025',
    },
    {
      id: 3,
      transactionId: 'TXN-003',
      customerName: 'Miguel',
      amount: 450.0,
      paymentMethod: 'Cash',
      status: 'Paid',
      date: '23-10-2025',
    },
  ])

  // Calculate stats dynamically
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Delivered').length,
  }

  const handleEditProduct = (productId) => {
    console.log('Edit product:', productId)
    alert('Edit functionality - coming soon!')
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId)
      alert('Product deleted successfully!')
    }
  }

  const handleAddProduct = () => {
    setIsModalOpen(true)
  }

  const handleSaveProduct = (formData) => {
    try {
      addProduct(formData)
      setIsModalOpen(false)
      alert('Product added successfully! ✅')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to add product')
    }
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

  const handleViewStore = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <AdminHeader 
        user={user} 
        onLogout={handleLogout} 
        onViewStore={handleViewStore} 
      />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
            <p className="text-amber-100">Here's what's happening with your store today.</p>
          </div>

          <StatsCards stats={stats} />
          <ProductManagement 
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
          />
          <OrderManagement orders={orders} />
          <PaymentManagement payments={payments} />
        </div>
      </main>

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  )
}

export default AdminDashboard