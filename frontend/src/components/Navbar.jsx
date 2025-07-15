import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt, FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    user, 
    logout, 
    getCartCount, 
    getWishlistCount 
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();
  const mobileMenuRef = useRef();

  const categories = {
    MEN: ['Shop All', 'T-Shirts', 'Shirts', 'Shorts', 'Joggers & Pants'],
    WOMEN: ['Shop All', 'T-Shirts', 'Crop Tops', 'Dresses', 'Joggers & Pants', 'Shorts', 'Sports Bra'],
    ACCESSORIES: ['Shop All', 'Bags', 'Hats', 'Slides', 'Bottles'],
  };

  const getCategoryLink = (category, item) => {
    if (item === 'Shop All') {
      return category === 'MEN' ? '/men' : category === 'WOMEN' ? '/women' : '/accessories';
    }
    
    if (category === 'MEN') {
      return `/men?category=${encodeURIComponent(item)}`;
    }
    
    if (category === 'WOMEN') {
      return `/women?category=${encodeURIComponent(item)}`;
    }
    
    return '#';
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or filter current page
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>🚚 Free Shipping on Orders Over Rs 5000</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">🔥 New Collection Available</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:+1234567890" className="hover:text-red-200 transition">📞 +94 (76) 797 8321</a>
            <a href="mailto:info@fashionhub.com" className="hover:text-red-200 transition">✉️ info@fashionhub.com</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FashionHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 ml-12">
              {Object.keys(categories).map((category) => (
                <div 
                  key={category}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(category)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    to={category === 'MEN' ? '/men' : category === 'WOMEN' ? '/women' : '/accessories'} 
                    className={`font-medium transition-all duration-200 relative ${
                      isActive(category === 'MEN' ? '/men' : category === 'WOMEN' ? '/women' : '/accessories')
                        ? 'text-red-600'
                        : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    {category}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                  
                  {activeDropdown === category && (
                    <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl py-3 z-50 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {category} Collection
                        </span>
                      </div>
                      {categories[category].map((item) => (
                        <Link
                          key={item}
                          to={getCategoryLink(category, item)}
                          className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <Link 
                to="/latest" 
                className={`font-medium transition-all duration-200 relative ${
                  isActive('/latest') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                }`}
              >
                LATEST
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 hover:w-full"></span>
              </Link>
              
              <Link 
                to="/aboutus" 
                className={`font-medium transition-all duration-200 relative ${
                  isActive('/aboutus') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                }`}
              >
                ABOUT US
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 hover:w-full"></span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                >
                  <FaSearch size={12} />
                </button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-red-600 transition-all duration-200">
                <FaHeart size={20} />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-red-600 transition-all duration-200">
                <FaShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Authentication */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FaUser size={14} className="text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                  </button>
                  
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl py-3 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                          {user.role}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          Wishlist
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-red-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-all duration-200"
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                >
                  <FaSearch size={12} />
                </button>
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-4">
              {Object.keys(categories).map((category) => (
                <div key={category}>
                  <Link
                    to={category === 'MEN' ? '/men' : category === 'WOMEN' ? '/women' : '/accessories'}
                    className={`block py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isActive(category === 'MEN' ? '/men' : category === 'WOMEN' ? '/women' : '/accessories')
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </Link>
                  <div className="ml-4 space-y-2">
                    {categories[category].map((item) => (
                      <Link
                        key={item}
                        to={getCategoryLink(category, item)}
                        className="block py-2 px-4 text-sm text-gray-600 hover:text-red-600 transition-all duration-200"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <Link
                to="/latest"
                className={`block py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/latest') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                LATEST
              </Link>
              
              <Link
                to="/aboutus"
                className={`block py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/aboutus') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                ABOUT US
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;