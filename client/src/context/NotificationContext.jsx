import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showNotification = useCallback(async ({ type = 'info', title, message }) => {
        // 1. Show Toast
        setToast({ type, title, message });

        // 2. Clear Toast after 3 seconds
        setTimeout(() => {
            setToast(null);
        }, 3000);

        // 3. Save to Database (In-App Notification)
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch('http://localhost:5000/api/notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ type, title, message })
                });
            }
        } catch (err) {
            console.error('Failed to save notification', err);
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {toast && (
                <Toast 
                    type={toast.type} 
                    title={toast.title} 
                    message={toast.message} 
                    onClose={() => setToast(null)} 
                />
            )}
        </NotificationContext.Provider>
    );
};
