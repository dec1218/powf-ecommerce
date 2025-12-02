// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Loadingscreen from './components/LoadingScreen'
import Homepage from './components/Homepage'
import AdminDashboard from './components/AdminDashboard'
import AddNewProduct from './components/AddNewProduct'
import CartPage from './components/CartPage'
import Categories from './components/Categories'
import CategoryPage from './components/CategoryPage'
import CheckoutPage from './components/CheckoutPage'
import Hero from './components/Hero'
import Login from './components/Login'
import OrderHistoryPage from './components/OrderHistoryPage'
import ProductDetailsPage from './components/ProductDetailsPage'
import Products from './components/Products'
import ProfilePage from './components/ProfilePage'
import Signup from './components/Signup'
import { AuthProvider, useAuth } from './context/AuthContext'
import Receipt from './components/Receipt'

// Protected Route - For pages that require authentication
const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, authChecked, role } = useAuth()
  
  // Wait for auth to be checked before rendering
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-amber-900 text-xl">Loading...</div>
      </div>
    )
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // If role is required and doesn't match, redirect to home
  if (requireRole && role !== requireRole) {
    return <Navigate to="/home" replace />
  }
  
  return children
}

// Guest Route - For login/signup pages (only accessible when NOT logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, authChecked, role } = useAuth()
  
  // Wait for auth to be checked before rendering
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-amber-900 text-xl">Loading...</div>
      </div>
    )
  }
  
  // If already authenticated, redirect based on role
  if (isAuthenticated) {
    // Admin goes to admin dashboard, regular user goes to home
    if (role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/home" replace />
  }
  
  // Not authenticated, show the guest page (login/signup)
  return children
}

function AppRoutes() {
  return (
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
      
      {/* Public Routes - Accessible to everyone */}
      <Route path="/add-product" element={<AddNewProduct />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/loading" element={<Loadingscreen />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App