import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const ProductManagement = ({ products, onEdit, onDelete, onAdd }) => {
  const [categoriesMap, setCategoriesMap] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch categories on mount to map category_id to category name
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
        
        if (error) throw error
        
        // Create a map: { "uuid-123": "Foods", "uuid-456": "Toys", ... }
        const map = {}
        data.forEach(cat => {
          map[cat.id] = cat.name
        })
        setCategoriesMap(map)
        console.log('✅ Categories loaded:', map)
      } catch (error) {
        console.error('❌ Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Helper function to get category name from category_id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Uncategorized'
    return categoriesMap[categoryId] || 'Uncategorized'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">
          Product Management
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product</span>
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto"></div>
          <p className="text-amber-600 mt-2 text-sm">Loading categories...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-amber-200">
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Name</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Category</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Price</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Stock</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-amber-600">
                    No products yet. Click "Add New Product" to get started!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">🎁</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-amber-900 block">
                            {product.name}
                          </span>
                          <span className="text-xs text-amber-600">
                            {product.images && product.images.length > 0 
                              ? `${product.images.length} image${product.images.length > 1 ? 's' : ''}`
                              : 'No images'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-amber-700 font-medium">
                      ₱{Math.round(product.price)}
                      {product.sale_price && (
                        <span className="block text-xs text-green-600 font-semibold">
                          Sale: ₱{Math.round(product.sale_price)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-bold ${
                        product.stock === 0 
                          ? 'text-red-600' 
                          : product.stock < 5 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(product.id)}
                          className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductManagement