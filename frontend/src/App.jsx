import React from 'react'
import { Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default App