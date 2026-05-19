import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/auth/user/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token invalid');
      })
      .then(data => setUser(data))
      .catch(() => logout());
    }
  }, [token]);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/wishlist/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.access);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return true;
    }
    return false;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return res.ok;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const addToCart = async (productId) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
    return false;
  };

  const addToWishlist = async (productId) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/api/wishlist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        await fetchWishlist();
        return true;
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
    return false;
  };

  const removeFromCart = async (cartItemId) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/api/cart/${cartItemId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
    return false;
  };

  const removeFromWishlist = async (wishlistItemId) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/api/wishlist/${wishlistItemId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchWishlist();
        return true;
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
    return false;
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/api/cart/${cartItemId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, login, register, logout, 
      cart, wishlist, fetchCart, fetchWishlist, 
      addToCart, addToWishlist, removeFromCart, 
      removeFromWishlist, updateCartQuantity 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
