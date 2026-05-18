import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Phone, 
  User, 
  ExternalLink,
  Info,
  Globe,
  Smartphone
} from 'lucide-react';
import './ShareProduct.css';

const ShareProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState('English');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const partnerId = user.id || 'partner';
  
  // Unique link generation
  const uniqueApplyLink = `${window.location.origin}/apply/${productId}?partner=${partnerId}`;
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/product/${productId}`);
        const data = await res.json();
        setProduct(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(uniqueApplyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
// Removed duplicate copy logic

  const handleNativeShare = async () => {
    const shareData = {
      title: product.name,
      text: `Apply for ${product.name} using my partner link!`,
      url: uniqueApplyLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) return <div className="loading-screen">Preparing Shareable Content...</div>;
  if (!product) return <div className="error-screen">Product not found</div>;

  return (
    <div className="share-product-page animate-fade-in">
      <header className="share-header">
        <button className="btn-back-circle" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Share Product</h1>
      </header>

      <div className="share-content-scroll">
        {/* Dynamic Service Image Section */}
        <div className="shareable-image-card">
          <div className="main-visual">
            {product.share_image_url ? (
              <img src={product.share_image_url} alt="Service Visual" className="service-promo-img" />
            ) : (
              <div className="placeholder-visual" style={{ background: `linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)` }}>
                <Globe size={60} color="rgba(255,255,255,0.2)" />
                <h3>{product.name}</h3>
                <p>Branded Image Placeholder</p>
              </div>
            )}
          </div>

          <div className="partner-identity-bar">
            <div className="partner-avatar-small">
              {user.name?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div className="partner-text-info">
              <span className="p-name">{user.name || 'Partner'}</span>
              <span className="p-phone">
                {user.phone ? (user.phone.startsWith('+91') ? user.phone : `+91 ${user.phone}`) : '+91 0000000000'}
              </span>
            </div>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="benefits-preview-section">
          <div className="benefits-header">
            <CheckCircle2 size={18} className="text-primary" />
            <h3>Product Benefits</h3>
          </div>
          
          <div className="share-description-box">
            <p>
              {product.share_description || `Experience the best of ${product.bank_name} with ${product.name}. Earn high rewards and enjoy exclusive benefits tailored for you.`}
            </p>
            <div className="apply-link-preview">
              <span className="link-label">Apply Now:</span>
              <a href={uniqueApplyLink} target="_blank" rel="noopener noreferrer" className="link-text">
                {uniqueApplyLink}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="share-actions-container">

          <div className="action-buttons-row">
            <button className="btn-copy-link" onClick={handleCopyLink}>
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button className="btn-main-share" onClick={handleNativeShare}>
              <Share2 size={20} />
              <span>Share Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareProduct;
