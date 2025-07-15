import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart, getWishlistCount } = useAuth();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-gray-400 text-3xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h1>
              <p className="text-gray-600 mb-8">Start adding items to your wishlist to save them for later.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaArrowLeft />
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{getWishlistCount()} items in your wishlist</p>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <FaTrash className="text-red-500 text-sm" />
                  </button>

                  {/* Availability Badge */}
                  {item.availability === 'out-of-stock' && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-gray-800">
                      Rs {typeof item.price === 'string' ? item.price.replace(/[^0-9.]/g, '') : item.price}
                    </p>
                    {item.color && (
                      <span className="text-sm text-gray-600 capitalize">{item.color}</span>
                    )}
                  </div>

                  {/* Sizes */}
                  {item.sizes && item.sizes.length > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-xs text-gray-500">Sizes:</span>
                      <div className="flex gap-1">
                        {item.sizes.slice(0, 3).map(size => (
                          <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                            {size}
                          </span>
                        ))}
                        {item.sizes.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.sizes.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.availability === 'out-of-stock'}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        item.availability === 'out-of-stock'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md'
                      }`}
                    >
                      <FaShoppingBag size={14} />
                      {item.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage; 