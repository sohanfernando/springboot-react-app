import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const { admin, logoutAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin-signup', label: 'Admin Signup' },
    { to: '/admin-login', label: 'Admin Login' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-gradient-to-r from-purple-700 to-blue-700 text-white shadow-lg px-8 py-4 flex items-center justify-between">
      {/* Logo and Links */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            FashionHub Admin
          </span>
        </div>
        <div className="flex items-center gap-6 ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-semibold text-lg transition px-2 py-1 rounded-lg ${isActive(link.to) ? 'bg-white/20 text-yellow-300' : 'hover:bg-white/10'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {/* Admin Info */}
      {admin && (
        <div className="flex items-center gap-4">
          <FaUserShield className="text-2xl" />
          <span className="font-bold text-lg">{admin.name}</span>
          <span className="text-sm bg-white/20 rounded px-2 py-1 ml-2">{admin.email}</span>
          <button
            onClick={() => { logoutAdmin(); window.location.href = '/admin-login'; }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar; 