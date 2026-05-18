import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ArrowDownToLine, AlertCircle, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending, payout

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const fetchAllTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/wallet/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             tx.id.toString().includes(searchTerm);
        
        const matchesFilter = filterStatus === 'all' || 
                             (filterStatus === 'payout' ? tx.type === 'withdrawal' : tx.status === filterStatus);
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="transactions-page">
            {/* Header */}
            <div className="tx-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>All Transactions</h2>
                <div className="placeholder-box"></div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-box">
                    <Search size={18} color="#94a3b8" />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips">
                <button 
                    className={`chip ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                >All</button>
                <button 
                    className={`chip ${filterStatus === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('completed')}
                >Completed</button>
                <button 
                    className={`chip ${filterStatus === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('pending')}
                >Pending</button>
                <button 
                    className={`chip ${filterStatus === 'payout' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('payout')}
                >Payouts</button>
            </div>

            {/* Transaction List */}
            <div className="tx-list-container">
                {loading ? (
                    <div className="loading-state">Loading transactions...</div>
                ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                        <div key={tx.id} className="tx-full-item">
                            <div className={`tx-icon-large ${tx.type === 'earning' ? 'success' : 'withdrawal'}`}>
                                {tx.type === 'earning' ? <CheckCircle2 size={20} /> : <ArrowDownToLine size={20} />}
                            </div>
                            <div className="tx-details">
                                <div className="tx-main-row">
                                    <h4>{tx.description}</h4>
                                    <span className={`tx-full-amount ${tx.type === 'earning' ? 'positive' : 'negative'}`}>
                                        {tx.type === 'earning' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="tx-sub-row">
                                    <span className="tx-id">ID: #TRX-{tx.id}</span>
                                    <span className="tx-date">{formatDate(tx.created_at)}</span>
                                </div>
                                <div className="tx-status-badge">
                                    <span className={`status-dot ${tx.status}`}></span>
                                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="tx-empty-state">
                        <div className="empty-icon-circle">
                            <AlertCircle size={48} color="#94a3b8" />
                        </div>
                        <h3>No transactions found</h3>
                        <p>When you earn or withdraw, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
