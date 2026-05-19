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
  Smartphone,
  Download
} from 'lucide-react';
import './ShareProduct.css';

const ShareProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState('English');
  const [shareFile, setShareFile] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const partnerId = user.id || 'partner';
  
  // Unique link generation
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
        setProduct(data);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(uniqueApplyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
// Removed duplicate copy logic

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
        // If native share fails (e.g. Chrome DevTools on Windows blocks it), 
        // fallback directly to WhatsApp sharing since that is the primary use case.
        fallbackToWhatsApp(); 
      }
    } else {
      fallbackToWhatsApp();
    }
  };

  const handleDownloadImage = async () => {
    if (!product.share_image_url) return;
    try {
      const blob = await getPngBlobFromUrl(product.share_image_url);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.name.replace(/\s+/g, '_')}_Promo.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed', e);
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
            <button className="btn-copy-link" onClick={() => window.open(uniqueApplyLink, '_blank')}>
              <ExternalLink size={20} />
              <span>Apply Now</span>
            </button>
            <button className="btn-main-share" onClick={handleNativeShare}>
              <Share2 size={20} />
              <span>Share Product</span>
            </button>
          </div>
          
          <button className="btn-copy-link" style={{ width: '100%', marginTop: '12px' }} onClick={handleDownloadImage}>
            <Download size={20} />
            <span>Download Promo Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareProduct;
