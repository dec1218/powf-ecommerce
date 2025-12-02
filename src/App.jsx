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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Loadingscreen />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Admin Routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* User Routes - Some Protected */}
      <Route path="/add-product" element={<AddNewProduct />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/receipt" element={<Receipt />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/loading" element={<Loadingscreen />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/products" element={<Products />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
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