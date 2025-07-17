import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartCount, user, setCart } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState('');

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 5000 ? 0 : 500; // Free shipping over Rs 5000
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!user) {
      setCheckoutError('You must be logged in to checkout.');
      return;
    }
    navigate('/payment', { state: { cart, total: calculateTotal(), user } });
  };

  // Helper to get correct image URL
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads/products/')) return `http://localhost:8080${img}`;
    return `http://localhost:8080/uploads/products/${img}`;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-gray-400 text-3xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors"
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{getCartCount()} items in your cart</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center p-6 border-b border-gray-100 last:border-b-0">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 ml-6">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Color: {item.color} | Size: {item.sizes?.[0] || 'One Size'}
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        Rs {typeof item.price === 'string' ? item.price.replace(/[^0-9.]/g, '') : item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mr-6">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {calculateShipping() === 0 ? 'Free' : `Rs ${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-lg font-bold text-gray-800">
                        Rs {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mb-4"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                {checkoutError && <div className="text-red-500 text-sm mt-2">{checkoutError}</div>}

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  Continue Shopping
                </Link>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Shipping Information</h3>
                  <p className="text-sm text-gray-600">
                    Free shipping on orders over Rs 5,000. Standard delivery takes 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage; 