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
      </Routes>
    </div>
  )
}

export default App