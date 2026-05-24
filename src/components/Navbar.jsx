import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { user, logout, cart, wishlist, products } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowDropdown(false);
        setSearchVal('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSearch = () => {
    setIsExpanded(prev => {
      const nextState = !prev;
      if (nextState) {
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 150);
      } else {
        setSearchVal('');
        setShowDropdown(false);
      }
      return nextState;
    });
  };

  
  const suggestions = searchVal.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.category.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(searchVal.toLowerCase()))
      )
    : [];

  const handleSelectProduct = (productId) => {
    setSearchVal('');
    setShowDropdown(false);
    setIsExpanded(false);
    navigate(`/product/${productId}`);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="Dermavence Logo" className="navbar-logo" />
          <span>Dermavence Pharma</span>
        </Link>
        <div className="navbar-links">
          
          <div className="navbar-search-wrapper" ref={searchRef}>
            <div className={`navbar-search-expandable ${isExpanded ? 'expanded' : ''}`}>
              <button className="navbar-search-toggle-btn" onClick={toggleSearch} title="Search catalog">
                <Search size={20} />
              </button>
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search premium formulations..." 
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="navbar-search-expand-input"
              />
            </div>

            
            {isExpanded && showDropdown && searchVal.trim() && (
              <div className="navbar-search-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <div 
                      key={p.id} 
                      className="search-suggestion-item" 
                      onClick={() => handleSelectProduct(p.id)}
                    >
                      <div className="suggestion-img">
                        <img src={p.image} alt={p.name} />
                      </div>
                      <div className="suggestion-info">
                        <span className="suggestion-name">{p.name}</span>
                        <span className="suggestion-category">{p.category}</span>
                      </div>
                      <div className="suggestion-price">₹xxxxx</div>
                    </div>
                  ))
                ) : (
                  <div className="search-suggestion-empty">
                    No formulations match your search
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <>
              <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                <Heart size={20} />
                {wishlist.length > 0 && <span className="navbar-badge">{wishlist.length}</span>}
              </Link>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                <ShoppingCart size={20} />
                {totalCartItems > 0 && <span className="navbar-badge">{totalCartItems}</span>}
              </Link>
              <div className="navbar-user-dropdown">
                <span className="navbar-user" style={{ cursor: 'pointer' }}>Hi, {user.username}</span>
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <button 
                      onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))} 
                      className="dropdown-item"
                      style={{ borderBottom: '1px solid var(--border-color)', borderRadius: '9px 9px 0 0' }}
                    >
                      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button onClick={handleLogout} className="dropdown-item" style={{ borderRadius: '0 0 9px 9px' }}>Logout</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
