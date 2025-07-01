import React from 'react';

const ProductAlertSection = () => {
  return (
    <div className="bg-gray-100 py-12 px-4 m-7">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-light mb-4 tracking-wide">
          OUR NEWEST PRODUCTS STRAIGHT TO
          <br />
          YOUR INBOX.
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Be the first to know about our products, limited-time offers, community
          <br />
          events, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address"
            className="px-4 py-3 border border-gray-300 rounded-none flex-grow focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors duration-200">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAlertSection;