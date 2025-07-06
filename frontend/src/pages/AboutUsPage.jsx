import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";

const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-32"> {/* Add padding for fixed navbar */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center font-sans">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 uppercase bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              FASHIONHUB - OUR STORY
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-600 mb-8">
              STREETWEAR & LIFESTYLE BRAND IN SRI LANKA
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          <section className="text-left space-y-8 bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div>
              <h2 className="font-bold text-xl md:text-2xl mb-4 text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  F
                </span>
                FashionHub: Born from the Passion for Style
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                What started as a vision over a simple idea became a bold move toward creating standout, affordable streetwear.
                Since its launch, FashionHub has grown into a leading name in lifestyle fashion—catering to individuals who express
                identity through design, comfort, and confidence.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our logo represents individuality and bold spirit—at FashionHub, fashion isn't just clothing, it's a movement.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="font-bold text-xl md:text-2xl mb-4 text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  M
                </span>
                Our Mission: Redefine Everyday Fashion
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                FashionHub is dedicated to helping you make a statement with what you wear. We focus on contemporary design,
                premium materials, and wearable comfort—because fashion should move with you, not restrict you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are always evolving to keep our collections fresh, functional, and ready to wear anywhere—from streets to socials.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="font-bold text-xl md:text-2xl mb-4 text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  E
                </span>
                Experience the Feel of Everyday Luxury
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our pieces are made with carefully selected fabrics, focused on breathable comfort and edgy aesthetics. Whether it's
                laid-back loungewear or bold statement pieces, FashionHub lets you look and feel your best—effortlessly.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-lg italic text-gray-600 text-center font-medium">
                "Join the FashionHub movement—where expression meets everyday style."
              </p>
            </div>
          </section>

          {/* Social Media Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Connect With Us</h3>
            <div className="flex justify-center gap-8 text-3xl">
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaTiktok />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUsPage
