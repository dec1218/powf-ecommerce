// src/context/OrderContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Fetch orders when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [isAuthenticated, user])

  // Fetch all orders for current user
  const fetchOrders = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          shipping_fee,
          shipping_address,
          payment_method,
          payment_status,
          created_at,
          order_items (
            id,
            quantity,
            unit_price,
            color,
            product_id,
            products (
              id,
              name,
              description,
              images
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log('✅ Orders fetched:', data?.length || 0)
      setOrders(data || [])
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  // Get order by order number
  const getOrderByNumber = (orderNumber) => {
    return orders.find(order => order.order_number === orderNumber)
  }

  // Create new order
  const createOrder = async (orderData) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      console.log('📦 Creating order:', orderData)

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: orderData.total_amount,
          shipping_fee: orderData.shipping_fee,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method,
          payment_status: 'pending'
        }])
        .select()
        .single()

      if (orderError) throw orderError

      console.log('✅ Order created:', order.id)

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        color: item.color || null
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      console.log('✅ Order items created:', orderItems.length)

      // Refresh orders
      await fetchOrders()

      return order
    } catch (error) {
      console.error('❌ Error creating order:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update order status (admin only)
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      )

      console.log('✅ Order status updated')
    } catch (error) {
      console.error('❌ Error updating order status:', error)
      throw error
    }
  }

  // Update payment status
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, payment_status: paymentStatus } : order
        )
      )

      console.log('✅ Payment status updated')
    } catch (error) {
      console.error('❌ Error updating payment status:', error)
      throw error
    }
  }

  // Get orders by status
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status)
  }

  // Get pending orders
  const getPendingOrders = () => {
    return getOrdersByStatus('pending')
  }

  // Get delivered orders
  const getDeliveredOrders = () => {
    return getOrdersByStatus('delivered')
  }

  // Calculate total spent
  const getTotalSpent = () => {
    return orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)
  }

  const value = {
    orders,
    loading,
    fetchOrders,
    getOrderById,
    getOrderByNumber,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    getOrdersByStatus,
    getPendingOrders,
    getDeliveredOrders,
    getTotalSpent
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider')
  }
  return context
}