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
import './InstantLoans.css';

const InstantLoans = () => {
  const navigate = useNavigate();

  const loans = [
    {
      id: 1,
      bank: 'KreditBee',
      name: 'KreditBee Personal Loan',
      earnAmount: '2100',
      features: [
        { icon: '⚡', text: 'Amount up to ₹4 Lakh' },
        { icon: '🌐', text: '100% Online Process' },
        { icon: '💰', text: 'Disbursal in 15 Minutes' }
      ],
      logo: 'https://www.kreditbee.in/images/logo.png'
    },
    {
      id: 2,
      bank: 'MoneyTap',
      name: 'MoneyTap Credit Line',
      earnAmount: '1800',
      features: [
        { icon: '📱', text: 'Flexible Credit Line' },
        { icon: '💡', text: 'No Interest on unused amount' },
        { icon: '⚡', text: 'Instant Approval' }
      ],
      logo: 'https://www.moneytap.com/blog/wp-content/uploads/2017/09/MoneyTap-Logo-1.png'
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
    <div className="instant-loans-page animate-fade-in">
      <header className="cc-header-standard">
        <div className="header-left-cc">
          <button className="back-arrow-cc" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="header-titles">
            <h1>Instant Loan</h1>
            <span>12 options available</span>
          </div>
        </div>
      </header>

      <div className="cc-content-list">
        {loans.map((loan) => (
          <div key={loan.id} className="credit-card-item">
            <div className="cc-earn-ribbon">
              <Star size={14} fill="white" color="white" />
              <span>Earn Upto ₹{loan.earnAmount}</span>
            </div>

            <div className="cc-card-header-row">
              <div className="cc-card-logo-container">
                <img src={loan.logo} alt={loan.bank} className="cc-bank-logo" />
              </div>
              <div className="cc-card-title-group">
                <h2 className="cc-product-name">{loan.name}</h2>
                <span className="cc-product-tag">instant_loan</span>
              </div>
            </div>

            <div className="cc-card-features-list">
              {loan.features.map((feature, idx) => (
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

export default InstantLoans;
