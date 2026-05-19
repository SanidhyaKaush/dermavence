import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-react';
import productImg from '../assets/product.png';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart } = useContext(AuthContext);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Compute pricing
  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  const handleQtyChange = async (itemId, currentQty, increment) => {
    const newQty = currentQty + (increment ? 1 : -1);
    if (newQty <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartQuantity(itemId, newQty);
    }
  };

  const handleCheckout = () => {
    // Clear cart or simulate checkout
    setShowCheckoutSuccess(true);
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
            {/* Cart Items List */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.product.image_url || productImg} alt={item.product.name} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <div className="cart-item-details">
                      Unit Price: ${parseFloat(item.product.price).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="cart-item-actions">
                    {/* Quantity Selector */}
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
                    
                    {/* Item Subtotal Price */}
                    <div className="cart-item-price">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </div>
                    
                    {/* Remove Button */}
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

            {/* Summary Sidebar */}
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span>Est. Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {subtotal < 50 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px', textAlign: 'center' }}>
                  Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
                </div>
              )}
              
              <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              
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
