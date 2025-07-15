import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;
  const items = order && typeof order.items === 'string' ? JSON.parse(order.items) : order?.items || [];

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center text-gray-500 text-lg">No order found.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Thank you for your order!</h1>
          <p className="text-lg text-gray-700 mb-6">Your order has been placed successfully.</p>
          <div className="mb-6">
            <div className="font-semibold text-gray-800">Order ID: <span className="text-blue-600">{order.id}</span></div>
            <div className="mt-2 text-gray-700">Total: <span className="font-bold">Rs {order.total}</span></div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Items:</h2>
            <ul className="text-left">
              {items.map((item, idx) => (
                <li key={idx} className="mb-1">{item.title} x {item.quantity}</li>
              ))}
            </ul>
          </div>
          <Link to="/" className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">Continue Shopping</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage; 