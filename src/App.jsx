// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Loadingscreen from './components/Loadingscreen'
import Homepage from './components/Homepage'
import AdminDashboard from './components/admin/AdminDashboard'
import CartPage from './components/CartPage'
import Categories from './components/Categories'
import CategoryPage from './components/CategoryPage'
import CheckoutPage from './components/CheckoutPage'
import Hero from './components/Hero'
import Login from './components/Login'
import OrderHistoryPage from './components/OrderHistoryPage'
import ProductDetailsPage from './components/ProductDetailsPage'
import Products from './components/AdminProducts'
import ProfilePage from './components/ProfilePage'
import Signup from './components/Signup'
import Receipt from './components/Receipt'
import PaymentPage from './components/PaymentPage'
import PaymentSuccessPage from './components/PaymentSuccessPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

// Protected Route - For pages that require authentication
const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, authChecked, role } = useAuth()
  
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-amber-900 text-xl">Loading...</div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requireRole && role !== requireRole) {
    return <Navigate to="/home" replace />
  }
  
  return children
}

// Guest Route - For login/signup pages (only accessible when NOT logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, authChecked, role } = useAuth()
  
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-amber-900 text-xl">Loading...</div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/home" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <Routes>
              <Route path="/" element={<Loadingscreen />} />
              <Route path="/home" element={<Homepage />} />
              
              {/* Guest Routes - Only accessible when NOT logged in */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <GuestRoute>
                    <Signup />
                  </GuestRoute>
                }
              />
              
              {/* Admin Routes - Protected, requires admin role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-history"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipt"
                element={
                  <ProtectedRoute>
                    <Receipt />
                  </ProtectedRoute>
                }
              />
              {/* Payment Routes - Add these */}
              <Route
                  path="/payment/:orderId"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
              <Route
                  path="/payment-success/:orderId"
                  element={
                    <ProtectedRoute>
                      <PaymentSuccessPage />
                    </ProtectedRoute>
                  }
                />
                
              {/* Public Routes - Accessible to everyone */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/hero" element={<Hero />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App