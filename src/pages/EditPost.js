import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import toast from 'react-hot-toast';

const SKILLS = ['React', 'React Native', 'Node.js', 'Python', 'AWS', 'Product Management', 'UX Design', 'Data Science', 'TypeScript', 'Kotlin', 'Java', 'Machine Learning', 'DevOps', 'Flutter', 'Go', 'Rust', 'SQL', 'MongoDB'];
const WORK_MODES = [{ id: 'remote', label: '🏠 Remote' }, { id: 'hybrid', label: '🔀 Hybrid' }, { id: 'onsite', label: '🏢 On-site' }];
const POST_TYPES = [
  { id: 'job_post',         label: '📢 Job Post',         color: '#e0e7ff', active: '#4f46e5' },
  { id: 'referral_offer',   label: '🤝 Referral Offer',   color: '#d1fae5', active: '#059669' },
  { id: 'referral_request', label: '🙋 Referral Request', color: '#fef3c7', active: '#d97706' },
];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    postsAPI.getOne(id)
      .then((p) => setForm({
        type:         p.type || 'job_post',
        job_title:    p.job_title || '',
        company:      p.company || '',
        location:     p.location || '',
        salary:       p.salary || '',
        experience:   p.experience || '',
        description:  p.description || '',
        skills:       p.skills || [],
        work_mode:    p.work_mode || 'hybrid',
        can_refer:    p.can_refer || false,
        company_logo: p.company_logo || '',
      }))
      .catch(() => toast.error('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (s) => set('skills', form.skills.includes(s) ? form.skills.filter((x) => x !== s) : [...form.skills, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.job_title.trim()) return toast.error('Job title is required');
    if (!form.company.trim())   return toast.error('Company name is required');
    setSaving(true);
    try {
      await postsAPI.update(id, form);
      toast.success('Post updated! Changes are live in the app.');
      navigate('/posts');
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="full-center"><div className="spinner" /></div>;
  if (!form)   return <div style={{ padding: 48, textAlign: 'center' }}>Post not found</div>;

  const activeType = POST_TYPES.find((t) => t.id === form.type);

  return (
    <div className="fade-in" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h2>Edit Post</h2>
          <p>Changes will reflect immediately in the mobile app</p>
        </div>
      </div>

      <div className="card">
        {/* Post type */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>Post Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {POST_TYPES.map((t) => (
              <button key={t.id} type="button" onClick={() => set('type', t.id)}
                style={{ padding: '12px', borderRadius: 12, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                  border: `2px solid ${form.type === t.id ? t.active : '#e2e8f0'}`,
                  background: form.type === t.id ? t.color : '#fff',
                  fontWeight: 700, fontSize: 14 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input className="input" value={form.job_title} onChange={(e) => set('job_title', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input className="input" value={form.company} onChange={(e) => set('company', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company Logo URL</label>
              <input className="input" value={form.company_logo} onChange={(e) => set('company_logo', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary / CTC</label>
              <input className="input" value={form.salary} onChange={(e) => set('salary', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Experience Required</label>
              <input className="input" value={form.experience} onChange={(e) => set('experience', e.target.value)} />
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
            <label>Skills</label>
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
            <label>Job Description</label>
            <textarea className="input textarea" style={{ minHeight: 140 }}
              value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          {form.type === 'job_post' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              <input type="checkbox" checked={form.can_refer} onChange={(e) => set('can_refer', e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#4f46e5' }} />
              Allow users to request referrals for this post
            </label>
          )}

          <div className="divider" />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/posts')}>Cancel</button>
            <button type="submit" className="btn btn-lg" disabled={saving}
              style={{ background: activeType?.active, color: '#fff', minWidth: 160, justifyContent: 'center' }}>
              {saving ? <span className="spinner spinner-sm" /> : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
