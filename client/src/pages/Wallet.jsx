import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowDownToLine, Building2, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import './Wallet.css';

const Wallet = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    currentBalance: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, transRes] = await Promise.all([
        axios.get('http://localhost:5000/api/wallet/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/wallet/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setStats(statsRes.data);
      setTransactions(transRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      showNotification({ type: 'error', title: 'Invalid Amount', message: 'Please enter a valid amount' });
      return;
    }

    if (amount > stats.currentBalance) {
      showNotification({ type: 'error', title: 'Insufficient Balance', message: 'You cannot withdraw more than your current balance' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/wallet/withdraw', { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'Withdrawal request submitted successfully' 
      });
      
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchWalletData(); // Refresh stats
    } catch (err) {
      showNotification({ 
        type: 'error', 
        title: 'Error', 
        message: err.response?.data?.message || 'Failed to submit withdrawal request' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="page-content-wrapper wallet-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-icon-box bg-teal">
          <WalletIcon size={18} color="#ffffff" />
        </div>
        <div className="header-text">
          <h2>My Wallet</h2>
          <p>Manage your earnings</p>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <span className="balance-label">Available Balance</span>
          <WalletIcon size={15} color="#ffffff" opacity={0.8} />
        </div>
        <h1 className="main-balance">₹{stats.currentBalance.toLocaleString()}</h1>
        
        <div className="balance-stats-row">
          <div className="balance-stat">
            <span className="stat-label">Total Earned</span>
            <span className="stat-value">₹{stats.totalEarned.toLocaleString()}</span>
          </div>
          <div className="balance-stat text-right">
            <span className="stat-label">Withdrawn</span>
            <span className="stat-value">₹{stats.totalWithdrawn.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="action-buttons-row">
        <button 
          className={`btn-withdraw ${stats.currentBalance <= 0 ? 'disabled' : ''}`}
          onClick={() => setShowWithdrawModal(true)}
        >
          <ArrowDownToLine size={14} />
          Withdraw
        </button>
        <button className="btn-manage-bank" onClick={() => navigate('/manage-bank')}>
          <Building2 size={14} />
          <div className="btn-text">
            <span>Manage</span>
            <span>Bank</span>
          </div>
        </button>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="withdraw-modal animate-slide-up">
            <div className="modal-header">
              <h3>Withdraw Funds</h3>
              <button className="close-btn" onClick={() => setShowWithdrawModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleWithdraw} className="withdraw-form">
              <div className="available-balance-box">
                <span>Available Balance</span>
                <h4>₹{stats.currentBalance.toLocaleString()}</h4>
              </div>

              <div className="input-group">
                <label>Amount to Withdraw</label>
                <div className="amount-input-box">
                  <span className="currency-symbol">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={stats.currentBalance}
                    required
                    autoFocus
                  />
                </div>
                <p className="input-hint">Amount will be transferred to your verified bank account.</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowWithdrawModal(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className={`btn-confirm ${stats.currentBalance <= 0 ? 'disabled' : ''}`} 
                  disabled={isSubmitting || stats.currentBalance <= 0}
                >
                  {isSubmitting ? 'Processing...' : stats.currentBalance <= 0 ? 'Insufficient Balance' : 'Request Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="transactions-section">
        <div className="section-header">
          <h3 className="section-title">Recent Transactions</h3>
          <span className="view-all" onClick={() => navigate('/transactions')}>View All</span>
        </div>
        
        <div className="transaction-list">
          {loading ? (
            <div className="loading-state">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className={`tx-icon ${tx.type === 'earning' ? 'success' : 'withdrawal'}`}>
                  {tx.type === 'earning' ? <CheckCircle2 size={16} /> : <ArrowDownToLine size={16} />}
                </div>
                <div className="tx-info">
                  <h4>{tx.description}</h4>
                  <p>ID: #TRX-{tx.id} • {formatDate(tx.created_at)}</p>
                </div>
                <div className={`tx-amount ${tx.type === 'earning' ? 'positive' : 'negative'}`}>
                  {tx.type === 'earning' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <AlertCircle size={40} color="#cbd5e1" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Wallet;
