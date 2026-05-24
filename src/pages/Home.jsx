import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Stethoscope, FlaskConical, CloudSun, Award, ChevronDown, Search } from 'lucide-react';

const WHY_CHOOSE_POINTS = [
  {
    title: 'Doctor-Driven Dermatology Approach',
    description: 'Formulated in collaboration with leading dermatologists. Every ingredient is clinically tested to ensure clinical-grade efficacy and ultimate skin safety.',
    icon: Stethoscope,
  },
  {
    title: 'Science-Led Skincare Formulations',
    description: 'We prioritize active ingredients supported by robust clinical research. Our serums and creams feature optimized concentrations for real, visible results.',
    icon: FlaskConical,
  },
  {
    title: 'Indian Skin & Climate Focus',
    description: 'Specifically tailored to withstand heat, humidity, and environmental stressors. Our lightweight formulas absorb quickly without clogging pores.',
    icon: CloudSun,
  },
  {
    title: 'Premium Quality Standards',
    description: 'Crafted in state-of-the-art facilities. We strictly exclude parabens, sulfates, and harmful toxins, ensuring only the highest purity for your skin.',
    icon: Award,
  }
];


const Home = () => {
  const { user, addToCart, addToWishlist, products, showToast } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse query directly from location.search to guarantee update propagation
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  const setSearchQuery = (val) => {
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const [showProducts, setShowProducts] = useState(!!searchQuery);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [activeFeature, setActiveFeature] = useState(-1);
  const [showContact, setShowContact] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Open products grid if search is active in URL
  useEffect(() => {
    if (searchQuery) {
      setShowProducts(true);
    }
  }, [searchQuery]);


  const handleAction = async (action, productId) => {
    if (!user) {
      showToast(`Please login to add to ${action}`, 'error');
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
        showToast(`Added to ${action} successfully!`, 'success');
      } else {
        showToast(`Failed to add to ${action}`, 'error');
      }
    } catch (err) {
      showToast(`Error adding to ${action}`, 'error');
    }
  };

  if (products.length === 0) return <div className="container">Loading...</div>;

  const product = products[currentSlide];
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  return (
    <div>
      {/* Scrolling Announcement Ticker */}
      <div className="ticker-banner">
        <div className="ticker-wrap">
          <div className="ticker-item">Dermavence <span className="flicker-text">coming soon</span> to deliver values</div>
          <div className="ticker-item">✦</div>
          <div className="ticker-item">Dermavence <span className="flicker-text">coming soon</span> to deliver values</div>
          <div className="ticker-item">✦</div>
          
          {/* Duplicated for seamless loop */}
          <div className="ticker-item">Dermavence <span className="flicker-text">coming soon</span> to deliver values</div>
          <div className="ticker-item">✦</div>
          <div className="ticker-item">Dermavence <span className="flicker-text">coming soon</span> to deliver values</div>
          <div className="ticker-item">✦</div>
        </div>
      </div>

      <div className="container">
        {/* Carousel */}
        <div className="carousel-container">
          <div key={`content-${currentSlide}`} className={`carousel-content carousel-animate-${slideDirection}`}>
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
          
          <div key={`image-${currentSlide}`} className={`carousel-image-container carousel-animate-${slideDirection}`}>
            <img src={product.image} alt={product.name} />
          </div>

          <div className="carousel-controls">
            <button 
              className="carousel-btn" 
              onClick={() => {
                setSlideDirection('prev');
                setCurrentSlide(prev => (prev === 0 ? products.length - 1 : prev - 1));
              }}
            >
              <ChevronLeft />
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => {
                setSlideDirection('next');
                setCurrentSlide(prev => (prev === products.length - 1 ? 0 : prev + 1));
              }}
            >
              <ChevronRight />
            </button>
          </div>
          
          <div className="carousel-dots">
            {products.map((_, idx) => (
              <div 
                key={idx} 
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => {
                  setSlideDirection(idx > currentSlide ? 'next' : 'prev');
                  setCurrentSlide(idx);
                }}
              />
            ))}
          </div>
        </div>

        {/* Toggle Products Button */}
        <div className="btn-center-container">
          <button 
            className="btn-primary btn-toggle-products" 
            onClick={() => setShowProducts(prev => !prev)}
          >
            {showProducts ? 'Hide All Products' : 'View All Products'}
          </button>
        </div>

        {/* Products Grid */}
        {showProducts && (
          <section className="products-section" id="products-catalog-section">
            <h2 className="section-title">All Products</h2>
            
            {/* Search & Filters */}
            <div className="products-filter-container">
              <div className="search-wrapper">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search products by name, description, or ingredients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="category-filter-row">
                {['All', 'Serums', 'Cleansers', 'Sunscreens'].map((cat) => (
                  <button 
                    key={cat} 
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <div key={p.id} className="product-card">
                    <Link to={`/product/${p.id}`} className="product-image-link">
                      <div className="product-image">
                        <img src={p.image} alt={p.name} style={{ height: '80%', objectFit: 'contain' }} />
                      </div>
                    </Link>
                    <div className="product-info">
                      <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="product-name">{p.name}</h3>
                      </Link>
                      <div className="product-price">₹xxxxx</div>
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
                ))
              ) : (
                <div className="empty-state" style={{ gridColumn: '1 / -1', margin: '40px auto', width: '100%', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No products match your search or category filter.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Why Choose Dermavence Section */}
        <section className="why-choose-section">
          <h2 className="section-title">Why Choose Dermavence</h2>
          <p className="section-subtitle">
            Experience advanced dermatological care crafted for optimal efficacy, purity, and clinical excellence.
          </p>

          {/* Desktop/Tablet Option Picker Style */}
          <div className="features-option-picker">
            <div className="features-options-grid">
              {WHY_CHOOSE_POINTS.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = activeFeature === idx;
                return (
                  <button
                    key={idx}
                    className={`feature-option-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveFeature(isActive ? -1 : idx)}
                  >
                    <IconComponent size={24} className="feature-icon" />
                    <span>{item.title}</span>
                    <ChevronDown 
                      size={16} 
                      className="feature-arrow" 
                      style={{ 
                        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        marginTop: '5px',
                        color: isActive ? 'var(--primary-color)' : 'var(--text-muted)'
                      }} 
                    />
                  </button>
                );
              })}
            </div>
            
            {activeFeature >= 0 && (
              <div className="feature-details-card animated-fade-in">
                <div className="card-header">
                  {React.createElement(WHY_CHOOSE_POINTS[activeFeature].icon, { size: 32, className: "card-icon" })}
                  <h3>{WHY_CHOOSE_POINTS[activeFeature].title}</h3>
                </div>
                <p className="card-description">
                  {WHY_CHOOSE_POINTS[activeFeature].description}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Accordion Dropdown Style */}
          <div className="features-accordion">
            {WHY_CHOOSE_POINTS.map((item, idx) => {
              const IconComponent = item.icon;
              const isOpen = activeFeature === idx;
              return (
                <div key={idx} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                  <button 
                    className="accordion-header"
                    onClick={() => setActiveFeature(isOpen ? -1 : idx)}
                  >
                    <div className="header-left">
                      <IconComponent size={18} className="accordion-icon" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown size={18} className="accordion-arrow" />
                  </button>
                  <div className="accordion-content-wrapper">
                    <p className="accordion-content">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section" style={{ marginBottom: '60px' }}>
          <h2 className="section-title" style={{ marginBottom: '10px' }}>Contact Our Skincare Experts</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 20px' }}>
            Have questions about your skincare routine or our formulations? Reach out to our team.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              className="btn-toggle-contact"
              onClick={() => setShowContact(true)}
            >
              Get in Touch
            </button>
          </div>

          {showContact && (
            <div className="contact-modal-overlay" onClick={() => setShowContact(false)}>
              <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="contact-modal-close-btn" onClick={() => setShowContact(false)} title="Close contact card">
                  <span style={{ fontSize: '24px', lineHeight: '1', display: 'block', transform: 'translateY(-1px)' }}>&times;</span>
                </button>
                
                <h3 className="contact-modal-title">Contact Dermavence Pharma</h3>
                <p className="contact-modal-subtitle">Connect with us on WhatsApp, Email or Instagram.</p>
                
                <div className="contact-list">
                  {/* WhatsApp Row 1 */}
                  <div className="contact-list-item">
                    <div className="contact-item-info">
                      <span className="contact-item-label">WhatsApp</span>
                      <span className="contact-item-value">+91 9990205776</span>
                    </div>
                    <a href="https://wa.me/919990205776" target="_blank" rel="noopener noreferrer" className="contact-item-btn">
                      Chat
                    </a>
                  </div>
                  
                  {/* WhatsApp Row 2 */}
                  <div className="contact-list-item">
                    <div className="contact-item-info">
                      <span className="contact-item-label">WhatsApp</span>
                      <span className="contact-item-value">+91 9990200736</span>
                    </div>
                    <a href="https://wa.me/919990200736" target="_blank" rel="noopener noreferrer" className="contact-item-btn">
                      Chat
                    </a>
                  </div>
                  
                  {/* Email Row */}
                  <div className="contact-list-item">
                    <div className="contact-item-info">
                      <span className="contact-item-label">Email</span>
                      <span className="contact-item-value">infor@dermavencepharma.com</span>
                    </div>
                    <a href="mailto:infor@dermavencepharma.com" className="contact-item-btn">
                      Mail
                    </a>
                  </div>
                  
                  {/* Instagram Row */}
                  <div className="contact-list-item">
                    <div className="contact-item-info">
                      <span className="contact-item-label">Instagram</span>
                      <span className="contact-item-value">@dermavence_pharma</span>
                    </div>
                    <a href="https://instagram.com/dermavence_pharma" target="_blank" rel="noopener noreferrer" className="contact-item-btn">
                      Open
                    </a>
                  </div>
                </div>
                
                {/* Copy Utilities Row */}
                <div className="contact-copy-row">
                  <button 
                    className="contact-copy-btn" 
                    onClick={() => {
                      navigator.clipboard.writeText('9990205776');
                      showToast('Copied WhatsApp Number +91 9990205776 to clipboard!', 'success');
                    }}
                  >
                    Copy 9990205776
                  </button>
                  <button 
                    className="contact-copy-btn" 
                    onClick={() => {
                      navigator.clipboard.writeText('9990200736');
                      showToast('Copied WhatsApp Number +91 9990200736 to clipboard!', 'success');
                    }}
                  >
                    Copy 9990200736
                  </button>
                  <button 
                    className="contact-copy-btn" 
                    onClick={() => {
                      navigator.clipboard.writeText('infor@dermavencepharma.com');
                      showToast('Copied Email address to clipboard!', 'success');
                    }}
                  >
                    Copy Email
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
