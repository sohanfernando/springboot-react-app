import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductAlertSection from '../components/ProductAlertSection'
import HeroSection from '../components/HeroSection'
import LatestSection from '../components/LatestSection'
import MenSection from '../components/MenSection'
import WomenSection from '../components/WomenSection'
import AccessoriesSection from '../components/AccessoriesSection'
import promoVideo from '../assets/Videos/1.mp4';
import { FaPlay, FaHeart, FaStar } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className='bg-zinc-950'>
        <Navbar />
        <div className="pt-32"> {/* Add padding for fixed navbar */}
          <HeroSection />
          <LatestSection />

          {/* Modern Video Section */}
          <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Video Section */}
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <video
                      src={promoVideo}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-[400px] lg:h-[650px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <FaPlay className="text-white text-xl ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats */}
                  {/* <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-white text-sm font-semibold">4.9</span>
                      </div>
                      <div className="w-px h-4 bg-white/30"></div>
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-red-400 text-sm" />
                        <span className="text-white text-sm font-semibold">2.5k</span>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Content Section */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-sm font-semibold">Featured Story</span>
                    </div>
                    
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                      Discover Our
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Story</span>
                    </h2>
                    
                    <p className="text-gray-300 text-lg leading-relaxed">
                      From humble beginnings to becoming a leading fitness brand, our journey is defined by passion, 
                      innovation, and an unwavering commitment to quality. Every piece tells a story of dedication 
                      to your fitness goals.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Premium Quality</h3>
                      <p className="text-gray-400 text-sm">Crafted with the finest materials for lasting performance</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Performance Driven</h3>
                      <p className="text-gray-400 text-sm">Designed to enhance your workout and daily activities</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Style & Comfort</h3>
                      <p className="text-gray-400 text-sm">Where fashion meets functionality seamlessly</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Community</h3>
                      <p className="text-gray-400 text-sm">Join thousands of fitness enthusiasts worldwide</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    {/* <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <span>Watch Full Story</span>
                      <FaPlay className="text-sm" />
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </section>

          <MenSection />
          <WomenSection />
          <AccessoriesSection />
          <ProductAlertSection />
        </div>
        <Footer />
    </div>
  )
}

export default HomePage