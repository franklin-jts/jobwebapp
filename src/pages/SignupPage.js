import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', companyName: '', companyEmail: '', mobile: '', password: '', confirmPassword: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.companyName || !form.companyEmail || !form.password || !form.confirmPassword)
      return toast.error('Please fill in all required fields');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`,
        email: form.companyEmail,
        company_name: form.companyName,
        mobile: form.mobile,
        password: form.password,
      });
      toast.success('Account created! Welcome to ReferNOW 🎉');
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
          <div className="auth-pg__brand">🤝 ReferNOW</div>
          <h2 className="auth-pg__tagline">Join 50,000+ professionals getting hired through referrals.</h2>
          <div className="auth-pg__features">
            {['Free to join — no credit card needed', 'Get referred at Google, Microsoft & more', 'Build your professional referral network', 'Available on iOS, Android and Web'].map((f) => (
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
            <h1>Create your account</h1>
            <p>Start getting referred at top companies today</p>
          </div>

          <form className="auth-pg__form" onSubmit={handleSubmit}>
            {/* First name + Last name */}
            <div className="auth-pg__row">
              <div className="auth-pg__group">
                <label>First Name <span className="auth-pg__req">*</span></label>
                <input className="auth-pg__input" placeholder="John"
                  value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
              </div>
              <div className="auth-pg__group">
                <label>Last Name <span className="auth-pg__req">*</span></label>
                <input className="auth-pg__input" placeholder="Doe"
                  value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </div>
            </div>

            {/* Company Name + Mobile on same row */}
            <div className="auth-pg__row">
              <div className="auth-pg__group">
                <label>Company Name <span className="auth-pg__req">*</span></label>
                <input className="auth-pg__input" type="text" placeholder="Acme Corp"
                  value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
              </div>
              <div className="auth-pg__group">
                <label>Mobile Number</label>
                <input className="auth-pg__input" type="tel" placeholder="+91 9876543210"
                  value={form.mobile} onChange={(e) => set('mobile', e.target.value)} />
              </div>
            </div>

            {/* Company Email */}
            <div className="auth-pg__group">
              <label>Company Email <span className="auth-pg__req">*</span></label>
              <input className="auth-pg__input" type="email" placeholder="you@company.com"
                value={form.companyEmail} onChange={(e) => set('companyEmail', e.target.value)} />
            </div>

            {/* Password + Confirm on same row */}
            <div className="auth-pg__row">
              <div className="auth-pg__group">
                <label>Password <span className="auth-pg__req">*</span></label>
                <div className="auth-pg__input-wrap">
                  <input className="auth-pg__input" type={showPwd ? 'text' : 'password'} placeholder="Min 6 chars"
                    value={form.password} onChange={(e) => set('password', e.target.value)} />
                  <button type="button" className="auth-pg__eye" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="auth-pg__group">
                <label>Confirm Password <span className="auth-pg__req">*</span></label>
                <div className="auth-pg__input-wrap">
                  <input className="auth-pg__input" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter"
                    value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} />
                  <button type="button" className="auth-pg__eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <span className="auth-pg__error">Passwords do not match</span>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length > 0 && (
                  <span className="auth-pg__success-msg">✓ Passwords match</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-pg__submit" disabled={loading}>
              {loading ? <span className="auth-pg__spinner" /> : '🚀 Create Account'}
            </button>

            <p className="auth-pg__terms">
              By signing up you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
            </p>
          </form>

          <div className="auth-pg__divider"><span>or</span></div>

          <p className="auth-pg__switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
