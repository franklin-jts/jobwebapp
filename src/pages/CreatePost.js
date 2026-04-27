import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import toast from 'react-hot-toast';

const SKILLS = ['React', 'React Native', 'Node.js', 'Python', 'AWS', 'Product Management', 'UX Design', 'Data Science', 'TypeScript', 'Kotlin', 'Java', 'Machine Learning', 'DevOps', 'Flutter', 'Go', 'Rust', 'SQL', 'MongoDB'];
const WORK_MODES = [{ id: 'remote', label: '🏠 Remote' }, { id: 'hybrid', label: '🔀 Hybrid' }, { id: 'onsite', label: '🏢 On-site' }];
const POST_TYPES = [
  { id: 'job_post',         label: '📢 Job Post',         desc: 'Company is hiring',     color: '#e0e7ff', active: '#4f46e5' },
  { id: 'referral_offer',   label: '🤝 Referral Offer',   desc: "I'll refer candidates", color: '#d1fae5', active: '#059669' },
  { id: 'referral_request', label: '🙋 Referral Request', desc: 'Looking for referral',  color: '#fef3c7', active: '#d97706' },
];

const EMPTY = { type: 'job_post', job_title: '', company: '', location: '', salary: '', experience: '', description: '', skills: [], work_mode: 'hybrid', can_refer: false, company_logo: '' };

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (s) => set('skills', form.skills.includes(s) ? form.skills.filter((x) => x !== s) : [...form.skills, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.job_title.trim()) return toast.error('Job title is required');
    if (!form.company.trim())   return toast.error('Company name is required');
    if (!form.description.trim()) return toast.error('Description is required');
    setLoading(true);
    try {
      await postsAPI.create({
        type:         form.type,
        job_title:    form.job_title,
        company:      form.company,
        location:     form.location,
        salary:       form.salary,
        experience:   form.experience,
        description:  form.description,
        skills:       form.skills,
        can_refer:    form.type === 'referral_offer' ? true : form.can_refer,
        company_logo: form.company_logo,
      });
      toast.success('Post published to app! 🎉');
      navigate('/posts');
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  };

  const activeType = POST_TYPES.find((t) => t.id === form.type);

  return (
    <div className="fade-in" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h2>Create Job Post</h2>
          <p>This post will appear live in the mobile app immediately</p>
        </div>
      </div>

      <div className="card">
        {/* Post type */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>Post Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {POST_TYPES.map((t) => (
              <button key={t.id} type="button" onClick={() => set('type', t.id)}
                style={{ padding: '14px 12px', borderRadius: 12, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                  border: `2px solid ${form.type === t.id ? t.active : '#e2e8f0'}`,
                  background: form.type === t.id ? t.color : '#fff' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input className="input" placeholder="e.g. Senior Software Engineer" value={form.job_title} onChange={(e) => set('job_title', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input className="input" placeholder="e.g. Google" value={form.company} onChange={(e) => set('company', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input className="input" placeholder="e.g. Bengaluru, India" value={form.location} onChange={(e) => set('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company Logo URL</label>
              <input className="input" placeholder="https://..." value={form.company_logo} onChange={(e) => set('company_logo', e.target.value)} />
              <span className="input-hint">Paste a direct image URL for the company logo</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary / CTC</label>
              <input className="input" placeholder="e.g. ₹20–30 LPA" value={form.salary} onChange={(e) => set('salary', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Experience Required</label>
              <input className="input" placeholder="e.g. 3–5 years" value={form.experience} onChange={(e) => set('experience', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Work Mode</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {WORK_MODES.map((m) => (
                <button key={m.id} type="button" onClick={() => set('work_mode', m.id)}
                  style={{ flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
                    border: `1.5px solid ${form.work_mode === m.id ? '#4f46e5' : '#e2e8f0'}`,
                    background: form.work_mode === m.id ? '#eef2ff' : '#fff',
                    color: form.work_mode === m.id ? '#4f46e5' : '#64748b' }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Skills Required</label>
            <div className="chips-wrap">
              {SKILLS.map((s) => (
                <button key={s} type="button" onClick={() => toggleSkill(s)}
                  className={`chip-btn ${form.skills.includes(s) ? 'selected' : 'unselected'}`}>
                  {form.skills.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea className="input textarea" style={{ minHeight: 140 }}
              placeholder="Describe the role, responsibilities, requirements, and how to apply..."
              value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          {form.type === 'job_post' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>
              <input type="checkbox" checked={form.can_refer} onChange={(e) => set('can_refer', e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#4f46e5' }} />
              Allow users to request referrals for this post
            </label>
          )}

          <div className="divider" />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/posts')}>Cancel</button>
            <button type="submit" className="btn btn-lg" disabled={loading}
              style={{ background: activeType?.active, color: '#fff', minWidth: 160, justifyContent: 'center' }}>
              {loading ? <span className="spinner spinner-sm" /> : `🚀 Publish Post`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
