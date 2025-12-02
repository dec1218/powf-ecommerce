import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { supabase } from '../../lib/supabase'
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
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  // Get products from context
  const products = getAllProducts()

  // Fetch orders and payments on mount
  useEffect(() => {
    fetchOrdersAndPayments()
  }, [])

  const fetchOrdersAndPayments = async () => {
    try {
      setLoading(true)
      console.log('📦 Fetching orders and payments...')

      // Fetch all orders with user info
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      console.log('✅ Orders fetched:', ordersData?.length || 0)
      setOrders(ordersData || [])

      // Transform orders into payments data
      const paymentsData = ordersData?.map(order => ({
        id: order.id,
        transactionId: order.order_number,
        customerName: order.users?.full_name || order.users?.email?.split('@')[0] || 'Unknown',
        amount: parseFloat(order.total_amount),
        paymentMethod: order.payment_method,
        status: order.payment_status,
        date: new Date(order.created_at).toLocaleDateString('en-PH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      })) || []

      setPayments(paymentsData)
      console.log('✅ Payments processed:', paymentsData.length)
    } catch (error) {
      console.error('❌ Error fetching orders/payments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats dynamically
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'delivered').length,
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

  const handleSaveProduct = async (formData) => {
    try {
      await addProduct(formData)
      setIsModalOpen(false)
      alert('Product added successfully! ✅')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to add product')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('📝 Updating order status:', orderId, newStatus)

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      // Refresh orders
      await fetchOrdersAndPayments()
      alert(`✅ Order status updated to ${newStatus}!`)
    } catch (error) {
      console.error('❌ Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      console.log('💳 Updating payment status:', orderId, newPaymentStatus)

      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus })
        .eq('id', orderId)

      if (error) throw error

      // Refresh orders
      await fetchOrdersAndPayments()
      alert(`✅ Payment status updated to ${newPaymentStatus}!`)
    } catch (error) {
      console.error('❌ Error updating payment:', error)
      alert('Failed to update payment status')
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
          
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 mb-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
              <p className="text-amber-600">Loading orders and payments...</p>
            </div>
          ) : (
            <>
              <OrderManagement 
                orders={orders} 
                onUpdateStatus={handleUpdateOrderStatus}
              />
              <PaymentManagement 
                payments={payments}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
            </>
          )}
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