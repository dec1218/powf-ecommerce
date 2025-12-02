// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Fetch cart items when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartItems()
    } else {
      // Clear cart when user logs out
      setCartItems([])
    }
  }, [isAuthenticated, user])

  // Fetch cart items from database
  const fetchCartItems = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          selected,
          color,
          product_id,
          products (
            id,
            name,
            description,
            price,
            sale_price,
            stock,
            images,
            rating
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to include product info at root level
      const transformedData = data.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products.name,
        description: item.products.description,
        price: item.products.sale_price || item.products.price,
        originalPrice: item.products.price,
        stock: item.products.stock,
        images: item.products.images,
        rating: item.products.rating,
        quantity: item.quantity,
        selected: item.selected,
        color: item.color
      }))

      setCartItems(transformedData)
      console.log('✅ Cart items fetched:', transformedData.length)
    } catch (error) {
      console.error('❌ Error fetching cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart
  const addToCart = async (product, quantity = 1, color = null) => {
    if (!user) {
      alert('Please login to add items to cart')
      return false
    }

    try {
      setLoading(true)

      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('color', color)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id)

        if (updateError) throw updateError
        console.log('✅ Cart item quantity updated')
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            product_id: product.id,
            quantity,
            color,
            selected: true
          }])

        if (insertError) throw insertError
        console.log('✅ Item added to cart')
      }

      // Refresh cart
      await fetchCartItems()
      return true
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      alert('Failed to add item to cart')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)

      if (error) throw error

      // Update local state
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (error) {
      console.error('❌ Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  // Toggle item selection
  const toggleSelect = async (cartItemId) => {
    try {
      const item = cartItems.find(i => i.id === cartItemId)
      if (!item) return

      const { error } = await supabase
        .from('cart_items')
        .update({ selected: !item.selected })
        .eq('id', cartItemId)

      if (error) throw error

      // Update local state
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, selected: !item.selected } : item
        )
      )
    } catch (error) {
      console.error('❌ Error toggling selection:', error)
    }
  }

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error

      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== cartItemId))
      console.log('✅ Item removed from cart')
    } catch (error) {
      console.error('❌ Error removing from cart:', error)
      alert('Failed to remove item')
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setCartItems([])
      console.log('✅ Cart cleared')
    } catch (error) {
      console.error('❌ Error clearing cart:', error)
    }
  }

  // Get selected items only
  const getSelectedItems = () => {
    return cartItems.filter(item => item.selected)
  }

  // Calculate totals
  const getCartTotals = () => {
    const selectedItems = getSelectedItems()
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingFee = selectedItems.length > 0 ? 150 : 0
    const total = subtotal + shippingFee

    return {
      subtotal,
      shippingFee,
      total,
      itemCount: selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  }

  // Get total cart count (all items)
  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    toggleSelect,
    removeFromCart,
    clearCart,
    getSelectedItems,
    getCartTotals,
    getCartCount,
    refreshCart: fetchCartItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}