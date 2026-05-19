import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Lock,
  Zap,
  User,
  Store,
  DollarSign,
  Users,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Star,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Map icon names to Lucide components
  const iconMap = {
    CreditCard: <CreditCard size={24} color="#2563eb" />,
    Lock: <Lock size={24} color="#16a34a" />,
    Zap: <Zap size={24} color="#ea580c" />,
    User: <User size={24} color="#0d9488" />,
    Store: <Store size={24} color="#92400e" />,
    DollarSign: <DollarSign size={24} color="#059669" />,
    Users: <Users size={24} color="#7c3aed" />,
    PiggyBank: <PiggyBank size={24} color="#e11d48" />,
    TrendingUp: <TrendingUp size={24} color="#2563eb" />,
    ShieldCheck: <ShieldCheck size={24} color="#16a34a" />
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, serviceRes] = await Promise.all([
          fetch('http://localhost:5000/api/banners'),
          fetch('http://localhost:5000/api/services')
        ]);

        const bannerData = await bannerRes.json();
        const serviceData = await serviceRes.json();

        setBanners(bannerData);
        setQuickActions(serviceData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto Slider Logic
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (isLoading) {
    return <div className="loading-screen">Loading Proxhelp...</div>;
  }

  return (
    <div className="home-content-wrapper animate-fade-in">

      {/* Promotional Banner Carousel */}
      {banners.length > 0 && (
        <div className="promo-carousel-wrapper">
          <div className="promo-banner" style={{ backgroundColor: banners[activeSlide].bg_color }}>
            <div className="promo-content">
              <div className="bank-logo-placeholder">
                <div className="bank-icon-box" style={{ backgroundColor: banners[activeSlide].accent_color }}></div>
                <span className="bank-name">{banners[activeSlide].bank_name}</span>
              </div>
              <h2 className="promo-title">{banners[activeSlide].title}</h2>
              <p className="promo-subtitle">{banners[activeSlide].subtitle}</p>
            </div>
            <div className="promo-image-container">
              <img src={banners[activeSlide].image_url} alt="Banners" className="promo-cards-img" />
            </div>
          </div>

          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`indicator-dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="section-container quick-actions-section">
        <div className="section-header-row">
          <div className="section-title-wrapper">
            <div className="title-accent-bar"></div>
            <div>
              <h3 className="section-title">Quick Actions</h3>
              <p className="section-subtitle">Explore our popular products</p>
            </div>
          </div>
          <button className="btn-view-all" onClick={() => navigate('/services')}>
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="quick-actions-grid">
          {quickActions.slice(0, 12).map((action, index) => (
            <div
              className="action-item"
              key={index}
              onClick={() => navigate(action.route_path)}
            >
              <div className="action-icon-circle" style={{ backgroundColor: action.bg_color }}>
                {iconMap[action.icon_name] || <Zap size={24} />}
              </div>
              <span className="action-name">{action.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products - Right Swipe */}
      <div className="section-container featured-products-section">
        <div className="section-header-row">
          <div className="section-title-wrapper">
            <div className="title-accent-bar"></div>
            <div>
              <h3 className="section-title">Featured Products</h3>
              <p className="section-subtitle">High commission products</p>
            </div>
          </div>
          <button className="btn-view-all">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="featured-cards-horizontal-scroll">
          {/* Swiggy HDFC Card */}
          <div className="featured-card horizontal">
            <div className="featured-card-header">
              <div className="product-logo-box">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" alt="HDFC" className="bank-logo-img" />
              </div>
              <div className="earn-badge">
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <span>Earn Upto ₹2300</span>
              </div>
            </div>
            <div className="featured-card-body">
              <h4>Swiggy HDFC Bank Card</h4>
              <p>Get up to 10% Cashback on Swiggy & more benefits</p>
            </div>
            <div className="featured-card-footer">
              <button className="btn-details" onClick={() => navigate('/credit-cards')}>View Details</button>
            </div>
          </div>

          {/* IndusInd Personal Loan */}
          <div className="featured-card horizontal">
            <div className="featured-card-header">
              <div className="product-logo-box">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/IndusInd_Bank_logo.svg" alt="IndusInd" className="bank-logo-img" />
              </div>
              <div className="earn-badge green">
                <Star size={14} fill="#10b981" color="#10b981" />
                <span>Earn Upto 2.60%</span>
              </div>
            </div>
            <div className="featured-card-body">
              <h4>IndusInd Bank Personal Loan</h4>
              <p>Quick digital process with attractive interest rates</p>
            </div>
            <div className="featured-card-footer">
              <button className="btn-details" onClick={() => navigate('/personal-loan')}>View Details</button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-container testimonials-section">
        <div className="section-header-row">
          <div className="section-title-wrapper">
            <div className="title-accent-bar blue"></div>
            <div>
              <h3 className="section-title">Listen with our partner says</h3>
              <p className="section-subtitle">Real experiences from our partners</p>
            </div>
          </div>
        </div>

        <div className="testimonials-horizontal-scroll">
          <div className="testimonial-card horizontal">
            <div className="testimonial-header">
              <div className="user-avatar-circle">AV</div>
              <div className="user-info">
                <h4>Amit Verma</h4>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />)}
                </div>
              </div>
            </div>
            <p className="testimonial-text">"Finxpert has completely changed how I manage my clients' financial needs. The payouts are fast and the platform is so easy to use!"</p>
          </div>

          <div className="testimonial-card horizontal">
            <div className="testimonial-header">
              <div className="user-avatar-circle pink">PS</div>
              <div className="user-info">
                <h4>Priya Sharma</h4>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />)}
                </div>
              </div>
            </div>
            <p className="testimonial-text">"The best part is the support team. Whenever I have a doubt about a product, they are there to help me out. Highly recommended!"</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
