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

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path='/men' element={<MenPage />} />
        <Route path='/women' element={<WomenPage />} />
        <Route path='/accessories' element={<AccessoriesPage />} />
        <Route path='/latest' element={<LatestPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
      </Routes>
    </div>
  )
}

export default App