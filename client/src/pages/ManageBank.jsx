import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, User, CreditCard, Landmark, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import './ManageBank.css';

const ManageBank = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [bankDetails, setBankDetails] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        account_holder_name: '',
        bank_name: '',
        account_number: '',
        ifsc_code: ''
    });

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/bank-account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) {
                setBankDetails(res.data);
                setFormData(res.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bank details:', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/bank-account', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification({ 
                type: 'success', 
                title: 'Success', 
                message: 'Bank details submitted for verification' 
            });
            setIsAdding(false);
            fetchBankDetails();
        } catch (err) {
            showNotification({ 
                type: 'error', 
                title: 'Error', 
                message: 'Failed to save bank details' 
            });
        }
    };

    return (
        <div className="manage-bank-page">
            <div className="bank-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Manage Bank</h2>
                <div className="placeholder-box"></div>
            </div>

            <div className="bank-content">
                {loading ? (
                    <div className="loading-state">Loading...</div>
                ) : !bankDetails && !isAdding ? (
                    <div className="no-bank-state">
                        <div className="icon-circle">
                            <Building2 size={48} color="#1e3a8a" />
                        </div>
                        <h3>No Bank Account Added</h3>
                        <p>Add your bank account details to receive your earnings directly.</p>
                        <button className="btn-add-bank" onClick={() => setIsAdding(true)}>
                            Add Bank Account
                        </button>
                    </div>
                ) : isAdding ? (
                    <div className="add-bank-form-container">
                        <h3>Add Bank Account</h3>
                        <p className="form-subtitle">Please enter your correct bank details for payouts.</p>
                        
                        <form onSubmit={handleSubmit} className="bank-form">
                            <div className="input-group">
                                <label>Account Holder Name</label>
                                <div className="input-box">
                                    <User size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Name as per bank record"
                                        value={formData.account_holder_name}
                                        onChange={(e) => setFormData({...formData, account_holder_name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Bank Name</label>
                                <div className="input-box">
                                    <Landmark size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="e.g. HDFC Bank, SBI"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Account Number</label>
                                <div className="input-box">
                                    <CreditCard size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Enter account number"
                                        value={formData.account_number}
                                        onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>IFSC Code</label>
                                <div className="input-box">
                                    <AlertCircle size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="e.g. HDFC0001234"
                                        value={formData.ifsc_code}
                                        onChange={(e) => setFormData({...formData, ifsc_code: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Details</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bank-details-card">
                        <div className="status-banner">
                            {bankDetails.status === 'pending' && <><Clock size={16} /> Verification Pending</>}
                            {bankDetails.status === 'approved' && <><CheckCircle2 size={16} /> Verified Account</>}
                            {bankDetails.status === 'rejected' && <><AlertCircle size={16} /> Verification Failed</>}
                        </div>
                        
                        <div className="details-header">
                            <div className="bank-brand-icon">
                                <Building2 size={24} color="#1e3a8a" />
                            </div>
                            <div className="bank-name-box">
                                <h4>{bankDetails.bank_name}</h4>
                                <span>{bankDetails.account_holder_name}</span>
                            </div>
                        </div>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label">Account Number</span>
                                <span className="value">•••• •••• {bankDetails.account_number.slice(-4)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">IFSC Code</span>
                                <span className="value">{bankDetails.ifsc_code}</span>
                            </div>
                        </div>

                        <button className="btn-edit-bank" onClick={() => setIsAdding(true)}>
                            Update Bank Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBank;
