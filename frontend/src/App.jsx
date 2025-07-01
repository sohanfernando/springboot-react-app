import React from 'react'
import { Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import MenPage from './pages/MenPage'
import AboutUsPage from './pages/AboutUsPage'

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/mens' element={<MenPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
      </Routes>
    </div>
  )
}

export default App