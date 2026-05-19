import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, Info, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import './ApplyProduct.css';

const ApplyProduct = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get('partner');

  const [product, setProduct] = useState(null);
  const [partner, setPartner] = useState(null);
  const [activeTab, setActiveTab] = useState('apply'); // 'apply' | 'details'
  
  const [formData, setFormData] = useState({
    mobile: '',
    fullName: '',
    pincode: '',
    agreed: false
  });
  
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [productRes, partnerRes] = await Promise.all([
          fetch(`http://localhost:5000/api/product/${productId}`),
          fetch(`http://localhost:5000/api/partner/${partnerId}`)
        ]);

        if (productRes.ok) {
          setProduct(await productRes.json());
        }
        if (partnerRes.ok) {
          setPartner(await partnerRes.json());
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (productId && partnerId) fetchDetails();
  }, [productId, partnerId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.fullName) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.pincode) {
      setError('Please enter your pincode.');
      return;
    }
    if (!formData.agreed) {
      setError('You must accept the terms & conditions.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep(true);
      // Mock OTP notification
      alert('Mock OTP sent! Any 4-digit code will work.');
    }, 1000);
  };

  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the OTP.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/leads/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner_id: partnerId,
          product_id: productId,
          customer_name: formData.fullName,
          customer_phone: formData.mobile,
          customer_pincode: formData.pincode
        })
      });

      if (res.ok) {
        // Redirect to official bank URL
        if (product.redirect_url) {
          window.location.href = product.redirect_url;
        } else {
          alert('Lead captured successfully, but no redirect URL is configured for this product.');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit application.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Server error. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="apply-loading">Loading application form...</div>;
  }

  if (!product) {
    return <div className="apply-error">Product not found or unavailable.</div>;
  }

  return (
    <div className="apply-container">
      {/* Header */}
      <header className="apply-header">
        <div className="header-logo-group">
          <img src="/finexprt-logo.png" alt="FinExprt Logo" className="apply-brand-logo" />
          {partner && <span className="apply-partner-name">{partner.name}</span>}
        </div>
      </header>

      {/* Product Banner */}
      <div className="apply-banner-wrapper">
        {product.share_image_url ? (
          <img src={product.share_image_url} alt="Product Banner" className="apply-product-banner" />
        ) : (
          <div className="apply-banner-placeholder">
            <h3>{product.name}</h3>
            <p>Select a Card. Hand - pick yours perks!</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="apply-tabs-container">
        <div className="apply-tabs">
          <button 
            className={`apply-tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveTab('apply')}
          >
            APPLY NOW
          </button>
          <button 
            className={`apply-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            PRODUCT DETAILS
          </button>
        </div>
      </div>

      <div className="apply-content">
        {activeTab === 'apply' ? (
          <div className="apply-form-section animate-fade-in">
            {error && <div className="apply-error-msg">{error}</div>}

            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="apply-form">
                <div className="form-group">
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength="10"
                    className="apply-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="apply-input"
                  />
                </div>

                <div className="form-group select-wrapper">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength="6"
                    className="apply-input"
                  />
                </div>

                <div className="terms-group">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="termsAgreed">
                    I authorise Finxpert to securely store & use my data to call/SMS/whatsapp/email me about its products & have accepted the <a href="#">terms</a> of the <a href="#">privacy policy</a>.
                  </label>
                </div>

                <button type="submit" className="btn-apply-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndSubmit} className="apply-form otp-form">
                <div className="otp-instructions">
                  <ShieldCheck size={40} color="#10b981" />
                  <h4>Verify your Mobile Number</h4>
                  <p>We've sent a 4-digit code to +91 {formData.mobile}</p>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="apply-input otp-input"
                  />
                </div>

                <button type="submit" className="btn-apply-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Verifying & Redirecting...' : 'Verify & Submit'}
                </button>
                <button type="button" className="btn-resend-otp" onClick={() => setOtpStep(false)}>
                  Change Number
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="apply-details-section animate-fade-in">
            <h3 className="section-title">Features</h3>
            <ul className="features-list">
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feat-icon">{feature.icon || '✔️'}</span>
                    <span className="feat-text">{feature.text}</span>
                  </li>
                ))
              ) : (
                <li>
                  <span className="feat-icon">✔️</span>
                  <span className="feat-text">Standard benefits apply for {product.name}</span>
                </li>
              )}
            </ul>

            <h3 className="section-title">Fees & Charges</h3>
            <ul className="fees-list">
              <li>
                <CheckCircle2 size={18} color="#64748b" />
                <span>Joining fee - {product.joining_fee || 'Nil'}</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="#64748b" />
                <span>Annual fee - {product.renewal_fee || 'Nil'}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyProduct;
