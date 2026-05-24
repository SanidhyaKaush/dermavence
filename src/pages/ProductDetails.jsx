import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Star, Heart, ShoppingCart, ArrowLeft, Shield, Clock, Droplets, Check, MessageSquare } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart, addToWishlist, products, showToast } = useContext(AuthContext);
  
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-muted)' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Load reviews from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${product.id}/reviews/`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    if (product) {
      fetchReviews();
    }
  }, [product?.id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/api/products/${product.id}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewerName,
          rating: Number(rating),
          comment: comment
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(prev => [data, ...prev]);
        // Reset Form
        setReviewerName('');
        setRating(5);
        setComment('');
        showToast('Review submitted successfully!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      showToast('Error submitting review.', 'error');
    }
  };

  const handleAction = async (action) => {
    if (!user) {
      showToast(`Please login to add to ${action}`, 'error');
      navigate('/login');
      return;
    }
    
    let success = false;
    if (action === 'cart') {
      success = await addToCart(product.id);
    } else {
      success = await addToWishlist(product.id);
    }

    if (success) {
      showToast(`Added to ${action} successfully!`, 'success');
    } else {
      showToast(`Failed to add to ${action}`, 'error');
    }
  };

  // Calculate Average Rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Back Link */}
      <div style={{ margin: '20px 0' }}>
        <Link to="/" className="btn-toggle-contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', fontSize: '0.9rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>

      <div className="product-details-layout">
        {/* Left Column: Image & Badges */}
        <div className="product-details-image-side">
          <div className="product-details-image-box">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-details-badges">
            <div className="detail-badge-item">
              <Shield size={20} className="badge-icon" />
              <div>
                <h5>Dermatologically Tested</h5>
                <p>Clinically evaluated for safety and efficacy.</p>
              </div>
            </div>
            <div className="detail-badge-item">
              <Droplets size={20} className="badge-icon" />
              <div>
                <h5>Clean Formulations</h5>
                <p>Cruelty-free, vegan, no parabens or sulfates.</p>
              </div>
            </div>
            <div className="detail-badge-item">
              <Clock size={20} className="badge-icon" />
              <div>
                <h5>Optimal pH Levels</h5>
                <p>Precisely balanced to preserve skin barrier health.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Specs, CTA */}
        <div className="product-details-info-side">
          <span className="product-category-tag">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          
          {/* Rating Summary */}
          <div className="product-rating-summary">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  fill={star <= Math.round(Number(avgRating)) ? '#ff5555' : 'none'} 
                  color={star <= Math.round(Number(avgRating)) ? '#ff5555' : 'var(--text-muted)'} 
                />
              ))}
            </div>
            <span className="avg-rating-value">{avgRating} / 5.0</span>
            <span className="reviews-count">({reviews.length} reviews)</span>
          </div>

          <div className="product-detail-price">₹xxxxx</div>
          
          {product.fda_notice && (
            <div className="fda-warning-box" style={{
              background: 'rgba(255, 85, 85, 0.08)',
              borderLeft: '4px solid #ff5555',
              padding: '12px 16px',
              borderRadius: '6px',
              margin: '15px 0',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: '#ff5555',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ⚠️ Warning: {product.fda_notice}
            </div>
          )}
          
          <p className="product-detail-desc">{product.description}</p>

          {/* Key Ingredients Badges */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Active Ingredients</h4>
            <div className="carousel-ingredients">
              {product.ingredients.map((ing, idx) => (
                <span key={idx} className="ingredient-badge" style={{ cursor: 'default' }}>{ing}</span>
              ))}
            </div>
          </div>

          {/* Clinical Formulation Parameters */}
          <div className="clinical-specs-card">
            <div className="spec-row">
              <span className="spec-label">Target Skin Type:</span>
              <span className="spec-value">{product.skinType}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Best Suited For:</span>
              <span className="spec-value">{product.suitability}</span>
            </div>
            <div className="spec-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
              <span className="spec-label">Directions for Use:</span>
              <span className="spec-value" style={{ lineHeight: '1.5' }}>{product.directions}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="details-cta-row">
            <button className="btn-primary" style={{ flex: 2, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => handleAction('cart')}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-outline" style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => handleAction('wishlist')}>
              <Heart size={18} /> Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Block: Full Ingredients & Reviews */}
      <div className="details-bottom-section">
        {/* Full Ingredients Panel */}
        <div className="full-ingredients-box">
          <h3>Full Ingredients List</h3>
          <p>{product.fullIngredients}</p>
        </div>

        {/* Reviews Panel */}
        <div className="reviews-section-wrapper">
          <div className="reviews-header">
            <h3>Customer Reviews</h3>
            <div className="reviews-stats">
              <span className="stats-score">{avgRating}</span>
              <span className="stats-label">out of 5 stars</span>
            </div>
          </div>

          <div className="reviews-layout-grid">
            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-meta">
                      <span className="reviewer-name">{rev.name}</span>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    <div className="review-rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={12} 
                          fill={star <= rev.rating ? '#ff5555' : 'none'} 
                          color={star <= rev.rating ? '#ff5555' : 'var(--text-muted)'} 
                        />
                      ))}
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Review Submission Form */}
            <div className="review-form-container">
              <h4>Write a Review</h4>
              <form onSubmit={handleAddReview} className="review-submit-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jane Doe" 
                    required 
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <div className="rating-selector-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button" 
                        key={star} 
                        className="star-select-btn" 
                        onClick={() => setRating(star)}
                      >
                        <Star 
                          size={24} 
                          fill={star <= rating ? '#ff5555' : 'none'} 
                          color={star <= rating ? '#ff5555' : 'var(--text-muted)'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Review Description</label>
                  <textarea 
                    rows="4" 
                    placeholder="Share details of your experience with this formulation..." 
                    required 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '5px', 
                      color: 'white', 
                      fontFamily: 'inherit',
                      resize: 'none'
                    }} 
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
