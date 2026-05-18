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
  DollarSign,
  Users,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Store,
  CreditCard as CardIcon
} from 'lucide-react';
import './DematAccounts.css';

const DematAccounts = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      bank: 'Upstox',
      name: 'Upstox Demat & Trading Account',
      earnAmount: '400',
      features: [
        { icon: '💹', text: 'Zero Brokerage on Delivery' },
        { icon: '📱', text: 'Free AMC for 1st Year' },
        { icon: '⚡', text: 'Open Account in 5 Minutes' }
      ],
      logo: 'https://upstox.com/app/uploads/2021/04/upstox-logo.png'
    },
    {
      id: 2,
      bank: 'Angel One',
      name: 'Angel One Smart Money',
      earnAmount: '500',
      features: [
        { icon: '🚀', text: 'Free Demat Account' },
        { icon: '💰', text: '₹0 Intraday Brokerage' },
        { icon: '📊', text: 'Personalized Advisory' }
      ],
      logo: 'https://www.angelone.in/wp-content/themes/angel-one/assets/images/angel-one-logo.svg'
    }
  ];

  const categories = [
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
    <div className="demat-accounts-page animate-fade-in">
      <header className="cc-header-standard">
        <div className="header-left-cc">
          <button className="back-arrow-cc" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="header-titles">
            <h1>Demat Account</h1>
            <span>10 brokers active</span>
          </div>
        </div>
      </header>

      <div className="cc-content-list">
        {products.map((product) => (
          <div key={product.id} className="credit-card-item">
            <div className="cc-earn-ribbon blue">
              <Star size={14} fill="white" color="white" />
              <span>Earn ₹{product.earnAmount}</span>
            </div>

            <div className="cc-card-header-row">
              <div className="cc-card-logo-container">
                <img src={product.logo} alt={product.bank} className="cc-bank-logo" />
              </div>
              <div className="cc-card-title-group">
                <h2 className="cc-product-name">{product.name}</h2>
                <span className="cc-product-tag">demat_account</span>
              </div>
            </div>

            <div className="cc-card-features-list">
              {product.features.map((feature, idx) => (
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
            {categories.map((cat, idx) => (
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

export default DematAccounts;
