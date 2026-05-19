import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Mail, Phone, ChevronLeft, Save, CheckCircle, Camera, Lock } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Load initial user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        name: user.name || '',
        username: user.username || user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      if (user.profile_url) {
        setPhotoPreview(`http://localhost:5000${user.profile_url}`);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('username', formData.username);
      dataToSend.append('email', formData.email);
      dataToSend.append('phone', formData.phone);
      if (photoFile) {
        dataToSend.append('profile_photo', photoFile);
      }

      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: dataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg(data.message);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.profile_url) {
          setPhotoPreview(`http://localhost:5000${data.user.profile_url}`);
        }
      } else {
        setErrorMsg(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container animate-fade-in">
      <div className="settings-header">
        <button className="btn-back-round" onClick={() => navigate('/profile')}>
          <ChevronLeft size={20} />
        </button>
        <h2>Settings</h2>
      </div>

      <div className="settings-card">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-avatar-section">
            <div className="settings-avatar-wrapper">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="settings-avatar-img" />
              ) : (
                <div className="settings-avatar-placeholder">
                  {(formData.username || formData.name || 'M').charAt(0).toUpperCase()}
                </div>
              )}
              <label htmlFor="profile_photo_input" className="settings-avatar-edit-badge">
                <Camera size={16} />
              </label>
            </div>
            <input
              type="file"
              id="profile_photo_input"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="settings-avatar-title">Profile Photo</div>
            <p className="settings-avatar-subtitle">Tap camera icon to upload a new photo</p>
          </div>

          <div className="form-section-divider"></div>
          <div className="form-section-title">Personal Details</div>

          {/* KYC Name */}
          <div className="settings-input-group">
            <label className="settings-label">KYC Legal Name</label>
            <div className="settings-input-wrapper settings-disabled-wrapper">
              <span className="settings-icon-box"><Lock size={18} /></span>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                placeholder="KYC Legal Name"
                className="settings-input settings-input-readonly"
              />
            </div>
          </div>

          {/* Username */}
          <div className="settings-input-group">
            <label className="settings-label">Display Name / Username</label>
            <div className="settings-input-wrapper">
              <span className="settings-icon-box"><User size={18} /></span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Display Username"
                className="settings-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="settings-input-group">
            <label className="settings-label">Email Address</label>
            <div className="settings-input-wrapper">
              <span className="settings-icon-box"><Mail size={18} /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className="settings-input"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="settings-input-group">
            <label className="settings-label">Phone Number</label>
            <div className="settings-input-wrapper">
              <span className="settings-icon-box"><Phone size={18} /></span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                required
                className="settings-input"
              />
            </div>
          </div>

          {errorMsg && <div className="settings-error-alert">{errorMsg}</div>}
          {successMsg && (
            <div className="settings-success-alert">
              <CheckCircle size={18} /> {successMsg}
            </div>
          )}

          <button type="submit" className="btn-settings-save" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
