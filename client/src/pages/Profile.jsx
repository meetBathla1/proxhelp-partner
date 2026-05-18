import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Info, 
  History, 
  IdCard, 
  HelpCircle, 
  Settings, 
  ChevronRight, 
  LogOut,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';
import KYCModal from '../components/KYCModal';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [agentCode, setAgentCode] = useState('');
  const [kycStatus, setKycStatus] = useState(null); // null, 'pending', 'approved', 'rejected'
  const [showKycModal, setShowKycModal] = useState(false);

  const fetchKycStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/kyc/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const data = await res.json();
      setKycStatus(data.status); // might be null if never submitted
    } catch (err) {
      console.error('Failed to fetch KYC status', err);
    }
  };

  const [walletStats, setWalletStats] = useState({ totalEarned: 0 });

  const fetchWalletStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/wallet/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWalletStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch wallet stats', err);
    }
  };

  useEffect(() => {
    let storedCode = localStorage.getItem('agentCode');
    if (!storedCode) {
      const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
      storedCode = `CK${randomDigits}`;
      localStorage.setItem('agentCode', storedCode);
    }
    setAgentCode(storedCode);
    fetchKycStatus();
    fetchWalletStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { 
      icon: <History size={22} />, 
      title: 'Transaction History', 
      subtitle: 'View all your earnings & withdrawals',
      onClick: () => navigate('/transactions')
    },
    { 
      icon: <IdCard size={22} />, 
      title: 'My ID Card', 
      subtitle: 'View and share your agent ID card',
      onClick: () => navigate('/digital-id')
    },
    { 
      icon: <HelpCircle size={22} />, 
      title: 'Help & Support', 
      subtitle: 'Raise a ticket or view your queries',
      onClick: () => navigate('/support')
    },
    { 
      icon: <Shield size={22} />, 
      title: 'Privacy Policy', 
      subtitle: 'Read our privacy policy',
      onClick: () => navigate('/privacy-policy')
    },
  ];

  return (
    <div className="profile-container animate-fade-in">
      {/* ── User Header ── */}
      <div className="profile-header-main">
        <div className="profile-avatar-large">
          {user.name?.charAt(0).toUpperCase() || 'M'}
        </div>
        <h2 className="profile-name-main">{user.name || 'Meet'}</h2>
        <p className="profile-email-main">{user.email || 'bathlameet5@gmail.com'}</p>
        <p className="profile-phone-main">{user.phone || '8168707143'}</p>
      </div>

      {/* ── KYC Banner ── */}
      {kycStatus === 'approved' ? (
        <div className="kyc-banner approved">
          <div className="kyc-info-row">
            <div className="kyc-icon-circle green">
              <CheckCircle size={24} />
            </div>
            <div className="kyc-text">
              <h3 style={{ color: '#10b981' }}>KYC Approved</h3>
              <p>Your identity is verified. All features unlocked.</p>
            </div>
          </div>
        </div>
      ) : kycStatus === 'pending' ? (
        <div className="kyc-banner pending">
          <div className="kyc-info-row">
            <div className="kyc-icon-circle orange">
              <Clock size={24} />
            </div>
            <div className="kyc-text">
              <h3 style={{ color: 'var(--primary)' }}>KYC Under Verification</h3>
              <p>We are reviewing your documents.</p>
            </div>
          </div>
        </div>
      ) : kycStatus === 'rejected' ? (
        <div className="kyc-banner rejected">
          <div className="kyc-info-row">
            <div className="kyc-icon-circle red">
              <Info size={24} />
            </div>
            <div className="kyc-text">
              <h3 style={{ color: '#ef4444' }}>KYC Rejected</h3>
              <p>Your documents were rejected. Please submit them again.</p>
            </div>
          </div>
          <button className="btn-start-kyc" style={{ background: '#ef4444', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)' }} onClick={() => setShowKycModal(true)}>
            Do KYC Again
          </button>
        </div>
      ) : (
        <div className="kyc-banner">
          <div className="kyc-info-row">
            <div className="kyc-icon-circle">
              <Info size={24} />
            </div>
            <div className="kyc-text">
              <h3>Complete KYC Verification</h3>
              <p>Verify your identity to unlock all features</p>
            </div>
          </div>
          <button className="btn-start-kyc" onClick={() => setShowKycModal(true)}>
            Start KYC
          </button>
        </div>
      )}

      {/* ── Agent Stats Card ── */}
      <div className="agent-stats-card">
        <div className="stat-group">
          <span className="stat-label">Agent ID</span>
          <span className="stat-value">{agentCode || 'CK2026109'}</span>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="quick-links-section">
        <h3 className="section-title">Quick Links</h3>
        <div className="menu-list">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item" onClick={item.onClick}>
              <div className="menu-icon-box">
                {item.icon}
              </div>
              <div className="menu-info">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </div>
          ))}

          {/* Logout Button */}
          <div className="logout-item" onClick={handleLogout}>
            <div className="logout-icon-box">
              <LogOut size={22} />
            </div>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {showKycModal && (
        <KYCModal 
          onClose={() => setShowKycModal(false)} 
          onSuccess={() => {
            setShowKycModal(false);
            fetchKycStatus(); // Refresh status after submission
          }} 
        />
      )}
    </div>
  );
};

export default Profile;
