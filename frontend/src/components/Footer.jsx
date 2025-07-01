import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* MENU Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">MENU</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-red-500">Home</a></li>
            <li><a href="/men" className="hover:text-red-500">Men</a></li>
            <li><a href="/women" className="hover:text-red-500">Women</a></li>
          </ul>
        </div>

        {/* SUPPORT Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">SUPPORT</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-500">FAQ</a></li>
            <li><a href="#" className="hover:text-red-500">Delivery</a></li>
            <li><a href="#" className="hover:text-red-500">Make A Return</a></li>
            <li><a href="#" className="hover:text-red-500">Returns</a></li>
            <li><a href="#" className="hover:text-red-500">Submit A Request</a></li>
          </ul>
        </div>

        {/* MY ACCOUNT Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">MY ACCOUNT</h3>
          <ul className="space-y-2">
            <li><a href="/login" className="hover:text-red-500">Login</a></li>
            <li><a href="/signup" className="hover:text-red-500">Register</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            <a href="#" className="mr-4 hover:text-red-500">Contact Information</a>
            <a href="#" className="mr-4 hover:text-red-500">Refund Policy</a>
            <a href="#" className="mr-4 hover:text-red-500">Shipping Policy</a>
            <a href="#" className="hover:text-red-500">Terms of Service</a>
          </div>
          <div className="text-sm">
            © 2025 | FashionHub | All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;