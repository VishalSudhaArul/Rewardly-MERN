import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/notifications/read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-bell-container" style={{ position: 'relative' }}>
      <button 
        className="nav-link" 
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
        onClick={() => { setShow(!show); if (!show) markAsRead(); }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', top: '-5px', right: '-5px', 
            background: 'var(--primary)', color: 'white', 
            fontSize: '10px', padding: '2px 5px', borderRadius: '50%',
            border: '2px solid var(--bg1)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <div className="card notification-dropdown" style={{ 
          position: 'absolute', 
          bottom: '100%', 
          left: '0',
          marginBottom: '10px',
          width: '320px', 
          zIndex: 1000, 
          maxHeight: '450px', 
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)', 
          border: '1px solid var(--border)',
          background: 'rgba(30, 30, 53, 0.95)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div className="flex-between mb-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--primary-light)' }}>Recent Notifications</span>
            <button className="text-xs text-muted" onClick={() => setShow(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
          </div>
          <div className="flex-column gap-2">
            {notifications.length > 0 ? notifications.map(n => (
              <div key={n._id} className="notification-item" style={{ 
                padding: '0.85rem', borderRadius: '10px', 
                background: n.read ? 'transparent' : 'rgba(124,58,237,0.08)',
                border: '1px solid',
                borderColor: n.read ? 'transparent' : 'rgba(124,58,237,0.2)',
                marginBottom: '0.5rem',
                transition: 'all 0.2s'
              }}>
                <div className="font-bold text-xs" style={{ color: n.read ? 'var(--text)' : 'var(--primary-light)' }}>{n.title}</div>
                <div className="text-muted text-xs mt-1" style={{ lineHeight: '1.4' }}>{n.message}</div>
                <div className="text-muted" style={{ fontSize: '9px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} />
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )) : (
              <div className="text-muted text-center py-5 text-xs">
                No new notifications for you
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
