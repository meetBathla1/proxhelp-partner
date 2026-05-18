import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  ChevronRight,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  FileCheck,
  Eye,
  HelpCircle,
  MessageSquare,
  Landmark
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [partners, setPartners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [kycs, setKycs] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'banner', 'product', 'kyc_details'
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

      if (activeTab === 'overview' || activeTab === 'banners') {
        const bannerRes = await fetch('http://localhost:5000/api/banners');
        setBanners(await bannerRes.json());
      }

      if (activeTab === 'products') {
        const serviceRes = await fetch('http://localhost:5000/api/services');
        const sData = await serviceRes.json();
        setServices(sData);
        if (!selectedCategory && sData.length > 0) setSelectedCategory(sData[0].name);

        if (selectedCategory) {
          const productRes = await fetch(`http://localhost:5000/api/products/${selectedCategory}`);
          setProducts(await productRes.json());
        }
      }

      if (activeTab === 'partners') {
        const partnerRes = await fetch('http://localhost:5000/api/admin/partners', { headers });
        setPartners(await partnerRes.json());
      }

      if (activeTab === 'leads') {
        const leadsRes = await fetch('http://localhost:5000/api/dashboard/leads', { headers });
        setLeads(await leadsRes.json());
      }

      if (activeTab === 'wallet') {
        const payoutRes = await fetch('http://localhost:5000/api/admin/payouts', { headers });
        setPayouts(await payoutRes.json());
      }

      if (activeTab === 'kyc') {
        const kycRes = await fetch('http://localhost:5000/api/admin/kyc', { headers });
        setKycs(await kycRes.json());
      }

      if (activeTab === 'support') {
        const ticketRes = await fetch('http://localhost:5000/api/admin/support/tickets', { headers });
        setSupportTickets(await ticketRes.json());
      }

      if (activeTab === 'bank_verification') {
        const bankRes = await fetch('http://localhost:5000/api/admin/bank-accounts', { headers });
        setBankAccounts(await bankRes.json());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const serviceId = services.find(s => s.name === selectedCategory)?.id;
    const productData = {
      ...formData,
      service_id: serviceId,
      features: formData.features || [] // Should be an array of {icon, text}
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleUpdateKycStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/kyc/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Update KYC error:', err);
    }
  };

  const handleUpdateBankStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/bank-account/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Update Bank status error:', err);
    }
  };

  const handleUpdateTicketStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/support/ticket/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Update ticket error:', err);
    }
  };

  const handleUpdatePayoutStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/payout/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Update payout status error:', err);
    }
  };

  const renderSidebar = () => (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <div className="logo-dot"></div>
        <span>Proxhelp Admin</span>
      </div>
      <nav className="admin-nav">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          <LayoutDashboard size={20} /> Overview
        </button>
        <button className={activeTab === 'banners' ? 'active' : ''} onClick={() => setActiveTab('banners')}>
          <ImageIcon size={20} /> Home Banners
        </button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
          <ShoppingBag size={20} /> Products & Pricing
        </button>
        <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => setActiveTab('leads')}>
          <TrendingUp size={20} /> Manage Leads
        </button>
        <button className={activeTab === 'partners' ? 'active' : ''} onClick={() => setActiveTab('partners')}>
          <Users size={20} /> Partner Network
        </button>
        <button className={activeTab === 'kyc' ? 'active' : ''} onClick={() => setActiveTab('kyc')}>
          <FileCheck size={20} /> KYC Approvals
        </button>
        <button className={activeTab === 'bank_verification' ? 'active' : ''} onClick={() => setActiveTab('bank_verification')}>
          <Landmark size={20} /> Bank Verification
        </button>
        <button className={activeTab === 'support' ? 'active' : ''} onClick={() => setActiveTab('support')}>
          <HelpCircle size={20} /> Support Tickets
        </button>
        <button className={activeTab === 'wallet' ? 'active' : ''} onClick={() => setActiveTab('wallet')}>
          <DollarSign size={20} /> Payouts & Wallet
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
          <Settings size={20} /> Settings
        </button>
      </nav>
      <div className="admin-user-profile">
        <div className="admin-avatar">A</div>
        <div className="admin-info">
          <p className="admin-name">Administrator</p>
          <p className="admin-role">Super Admin</p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="admin-content-section animate-fade-in">
      <h1 className="admin-page-title">Dashboard Overview</h1>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap blue"><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Partners</span>
            <span className="stat-value">{partners.length || '1,248'}</span>
          </div>
          <div className="stat-trend positive">+12%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap purple"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Services</span>
            <span className="stat-value">{services.length || '10'}</span>
          </div>
          <div className="stat-trend positive">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap orange"><DollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Active Banners</span>
            <span className="stat-value">{banners.length}</span>
          </div>
          <div className="stat-trend">Live</div>
        </div>
      </div>

      <div className="admin-recent-grid">
        <div className="recent-card list-card">
          <h3>Recent Partners</h3>
          <div className="recent-list">
            {partners.slice(0, 5).map(p => (
              <div key={p.id} className="list-item">
                <div className="item-avatar">{p.name.charAt(0)}</div>
                <div className="item-details">
                  <p className="item-main">{p.name}</p>
                  <p className="item-sub">{p.email}</p>
                </div>
                <span className={`item-status ${p.role}`}>{p.role}</span>
              </div>
            ))}
          </div>
          <button className="btn-view-all-admin" onClick={() => setActiveTab('partners')}>View All Partners <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">Products & Pricing</h1>
        <button className="btn-add-admin" onClick={() => { setModalType('product'); setFormData({ features: [] }); setShowModal(true); }}>
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="admin-category-tabs">
        {services.map(s => (
          <button
            key={s.id}
            className={`cat-tab ${selectedCategory === s.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(s.name)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bank / Provider</th>
              <th>Product Name</th>
              <th>Earn Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="td-bank">
                    <img src={product.logo_url} alt="" className="mini-logo" />
                    <strong>{product.bank_name}</strong>
                  </div>
                </td>
                <td>{product.name}</td>
                <td className="earn-text">₹{product.earn_amount}</td>
                <td><span className={`status-pill ${product.is_active ? 'active' : 'inactive'}`}>{product.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon-admin edit" onClick={() => { setModalType('product'); setFormData(product); setShowModal(true); }}><Edit3 size={18} /></button>
                    <button className="btn-icon-admin delete"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="empty-state-admin">No products found in this category.</div>}
      </div>
    </div>
  );

  const renderBanners = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">Manage Home Banners</h1>
        <button className="btn-add-admin" onClick={() => { setModalType('banner'); setFormData({}); setShowModal(true); }}>
          <Plus size={20} /> Add New Banner
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bank Name</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => (
              <tr key={banner.id}>
                <td><strong>{banner.bank_name}</strong></td>
                <td>{banner.title}</td>
                <td><span className={`status-pill ${banner.is_active ? 'active' : 'inactive'}`}>{banner.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>{new Date(banner.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon-admin edit" onClick={() => { setModalType('banner'); setFormData(banner); setShowModal(true); }}><Edit3 size={18} /></button>
                    <button className="btn-icon-admin delete"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">Partner Network</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Contact Info</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="td-bank">
                    <div className="item-avatar small">{p.name.charAt(0)}</div>
                    <strong>{p.name}</strong>
                  </div>
                </td>
                <td>
                  <div className="contact-info-td">
                    <span>{p.email}</span>
                    <span className="sub-text">{p.phone}</span>
                  </div>
                </td>
                <td><span className={`role-badge ${p.role}`}>{p.role}</span></td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon-admin edit" title="Edit Partner"><Edit3 size={18} /></button>
                    <button className="btn-icon-admin delete" title="Delete Partner"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">Manage Leads</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Service</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td><strong>{lead.customer_name}</strong></td>
                <td>{lead.service_type}</td>
                <td><span className={`status-pill ${lead.status}`}>{lead.status}</span></td>
                <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    className="admin-status-select"
                    value={lead.status}
                    onChange={(e) => {/* Handle status update */ }}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <div className="empty-state-admin">No leads found.</div>}
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="admin-content-section animate-fade-in">
      <h1 className="admin-page-title">Payouts & Wallet</h1>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap orange"><DollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Payouts</span>
            <span className="stat-value">₹{payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap blue"><CheckCircle2 size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Paid Out</span>
            <span className="stat-value">₹{payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <h3 className="table-inner-title">Recent Payout Requests</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Amount</th>
              <th>Requested Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="td-partner">
                    <strong>{p.partner_name}</strong>
                    <span>{p.partner_email}</span>
                  </div>
                </td>
                <td><strong>₹{parseFloat(p.amount).toLocaleString()}</strong></td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td><span className={`status-pill ${p.status}`}>{p.status}</span></td>
                <td>
                  <div className="action-btns">
                    {p.status === 'pending' && (
                      <>
                        <button className="btn-icon-admin success" title="Approve" onClick={() => handleUpdatePayoutStatus(p.id, 'completed')}><CheckCircle2 size={18} /></button>
                        <button className="btn-icon-admin delete" title="Reject" onClick={() => handleUpdatePayoutStatus(p.id, 'failed')}><X size={18} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payouts.length === 0 && <div className="empty-state-admin">No pending payout requests.</div>}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">Support Tickets</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supportTickets.map(ticket => (
              <tr key={ticket.id}>
                <td>
                  <div className="td-partner">
                    <strong>{ticket.partner_name}</strong>
                    <span>{ticket.partner_email}</span>
                  </div>
                </td>
                <td><span className="ticket-category-admin">{ticket.category}</span></td>
                <td className="td-subject" title={ticket.message}>
                  <strong>{ticket.subject}</strong>
                  <p className="msg-preview">{ticket.message.substring(0, 50)}...</p>
                </td>
                <td><span className={`status-pill ${ticket.status.replace(' ', '-')}`}>{ticket.status}</span></td>
                <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    className="admin-status-select"
                    value={ticket.status}
                    onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="under process">Under Process</option>
                    <option value="resolved">Resolved</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {supportTickets.length === 0 && <div className="empty-state-admin">No support tickets found.</div>}
      </div>
    </div>
  );

  const renderBankAccounts = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">Bank Account Verification</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Bank Name</th>
              <th>Account Holder</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bankAccounts.map(b => (
              <tr key={b.id}>
                <td>
                  <div className="td-partner">
                    <strong>{b.partner_name}</strong>
                    <span>{b.partner_email}</span>
                  </div>
                </td>
                <td><strong>{b.bank_name}</strong></td>
                <td>{b.account_holder_name}</td>
                <td><code className="acc-number">{b.account_number}</code></td>
                <td><code className="ifsc-code">{b.ifsc_code}</code></td>
                <td><span className={`status-pill ${b.status}`}>{b.status}</span></td>
                <td>
                  <div className="action-btns">
                    {b.status === 'pending' ? (
                      <>
                        <button className="btn-icon-admin success" title="Approve" onClick={() => handleUpdateBankStatus(b.id, 'approved')}><CheckCircle2 size={18} /></button>
                        <button className="btn-icon-admin delete" title="Reject" onClick={() => handleUpdateBankStatus(b.id, 'rejected')}><X size={18} /></button>
                      </>
                    ) : (
                      <button className="btn-icon-admin edit" title="Reset to Pending" onClick={() => handleUpdateBankStatus(b.id, 'pending')}><Edit3 size={18} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bankAccounts.length === 0 && <div className="empty-state-admin">No bank account submissions found.</div>}
      </div>
    </div>
  );

  const renderKyc = () => (
    <div className="admin-content-section animate-fade-in">
      <div className="section-header-admin">
        <h1 className="admin-page-title">KYC Verifications</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycs.map(k => (
              <tr key={k.id}>
                <td><strong>{k.full_name}</strong></td>
                <td>{k.phone}</td>
                <td><span className={`status-pill ${k.status}`}>{k.status}</span></td>
                <td>{new Date(k.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-view-kyc"
                    onClick={() => { setModalType('kyc_details'); setFormData(k); setShowModal(true); }}
                  >
                    <Eye size={16} /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {kycs.length === 0 && <div className="empty-state-admin">No KYC applications found.</div>}
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {renderSidebar()}
      <main className="admin-main-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'banners' && renderBanners()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'partners' && renderPartners()}
        {activeTab === 'kyc' && renderKyc()}
        {activeTab === 'bank_verification' && renderBankAccounts()}
        {activeTab === 'support' && renderSupport()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'settings' && <div className="admin-content-section"><h1>Settings Coming Soon</h1></div>}
      </main>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal animate-slide-up">
            <div className="modal-header">
              <h3>
                {modalType === 'banner' ? (formData.id ? 'Edit Banner' : 'New Banner') :
                  modalType === 'kyc_details' ? 'Review KYC Details' :
                    (formData.id ? 'Edit Product' : 'New Product')}
              </h3>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>

            <form className="admin-form" onSubmit={modalType === 'product' ? handleSaveProduct : modalType === 'banner' ? handleSaveBanner : (e) => e.preventDefault()}>
              <div className="form-scroll-area">
                {modalType === 'kyc_details' ? (
                  <div className="kyc-review-wrap">

                    {/* Action Bar at the top for easy access */}
                    {formData.status === 'pending' && (
                      <div className="kyc-action-bar">
                        <div className="action-info">
                          <h4>Pending Approval</h4>
                          <p>Review the documents and take action.</p>
                        </div>
                        <div className="action-buttons">
                          <button type="button" className="btn-danger" onClick={() => handleUpdateKycStatus(formData.id, 'rejected')}>
                            <X size={18} /> Reject
                          </button>
                          <button type="button" className="btn-success" onClick={() => handleUpdateKycStatus(formData.id, 'approved')}>
                            <CheckCircle2 size={18} /> Approve KYC
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="kyc-details-grid">
                      <div className="detail-item">
                        <span className="detail-icon">👤</span>
                        <div className="detail-text-wrap">
                          <strong>Full Name</strong>
                          <span>{formData.full_name}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">💳</span>
                        <div className="detail-text-wrap">
                          <strong>Aadhaar No.</strong>
                          <span>{formData.aadhar_number}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🪪</span>
                        <div className="detail-text-wrap">
                          <strong>PAN No.</strong>
                          <span className="pan-text">{formData.pan_number?.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="kyc-doc-list">
                      <h4 className="doc-list-title">Uploaded Documents</h4>
                      <div className="doc-list-item">
                        <span>Profile Photo</span>
                        <button type="button" className="btn-view-doc" onClick={() => setPreviewImage(`http://localhost:5000${formData.profile_photo_url}`)}>
                          <Eye size={16} /> View Document
                        </button>
                      </div>
                      <div className="doc-list-item">
                        <span>Aadhar Front</span>
                        <button type="button" className="btn-view-doc" onClick={() => setPreviewImage(`http://localhost:5000${formData.aadhar_front_url}`)}>
                          <Eye size={16} /> View Document
                        </button>
                      </div>
                      <div className="doc-list-item">
                        <span>Aadhar Back</span>
                        <button type="button" className="btn-view-doc" onClick={() => setPreviewImage(`http://localhost:5000${formData.aadhar_back_url}`)}>
                          <Eye size={16} /> View Document
                        </button>
                      </div>
                      <div className="doc-list-item">
                        <span>PAN Card</span>
                        <button type="button" className="btn-view-doc" onClick={() => setPreviewImage(`http://localhost:5000${formData.pan_card_url}`)}>
                          <Eye size={16} /> View Document
                        </button>
                      </div>
                    </div>
                  </div>
                ) : modalType === 'product' ? (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. AU Bank Altura Card"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={formData.bank_name || ''}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        placeholder="e.g. AU Small Finance Bank"
                      />
                    </div>
                    <div className="form-group">
                      <label>Logo URL</label>
                      <input
                        type="text"
                        value={formData.logo_url || ''}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                        placeholder="https://logo.url/bank.svg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Earn Amount (e.g. 2300 or 2.5%)</label>
                      <input
                        type="text"
                        value={formData.earn_amount || ''}
                        onChange={(e) => setFormData({ ...formData, earn_amount: e.target.value })}
                        placeholder="2300"
                      />
                    </div>
                    <div className="form-group">
                      <label>Joining Fee</label>
                      <input
                        type="text"
                        value={formData.joining_fee || ''}
                        onChange={(e) => setFormData({ ...formData, joining_fee: e.target.value })}
                        placeholder="499 + GST"
                      />
                    </div>
                    <div className="form-group">
                      <label>Renewal Fee</label>
                      <input
                        type="text"
                        value={formData.renewal_fee || ''}
                        onChange={(e) => setFormData({ ...formData, renewal_fee: e.target.value })}
                        placeholder="Free"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Shareable Image URL (Promo Visual)</label>
                      <input
                        type="text"
                        value={formData.share_image_url || ''}
                        onChange={(e) => setFormData({ ...formData, share_image_url: e.target.value })}
                        placeholder="https://image.url/promo.jpg"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Share Description (For Partner Social Sharing)</label>
                      <textarea
                        value={formData.share_description || ''}
                        onChange={(e) => setFormData({ ...formData, share_description: e.target.value })}
                        placeholder="Short description for sharing on WhatsApp/Social media..."
                      ></textarea>
                    </div>

                    <div className="form-group full-width">
                      <label>Official Bank Redirect URL</label>
                      <input
                        type="url"
                        value={formData.redirect_url || ''}
                        onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                        placeholder="https://apply.hdfcbank.com/..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Key Features</label>
                      <div className="features-builder">
                        {formData.features?.map((f, idx) => (
                          <div key={idx} className="feature-input-row">
                            <input
                              type="text"
                              className="feat-icon"
                              value={f.icon}
                              onChange={(e) => {
                                const newFeats = [...formData.features];
                                newFeats[idx].icon = e.target.value;
                                setFormData({ ...formData, features: newFeats });
                              }}
                              placeholder="💰"
                            />
                            <input
                              type="text"
                              className="feat-text"
                              value={f.text}
                              onChange={(e) => {
                                const newFeats = [...formData.features];
                                newFeats[idx].text = e.target.value;
                                setFormData({ ...formData, features: newFeats });
                              }}
                              placeholder="Feature description"
                            />
                            <button type="button" onClick={() => {
                              const newFeats = formData.features.filter((_, i) => i !== idx);
                              setFormData({ ...formData, features: newFeats });
                            }} className="btn-remove-feat"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button type="button" className="btn-add-feat" onClick={() => {
                          setFormData({ ...formData, features: [...(formData.features || []), { icon: '✅', text: '' }] });
                        }}>
                          <Plus size={14} /> Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-grid">
                    {/* Banner Form Fields */}
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={formData.bank_name || ''}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        placeholder="e.g. HDFC Bank"
                      />
                    </div>
                    <div className="form-group">
                      <label>Main Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Lifetime Free Card"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Subtitle / Description</label>
                      <textarea
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Banner description text..."
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Background Color</label>
                      <div className="color-picker-wrap">
                        <input
                          type="color"
                          value={formData.bg_color || '#f4f5f9'}
                          onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                        />
                        <span>{formData.bg_color || '#f4f5f9'}</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Accent Color</label>
                      <div className="color-picker-wrap">
                        <input
                          type="color"
                          value={formData.accent_color || '#E31E24'}
                          onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                        />
                        <span>{formData.accent_color || '#E31E24'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-actions">
                {modalType === 'kyc_details' ? (
                  <button type="button" className="btn-secondary-admin" onClick={() => setShowModal(false)}>Close</button>
                ) : (
                  <>
                    <button type="button" className="btn-secondary-admin" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn-primary-admin">
                      <Save size={18} /> {formData.id ? 'Update' : 'Save'} {modalType === 'banner' ? 'Banner' : 'Product'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={e => e.stopPropagation()}>
            <button className="btn-close-preview" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
            <img src={previewImage} alt="Document Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
