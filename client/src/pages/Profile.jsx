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
  Clock,
  MessageSquare,
  Phone,
  UserCheck
} from 'lucide-react';
import KYCModal from '../components/KYCModal';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profileData, setProfileData] = useState(user);
  const [agentCode, setAgentCode] = useState('');
  const [kycStatus, setKycStatus] = useState(null); // null, 'pending', 'approved', 'rejected'
  const [showKycModal, setShowKycModal] = useState(false);
  const [rm, setRm] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch profile details', err);
    }
  };

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

  const fetchRM = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/profile/rm', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRm(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch RM', err);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      setAgentCode(`FIN${1000 + parseInt(user.id)}`);
    } else {
      setAgentCode('FIN1001');
    }
    fetchKycStatus();
    fetchWalletStats();
    fetchRM();
    fetchProfile();
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
      icon: <Settings size={22} />, 
      title: 'Settings', 
      subtitle: 'Manage your profile details & password',
      onClick: () => navigate('/settings')
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
        <button className="profile-settings-gear" onClick={() => navigate('/settings')} title="Settings">
          <Settings size={22} />
        </button>
        <div className="profile-avatar-large">
          {profileData.profile_url ? (
            <img src={`http://localhost:5000${profileData.profile_url}`} alt="Profile" className="profile-avatar-img" />
          ) : (
            (profileData.username || profileData.name || 'M').charAt(0).toUpperCase()
          )}
        </div>
        <h2 className="profile-name-main">{profileData.username || profileData.name || 'Meet'}</h2>
        <p className="profile-email-main">{profileData.email || 'bathlameet5@gmail.com'}</p>
        <p className="profile-phone-main">{profileData.phone || '8168707143'}</p>
        <p className="profile-agent-id-main">ID: {agentCode || 'CK2026109'}</p>
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

      {/* ── Relationship Manager Card ── */}
      <div className="rm-card animate-fade-in">
        <h3 className="rm-title">Your Relationship Manager</h3>
        {rm ? (
          <div className="rm-details">
            <div className="rm-profile-info">
              {rm.profile_url ? (
                <img src={rm.profile_url} alt={rm.name} className="rm-avatar" />
              ) : (
                <div className="rm-avatar-placeholder">{rm.name.charAt(0)}</div>
              )}
              <div className="rm-text-group">
                <h4>{rm.name}</h4>
                <p>Finexprt Relationship Manager</p>
              </div>
            </div>
            <div className="rm-actions">
              {rm.whatsapp && (
                <a href={`https://wa.me/${rm.whatsapp}`} target="_blank" rel="noreferrer" className="btn-rm-action whatsapp">
                  <MessageSquare size={18} /> WhatsApp
                </a>
              )}
              {rm.phone && (
                <a href={`tel:${rm.phone}`} className="btn-rm-action call">
                  <Phone size={18} /> Call
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="rm-empty">
            <UserCheck size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
            <p>An RM will be assigned to you soon.</p>
          </div>
        )}
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
