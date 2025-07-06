import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">FashionHub</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering your active lifestyle with premium fitness wear. 
                Designed for performance, built for comfort.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <FaInstagram className="text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <FaFacebook className="text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <FaTiktok className="text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/men" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/latest" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Latest Arrivals
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Customer Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Stay Connected</h3>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">
                Get exclusive offers and fitness tips delivered to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-sm"
                />
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-r-md transition-colors duration-300">
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <FaEnvelope className="mr-2 text-red-500" />
                <span>support@fashionhub.com</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <FaPhone className="mr-2 text-red-500" />
                <span>+94 (76) 797-8321</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                <span>214 Modera St, Colombo, 01500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 FashionHub. All rights reserved. Made with{' '}
              <FaHeart className="inline text-red-500 mx-1" />
              for fitness enthusiasts.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Motivation Bar */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-semibold text-sm">
            🏃‍♀️ Transform your fitness journey with premium activewear. Free shipping on orders over Rs.5000! 🏃‍♂️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;