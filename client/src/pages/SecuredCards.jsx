import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Info, 
  Share2,
  Lock,
  Zap,
  User,
  ShoppingBag,
  DollarSign,
  Users,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Store,
  CreditCard as CardIcon
} from 'lucide-react';
import './SecuredCards.css';

const SecuredCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      bank: 'Stable Money',
      name: 'Stable Money FD Card',
      earnAmount: '1600',
      features: [
        { icon: '💳', text: 'FD-backed card' },
        { icon: '🏦', text: 'Higher FD returns vs bank average' },
        { icon: '🌐', text: '% digital process' }
      ],
      logo: 'https://stablemoney.in/assets/logo.svg' // Placeholder
    },
    {
      id: 2,
      bank: 'SBM Bank',
      name: 'SBM ZET FD Credit Card',
      earnAmount: '800',
      features: [
        { icon: '💡', text: 'FD start from just ₹2000' },
        { icon: '📱', text: 'Easy approval no income proof' },
        { icon: '💡', text: 'Helps build / improve CIBIL score' }
      ],
      logo: 'https://www.sbmbank.co.in/images/logo.png' // Placeholder
    }
  ];

  const otherCategories = [
    { name: 'Credit Cards', icon: <CardIcon size={20} color="#2563eb" />, bg: '#eff6ff', path: '/credit-cards' },
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

  return (
    <div className="secured-cards-page animate-fade-in">
      {/* Header */}
      <header className="cc-header-standard">
        <div className="header-left-cc">
          <button className="back-arrow-cc" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="header-titles">
            <h1>Secured Cards</h1>
            <span>2 options available</span>
          </div>
        </div>
      </header>

      {/* Cards List */}
      <div className="cc-content-list">
        {cards.map((card) => (
          <div key={card.id} className="credit-card-item">
            <div className="cc-earn-ribbon">
              <Star size={14} fill="white" color="white" />
              <span>Earn Upto ₹{card.earnAmount}</span>
            </div>

            <div className="cc-card-header-row">
              <div className="cc-card-logo-container">
                <img src={card.logo} alt={card.bank} className="cc-bank-logo" />
              </div>
              <div className="cc-card-title-group">
                <h2 className="cc-product-name">{card.name}</h2>
                <span className="cc-product-tag">secured_cards</span>
              </div>
            </div>

            <div className="cc-card-features-list">
              {card.features.map((feature, idx) => (
                <div key={idx} className="cc-feature-row">
                  <span className="cc-feature-emoji">{feature.icon}</span>
                  <span className="cc-feature-description">{feature.text}</span>
                </div>
              ))}
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

        {/* Browse Other Categories Section */}
        <div className="browse-categories-section">
          <h2 className="section-title-cc">Browse Other Categories</h2>
          <div className="categories-grid-cc">
            {otherCategories.map((cat, idx) => (
              <div 
                className="category-item-cc" 
                key={idx}
                onClick={() => {
                  navigate(cat.path);
                }}
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

export default SecuredCards;
