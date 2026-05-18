import React, { useEffect } from 'react';
import { CheckCircle, Info, AlertCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ type = 'info', title, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color="#10b981" />;
            case 'warning': return <AlertCircle size={24} color="#f59e0b" />;
            case 'error': return <XCircle size={24} color="#ef4444" />;
            default: return <Info size={24} color="#3b82f6" />;
        }
    };

    return (
        <div className={`toast-message ${type} animate-slide-in`}>
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-content">
                {title && <h4>{title}</h4>}
                <p>{message}</p>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
