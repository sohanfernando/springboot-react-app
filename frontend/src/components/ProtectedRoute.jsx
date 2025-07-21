import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireUser = false }) => {
  const { isAuthenticated, isAdmin, isUser } = useAuth();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && (!isAuthenticated() || !isAdmin())) {
    return <Navigate to="/admin-login" replace />;
  }

  // If user access is required but user is not a regular user
  if (requireUser && (!isAuthenticated() || !isUser())) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but trying to access login/signup pages
  if (!requireAuth && isAuthenticated()) {
    // Redirect based on user role
    if (isAdmin()) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;