import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-react';
import productImg from '../assets/product.png';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  
  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.08; 
  const total = subtotal + shipping + tax;

  const handleQtyChange = async (itemId, currentQty, increment) => {
    const newQty = currentQty + (increment ? 1 : -1);
    if (newQty <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartQuantity(itemId, newQty);
    }
  };

  const handleCheckout = async () => {
    try {
      await clearCart();
      setShowCheckoutSuccess(true);
    } catch (err) {
      console.error("Failed to complete checkout order", err);
    }
  };

  if (cart.length === 0 && !showCheckoutSuccess) {
    return (
      <div className="container">
        <div className="empty-state">
          <ShoppingBag size={48} style={{ color: 'var(--primary-color)', marginBottom: '15px' }} />
          <h3>Your Cart is Empty</h3>
          <p>Explore our premium, doctor-driven skincare products and add them to your cart.</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '80vh', paddingBottom: '40px' }}>
      {showCheckoutSuccess ? (
        <div className="empty-state" style={{ maxWidth: '500px', marginTop: '60px' }}>
          <CheckCircle size={56} style={{ color: '#4caf50', marginBottom: '20px' }} />
          <h3>Order Confirmed!</h3>
          <p>Thank you for shopping with Dermavence Pharma. Your order has been successfully placed and is being prepared by our medical skincare experts.</p>
          <Link to="/" className="btn-primary" onClick={() => window.location.reload()}>
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          <h1 className="page-title">Shopping Cart</h1>
          
          <div className="cart-layout">
            
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.product.image || productImg} alt={item.product.name} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <div className="cart-item-details">
                      Unit Price: ₹xxxxx
                    </div>
                  </div>
                  
                  <div className="cart-item-actions">
                    
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQtyChange(item.id, item.quantity, false)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQtyChange(item.id, item.quantity, true)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    
                    <div className="cart-item-price">
                      ₹xxxxx
                    </div>
                    
                    
                    <button 
                      className="btn-remove" 
                      onClick={() => removeFromCart(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹xxxxx</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="summary-row">
                <span>Est. Tax (8%)</span>
                <span>₹xxxxx</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹xxxxx</span>
              </div>
              

              
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <Link to="/" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '500' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
