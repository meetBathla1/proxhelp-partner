import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, UploadCloud, Info, CheckCircle } from 'lucide-react';
import './KYCModal.css';

const KYCModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    aadharNumber: '',
    panNumber: '',
  });

  const [files, setFiles] = useState({
    profile_photo: null,
    aadhar_front: null,
    aadhar_back: null,
    pan_card: null,
  });

  const [previews, setPreviews] = useState({
    profile_photo: '',
    aadhar_front: '',
    aadhar_back: '',
    pan_card: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'panNumber') val = val.toUpperCase();
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [fieldName]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.fullName || !formData.aadharNumber || !formData.panNumber) {
      return setError('Please fill all text fields.');
    }
    if (!files.profile_photo || !files.aadhar_front || !files.aadhar_back || !files.pan_card) {
      return setError('Please upload all required documents.');
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('aadharNumber', formData.aadharNumber);
    submitData.append('panNumber', formData.panNumber);
    submitData.append('profile_photo', files.profile_photo);
    submitData.append('aadhar_front', files.aadhar_front);
    submitData.append('aadhar_back', files.aadhar_back);
    submitData.append('pan_card', files.pan_card);

    try {
      const response = await fetch('http://localhost:5000/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      if (response.status === 401 || response.status === 403) {
        setError('Session expired. Please close this modal, log in again, and retry.');
        return;
      }

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(result.message || 'Submission failed. Try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="kyc-modal-overlay">
      <div className="kyc-modal animate-slide-up">
        
        {/* Header */}
        <div className="kyc-modal-header">
          <button className="kyc-back-btn" onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <div className="kyc-title-box">
            <h2>KYC Verification</h2>
            <p>Complete your profile</p>
          </div>
        </div>

        {/* Content */}
        <div className="kyc-modal-content">
          
          <div className="kyc-info-banner">
            <Info size={20} className="info-icon" />
            <span>Complete KYC verification to unlock all features</span>
          </div>

          {error && <div className="kyc-error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            
            {/* Profile Photo */}
            <div className="kyc-form-group">
              <label>Profile Photo *</label>
              <div className="profile-upload-container">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="profile_photo" 
                  onChange={(e) => handleFileChange(e, 'profile_photo')}
                  hidden 
                />
                <label htmlFor="profile_photo" className="profile-upload-circle">
                  {previews.profile_photo ? (
                    <img src={previews.profile_photo} alt="Profile Preview" className="preview-img-circle" />
                  ) : (
                    <>
                      <div className="cam-icon-box"><UploadCloud size={20} /></div>
                      <span>Upload Photo</span>
                    </>
                  )}
                </label>
                <p className="upload-hint">Tap to upload your profile photo</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="kyc-form-group">
              <label>Full Name *</label>
              <div className="kyc-input-wrap">
                <span className="kyc-field-icon">👤</span>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Enter full name as per Aadhar" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            {/* Aadhar Details */}
            <div className="kyc-form-group">
              <label>Aadhar Card *</label>
              <div className="kyc-input-wrap">
                <span className="kyc-field-icon">💳</span>
                <input 
                  type="text" 
                  name="aadharNumber"
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength="12"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="kyc-upload-row">
                {/* Aadhar Front */}
                <div className="kyc-upload-box">
                  <input type="file" accept="image/*" id="aadhar_front" onChange={(e) => handleFileChange(e, 'aadhar_front')} hidden />
                  <label htmlFor="aadhar_front" className="upload-area">
                    {previews.aadhar_front ? (
                      <img src={previews.aadhar_front} alt="Aadhar Front" className="preview-img" />
                    ) : (
                      <>
                        <UploadCloud size={24} className="up-icon" />
                        <span className="up-title">Aadhaar Front</span>
                        <span className="up-sub">Tap to upload</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Aadhar Back */}
                <div className="kyc-upload-box">
                  <input type="file" accept="image/*" id="aadhar_back" onChange={(e) => handleFileChange(e, 'aadhar_back')} hidden />
                  <label htmlFor="aadhar_back" className="upload-area">
                    {previews.aadhar_back ? (
                      <img src={previews.aadhar_back} alt="Aadhar Back" className="preview-img" />
                    ) : (
                      <>
                        <UploadCloud size={24} className="up-icon" />
                        <span className="up-title">Aadhaar Back</span>
                        <span className="up-sub">Tap to upload</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* PAN Details */}
            <div className="kyc-form-group">
              <label>PAN Card *</label>
              <div className="kyc-input-wrap">
                <span className="kyc-field-icon">🪪</span>
                <input 
                  type="text" 
                  name="panNumber"
                  placeholder="Enter 10-character PAN"
                  maxLength="10"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  style={{ textTransform: 'uppercase' }}
                  required 
                />
              </div>

              <div className="kyc-upload-box full-width">
                <input type="file" accept="image/*" id="pan_card" onChange={(e) => handleFileChange(e, 'pan_card')} hidden />
                <label htmlFor="pan_card" className="upload-area">
                  {previews.pan_card ? (
                    <img src={previews.pan_card} alt="PAN Card" className="preview-img" />
                  ) : (
                    <>
                      <UploadCloud size={24} className="up-icon" />
                      <span className="up-title">Upload PAN Card</span>
                      <span className="up-sub">Tap to upload</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button type="submit" className="btn-submit-kyc" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit KYC'} →
            </button>

          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default KYCModal;
