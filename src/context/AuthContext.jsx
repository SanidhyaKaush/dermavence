import React, { createContext, useState, useEffect } from 'react';
import { products as staticProducts } from '../data/products';
import facewashImg from '../assets/facewash.png';
import sunscreenImg from '../assets/sunscreen.png';
import vitcImg from '../assets/vitc.png';
import moisturizerImg from '../assets/moisturizer.jpg';

export const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:8000/api';

const IMAGE_MAP = {
  'vitc.png': vitcImg,
  'facewash.png': facewashImg,
  'sunscreen.png': sunscreenImg,
  'moisturizer.jpg': moisturizerImg
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState(staticProducts);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Helper to map DB image name to local React assets
  const mapProductImage = (prod) => {
    if (!prod) return prod;
    return {
      ...prod,
      image: IMAGE_MAP[prod.image_name] || vitcImg
    };
  };

  const mapCartItem = (item) => ({
    ...item,
    product: mapProductImage(item.product)
  });

  const mapWishlistItem = (item) => ({
    ...item,
    product: mapProductImage(item.product)
  });

  // Fetch all products from MySQL on mount
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(mapProductImage);
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Error fetching products from backend:', err);
    }
  };

  // Fetch cart from backend
  const fetchCart = async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/`, {
        headers: {
          'Authorization': `Token ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.map(mapCartItem));
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Fetch wishlist from backend
  const fetchWishlist = async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/wishlist/`, {
        headers: {
          'Authorization': `Token ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.map(mapWishlistItem));
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  // Check for active session on load
  useEffect(() => {
    const initSession = async () => {
      await fetchProducts();

      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          // Verify token against backend
          const res = await fetch(`${API_BASE_URL}/auth/user/`, {
            headers: {
              'Authorization': `Token ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(storedToken);
            // Fetch cart and wishlist
            await fetchCart(storedToken);
            await fetchWishlist(storedToken);
          } else {
            // Token invalid or expired
            localStorage.removeItem('access_token');
          }
        } catch (err) {
          console.error('Session initialization error:', err);
        }
      }
    };

    initSession();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        const userSession = data.user;
        const userToken = data.token;

        setUser(userSession);
        setToken(userToken);
        localStorage.setItem('access_token', userToken);

        // Fetch user's cart and wishlist from DB
        await fetchCart(userToken);
        await fetchWishlist(userToken);
        return true;
      }
    } catch (err) {
      console.error('Login request failed:', err);
    }
    return false;
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
    return false;
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('Logout request failed:', err);
      }
    }

    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('access_token');
  };

  const addToCart = async (productId) => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });

      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
    return false;
  };

  const addToWishlist = async (productId) => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/wishlist/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId })
      });

      if (res.ok) {
        await fetchWishlist();
        return true;
      }
    } catch (err) {
      console.error('Add to wishlist failed:', err);
    }
    return false;
  };

  const removeFromCart = async (cartItemId) => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/?cart_item_id=${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
    return false;
  };

  const removeFromWishlist = async (wishlistItemId) => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/wishlist/?wishlist_item_id=${wishlistItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        await fetchWishlist();
        return true;
      }
    } catch (err) {
      console.error('Remove from wishlist failed:', err);
    }
    return false;
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart_item_id: cartItemId, quantity: Number(quantity) })
      });

      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Update cart quantity failed:', err);
    }
    return false;
  };

  const clearCart = async () => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/?clear_all=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        await fetchCart();
        return true;
      }
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, login, register, logout, 
      products,
      cart, wishlist, fetchCart, fetchWishlist, 
      addToCart, addToWishlist, removeFromCart, 
      removeFromWishlist, updateCartQuantity, clearCart,
      showToast
    }}>
      {children}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠' : 'ℹ'}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => setToast(null)}>&times;</button>
        </div>
      )}
    </AuthContext.Provider>
  );
};
