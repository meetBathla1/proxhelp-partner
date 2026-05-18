import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Gift,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './Signup.css';

const API_BASE = 'http://localhost:5000';

const Signup = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Live password mismatch indicator
  const passwordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const passwordMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (error) setError('');
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // Returns true if field is touched AND empty (for red border)
  const isFieldError = (field) => touched[field] && !formData[field].trim();

  /* ── CLIENT-SIDE VALIDATION BEFORE API CALL ── */
  const validate = () => {
    // Mark all required fields as touched so errors show
    setTouched({ fullName: true, phone: true, email: true, password: true, confirmPassword: true });

    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit phone number.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email address is required.');
      return false;
    }
    if (!formData.password) {
      setError('Password is required.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter them.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Scroll to top of form so user sees any error banner
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/register`, {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim() || undefined,
      });

      // Persist session
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setSuccess(`Welcome, ${res.data.user.name}! Account created. Redirecting...`);
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.request ? 'Cannot reach server. Is the backend running on port 5000?' : err.message);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container animate-fade-in" ref={formRef}>
      <header className="signup-header">
        <button className="signup-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-text">
          <h1>Create Account</h1>
          <p>Join FinXpert Partner and start earning</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="signup-form" noValidate>

        {/* ── Error Banner ── */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Success Banner ── */}
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Full Name */}
        <div className="form-group">
          <label>Full Name *</label>
          <div className={`input-wrapper ${isFieldError('fullName') ? 'input-error' : ''}`}>
            <User className="input-icon" size={20} />
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {isFieldError('fullName') && (
            <p className="field-hint hint-error"><AlertCircle size={13} /> Full name is required</p>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number *</label>
          <div className={`input-wrapper ${isFieldError('phone') ? 'input-error' : ''}`}>
            <Phone className="input-icon" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {isFieldError('phone') && (
            <p className="field-hint hint-error"><AlertCircle size={13} /> Phone number is required</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address *</label>
          <div className={`input-wrapper ${isFieldError('email') ? 'input-error' : ''}`}>
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {isFieldError('email') && (
            <p className="field-hint hint-error"><AlertCircle size={13} /> Email is required</p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password *</label>
          <div className={`input-wrapper ${isFieldError('password') ? 'input-error' : ''}`}>
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(p => !p)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {isFieldError('password') && (
            <p className="field-hint hint-error"><AlertCircle size={13} /> Password is required</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password *</label>
          <div className={`input-wrapper ${passwordMismatch ? 'input-error' : ''} ${passwordMatch ? 'input-success' : ''}`}>
            <Lock className="input-icon" size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(p => !p)}
            >
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

        {/* Referral Code */}
        <div className="form-group">
          <label>Referral Code (Optional)</label>
          <div className="input-wrapper">
            <Gift className="input-icon" size={20} />
            <input
              type="text"
              name="referralCode"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary signup-submit"
          disabled={loading || passwordMismatch}
        >
          {loading ? (
            <span className="loading-row">
              <span className="spinner" /> Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="login-prompt">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
