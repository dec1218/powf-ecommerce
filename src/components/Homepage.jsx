import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Hero from './Hero'
import Categories from './Categories'
import Products from './Products'

const Homepage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName)
    navigate(`/category/${categoryName}`)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      <main>
        <Hero />
        <Categories onCategoryClick={handleCategoryClick} />
        <Products onProductClick={handleProductClick} />
      </main>
    </div>
  )
}

export default Homepage