import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Heart, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, cart, wishlist } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Dermavence Pharma
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span style={{ marginRight: '15px' }}>Hi, {user.username}</span>
              <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center' }}>
                <Heart size={20} />
                {wishlist.length > 0 && <span className="navbar-badge">{wishlist.length}</span>}
              </Link>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCart size={20} />
                {totalCartItems > 0 && <span className="navbar-badge">{totalCartItems}</span>}
              </Link>
              <button onClick={handleLogout} className="btn-outline" style={{ marginLeft: '10px' }}>Logout</button>
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
