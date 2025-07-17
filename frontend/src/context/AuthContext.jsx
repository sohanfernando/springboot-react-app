import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [wishlist, setWishlist] = useState([]);
  // Initialize admin from localStorage
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save user to localStorage on login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Save admin to localStorage on admin login
  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  // Remove user from localStorage on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear cart and wishlist on logout
    setCart([]);
    setWishlist([]);
  };

  // Remove admin from localStorage on admin logout
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
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

  const value = {
    user,
    login,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartCount,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    admin,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 