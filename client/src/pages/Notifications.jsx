import React from 'react';
import { Bell, ArrowLeft, CheckCircle, Info, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="#22c55e" />;
      case 'warning': return <AlertCircle size={20} color="#f59e0b" />;
      case 'error': return <XCircle size={20} color="#ef4444" />;
      default: return <Info size={20} color="#3b82f6" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'success': return '#f0fdf4';
      case 'warning': return '#fffbeb';
      case 'error': return '#fef2f2';
      default: return '#eff6ff';
    }
  };

  const getTimeLabel = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-container animate-fade-in">
      {/* Header */}
      <div className="notif-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Notifications</h2>
      </div>

      {/* Content */}
      <div className="notif-content">
        {notifications.length > 0 ? (
          <div className="notif-list">
            {notifications.map((notif) => (
              <div key={notif.id} className="notif-item">
                <div className="notif-icon-box" style={{ backgroundColor: getBg(notif.type) }}>
                  {getIcon(notif.type)}
                </div>
                <div className="notif-info">
                  <div className="notif-title-row">
                    <h4>{notif.title}</h4>
                    <span className="notif-time">{getTimeLabel(notif.created_at)}</span>
                  </div>
                  <p>{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notif">
            <Bell size={48} color="#cbd5e1" />
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
