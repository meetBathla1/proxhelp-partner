import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';
import './ShareProduct.css';

const ShareProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('benefits'); // 'benefits', 'refer', 'video', 'perform', 'tc', 'faqs'
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedTc, setExpandedTc] = useState(null);
  const [shareFile, setShareFile] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const partnerId = user.id || 'partner';
  const uniqueApplyLink = `${window.location.origin}/apply/${productId}?partner=${partnerId}`;

  const getPngBlobFromUrl = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 800;
        canvas.height = img.height || 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/png');
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/product/${productId}`);
        const data = await res.json();

        // Parse JSON columns safely
        const parsedData = {
          ...data,
          stats: typeof data.stats === 'string' ? JSON.parse(data.stats) : (data.stats || { earnings: 0, leads: 0, sales: 0 }),
          benefits: typeof data.benefits === 'string' ? JSON.parse(data.benefits) : (data.benefits || []),
          whom_to_refer: typeof data.whom_to_refer === 'string' ? JSON.parse(data.whom_to_refer) : (data.whom_to_refer || []),
          training_videos: typeof data.training_videos === 'string' ? JSON.parse(data.training_videos) : (data.training_videos || []),
          how_to_perform_steps: typeof data.how_to_perform_steps === 'string' ? JSON.parse(data.how_to_perform_steps) : (data.how_to_perform_steps || []),
          terms_conditions: typeof data.terms_conditions === 'string' ? JSON.parse(data.terms_conditions) : (data.terms_conditions || []),
          faqs: typeof data.faqs === 'string' ? JSON.parse(data.faqs) : (data.faqs || []),
          marketing_materials: typeof data.marketing_materials === 'string' ? JSON.parse(data.marketing_materials) : (data.marketing_materials || [])
        };

        setProduct(parsedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product && product.share_image_url) {
      const preloadImage = async () => {
        try {
          const blob = await getPngBlobFromUrl(product.share_image_url);
          const file = new File([blob], `promo.png`, { type: 'image/png' });
          setShareFile(file);
        } catch (e) {
          console.error('Failed to preload share image', e);
        }
      };
      preloadImage();
    }
  }, [product]);

  const handleNativeShare = async () => {
    const shareTextWithLink = `Apply for ${product.name} using my partner link!\n\n${uniqueApplyLink}`;
    const shareTextWithoutLink = `Apply for ${product.name} using my partner link!`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let sharePayload = {
      title: product.name,
      text: shareTextWithoutLink,
      url: uniqueApplyLink
    };

    if (isMobile && shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
      sharePayload = {
        title: product.name,
        text: shareTextWithLink,
        files: [shareFile]
      };
    }

    const fallbackToWhatsApp = () => {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareTextWithLink)}`;
      window.open(waUrl, '_blank');
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch (err) {
        console.error('Share failed:', err);
        fallbackToWhatsApp();
      }
    } else {
      fallbackToWhatsApp();
    }
  };

  if (isLoading) return <div className="loading-screen">Loading Product Details...</div>;
  if (!product) return <div className="error-screen">Product not found</div>;

  return (
    <div className="pdp-page-container">
      {/* Sticky Header Section */}
      <div className="pdp-sticky-header">
        <div className="header-navigation">
          <button className="pdp-back-btn" onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate(product?.service_route_path || '/home');
            }
          }}>
            <ArrowLeft size={20} />
          </button>
          <h2>Product Details</h2>
          <button className="share-top-btn" onClick={handleNativeShare}>
            <Share2 size={20} />
          </button>
        </div>

        {/* Purple Gradient Product Card */}
        <div className="pdp-hero-card">
          <div className="product-identity-row">
            <img src={product.logo_url} alt="" className="pdp-logo" />
            <div className="product-name-info">
              <h3>{product.name}</h3>
              <p>{product.bank_name}</p>
            </div>
          </div>

          <div className="pdp-stats-grid">
            <div className="stat-pdp-item">
              <span className="stat-val">₹{product.stats?.earnings || 0}</span>
              <span className="stat-lbl">Total Earnings</span>
            </div>
            <div className="stat-pdp-item">
              <span className="stat-val">{product.stats?.leads || 0}</span>
              <span className="stat-lbl">Total Leads</span>
            </div>
            <div className="stat-pdp-item">
              <span className="stat-val">{product.stats?.sales || 0}</span>
              <span className="stat-lbl">Total Sales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pdp-scroll-content">

        {/* Subcategory Selectable Chips */}
        <div className="subcategory-chips-container">
          {[
            { id: 'benefits', label: 'Benefits' },
            { id: 'refer', label: 'Whom to Refer?' },
            { id: 'perform', label: 'How to Perform?' },
            { id: 'tc', label: 'T&C' },
            { id: 'faqs', label: 'FAQs' }
          ].map(chip => (
            <button
              key={chip.id}
              className={`chip-btn ${activeSubTab === chip.id ? 'active' : ''}`}
              onClick={() => setActiveSubTab(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Render Details Content Blocks */}
        <div className="pdp-tab-content-block">
          {activeSubTab === 'benefits' && (
            <div className="details-subtab-section animate-fade-in">
              <h4 className="section-title">Product Benefits</h4>
              <div className="benefits-checklist">
                {(product.benefits || []).map((b, idx) => (
                  <div key={idx} className="benefit-check-card">
                    <span className="check-icon">{b.icon || '✔'}</span>
                    <div className="benefit-check-text">
                      <strong>{b.title}</strong>
                      {b.desc && <p>{b.desc}</p>}
                    </div>
                  </div>
                ))}
                {(!product.benefits || product.benefits.length === 0) && (
                  <div className="benefit-check-card">
                    <span className="check-icon">✔</span>
                    <div className="benefit-check-text">
                      <strong>High Reward Rate</strong>
                      <p>Maximize your financial potential and earnings with exclusive payouts.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Fees Section */}
              <div className="fees-card" style={{ marginTop: '20px' }}>
                <h4>Fees & Charges</h4>
                <div className="fees-row">
                  <span>Joining Fee:</span>
                  <strong>{product.joining_fee || 'Nil'}</strong>
                </div>
                <div className="fees-row">
                  <span>Renewal Fee:</span>
                  <strong>{product.renewal_fee || 'Nil'}</strong>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'refer' && (
            <div className="details-subtab-section animate-fade-in">
              <h4 className="section-title">Ideal Target Audience</h4>
              <div className="refer-grid">
                {(product.whom_to_refer || []).map((w, idx) => (
                  <div key={idx} className="refer-card">
                    <span className="refer-icon">🎯</span>
                    <strong>{w.title}</strong>
                    {w.subtitle && <p>{w.subtitle}</p>}
                  </div>
                ))}
                {(!product.whom_to_refer || product.whom_to_refer.length === 0) && (
                  <>
                    <div className="refer-card">
                      <span className="refer-icon">💼</span>
                      <strong>Salaried Employees</strong>
                      <p>Ideal for regular income earners looking for rewards.</p>
                    </div>
                    <div className="refer-card">
                      <span className="refer-icon">✈</span>
                      <strong>Travelers</strong>
                      <p>Great for individuals who spend heavily on transport/lounge.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}


          {activeSubTab === 'perform' && (
            <div className="details-subtab-section animate-fade-in">
              <h4 className="section-title">How to Perform (Steps)</h4>
              <div className="steps-timeline">
                {(product.how_to_perform_steps || []).map((s, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="step-number-badge">{idx + 1}</div>
                    <div className="timeline-content">
                      <strong>{s.title}</strong>
                      {s.desc && <p>{s.desc}</p>}
                    </div>
                  </div>
                ))}
                {(!product.how_to_perform_steps || product.how_to_perform_steps.length === 0) && (
                  <>
                    <div className="timeline-item">
                      <div className="step-number-badge">1</div>
                      <div className="timeline-content">
                        <strong>Share Link</strong>
                        <p>Share your unique application link to customer via WhatsApp/SMS.</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="step-number-badge">2</div>
                      <div className="timeline-content">
                        <strong>Customer Details</strong>
                        <p>Customer completes verification and KYC digitally.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'tc' && (
            <div className="details-subtab-section animate-fade-in">
              <h4 className="section-title">Terms & Conditions</h4>
              <div className="accordions-wrap">
                {(product.terms_conditions || []).map((t, idx) => (
                  <div key={idx} className={`accordion-card ${expandedTc === idx ? 'expanded' : ''}`}>
                    <div className="accordion-trigger" onClick={() => setExpandedTc(expandedTc === idx ? null : idx)}>
                      <strong>{t.title}</strong>
                      {expandedTc === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {expandedTc === idx && (
                      <div className="accordion-panel animate-fade-in">
                        <p>{t.content}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(!product.terms_conditions || product.terms_conditions.length === 0) && (
                  <div className="accordion-card expanded">
                    <div className="accordion-trigger">
                      <strong>Eligibility Criteria</strong>
                    </div>
                    <div className="accordion-panel">
                      <p>Applicant must be age 21 to 60 with matching salary requirements.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'faqs' && (
            <div className="details-subtab-section animate-fade-in">
              <h4 className="section-title">Frequently Asked Questions</h4>
              <div className="accordions-wrap">
                {(product.faqs || []).map((f, idx) => (
                  <div key={idx} className={`accordion-card ${expandedFaq === idx ? 'expanded' : ''}`}>
                    <div className="accordion-trigger" onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}>
                      <strong>Q. {f.q}</strong>
                      {expandedFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {expandedFaq === idx && (
                      <div className="accordion-panel animate-fade-in">
                        <p>{f.a}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(!product.faqs || product.faqs.length === 0) && (
                  <div className="accordion-card expanded">
                    <div className="accordion-trigger">
                      <strong>Q. What is the minimum salary?</strong>
                    </div>
                    <div className="accordion-panel">
                      <p>The minimum monthly salary required is ₹20,000 for salaried applicants.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="pdp-sticky-bottom-cta">
        <div className="cta-left-info">
          <span>Earn Upto</span>
          <strong>{product.earn_amount.includes('%') ? product.earn_amount : `₹${product.earn_amount || 'XXXX'}`}</strong>
        </div>
        <button className="btn-main-share-cta" onClick={handleNativeShare}>
          <Share2 size={16} />
          <span>Share to Customer</span>
        </button>
      </div>
    </div>
  );
};

export default ShareProduct;
