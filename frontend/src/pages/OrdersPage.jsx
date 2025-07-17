import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8080/api/orders');
        // Filter orders for this user
        const userOrders = Array.isArray(res.data)
          ? res.data.filter(order => order.userId === user.id)
          : [];
        setOrders(userOrders);
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'confirmed':
        return <FaCheckCircle className="text-blue-500" />;
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your orders</h1>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Go to Login
            </Link>
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
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600">Track your order history and current orders</p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBox className="text-gray-400 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8">Start shopping to see your orders here.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Order {order.id}</h3>
                        {/* <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p> */}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                        <span className="text-lg font-bold text-gray-800">Rs {order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {(() => {
                        let items = order.items;
                        if (typeof items === 'string') {
                          try { items = JSON.parse(items); } catch { items = []; }
                        }
                        return Array.isArray(items) ? items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={
                                      item.image.startsWith('http')
                                        ? item.image
                                        : `http://localhost:8080/uploads/products/${item.image.replace(/^\/uploads\/products\//, '')}`
                                    }
                                    alt={item.title || item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <FaBox className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{item.title || item.name}</h4>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-medium text-gray-800">Rs {item.price}</span>
                          </div>
                        )) : null;
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage; 