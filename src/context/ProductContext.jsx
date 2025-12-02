import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products from Supabase on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Simple query without join
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Fetch error:', error)
        throw error
      }
      
      console.log('✅ Products fetched:', data?.length || 0)
      setProducts(data || [])
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      setProducts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Add new product
  const addProduct = async (productData) => {
    try {
      console.log('📦 Adding product:', productData)

      // Get the category UUID from the category name
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('name', productData.category)
        .maybeSingle()

      if (categoryError) {
        console.error('❌ Category lookup error:', categoryError)
      }

      if (!categoryData) {
        console.warn('⚠️ Category not found:', productData.category)
        throw new Error(`Category "${productData.category}" not found. Please select a valid category.`)
      }

      console.log('✅ Category found:', categoryData)

      // Create product with proper data types
      const newProduct = {
        name: productData.productName,
        description: productData.description,
        category_id: categoryData.id,
        price: parseFloat(productData.price),
        sale_price: productData.price2 ? parseFloat(productData.price2) : null,
        stock: parseInt(productData.stock, 10) || 0,
        images: productData.images || [],
        rating: 0,
        is_active: true
      }

      console.log('📤 Inserting product:', newProduct)

      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()

      if (error) {
        console.error('❌ Insert error:', error)
        throw error
      }

      console.log('✅ Product created successfully:', data)

      // Update local state
      setProducts(prev => [data[0], ...prev])
      return data[0]
    } catch (error) {
      console.error('❌ Error adding product:', error)
      throw error
    }
  }

  // Update product - ENHANCED VERSION ✅
  const updateProduct = async (productId, productData) => {
    try {
      console.log('📝 Updating product:', productId, productData)

      // Get category UUID
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', productData.category)
        .single()

      if (categoryError) throw categoryError

      // Prepare update data
      const updateData = {
        name: productData.productName,
        description: productData.description,
        category_id: categoryData.id,
        price: parseFloat(productData.price),
        sale_price: productData.price2 ? parseFloat(productData.price2) : null,
        stock: parseInt(productData.stock, 10) || 0,
        images: productData.images || [] // Include updated images
      }

      console.log('📤 Update data:', updateData)

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)

      if (error) throw error

      console.log('✅ Product updated successfully')

      // Refresh products to get the latest data
      await fetchProducts()
    } catch (error) {
      console.error('❌ Error updating product:', error)
      throw error
    }
  }

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      // Update local state immediately
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Get products by category - Fetch from database with category name
  const getProductsByCategory = async (categoryName) => {
    try {
      // Get category UUID first
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .maybeSingle()

      if (categoryError || !categoryData) {
        console.warn('Category not found:', categoryName)
        return []
      }

      // Get products for this category
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)

      if (productsError) {
        console.error('Error fetching products:', productsError)
        return []
      }

      return productsData || []
    } catch (error) {
      console.error('Error in getProductsByCategory:', error)
      return []
    }
  }

  // Get active products
  const getActiveProducts = () => {
    return products.filter(product => product.is_active)
  }

  // Get all products
  const getAllProducts = () => {
    return products
  }

  // Get product by ID
  const getProductById = (productId) => {
    return products.find(product => product.id === productId)
  }

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getActiveProducts,
    getAllProducts,
    getProductById,
    refreshProducts: fetchProducts
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}