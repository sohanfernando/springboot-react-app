import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaRegEye, FaShoppingBag, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads/products/')) return `http://localhost:8080${img}`;
  return `http://localhost:8080/uploads/products/${img}`;
};

const ProductCard = ({ image, title, price, color, availability, sizes, id }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useAuth();

  const isWishlisted = isInWishlist(id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (availability !== 'out-of-stock') {
      addToCart({
        id,
        image,
        title,
        price,
        color,
        availability,
        sizes
      });
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist({
      id,
      image,
      title,
      price,
      color,
      availability,
      sizes
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative p-3">
        <Link to={`/product/${id}`} className="block">
          <img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-[400px] object-cover rounded-md mx-auto group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" size={14} />
          ) : (
            <FaRegHeart className="text-gray-600" size={14} />
          )}
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
            <Link to={`/product/${id}`} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-200">
              <FaRegEye size={12} />
            </Link>
            <button 
              onClick={handleAddToCart}
              disabled={availability === 'out-of-stock'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                availability === 'out-of-stock'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <FaShoppingBag size={12} />
            </button>
          </div>
        </div>

        {/* Availability Badge */}
        {availability === 'out-of-stock' && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-auto p-4 bg-white rounded-b-xl text-black">
        <h3 className="font-semibold text-sm min-h-[40px] line-clamp-2 mb-2">{title}</h3>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-gray-900">{price}</p>
          {color && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Color:</span>
              <span className="text-xs font-medium capitalize">{color}</span>
            </div>
          )}
        </div>

        {/* Sizes */}
        {sizes && sizes.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-gray-500">Sizes:</span>
            <div className="flex gap-1">
              {sizes.map(size => (
                <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={availability === 'out-of-stock'}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            availability === 'out-of-stock'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md'
          }`}
        >
          {availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
