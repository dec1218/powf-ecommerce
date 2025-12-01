import { useState } from 'react'
import Header from './Header'
import Hero from './Hero'
import Categories from './Categories'
import Products from './Products'
import Login from './Login'
import Signup from './Signup'
import CategoryPage from './CategoryPage'
import ProfilePage from './ProfilePage'
import ProductDetailsPage from './ProductDetailsPage'
import CartPage from './CartPage'
import CheckoutPage from './CheckoutPage'
import OrderHistoryPage from './OrderHistoryPage'

const Homepage = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [currentView, setCurrentView] = useState('login')
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleShowLogin = () => {
    setShowLogin(true)
    setCurrentView('login')
  }

  const handleShowSignup = () => {
    setShowLogin(true)
    setCurrentView('signup')
  }

  const handleCloseAuth = () => {
    setShowLogin(false)
    setShowSignup(false)
  }

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName)
    setCurrentPage('category')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setSelectedCategory('')
  }

  const handleShowProfile = () => {
    setCurrentPage('profile')
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setCurrentPage('product-details')
  }

  const handleAddToCart = (product) => {
    // Add product to cart and navigate to cart page
    setCurrentPage('cart')
  }

  const handleShowCart = () => {
    setCurrentPage('cart')
  }

  const handleProceedCheckout = () => {
    setCurrentPage('checkout')
  }

  const handleShowOrderHistory = () => {
    setCurrentPage('order-history')
  }

  const switchToSignup = () => setCurrentView('signup')
  const switchToLogin = () => setCurrentView('login')

  if (showLogin) {
    return (
      <>
        {currentView === 'login' ? (
          <Login onSwitchToSignup={switchToSignup} onClose={handleCloseAuth} />
        ) : (
          <Signup onSwitchToLogin={switchToLogin} onClose={handleCloseAuth} />
        )}
      </>
    )
  }

  if (currentPage === 'category') {
    return (
      <CategoryPage 
        categoryName={selectedCategory}
        onBackToHome={handleBackToHome}
        onShowLogin={handleShowLogin}
        onProductClick={handleProductClick}
      />
    )
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage 
        onBackToHome={handleBackToHome}
        onShowLogin={handleShowLogin}
        onShowOrderHistory={handleShowOrderHistory}
      />
    )
  }

  if (currentPage === 'order-history') {
    return (
      <OrderHistoryPage 
        onBackToHome={handleBackToHome}
        onShowLogin={handleShowLogin}
        onShowCart={handleShowCart}
      />
    )
  }

  if (currentPage === 'product-details') {
    return (
      <ProductDetailsPage 
        product={selectedProduct}
        onBackToHome={handleBackToHome}
        onShowLogin={handleShowLogin}
        onAddToCart={handleAddToCart}
      />
    )
  }

  if (currentPage === 'cart') {
    return (
      <CartPage 
        onBackToHome={handleBackToHome}
        onShowLogin={handleShowLogin}
        onProceedCheckout={handleProceedCheckout}
      />
    )
  }

  if (currentPage === 'checkout') {
    return (
      <CheckoutPage 
        onBackToHome={handleBackToHome}
        onShowLogin={handleShowLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
  <Header onShowLogin={handleShowLogin} onShowCart={handleShowCart} />
      <main>
        <Hero />
        <Categories onCategoryClick={handleCategoryClick} />
        <Products onProductClick={handleProductClick} />
      </main>
    </div>
  )
}

export default Homepage
