import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle2, XCircle,
  ChevronRight, TrendingUp, AlertCircle, Search, Users
} from 'lucide-react';
import axios from 'axios';
import './Leads.css';

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={14} /> },
  completed: { label: 'Approved', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={14} /> },
  pending:  { label: 'Pending',  color: '#ff8c00', bg: '#fff4e6', icon: <Clock size={14} /> },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} /> },
  new:      { label: 'New',      color: '#3b82f6', bg: '#eff6ff', icon: <FileText size={14} /> },
  'in-progress': { label: 'In Progress', color: '#8b5cf6', bg: '#f5f3ff', icon: <TrendingUp size={14} /> }
};

const Leads = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [leadType, setLeadType] = useState('my'); // 'my' or 'team'
  const [search, setSearch] = useState('');
  
  const [myLeads, setMyLeads] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyLeads(res.data.myLeads || []);
      setTeamLeads(res.data.referralLeads || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentLeads = leadType === 'my' ? myLeads : teamLeads;

  const filtered = currentLeads.filter(l => {
    const statusVal = (l.status || 'new').toLowerCase();
    const matchTab = activeTab === 'all' || 
                     (activeTab === 'pending' && (statusVal === 'pending' || statusVal === 'new' || statusVal === 'in-progress')) ||
                     statusVal === activeTab;
    
    const nameMatch = l.customer_name ? l.customer_name.toLowerCase().includes(search.toLowerCase()) : false;
    const serviceMatch = l.service_type ? l.service_type.toLowerCase().includes(search.toLowerCase()) : false;
    
    return matchTab && (nameMatch || serviceMatch);
  });

  const total    = currentLeads.length;
  const pending  = currentLeads.filter(l => ['pending', 'new', 'in-progress'].includes((l.status || '').toLowerCase())).length;
  const approved = currentLeads.filter(l => (l.status || '').toLowerCase() === 'approved').length;
  const rejected = currentLeads.filter(l => (l.status || '').toLowerCase() === 'rejected').length;

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
          <h1 className="leads-hero-title">Applications</h1>
          <p className="leads-hero-desc">Track & manage customer leads</p>
        </div>
        <div className="leads-hero-icon">
          <TrendingUp size={40} color="rgba(255,255,255,0.3)" />
        </div>
      </div>
      
      {/* ── Type Toggle (My Leads / Team Leads) ── */}
      <div className="leads-type-toggle-container">
        <div className="leads-type-toggle">
          <button 
            className={`type-toggle-btn ${leadType === 'my' ? 'active' : ''}`}
            onClick={() => setLeadType('my')}
          >
            <FileText size={16} /> My Leads
          </button>
          <button 
            className={`type-toggle-btn ${leadType === 'team' ? 'active' : ''}`}
            onClick={() => setLeadType('team')}
          >
            <Users size={16} /> Team Leads
          </button>
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
          {loading ? (
             <div className="leads-empty-state">
                <p>Loading leads...</p>
             </div>
          ) : filtered.length === 0 ? (
            <div className="leads-empty-state">
              <div className="leads-empty-icon">
                <AlertCircle size={32} color="var(--secondary)" />
              </div>
              <h3>No applications found</h3>
              <p>{leadType === 'my' ? 'Applications you submit will appear here' : 'Applications submitted by your team will appear here'}</p>
            </div>
          ) : (
            filtered.map(lead => {
              const statusVal = (lead.status || 'new').toLowerCase();
              const status = STATUS_CONFIG[statusVal] || STATUS_CONFIG['new'];
              const dateObj = new Date(lead.created_at);
              const dateStr = isNaN(dateObj) ? '' : dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              
              return (
                <div key={lead.id} className="lead-card">
                  <div className="lead-card-left">
                    <div className="lead-avatar">
                      {lead.customer_name ? lead.customer_name.charAt(0) : '?'}
                    </div>
                    <div className="lead-info">
                      <h4 className="lead-name">{lead.customer_name}</h4>
                      <p className="lead-service">{lead.service_type || 'Service'} {lead.bank ? `· ${lead.bank}` : ''}</p>
                      {leadType === 'team' && lead.agent_name && (
                         <p className="lead-agent-name" style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px', fontWeight: '500' }}>
                           Referred by: {lead.agent_name}
                         </p>
                      )}
                      <p className="lead-date">{dateStr}</p>
                    </div>
                  </div>
                  <div className="lead-card-right">
                    <span 
                      className="lead-status-badge"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.icon} {status.label}
                    </span>
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
