import React from 'react'
import { Routes, Route } from 'react-router'

import CustomerLayout from './components/CustomerLayout'
import AdminLayout from './components/admin/AdminLayout'

// Customer side
import HomePage from './pages/HomePage'
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
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import PaymentPage from './pages/PaymentPage'

// Admin side
import AdminHomePage from './pages/AdminHomePage'
import AdminCatalogPage from './pages/AdminCatalogPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminPaymentsPage from './pages/AdminPaymentsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminSignupPage from './pages/AdminSignupPage'

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <Routes>
        {/* Storefront — nav, footer, smooth scroll and preloader are all
            supplied by the layout instead of by each page. */}
        <Route element={<CustomerLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/men' element={<MenPage />} />
          <Route path='/women' element={<WomenPage />} />
          <Route path='/accessories' element={<AccessoriesPage />} />
          <Route path='/latest' element={<LatestPage />} />
          <Route path='/aboutus' element={<AboutUsPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/product/:productId' element={<ProductDetailPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/order-confirmation' element={<OrderConfirmationPage />} />
        </Route>

        {/* Admin — the layout supplies the rail and guards every route inside it. */}
        <Route element={<AdminLayout />}>
          <Route path='/admin' element={<AdminHomePage />} />
          <Route path='/admin/catalog' element={<AdminCatalogPage />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route path='/admin/payments' element={<AdminPaymentsPage />} />
          <Route path='/admin/users' element={<AdminUsersPage />} />
          <Route path='/admin/settings' element={<AdminSettingsPage />} />
        </Route>

        {/* Admin auth sits outside the guarded layout. */}
        <Route path='/admin-login' element={<AdminLoginPage />} />
        <Route path='/admin-signup' element={<AdminSignupPage />} />
      </Routes>
    </div>
  )
}

export default App
