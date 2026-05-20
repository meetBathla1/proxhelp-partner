import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink, HelpCircle, FileText, CheckCircle, Info } from 'lucide-react';
import './OfflinePartners.css';
import './FinancialProductModal.css';

const OfflinePartners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    const fetchOfflinePartners = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/offline-partners');
        const data = await res.json();
        setPartners(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching offline partners:', err);
        setIsLoading(false);
      }
    };
    fetchOfflinePartners();
  }, []);

  const handleShare = (partner) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const partnerId = user.id || 'partner';
    const trackingLink = `${window.location.origin}/apply/offline_${partner.id}?partner=${partnerId}`;
    const shareText = `Connect with ${partner.bank_name} for offline banking applications!\n\nApply here: ${trackingLink}`;

    // Attempt native share if on mobile, otherwise copy
    if (navigator.share) {
      navigator.share({
        title: partner.bank_name,
        text: shareText
      }).catch(err => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleApply = (partner) => {
    navigate(`/apply-offline/${partner.id}`);
  };

  if (isLoading) return <div className="loading-screen">Loading Offline Partners...</div>;

  return (
    <div className="offline-partners-page animate-fade-in">
      <header className="offline-header">
        <button className="btn-back-circle" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Offline Bank Applications</h1>
      </header>

      <div className="offline-content">
        <div className="offline-partners-list">
          {partners.map((partner) => {
            const features = typeof partner.features === 'string'
              ? JSON.parse(partner.features)
              : (partner.features || ['Documents Upload', 'Dedicated Support']);

            return (
              <div key={partner.id} className="offline-partner-card">
                <div className="card-top-info">
                  <div 
                    className="logo-container" 
                    onClick={() => setSelectedPartner(partner)}
                    title="Click for Details"
                  >
                    <img src={partner.logo_url} alt={partner.bank_name} className="bank-logo-img" />
                  </div>

                  <div className="details-container">
                    <div className="bank-name-row">
                      <h3 
                        onClick={() => setSelectedPartner(partner)}
                        title="Click for Details"
                      >
                        {partner.bank_name}
                      </h3>
                      <span className="status-badge active-status">Active</span>
                    </div>

                    <div className="features-grid">
                      <div className="feature-item">
                        <FileText size={16} className="feature-icon doc-icon" />
                        <span>{features[0] || 'Documents Upload'}</span>
                      </div>
                      <div className="feature-item">
                        <HelpCircle size={16} className="feature-icon support-icon" />
                        <span>{features[1] || 'Dedicated Support'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-actions-row">
                  <button className="btn-action-share" onClick={() => handleShare(partner)}>
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button className="btn-action-apply" onClick={() => handleApply(partner)}>
                    <span>Apply Now</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="product-details-modal-overlay" onClick={() => setSelectedPartner(null)}>
          <div className="product-details-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPartner.bank_name} Details</h3>
              <button className="btn-close-modal" onClick={() => setSelectedPartner(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-brand-info">
                <img src={selectedPartner.logo_url} alt={selectedPartner.bank_name} className="modal-bank-logo" />
                <div className="modal-brand-text">
                  <h4>{selectedPartner.bank_name}</h4>
                  <span className="modal-earn-badge">Offline Banking Partner</span>
                </div>
              </div>
              
              <div className="modal-section">
                <h5>About This Partner</h5>
                <p>
                  Access direct and offline banking applications for major credit card, loan, and account opening services in association with {selectedPartner.bank_name}. Submit documents, consult dedicated RMs, and track offline leads on the partner dashboard.
                </p>
              </div>

              <div className="modal-section">
                <h5>Key Features</h5>
                <ul className="modal-features-list">
                  {(typeof selectedPartner.features === 'string' ? JSON.parse(selectedPartner.features) : (selectedPartner.features || ['Documents Upload', 'Dedicated Support'])).map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} style={{ color: '#059669', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#334155' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px 24px' }}>
              <button 
                className="btn-action-share" 
                onClick={() => { handleShare(selectedPartner); setSelectedPartner(null); }}
                style={{ height: '44px', padding: '0 16px', margin: 0 }}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button 
                className="btn-action-apply" 
                onClick={() => { handleApply(selectedPartner); setSelectedPartner(null); }}
                style={{ height: '44px', padding: '0 16px', margin: 0 }}
              >
                <span>Apply Now</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflinePartners;
