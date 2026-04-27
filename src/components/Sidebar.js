import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin',         icon: '📊', label: 'Dashboard' },
  { to: '/admin/posts',   icon: '📋', label: 'Job Posts' },
  { to: '/admin/stories', icon: '📸', label: 'Stories' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🤝 ReferJob</h1>
        <p>Super Admin</p>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} className={`nav-item ${isActive(item.to) ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <img src={user?.avatar || `https://i.pravatar.cc/34?u=${user?.email}`} alt="avatar" />
          <div className="sidebar-user-info">
            <div className="name">{user?.name || 'Admin'}</div>
            <div className="role">Super Admin</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">🚪</button>
        </div>
      </div>
    </div>
  );
}
