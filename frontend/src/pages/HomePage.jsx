import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductAlertSection from '../components/ProductAlertSection'
import HeroSection from '../components/HeroSection'
import LatestSection from '../components/LatestSection'
import MenSection from '../components/MenSection'
import WomenSection from '../components/WomenSection'

const HomePage = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <LatestSection />
        <MenSection />
        <WomenSection />
        <ProductAlertSection />
        <Footer />
    </div>
  )
}

export default HomePage