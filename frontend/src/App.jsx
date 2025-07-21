import React from 'react'
import { Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import AdminHomePage from './pages/AdminHomePage'
import MenPage from './pages/MenPage'
import WomenPage from './pages/WomenPage'
import AccessoriesPage from './pages/AccessoriesPage'
import LatestPage from './pages/LatestPage'
import AboutUsPage from './pages/AboutUsPage'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import AdminSignupPage from './pages/AdminSignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/men' element={<MenPage />} />
        <Route path='/women' element={<WomenPage />} />
        <Route path='/accessories' element={<AccessoriesPage />} />
        <Route path='/latest' element={<LatestPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />

        {/* Authentication Routes (redirect if already logged in) */}
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={
          <ProtectedRoute requireAuth={false}>
            <SignUpPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-login" element={
          <ProtectedRoute requireAuth={false}>
            <AdminLoginPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-signup" element={
          <ProtectedRoute requireAuth={false}>
            <AdminSignupPage />
          </ProtectedRoute>
        } />

        {/* Protected User Routes */}
        <Route path="/cart" element={
          <ProtectedRoute requireAuth={true}>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute requireAuth={true}>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requireAuth={true}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute requireAuth={true}>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute requireAuth={true}>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute requireAuth={true}>
            <OrderConfirmationPage />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminHomePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsersPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App