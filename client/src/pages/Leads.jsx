import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle2, XCircle,
  ChevronRight, TrendingUp, AlertCircle, Search
} from 'lucide-react';
import './Leads.css';

const DEMO_LEADS = [
  { id: 1, name: 'Rahul Sharma', service: 'Credit Card', bank: 'HDFC Bank', status: 'approved', date: '2024-05-10', amount: '₹2,300' },
  { id: 2, name: 'Priya Verma', service: 'Personal Loan', bank: 'IndusInd Bank', status: 'pending', date: '2024-05-12', amount: '₹2.60%' },
  { id: 3, name: 'Amit Kumar', service: 'Savings Account', bank: 'AU Bank', status: 'pending', date: '2024-05-13', amount: '₹800' },
  { id: 4, name: 'Sneha Patel', service: 'Demat Account', bank: 'Upstox', status: 'rejected', date: '2024-05-14', amount: '₹400' },
  { id: 5, name: 'Vikram Singh', service: 'Instant Loan', bank: 'KreditBee', status: 'approved', date: '2024-05-15', amount: '₹3.20%' },
];

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={14} /> },
  pending:  { label: 'Pending',  color: '#ff8c00', bg: '#fff4e6', icon: <Clock size={14} /> },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} /> },
};

const Leads = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [leads] = useState(DEMO_LEADS);

  const filtered = leads.filter(l => {
    const matchTab = activeTab === 'all' || l.status === activeTab;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                        l.service.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const total    = leads.length;
  const pending  = leads.filter(l => l.status === 'pending').length;
  const approved = leads.filter(l => l.status === 'approved').length;
  const rejected = leads.filter(l => l.status === 'rejected').length;

  const tabs = [
    { key: 'all',      label: 'All',      count: total },
    { key: 'pending',  label: 'Pending',  count: pending },
    { key: 'approved', label: 'Approved', count: approved },
    { key: 'rejected', label: 'Rejected', count: rejected },
  ];

  return (
    <div className="leads-page-wrapper animate-fade-in">

      {/* ── Hero Header ── */}
      <div className="leads-hero">
        <div className="leads-hero-content">
          <p className="leads-hero-subtitle">Partner Dashboard</p>
          <h1 className="leads-hero-title">My Applications</h1>
          <p className="leads-hero-desc">Track & manage all your customer leads</p>
        </div>
        <div className="leads-hero-icon">
          <TrendingUp size={40} color="rgba(255,255,255,0.3)" />
        </div>
      </div>

      {/* ── Stats Cards Grid ── */}
      <div className="leads-stats-grid">
        <div className="leads-stat-card navy">
          <div className="lsc-icon"><FileText size={20} /></div>
          <div className="lsc-info">
            <span className="lsc-value">{total}</span>
            <span className="lsc-label">Total</span>
          </div>
          <div className="lsc-bar" />
        </div>
        <div className="leads-stat-card orange">
          <div className="lsc-icon"><Clock size={20} /></div>
          <div className="lsc-info">
            <span className="lsc-value">{pending}</span>
            <span className="lsc-label">Pending</span>
          </div>
          <div className="lsc-bar" />
        </div>
        <div className="leads-stat-card green">
          <div className="lsc-icon"><CheckCircle2 size={20} /></div>
          <div className="lsc-info">
            <span className="lsc-value">{approved}</span>
            <span className="lsc-label">Approved</span>
          </div>
          <div className="lsc-bar" />
        </div>
        <div className="leads-stat-card red">
          <div className="lsc-icon"><XCircle size={20} /></div>
          <div className="lsc-info">
            <span className="lsc-value">{rejected}</span>
            <span className="lsc-label">Rejected</span>
          </div>
          <div className="lsc-bar" />
        </div>
      </div>

      <div className="leads-body">

        {/* ── Search Bar ── */}
        <div className="leads-search-wrap">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or service..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="leads-search-input"
          />
        </div>

        {/* ── Tabs ── */}
        <div className="leads-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`leads-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className={`leads-tab-count ${activeTab === tab.key ? 'active' : ''}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Lead Cards ── */}
        <div className="leads-list">
          {filtered.length === 0 ? (
            <div className="leads-empty-state">
              <div className="leads-empty-icon">
                <AlertCircle size={32} color="var(--secondary)" />
              </div>
              <h3>No applications found</h3>
              <p>Applications you submit will appear here</p>
            </div>
          ) : (
            filtered.map(lead => {
              const status = STATUS_CONFIG[lead.status];
              return (
                <div key={lead.id} className="lead-card">
                  <div className="lead-card-left">
                    <div className="lead-avatar">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="lead-info">
                      <h4 className="lead-name">{lead.name}</h4>
                      <p className="lead-service">{lead.service} · {lead.bank}</p>
                      <p className="lead-date">{new Date(lead.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="lead-card-right">
                    <span 
                      className="lead-status-badge"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.icon} {status.label}
                    </span>
                    <p className="lead-earn">Earn: <strong>{lead.amount}</strong></p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
