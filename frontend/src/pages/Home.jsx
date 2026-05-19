import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import productImg from '../assets/product.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Home = () => {
  const { user, addToCart, addToWishlist } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/products/`)
      .then(res => res.json())
      .then(data => {
        // Map backend product to frontend structure
        const formatted = data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image_url || productImg,
          ingredients: p.ingredients ? p.ingredients.split(',') : [],
          tag: 'DERMAVENCE • Doctor-Driven Care'
        }));
        setProducts(formatted.length ? formatted : [
          {
            id: 1,
            name: 'Intense Deep Clean Face Wash',
            description: 'Deep cleansing formula designed to unclog pores, fight acne and refresh skin while maintaining a clean, premium pharma look.',
            price: '24.99',
            image: productImg,
            ingredients: ['2% Salicylic Acid', '0.5% Glycolic Acid', 'Unclogs Pores'],
            tag: 'DERMAVENCE • Doctor-Driven Care'
          }
        ]);
      })
      .catch(err => console.error(err));
  }, []);

  const handleAction = async (action, productId) => {
    if (!user) {
      alert(`Please login to add to ${action}`);
      navigate('/login');
      return;
    } 

    try {
      let success = false;
      if (action === 'cart') {
        success = await addToCart(productId);
      } else if (action === 'wishlist') {
        success = await addToWishlist(productId);
      }
      
      if (success) {
        alert(`Added to ${action} successfully!`);
      } else {
        alert(`Failed to add to ${action}`);
      }
    } catch (err) {
      alert(`Error adding to ${action}`);
    }
  };

  if (products.length === 0) return <div className="container">Loading...</div>;

  const product = products[currentSlide];

  return (
    <div>
      <div className="container">
        {/* Carousel */}
        <div className="carousel-container">
          <div className="carousel-content">
            <div className="carousel-tag">{product.tag || 'FEATURED'}</div>
            <h1 className="carousel-title">{product.name}</h1>
            <p className="carousel-desc">{product.description}</p>
            
            <div className="carousel-ingredients">
              {product.ingredients && product.ingredients.map((ing, idx) => (
                <span key={idx} className="ingredient-badge">{ing}</span>
              ))}
            </div>
            
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <button className="btn-primary" onClick={() => handleAction('cart', product.id)}>Add to Cart</button>
              <button className="btn-outline" onClick={() => handleAction('wishlist', product.id)}>Add to Wishlist</button>
            </div>
          </div>
          
          <div className="carousel-image-container">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => setCurrentSlide(prev => (prev === 0 ? products.length - 1 : prev - 1))}>
              <ChevronLeft />
            </button>
            <button className="carousel-btn" onClick={() => setCurrentSlide(prev => (prev === products.length - 1 ? 0 : prev + 1))}>
              <ChevronRight />
            </button>
          </div>
          
          <div className="carousel-dots">
            {products.map((_, idx) => (
              <div 
                key={idx} 
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <section className="products-section">
          <h2 className="section-title">All Products</h2>
          <div className="products-grid">
            {products.map(p => (
              <div key={p.id} className="product-card">
                <div className="product-image">
                  <img src={p.image} alt={p.name} style={{ height: '80%', objectFit: 'contain' }} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-price">${p.price}</div>
                  <div className="product-actions">
                    <button className="btn-primary btn-full" onClick={() => handleAction('cart', p.id)}>
                      <ShoppingCart size={18} style={{ marginRight: '5px' }}/> Add
                    </button>
                    <button className="btn-icon" onClick={() => handleAction('wishlist', p.id)}>
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
