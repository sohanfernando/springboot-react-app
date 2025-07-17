import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import AdminProductManager from '../components/AdminProductManager';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import axios from 'axios';

const AdminHomePage = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({ products: 0, orders: 0, users: 0 });

  React.useEffect(() => {
    if (!admin || admin.role !== 'ADMIN') {
      navigate('/admin-login');
    }
  }, [admin, navigate]);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get('http://localhost:8080/admin/products'),
          axios.get('http://localhost:8080/api/orders'),
          axios.get('http://localhost:8080/users'),
        ]);
        console.log('Products:', productsRes.data);
        console.log('Orders:', ordersRes.data);
        console.log('Users:', usersRes.data);
        setStats({
          products: Array.isArray(productsRes.data) ? productsRes.data.length : (Array.isArray(productsRes.data.content) ? productsRes.data.content.length : 0),
          orders: Array.isArray(ordersRes.data) ? ordersRes.data.length : (Array.isArray(ordersRes.data.content) ? ordersRes.data.content.length : 0),
          users: Array.isArray(usersRes.data) ? usersRes.data.length : (Array.isArray(usersRes.data.content) ? usersRes.data.content.length : 0),
        });
      } catch (e) {
        setStats({ products: 0, orders: 0, users: 0 });
      }
    };
    fetchStats();
  }, []);

  if (!admin || admin.role !== 'ADMIN') {
    return null; // Optionally show a spinner or nothing while redirecting
  }

  return (
    <div className='bg-zinc-950'>
      <AdminNavbar />
      {/* Dashboard Overview */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-4xl font-bold text-purple-700 mb-2">{stats.products}</span>
          <span className="text-lg font-semibold text-gray-700">Total Products</span>
          <span className="text-xs text-gray-500 mt-2">(All products. Filtering by admin not implemented.)</span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-700 mb-2">{stats.orders}</span>
          <span className="text-lg font-semibold text-gray-700">Total Orders</span>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => navigate('/admin/orders')}
          >
            Manage Orders
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-700 mb-2">{stats.users}</span>
          <span className="text-lg font-semibold text-gray-700">Total Users</span>
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => navigate('/admin/users')}
          >
            View User Details
          </button>
        </div>
      </div>
      {/* Admin Welcome Section */}
      <div className="w-full flex justify-center py-6 m-auto pt-32">
        <div className="w-[95%] min-h-[60vh] bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl overflow-hidden flex items-center justify-center">
          <AdminProductManager />
        </div>
      </div>
      {/* Admin Stats Section */}
      <section className="w-full my-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-600">+12% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-green-600">89</p>
              <p className="text-sm text-gray-600">+8% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-purple-600">1,234</p>
              <p className="text-sm text-gray-600">+15% from last month</p>
            </div>
          </div>
        </div>
      </section>
      {/* Quick Actions */}
      <section className="w-full my-10 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition text-left">
              <h3 className="font-semibold">Add New Product</h3>
              <p className="text-sm opacity-90">Create and publish new products</p>
            </button>
            <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition text-left">
              <h3 className="font-semibold">Process Orders</h3>
              <p className="text-sm opacity-90">Review and fulfill pending orders</p>
            </button>
            <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition text-left">
              <h3 className="font-semibold">Manage Inventory</h3>
              <p className="text-sm opacity-90">Update stock levels and prices</p>
            </button>
            <button className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition text-left">
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-sm opacity-90">Check sales and performance data</p>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminHomePage; 