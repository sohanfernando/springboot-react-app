import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import AdminProductManager from '../components/AdminProductManager';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield, FaBoxOpen, FaUsers, FaClipboardList } from 'react-icons/fa';
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-blue-900 to-purple-900">
      <AdminNavbar />
      {/* Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <FaBoxOpen className="text-5xl text-purple-600 mb-3" />
            <span className="text-4xl font-extrabold text-purple-700 mb-1">{stats.products}</span>
            <span className="text-lg font-semibold text-gray-700">Products</span>
            <span className="text-xs text-gray-400 mt-2">All products in your store</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <FaClipboardList className="text-5xl text-blue-600 mb-3" />
            <span className="text-4xl font-extrabold text-blue-700 mb-1">{stats.orders}</span>
            <span className="text-lg font-semibold text-gray-700">Orders</span>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              onClick={() => navigate('/admin/orders')}
            >
              Manage Orders
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <FaUsers className="text-5xl text-green-600 mb-3" />
            <span className="text-4xl font-extrabold text-green-700 mb-1">{stats.users}</span>
            <span className="text-lg font-semibold text-gray-700">Users</span>
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              onClick={() => navigate('/admin/users')}
            >
              View User Details
            </button>
          </div>
        </div>
        {/* Admin Product Manager Section */}
        <div className="w-full flex justify-center py-6">
          <div className="w-[98%] min-h-[60vh] bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
            <AdminProductManager />
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminHomePage; 