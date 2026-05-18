import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Briefcase, Phone, Mail } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './DigitalID.css';

const DigitalID = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const agentCode = localStorage.getItem('agentCode') || 'CK2026109';
  const [kycStatus, setKycStatus] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/kyc/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setKycStatus(data.status);
        }
      } catch (err) {
        console.error('Failed to fetch KYC status', err);
      }
    };
    fetchKycStatus();
  }, []);

  const isApproved = kycStatus === 'approved';

  const handleDownload = async () => {
    if (!isApproved) return;
    try {
      const element = cardRef.current;
      // Use scale: 3 for high quality image
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      // Use the actual on-screen dimensions for the PDF physical size
      const pdfWidth = element.offsetWidth;
      const pdfHeight = element.offsetHeight;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });
      
      // Add the high-res image compressed into the original dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${user.name || 'Agent'}_Digital_ID.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      showNotification({
        type: 'error',
        title: 'Download Failed',
        message: 'Could not generate your ID card PDF. Please try again.'
      });
    }
  };

  const handleShare = async () => {
    if (!isApproved) return;
    const shareLink = `https://finxpert.com/id/${agentCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Finxpert Digital ID',
          text: `Hi! I'm ${user.name}, a Financial Partner with Finxpert. Connect with me using my Digital ID!`,
          url: shareLink,
        });
      } else {
        await navigator.clipboard.writeText(shareLink);
        showNotification({
          type: 'success',
          title: 'Link Copied',
          message: 'Digital ID link has been copied to your clipboard.'
        });
      }
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=finxpert:${agentCode}`;

  return (
    <div className="digital-id-page animate-fade-in">
      <div className="id-header">
        <button className="btn-back-id" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="id-title-area">
        <h2>Your Digital ID Card</h2>
        {!isApproved && (
          <p className="kyc-warning-text">Complete KYC to share</p>
        )}
      </div>

      <div className="id-card-wrapper">
        <div className="digital-card" ref={cardRef}>
          <div className="card-top">
            <div className="card-brand">
              <h3>Finxpert</h3>
              <p>Financial Partner</p>
            </div>
            <div className="card-avatar">
              {user.name?.charAt(0).toUpperCase() || 'M'}
            </div>
          </div>

          <div className="card-user-name">
            {user.name?.toUpperCase() || 'MEET'}
          </div>

          <div className="card-details">
            <div className="detail-row">
              <Briefcase size={16} />
              <span>ID: {agentCode}</span>
            </div>
            <div className="detail-row">
              <Phone size={16} />
              <span>{user.phone || '8168707143'}</span>
            </div>
            <div className="detail-row">
              <Mail size={16} />
              <span>{user.email || 'bathlameet5@gmail.com'}</span>
            </div>
          </div>

          <div className="card-bottom">
            <div className="member-since">
              <span className="since-label">Member Since</span>
              <span className="since-value">{currentMonthYear}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="id-actions-bar">
        <button 
          className={`action-btn ${!isApproved ? 'disabled' : ''}`}
          onClick={handleDownload}
          disabled={!isApproved}
        >
          <div className="icon-wrapper">
            <Download size={22} />
          </div>
          <span>Download</span>
        </button>

        <button 
          className={`action-btn ${!isApproved ? 'disabled' : ''}`}
          onClick={handleShare}
          disabled={!isApproved}
        >
          <div className="icon-wrapper">
            <Share2 size={22} />
          </div>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default DigitalID;
