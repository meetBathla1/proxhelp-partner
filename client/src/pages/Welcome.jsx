import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page-container animate-fade-in">
      <div className="welcome-header">
        <img src="/finexprt-logo.png" alt="FinExprt Logo" className="welcome-logo" />
      </div>

      <div className="welcome-illustration-container">
        <img src="/welcome-illustration.png" alt="Financial Growth" className="welcome-illustration" />
      </div>

      <div className="welcome-text-content">
        <h1>Welcome to FinXpert Partner</h1>
        <p>
          Your all-in-one financial partner. Manage loans, insurance, 
          investments and more in one place.
        </p>
      </div>

      <div className="welcome-footer">
        <div className="pagination-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        
        <button className="btn-continue" onClick={() => navigate('/signup')}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Welcome;
