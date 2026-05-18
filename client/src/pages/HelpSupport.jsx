import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare, History } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import './HelpSupport.css';

const HelpSupport = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('create'); // 'list' or 'create'
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: 'General',
        subject: '',
        message: ''
    });

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/support/tickets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            console.error('Failed to fetch tickets', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'list') {
            fetchTickets();
        }
    }, [activeTab]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            showNotification({ 
                type: 'warning', 
                title: 'Missing Information', 
                message: 'Please fill in both the subject and the message.' 
            });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/support/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showNotification({ 
                    type: 'success', 
                    title: 'Ticket Raised', 
                    message: 'Your support ticket has been submitted successfully.' 
                });
                setFormData({ category: 'General', subject: '', message: '' });
                setActiveTab('list');
            } else {
                showNotification({ 
                    type: 'error', 
                    title: 'Submission Failed', 
                    message: 'We could not raise your ticket at this time. Please try again.' 
                });
            }
        } catch (err) {
            console.error('Error submitting ticket', err);
            showNotification({ 
                type: 'error', 
                title: 'Server Error', 
                message: 'An unexpected error occurred. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#64748b';
            case 'under process': return '#ff8c00';
            case 'resolved': return '#10b981';
            case 'completed': return '#002d62';
            default: return '#64748b';
        }
    };

    return (
        <div className="help-support-page">
            <div className="support-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-text">
                    <h2>Help & Support</h2>
                    <p>We're here to help you</p>
                </div>
            </div>

            <div className="support-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    <History size={18} />
                    My Tickets
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    <MessageSquare size={18} />
                    Create Ticket
                </button>
            </div>

            <div className="support-content animate-fade-in">
                {activeTab === 'create' ? (
                    <div className="create-ticket-section">
                        <h3>Create New Ticket</h3>
                        <p className="section-desc">Describe your issue and we'll get back to you soon</p>

                        <form className="ticket-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleInputChange}
                                >
                                    <option value="General">General</option>
                                    <option value="Technical">Technical Issue</option>
                                    <option value="Payment">Payment / Earnings</option>
                                    <option value="KYC">KYC Verification</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    placeholder="Brief description of your issue"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Message</label>
                                <textarea 
                                    name="message"
                                    placeholder="Explain your issue in detail..."
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-submit-ticket" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Ticket'}
                                {!loading && <Send size={18} />}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="tickets-list-section">
                        {tickets.length === 0 ? (
                            <div className="empty-tickets">
                                <div className="mailbox-icon">📬</div>
                                <h4>No tickets yet</h4>
                                <p>Create a ticket to get support</p>
                            </div>
                        ) : (
                            <div className="tickets-grid">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} className="ticket-card">
                                        <div className="ticket-card-header">
                                            <span className="ticket-category">{ticket.category}</span>
                                            <span className="ticket-status" style={{ backgroundColor: getStatusColor(ticket.status) + '20', color: getStatusColor(ticket.status) }}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h4 className="ticket-subject">{ticket.subject}</h4>
                                        <p className="ticket-msg">{ticket.message}</p>
                                        <div className="ticket-footer">
                                            <span className="ticket-id">#{ticket.id}</span>
                                            <span className="ticket-date">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpSupport;
