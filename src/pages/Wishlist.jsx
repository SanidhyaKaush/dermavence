import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import productImg from '../assets/product.png';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart, showToast } = useContext(AuthContext);

  const handleMoveToCart = async (wishlistItemId, productId) => {
    
    const added = await addToCart(productId);
    if (added) {
      
      await removeFromWishlist(wishlistItemId);
      showToast('Product moved to cart successfully!', 'success');
    } else {
      showToast('Failed to move product to cart.', 'error');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <Heart size={48} style={{ color: 'var(--primary-color)', marginBottom: '15px' }} />
          <h3>Your Wishlist is Empty</h3>
          <p>Tap the heart icon on any products to save them for later.</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '80vh', paddingBottom: '40px' }}>
      <h1 className="page-title">My Wishlist</h1>
      
      <div className="wishlist-grid-container">
        <div className="products-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image">
                <img 
                  src={item.product.image || productImg} 
                  alt={item.product.name} 
                  style={{ height: '80%', objectFit: 'contain' }}
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{item.product.name}</h3>
                <div className="product-price">₹xxxxx</div>
                
                <div className="product-actions">
                  
                  <button 
                    className="btn-primary btn-full" 
                    onClick={() => handleMoveToCart(item.id, item.product.id)}
                  >
                    <ShoppingCart size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Move to Cart
                  </button>
                  
                  
                  <button 
                    className="btn-icon" 
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
