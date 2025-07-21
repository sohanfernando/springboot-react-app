import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeGetJSON, safeGetItem, safeSetJSON, safeSetItem, safeRemoveItem, validateLocalStorageData } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Validate localStorage integrity on startup
  useEffect(() => {
    validateLocalStorageData();
  }, []);

  // Initialize user and token from localStorage with safe parsing
  const [user, setUser] = useState(() => safeGetJSON('user', null));
  const [token, setToken] = useState(() => safeGetItem('token', null));
  
  // Initialize cart from localStorage with safe parsing
  const [cart, setCart] = useState(() => safeGetJSON('cart', []));
  const [wishlist, setWishlist] = useState(() => safeGetJSON('wishlist', []));

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    safeSetJSON('cart', cart);
  }, [cart]);

  // Persist wishlist to localStorage whenever it changes
  useEffect(() => {
    safeSetJSON('wishlist', wishlist);
  }, [wishlist]);

  // Login function - now handles JWT response
  const login = (loginResponse) => {
    try {
      const { token: jwtToken, user: userData } = loginResponse;
      
      if (!jwtToken || !userData) {
        throw new Error('Invalid login response structure');
      }
      
      setUser(userData);
      setToken(jwtToken);
      
      safeSetJSON('user', userData);
      safeSetItem('token', jwtToken);
    } catch (error) {
      console.error('Error during login:', error);
          // Clear any partial state
    setUser(null);
    setToken(null);
    safeRemoveItem('user');
    safeRemoveItem('token');
      throw error; // Re-throw so calling component can handle it
    }
  };

  // Logout function - clears JWT token
  const logout = () => {
    setUser(null);
    setToken(null);
    
    safeRemoveItem('user');
    safeRemoveItem('token');
    
    // Clear cart and wishlist on logout
    setCart([]);
    setWishlist([]);
    safeRemoveItem('cart');
    safeRemoveItem('wishlist');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  // Check if user is regular user
  const isUser = () => {
    return user?.role === 'USER';
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item.id === product.id);
      if (!exists) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const value = {
    // Authentication
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
    
    // Cart
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartCount,
    getCartTotal,
    clearCart,
    
    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 