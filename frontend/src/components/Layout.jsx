import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  Gift, 
  Trophy, 
  LogOut, 
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import ChatDrawer from './ChatDrawer';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <Clock size={20} /> },
    { name: 'Performance', path: '/performance', icon: <BarChart3 size={20} /> },
    { name: 'Feedback', path: '/feedback', icon: <MessageSquare size={20} /> },
    { name: 'Rewards', path: '/rewards', icon: <Gift size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
  ];

  if (user?.role === 'admin' || user?.role === 'manager') {
    navItems.push({ name: 'Admin Portal', path: '/admin', icon: <ShieldCheck size={20} /> });
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          REWARDLY
          <span>HRM Reward Ecosystem</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-badge mt-1" style={{ marginBottom: '1rem' }}>
            <div className="flex-gap">
              <UserCircle size={32} className="text-muted" />
              <div>
                <div className="name">{user?.name}</div>
                <div className="role">{user?.role}</div>
              </div>
            </div>
            <div className={`tier-badge tier-${user?.tier || 'Standard'} mt-1`}>
              {user?.tier || 'Standard'} Tier
            </div>
          </div>
          
          <div className="flex-between mb-1" style={{ padding: '0 0.75rem' }}>
            <span className="text-muted text-xs">Stay Updated</span>
            <NotificationBell />
          </div>

          <button onClick={handleLogout} className="nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
      <ChatDrawer />
    </div>
  );
}
