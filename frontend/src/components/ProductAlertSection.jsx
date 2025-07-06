import React, { useState } from 'react';
import { FaEnvelope, FaArrowRight, FaBell, FaGift, FaFire } from 'react-icons/fa';

const ProductAlertSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Here you would typically send the email to your backend
      console.log('Email subscribed:', email);
      setEmail('');
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="text-center">
          
          {/* Icon and Badge */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <FaBell className="text-white text-xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <FaFire className="text-red-600 text-xs" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Stay Ahead of the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Game</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            Get exclusive access to our latest fitness gear, early-bird discounts, and 
            <span className="text-red-400 font-semibold"> VIP member benefits</span> before anyone else.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FaGift className="text-red-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm">Exclusive Offers</h3>
              <p className="text-gray-400 text-xs">First access to sales and limited editions</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FaFire className="text-red-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm">New Arrivals</h3>
              <p className="text-gray-400 text-xs">Be the first to know about fresh drops</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FaBell className="text-red-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm">Fitness Tips</h3>
              <p className="text-gray-400 text-xs">Expert advice and workout inspiration</p>
            </div>
          </div>

          {/* Email Signup Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>Subscribe</span>
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-green-400 font-semibold mb-2">Successfully Subscribed!</h3>
                <p className="text-gray-300 text-sm">You'll receive our latest updates and exclusive offers.</p>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Join 50,000+ fitness enthusiasts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default ProductAlertSection;