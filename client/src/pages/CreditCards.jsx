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
  Store
} from 'lucide-react';
import './CreditCards.css';

const CreditCards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const otherCategories = [
    { name: 'Secured Card', icon: <Lock size={20} color="#1e293b" />, bg: '#f1f5f9', path: '/secured-cards' },
    { name: 'Instant Loan', icon: <Zap size={20} color="#ea580c" />, bg: '#fff7ed', path: '/instant-loan' },
    { name: 'Personal Loan', icon: <User size={20} color="#0d9488" />, bg: '#f0fdfa', path: '/personal-loan' },
    { name: 'Business Loans', icon: <Store size={20} color="#92400e" />, bg: '#fef3c7', path: '/business-loan' },
    { name: 'Micro Loan', icon: <DollarSign size={20} color="#059669" />, bg: '#ecfdf5', path: '/micro-loan' },
    { name: 'Group Loan', icon: <Users size={20} color="#7c3aed" />, bg: '#f5f3ff', path: '/group-loan' },
    { name: 'Savings Account', icon: <PiggyBank size={20} color="#e11d48" />, bg: '#fff1f2', path: '/savings-account' },
    { name: 'Demat Account', icon: <TrendingUp size={20} color="#2563eb" />, bg: '#eff6ff', path: '/demat-account' },
    { name: 'Insurance', icon: <ShieldCheck size={20} color="#16a34a" />, bg: '#f0fdf4', path: '/insurance' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/Credit Card');
        const data = await res.json();
        setCards(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <div className="loading-screen">Fetching Credit Cards...</div>;

  return (
    <div className="credit-cards-page animate-fade-in">
      <header className="cc-header-standard">
        <div className="header-left-cc">
          <button className="back-arrow-cc" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="header-titles">
            <h1>Credit Cards</h1>
            <span>{cards.length} options available</span>
          </div>
        </div>
      </header>

      <div className="cc-content-list">
        {cards.map((card) => (
          <div key={card.id} className="credit-card-item">
            <div className="cc-earn-ribbon">
              <Star size={14} fill="white" color="white" />
              <span>Earn Upto ₹{card.earn_amount}</span>
            </div>

            <div className="cc-card-header-row">
              <div className="cc-card-logo-container">
                <img src={card.logo_url} alt={card.bank_name} className="cc-bank-logo" />
              </div>
              <div className="cc-card-title-group">
                <h2 className="cc-product-name">{card.name}</h2>
                <span className="cc-product-tag">Credit Card</span>
              </div>
            </div>

            <div className="cc-card-features-list">
              {(typeof card.features === 'string' ? JSON.parse(card.features) : card.features).map((feature, idx) => (
                <div key={idx} className="cc-feature-row">
                  <span className="cc-feature-emoji">{feature.icon}</span>
                  <span className="cc-feature-description">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="cc-fees-grid">
              <div className="cc-fee-card">
                <span className="cc-fee-title">Joining Fee</span>
                <span className="cc-fee-amount">₹{card.joining_fee}</span>
              </div>
              <div className="cc-fee-card teal-tint">
                <span className="cc-fee-title">Renewal Fee</span>
                <span className="cc-fee-amount teal-text">₹{card.renewal_fee}</span>
              </div>
            </div>

            <div className="cc-button-group">
              <button className="btn-details-purple">
                <Info size={16} />
                <span>Details</span>
              </button>
              <button className="btn-share-teal">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}

        <div className="browse-categories-section">
          <h2 className="section-title-cc">Browse Other Categories</h2>
          <div className="categories-grid-cc">
            {otherCategories.map((cat, idx) => (
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
  );
};

export default CreditCards;
