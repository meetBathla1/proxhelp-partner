import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Info, 
  Share2,
  Lock,
  Zap,
  User,
  DollarSign,
  Users,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Store,
  CreditCard
} from 'lucide-react';
import './FinancialProductPage.css';
import './FinancialProductModal.css';

const FinancialProductPage = ({ serviceName, title, ribbonClass = "" }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const otherCategories = [
    { name: 'Credit Card', icon: <CreditCard size={20} color="#2563eb" />, bg: '#eff6ff', path: '/credit-cards' },
    { name: 'Secured Card', icon: <Lock size={20} color="#16a34a" />, bg: '#f0fdf4', path: '/secured-cards' },
    { name: 'Instant Loan', icon: <Zap size={20} color="#ea580c" />, bg: '#fff7ed', path: '/instant-loan' },
    { name: 'Personal Loan', icon: <User size={20} color="#0d9488" />, bg: '#f0fdfa', path: '/personal-loan' },
    { name: 'Business Loans', icon: <Store size={20} color="#92400e" />, bg: '#fef3c7', path: '/business-loan' },
    { name: 'Micro Loan', icon: <DollarSign size={20} color="#059669" />, bg: '#ecfdf5', path: '/micro-loan' },
    { name: 'Group Loan', icon: <Users size={20} color="#7c3aed" />, bg: '#f5f3ff', path: '/group-loan' },
    { name: 'Savings Account', icon: <PiggyBank size={20} color="#e11d48" />, bg: '#fff1f2', path: '/savings-account' },
    { name: 'Demat Account', icon: <TrendingUp size={20} color="#2563eb" />, bg: '#eff6ff', path: '/demat-account' },
    { name: 'Insurance', icon: <ShieldCheck size={20} color="#16a34a" />, bg: '#f0fdf4', path: '/insurance' },
  ];

  // Filter out the current category from "Other Categories"
  const filteredCategories = otherCategories.filter(cat => cat.name !== serviceName);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${serviceName}`);
        const data = await res.json();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching ${serviceName}:`, err);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [serviceName]);

  // Lock body scroll when selected product details modal is open to prevent scroll gap issues
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  if (isLoading) return <div className="loading-screen">Fetching {title}...</div>;

  return (
    <div className="product-page-wrapper">
      <div className="animate-fade-in">
        <header className="cc-header-standard">
        <div className="header-left-cc">
          <button className="back-arrow-cc" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="header-titles">
            <h1>{title}</h1>
            <span>{products.length} options available</span>
          </div>
        </div>
      </header>

      <div className="cc-content-list">
        {products.map((product) => (
          <div key={product.id} className="credit-card-item">
            <div className={`cc-earn-ribbon ${ribbonClass}`}>
              <Star size={14} fill="white" color="white" />
              <span>Earn Upto ₹{product.earn_amount}</span>
            </div>

            <div className="cc-card-header-row">
              <div className="cc-card-logo-container">
                <img src={product.logo_url} alt={product.bank_name} className="cc-bank-logo" />
              </div>
              <div className="cc-card-title-group">
                <h2 className="cc-product-name">{product.name}</h2>
                <span className="cc-product-tag">{serviceName}</span>
              </div>
            </div>

            <div className="cc-card-features-list">
              {(typeof product.features === 'string' ? JSON.parse(product.features) : product.features).map((feature, idx) => (
                <div key={idx} className="cc-feature-row">
                  <span className="cc-feature-emoji">{feature.icon}</span>
                  <span className="cc-feature-description">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="cc-fees-grid">
              <div className="cc-fee-card">
                <span className="cc-fee-title">Joining Fee</span>
                <span className="cc-fee-amount">₹{product.joining_fee}</span>
              </div>
              <div className="cc-fee-card teal-tint">
                <span className="cc-fee-title">Renewal Fee</span>
                <span className="cc-fee-amount teal-text">₹{product.renewal_fee}</span>
              </div>
            </div>

            <div className="cc-button-group">
              <button 
                className="btn-details-purple"
                onClick={() => navigate(`/share-product/${product.id}`)}
              >
                <Info size={16} />
                <span>Details</span>
              </button>
              <button className="btn-share-teal" onClick={() => navigate(`/share-product/${product.id}`)}>
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="coming-soon-box">
            <h3>New Products Coming Soon</h3>
            <p>We are currently onboarding new partners for {title}. Stay tuned!</p>
          </div>
        )}

        <div className="browse-categories-section">
          <h2 className="section-title-cc">Browse Other Categories</h2>
          <div className="categories-grid-cc">
            {filteredCategories.slice(0, 9).map((cat, idx) => (
              <div 
                className="category-item-cc" 
                key={idx}
                onClick={() => navigate(cat.path)}
              >
                <div className="category-icon-box-cc" style={{ backgroundColor: cat.bg }}>
                  {cat.icon}
                </div>
                <span className="category-name-cc">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="product-details-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-details-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProduct.name} Details</h3>
              <button className="btn-close-modal" onClick={() => setSelectedProduct(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedProduct.share_image_url && (
                <div className="modal-banner-container">
                  <img src={selectedProduct.share_image_url} alt="Product Promo Banner" className="modal-promo-banner" />
                </div>
              )}
              <div className="modal-brand-info">
                <img src={selectedProduct.logo_url} alt={selectedProduct.bank_name} className="modal-bank-logo" />
                <div className="modal-brand-text">
                  <h4>{selectedProduct.bank_name}</h4>
                  <span className="modal-earn-badge">Earn Upto ₹{selectedProduct.earn_amount}</span>
                </div>
              </div>
              
              <div className="modal-section">
                <h5>Product Description</h5>
                <p>{selectedProduct.share_description || `Experience the best of ${selectedProduct.bank_name} with the ${selectedProduct.name}. Apply today to enjoy exclusive benefits and industry-leading features tailored for you.`}</p>
              </div>

              <div className="modal-section">
                <h5>Key Features</h5>
                <ul className="modal-features-list">
                  {(typeof selectedProduct.features === 'string' ? JSON.parse(selectedProduct.features) : selectedProduct.features).map((feature, idx) => (
                    <li key={idx}>
                      <span className="feat-icon">{feature.icon}</span>
                      <span className="feat-text">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-fees-grid">
                <div className="modal-fee-item">
                  <span>Joining Fee</span>
                  <strong>₹{selectedProduct.joining_fee}</strong>
                </div>
                <div className="modal-fee-item">
                  <span>Annual / Renewal Fee</span>
                  <strong>₹{selectedProduct.renewal_fee}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-action" onClick={() => navigate(`/share-product/${selectedProduct.id}`)}>
                <Share2 size={18} />
                Share with Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Lucide helpers removed as they are now properly imported

export default FinancialProductPage;
