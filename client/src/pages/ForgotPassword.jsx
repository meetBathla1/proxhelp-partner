import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import './ForgotPassword.css';

const API_BASE = 'http://localhost:5000';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=verify phone, 3=new password
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');

  // Step 1: Verify email exists
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/forgot-password/verify-email`, { email });
      setMaskedPhone(res.data.maskedPhone);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify phone number
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/forgot-password/verify-phone`, { email, phone });
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Phone number does not match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/forgot-password/reset`, {
        resetToken,
        newPassword,
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const passwordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="forgot-password-container animate-fade-in">
      <header className="forgot-header">
        <button className="forgot-back-btn" onClick={() => step > 1 ? (setStep(step - 1), setError('')) : navigate('/login')}>
          <ArrowLeft size={22} />
        </button>
        <div className="header-text">
          <h1>Reset Password</h1>
          <p>
            {step === 1 && 'Enter your registered email address'}
            {step === 2 && 'Verify your identity'}
            {step === 3 && 'Create a new password'}
          </p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span>1</span>
        </div>
        <div className={`step-line ${step > 1 ? 'active' : ''}`}></div>
        <div className={`step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span>2</span>
        </div>
        <div className={`step-line ${step > 2 ? 'active' : ''}`}></div>
        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>
          <span>3</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Step 1: Email */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="forgot-form">
          <div className="step-icon-wrapper">
            <Mail size={40} />
          </div>
          <p className="step-description">
            Enter the email address associated with your account and we'll help you reset your password.
          </p>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading-row"><span className="spinner" /> Verifying...</span>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      )}

      {/* Step 2: Phone Verification */}
      {step === 2 && (
        <form onSubmit={handlePhoneSubmit} className="forgot-form">
          <div className="step-icon-wrapper verify">
            <ShieldCheck size={40} />
          </div>
          <p className="step-description">
            For security, please enter the phone number registered with <strong>{email}</strong>.
          </p>
          <div className="phone-hint">
            <Phone size={16} />
            <span>Phone ending in <strong>{maskedPhone}</strong></span>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={20} />
              <input
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading-row"><span className="spinner" /> Verifying...</span>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === 3 && !success && (
        <form onSubmit={handlePasswordReset} className="forgot-form">
          <div className="step-icon-wrapper success">
            <Lock size={40} />
          </div>
          <p className="step-description">
            Identity verified! Create a strong new password for your account.
          </p>
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <div className={`input-wrapper ${passwordMismatch ? 'input-error' : ''} ${passwordMatch ? 'input-success' : ''}`}>
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(p => !p)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordMismatch && (
              <p className="field-hint hint-error"><AlertCircle size={13} /> Passwords do not match</p>
            )}
            {passwordMatch && (
              <p className="field-hint hint-success"><CheckCircle size={13} /> Passwords match</p>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={loading || passwordMismatch}>
            {loading ? (
              <span className="loading-row"><span className="spinner" /> Resetting...</span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}

      <p className="back-to-login" onClick={() => navigate('/login')}>
        ← Back to Login
      </p>
    </div>
  );
};

export default ForgotPassword;
