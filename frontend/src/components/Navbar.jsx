import { useState } from 'react';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const categories = {
    MEN: ['Shop All', 'T-Shirts', 'Shirts', 'Shorts', 'Joggers & Pants'],
    WOMEN: ['Shop All', 'Tops', 'Dresses', 'Jeans', 'Activewear'],
    ACCESSORIES: ['Shop All', 'Bags', 'Watches', 'Jewelry', 'Hats', 'Sunglasses'],
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-700">FashionHub</div>

        {/* Category Links */}
        <div className="hidden md:flex space-x-8">
          {Object.keys(categories).map((category) => (
            <div 
              key={category}
              className="relative"
              onMouseEnter={() => setActiveDropdown(category)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-gray-800 hover:text-red-500 font-medium transition">
                {category}
              </button>
              
              {/* Dropdown */}
              {activeDropdown === category && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                  {categories[category].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Static Links */}
          <a href="/latest" className="text-gray-800 hover:text-red-500 font-medium">LATEST</a>
          <a href="/aboutus" className="text-gray-800 hover:text-red-500 font-medium">ABOUT US</a>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search for a Product"
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300 w-64"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Icons */}
          <div className="flex space-x-4">
            <button className="text-gray-700 hover:text-red-500">
              <FaUser size={20} />
            </button>
            <button className="text-gray-700 hover:text-red-500">
              <FaShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;