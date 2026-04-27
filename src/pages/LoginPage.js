import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-pg">
      {/* Left panel */}
      <div className="auth-pg__left">
        <div className="auth-pg__left-inner">
          <Link to="/" className="auth-pg__back">← Back to Home</Link>
          <div className="auth-pg__brand">🤝 ReferJob</div>
          <h2 className="auth-pg__tagline">Get referred faster.<br />Land your dream job.</h2>
          <div className="auth-pg__features">
            {['Connect with insiders at top companies', 'Skip the ATS — get seen by real humans', '12,000+ referrals given and counting', 'Available on web and mobile'].map((f) => (
              <div key={f} className="auth-pg__feature">
                <span className="auth-pg__feature-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-pg__right">
        <div className="auth-pg__form-wrap">
          <div className="auth-pg__header">
            <h1>Welcome back</h1>
            <p>Sign in to your ReferJob account</p>
          </div>

          <form className="auth-pg__form" onSubmit={handleSubmit}>
            <div className="auth-pg__group">
              <label>Email or Mobile</label>
              <input className="auth-pg__input" type="text" placeholder="you@email.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="auth-pg__group">
              <label>Password</label>
              <div className="auth-pg__input-wrap">
                <input className="auth-pg__input" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="auth-pg__eye" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-pg__submit" disabled={loading}>
              {loading ? <span className="auth-pg__spinner" /> : '🔐 Sign In'}
            </button>
          </form>

          <div className="auth-pg__divider"><span>or</span></div>

          <p className="auth-pg__switch">
            Don't have an account? <Link to="/signup">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
