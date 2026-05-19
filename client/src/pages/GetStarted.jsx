import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './GetStarted.css';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="get-started-container animate-fade-in">
      <div className="splash-content">
        <div className="logo-section">
          <img src="/finexprt-logo.png" alt="FinExprt Logo" className="splash-logo" />
        </div>
        <div className="splash-illustration-wrapper">
          <img src="/splash-illustration.png" alt="Welcome Illustration" className="splash-illustration" />
        </div>
        <div className="splash-text">
          <h1>Welcome to FINxPERT Partner</h1>
          <p>Join the fastest growing network of financial experts.</p>
        </div>
      </div>

      <div className="action-section">
        <button className="btn-get-started" onClick={() => navigate('/signup')}>
          <span>Get Started</span>
          <ArrowRight size={24} />
        </button>

        <p className="login-footer-text">
          Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default GetStarted;
