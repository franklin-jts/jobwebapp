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
  const location  = useLocation();
  const navigate  = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🤝 ReferNOW</h1>
        <p>Super Admin</p>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Company ID badge */}
        {user?.company_id && (
          <div style={{
            margin: '0 12px 10px',
            padding: '6px 12px',
            background: 'rgba(165,180,252,0.12)',
            border: '1px solid rgba(165,180,252,0.25)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 700, letterSpacing: 0.3 }}>
              🏢 Company ID
            </span>
            <span style={{
              marginLeft: 'auto',
              background: '#4f46e5',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 6,
            }}>
              {user.company_id}
            </span>
          </div>
        )}

        <div className="sidebar-user">
          <img
            src={user?.avatar || `https://i.pravatar.cc/34?u=${user?.email}`}
            alt="avatar"
          />
          <div className="sidebar-user-info">
            <div className="name">{user?.name || 'Admin'}</div>
            <div className="role">{user?.email || 'Super Admin'}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">🚪</button>
        </div>
      </div>
    </div>
  );
}
