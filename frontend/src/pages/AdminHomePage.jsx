import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminHomePage = () => {
  return (
    <div className='bg-zinc-950'>
      <Navbar />
      
      {/* Admin Welcome Section */}
      <div className="w-full flex justify-center py-6 m-auto">
        <div className="w-[95%] h-[60vh] bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl mb-8">Welcome to FashionHub Administration</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Manage Products
              </button>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                View Orders
              </button>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                User Management
              </button>
            </div>
          </div>
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