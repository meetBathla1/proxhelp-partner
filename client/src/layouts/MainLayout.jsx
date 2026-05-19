import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  FileText, 
  Wallet, 
  User,
  Calculator as CalculatorIcon,
  Bell
} from 'lucide-react';
import './MainLayout.css';
import '../pages/Home.css'; // For header styles

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/wallet/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.currentBalance || 0);
        }
      } catch (err) {
        console.error('Failed to fetch wallet balance', err);
      }
    };
    
    if (isHomePage) {
      fetchBalance();
    }
  }, [isHomePage, location.pathname]);

  return (
    <div className="app-container">
      {/* User Profile Header (Only visible on Home) */}
      {isHomePage && (
        <header className="mobile-header profile-header">
          <div className="header-left" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <div className="profile-avatar" style={{ overflow: 'hidden' }}>
              {user.profile_url ? (
                <img src={`http://localhost:5000${user.profile_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name?.charAt(0).toUpperCase() || 'M'
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name || 'User'}</span>
              <div className="wallet-balance-small">
                <span className="wallet-icon">💳</span>
                <span>₹{parseFloat(balance).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn-rounded header-wallet-btn" onClick={() => navigate('/wallet')}>
              <Wallet size={20} className="text-green" />
            </button>
            <button className="icon-btn-rounded" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar (Matching Screenshot) */}
      <nav className="bottom-nav">
        <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <HomeIcon size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/leads" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FileText size={24} />
          <span>Leads</span>
        </NavLink>
        <NavLink to="/calculator" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <CalculatorIcon size={24} />
          <span>Calculator</span>
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Wallet size={24} />
          <span>Wallet</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainLayout;
