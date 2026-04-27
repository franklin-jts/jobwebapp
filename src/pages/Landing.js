import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`ln-nav ${scrolled ? 'ln-nav--scrolled' : ''}`}>
      <div className="ln-nav__inner">
        <div className="ln-nav__logo">🤝 ReferJob</div>

        <div className={`ln-nav__links ${menuOpen ? 'ln-nav__links--open' : ''}`}>
          <button onClick={() => scrollTo('home')}>Home</button>
          <button onClick={() => scrollTo('about')}>About</button>
          <button onClick={() => scrollTo('focus')}>Focus</button>
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </div>

        <div className="ln-nav__actions">
          <Link to="/login" className="ln-btn ln-btn--ghost">Log In</Link>
          <Link to="/signup" className="ln-btn ln-btn--primary">Sign Up</Link>
        </div>

        <button className="ln-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" className="ln-hero">
      {/* Floating blobs */}
      <div className="ln-blob ln-blob--1" />
      <div className="ln-blob ln-blob--2" />
      <div className="ln-blob ln-blob--3" />

      <div className="ln-hero__content">
        <div className="ln-hero__badge">🚀 India's #1 Job Referral Network</div>
        <h1 className="ln-hero__title">
          Get Referred.<br />
          <span className="ln-gradient-text">Land Your Dream Job.</span>
        </h1>
        <p className="ln-hero__sub">
          Connect with insiders at Google, Microsoft, Amazon and 500+ top companies.
          Skip the queue — get referred directly by employees who know you'll crush it.
        </p>
        <div className="ln-hero__cta">
          <Link to="/signup" className="ln-btn ln-btn--primary ln-btn--lg">
            🤝 Get Started Free
          </Link>
          <button className="ln-btn ln-btn--outline ln-btn--lg" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
            Learn More ↓
          </button>
        </div>
        <div className="ln-hero__stats">
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '500+', label: 'Companies' },
            { value: '12K+', label: 'Referrals Given' },
            { value: '89%', label: 'Success Rate' },
          ].map((s) => (
            <div key={s.label} className="ln-hero__stat">
              <span className="ln-hero__stat-value">{s.value}</span>
              <span className="ln-hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* App mockup */}
      <div className="ln-hero__mockup">
        <div className="ln-phone">
          <div className="ln-phone__screen">
            <div className="ln-phone__topbar">
              <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: 13 }}>ReferJobs</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Find your next opportunity</span>
            </div>
            {[
              { company: 'Google', role: 'SWE III', salary: '₹45 LPA', tag: '🤝 Referring', color: '#d1fae5', tc: '#059669' },
              { company: 'Microsoft', role: 'PM II', salary: '₹38 LPA', tag: '📢 Hiring', color: '#e0e7ff', tc: '#4f46e5' },
              { company: 'Amazon', role: 'SDE II', salary: '₹32 LPA', tag: '🤝 Referring', color: '#d1fae5', tc: '#059669' },
            ].map((c, i) => (
              <div key={i} className="ln-phone__card">
                <div className="ln-phone__card-top">
                  <div className="ln-phone__avatar">{c.company[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{c.role}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>🏢 {c.company} · 💰 {c.salary}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, background: c.color, color: c.tc, padding: '2px 7px', borderRadius: 8 }}>{c.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="ln-section ln-section--white">
      <div className="ln-container">
        <div className="ln-section__header">
          <div className="ln-section__tag">About Us</div>
          <h2 className="ln-section__title">Why ReferJob?</h2>
          <p className="ln-section__sub">
            Referrals are 9× more likely to get hired than cold applications.
            We built ReferJob to make that advantage available to everyone.
          </p>
        </div>

        <div className="ln-about__grid">
          <div className="ln-about__text">
            <p>
              ReferJob is a professional network built specifically around job referrals.
              Unlike traditional job boards, we connect job seekers directly with employees
              at their target companies — people who can vouch for them internally.
            </p>
            <p>
              Our platform makes it easy to post job openings, offer referrals, and request
              introductions — all in one place. Whether you're a hiring manager, an employee
              who wants to help your network, or a job seeker looking for your next big break,
              ReferJob has you covered.
            </p>
            <div className="ln-about__points">
              {[
                { icon: '🎯', text: 'Direct connection with company insiders' },
                { icon: '⚡', text: 'Skip the ATS — get seen by real humans' },
                { icon: '🔒', text: 'Verified profiles and trusted referrals' },
                { icon: '📱', text: 'Available on web and mobile app' },
              ].map((p) => (
                <div key={p.text} className="ln-about__point">
                  <span>{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ln-about__cards">
            {[
              { icon: '🤝', title: 'Offer Referrals', desc: 'Help your network land jobs at your company. Build your reputation as a trusted referrer.', color: '#d1fae5', border: '#10b981' },
              { icon: '🙋', title: 'Request Referrals', desc: 'Find insiders at your dream company and request a direct referral in seconds.', color: '#e0e7ff', border: '#4f46e5' },
              { icon: '📢', title: 'Post Jobs', desc: 'Hiring managers can post openings and find pre-vetted candidates through referrals.', color: '#fef3c7', border: '#f59e0b' },
            ].map((c) => (
              <div key={c.title} className="ln-about__card" style={{ background: c.color, borderLeft: `4px solid ${c.border}` }}>
                <span className="ln-about__card-icon">{c.icon}</span>
                <div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Focus ─────────────────────────────────────────────────────────────────────
function Focus() {
  const features = [
    { icon: '🏢', title: 'Top Companies', desc: 'Access referrals at Google, Microsoft, Amazon, Flipkart, Swiggy, Zomato and 500+ more companies across India and globally.', color: '#4f46e5' },
    { icon: '⚡', title: 'Instant Matching', desc: 'Our smart algorithm matches job seekers with the right referrers based on role, company, and skills — instantly.', color: '#10b981' },
    { icon: '💬', title: 'Direct Messaging', desc: 'Chat directly with referrers. No middlemen, no delays. Build real professional relationships.', color: '#f59e0b' },
    { icon: '📊', title: 'Track Progress', desc: 'See the status of every referral request in real time — pending, accepted, submitted, or rejected.', color: '#ef4444' },
    { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified the moment someone accepts your referral request or posts a job at your target company.', color: '#8b5cf6' },
    { icon: '🛡️', title: 'Verified Profiles', desc: 'Every profile is verified. You know exactly who you\'re connecting with — no fake accounts, no spam.', color: '#06b6d4' },
  ];

  return (
    <section id="focus" className="ln-section ln-section--gray">
      <div className="ln-container">
        <div className="ln-section__header">
          <div className="ln-section__tag">Our Focus</div>
          <h2 className="ln-section__title">Everything You Need to Get Hired</h2>
          <p className="ln-section__sub">
            We've built every feature with one goal in mind — getting you hired faster through the power of referrals.
          </p>
        </div>

        <div className="ln-focus__grid">
          {features.map((f) => (
            <div key={f.title} className="ln-focus__card">
              <div className="ln-focus__icon" style={{ background: f.color + '18', color: f.color }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="ln-how">
          <h3 className="ln-how__title">How It Works</h3>
          <div className="ln-how__steps">
            {[
              { step: '01', icon: '👤', title: 'Create Profile', desc: 'Sign up and build your professional profile with your skills, experience and target companies.' },
              { step: '02', icon: '🔍', title: 'Find Referrers', desc: 'Browse job posts from insiders at top companies who are actively offering referrals.' },
              { step: '03', icon: '🤝', title: 'Request Referral', desc: 'Send a referral request with your resume and a personal note. It takes under 2 minutes.' },
              { step: '04', icon: '🚀', title: 'Get Hired', desc: 'Your referrer submits your profile internally. You skip the queue and get a direct interview.' },
            ].map((s, i) => (
              <div key={s.step} className="ln-how__step">
                <div className="ln-how__step-num">{s.step}</div>
                <div className="ln-how__step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                {i < 3 && <div className="ln-how__arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="ln-section ln-section--white">
      <div className="ln-container">
        <div className="ln-section__header">
          <div className="ln-section__tag">Contact Us</div>
          <h2 className="ln-section__title">Get In Touch</h2>
          <p className="ln-section__sub">Have a question or want to partner with us? We'd love to hear from you.</p>
        </div>

        <div className="ln-contact__grid">
          <div className="ln-contact__info">
            {[
              { icon: '📧', label: 'Email', value: 'hello@referjob.in' },
              { icon: '📱', label: 'Phone', value: '+91 98765 43210' },
              { icon: '📍', label: 'Location', value: 'Bengaluru, Karnataka, India' },
              { icon: '🕐', label: 'Support Hours', value: 'Mon–Fri, 9 AM – 6 PM IST' },
            ].map((c) => (
              <div key={c.label} className="ln-contact__item">
                <div className="ln-contact__item-icon">{c.icon}</div>
                <div>
                  <div className="ln-contact__item-label">{c.label}</div>
                  <div className="ln-contact__item-value">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ln-contact__form-wrap">
            {sent ? (
              <div className="ln-contact__success">
                <div style={{ fontSize: 52 }}>✅</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="ln-contact__form" onSubmit={handleSubmit}>
                <div className="ln-form-group">
                  <label>Your Name</label>
                  <input className="ln-input" placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="ln-form-group">
                  <label>Email Address</label>
                  <input className="ln-input" type="email" placeholder="you@email.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="ln-form-group">
                  <label>Message</label>
                  <textarea className="ln-input ln-textarea" placeholder="How can we help you?" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <button type="submit" className="ln-btn ln-btn--primary ln-btn--lg" style={{ width: '100%', justifyContent: 'center' }}>
                  📨 Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="ln-footer">
      <div className="ln-container">
        <div className="ln-footer__grid">
          <div>
            <div className="ln-footer__logo">🤝 ReferJob</div>
            <p className="ln-footer__tagline">Get referred faster. Land your dream job.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</button></li>
              <li><button onClick={() => document.getElementById('focus')?.scrollIntoView({ behavior: 'smooth' })}>Features</button></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</button></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="ln-footer__bottom">
          <p>© 2026 ReferJob. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="ln-page">
      <Navbar />
      <Hero />
      <About />
      <Focus />
      <Contact />
      <Footer />
    </div>
  );
}
