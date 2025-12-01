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
  const { isAuthenticated, loading, role } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/home" replace />
  if (requireRole && role !== requireRole) return <Navigate to="/home" replace />
  return children
}

function App() {
  const auth = JSON.parse(localStorage.getItem('auth'));
  console.log(auth);
  console.log('profile role:', auth?.user?.role);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Loadingscreen />} />
          <Route path="/home" element={<Homepage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/add-product" element={<AddNewProduct />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/loading" element={<Loadingscreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
