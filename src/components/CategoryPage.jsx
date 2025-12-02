import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from './Header'
import { useProducts } from '../context/ProductContext'

const CategoryPage = ({ onShowLogin, onProductClick }) => {
  const { id: categoryName } = useParams()
  const navigate = useNavigate()
  const { getProductsByCategory } = useProducts()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true)
      const categoryProducts = await getProductsByCategory(categoryName)
      setProducts(categoryProducts)
      setLoading(false)
    }

    fetchCategoryProducts()
  }, [categoryName])

  const handleBackToHome = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header onShowLogin={onShowLogin} />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          {/* Category Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 uppercase">
              {categoryName}
            </h1>
            {!loading && (
              <p className="text-amber-600 mt-2">
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
              <p className="text-amber-600 mt-4">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">No Products Yet</h3>
                  <p className="text-amber-600">Products in this category will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 group"
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-200 flex items-center justify-center p-8 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-6xl">🎁</div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="p-6">
                        <h3 className="font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors text-lg">
                          {product.name}
                        </h3>
                        
                        <p className="text-amber-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-amber-600 ml-2">({product.rating || 0})</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            {product.sale_price ? (
                              <>
                                <span className="text-2xl font-bold text-amber-900">₱{Math.round(product.sale_price)}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">₱{Math.round(product.price)}</span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-amber-900">₱{Math.round(product.price)}</span>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              if (onProductClick) {
                                onProductClick(product)
                              } else {
                                navigate(`/product/${product.id}`)
                              }
                            }}
                            className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-medium"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default CategoryPage