import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  CreditCard, 
  Lock, 
  Zap, 
  User,
  Briefcase,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Store,
  Users,
  PiggyBank
} from 'lucide-react';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();

  const allServices = [
    { name: 'Credit Card', icon: <CreditCard size={24} color="#2563eb" />, bg: '#eff6ff' },
    { name: 'Secured Card', icon: <Lock size={24} color="#16a34a" />, bg: '#f0fdf4' },
    { name: 'Instant Loan', icon: <Zap size={24} color="#ea580c" />, bg: '#fff7ed' },
    { name: 'Personal Loan', icon: <User size={24} color="#0d9488" />, bg: '#f0fdfa' },
    { name: 'Business Loans', icon: <Briefcase size={24} color="#92400e" />, bg: '#fef3c7' },
    { name: 'Micro Loan', icon: <DollarSign size={24} color="#059669" />, bg: '#ecfdf5' },
    { name: 'Group Loan', icon: <Users size={24} color="#7c3aed" />, bg: '#f5f3ff' },
    { name: 'Savings Account', icon: <PiggyBank size={24} color="#e11d48" />, bg: '#fff1f2' },
    { name: 'Demat Account', icon: <TrendingUp size={24} color="#2563eb" />, bg: '#eff6ff' },
    { name: 'Insurance', icon: <ShieldCheck size={24} color="#16a34a" />, bg: '#f0fdf4' }
  ];

  return (
    <div className="services-container animate-fade-in">
      <header className="services-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>All Services</h1>
      </header>

      <div className="services-grid">
        {allServices.map((service, index) => (
          <div 
            className="service-item" 
            key={index}
            onClick={() => {
              if (service.name === 'Credit Card') navigate('/credit-cards');
              if (service.name === 'Secured Card') navigate('/secured-cards');
              if (service.name === 'Personal Loan') navigate('/personal-loan');
              if (service.name === 'Instant Loan') navigate('/instant-loan');
              if (service.name === 'Business Loans') navigate('/business-loan');
              if (service.name === 'Micro Loan') navigate('/micro-loan');
              if (service.name === 'Group Loan') navigate('/group-loan');
              if (service.name === 'Savings Account') navigate('/savings-account');
              if (service.name === 'Demat Account') navigate('/demat-account');
              if (service.name === 'Insurance') navigate('/insurance');
            }}
          >
            <div className="service-icon-box" style={{ backgroundColor: service.bg }}>
              {service.icon}
            </div>
            <span className="service-name">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
