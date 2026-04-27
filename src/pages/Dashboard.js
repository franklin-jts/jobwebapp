import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, storiesAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const TYPE_BADGE = {
  job_post:         { label: '📢 Job Post',         cls: 'badge-job' },
  referral_offer:   { label: '🤝 Referral Offer',   cls: 'badge-refer' },
  referral_request: { label: '🙋 Referral Request', cls: 'badge-request' },
};

export default function Dashboard() {
  const [posts, setPosts]     = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([postsAPI.feed(0, 100), storiesAPI.list().catch(() => [])])
      .then(([p, s]) => { setPosts(p); setStories(s); })
      .finally(() => setLoading(false));
  }, []);

  const jobPosts   = posts.filter((p) => p.type === 'job_post');
  const referOffers = posts.filter((p) => p.type === 'referral_offer');
  const referReqs  = posts.filter((p) => p.type === 'referral_request');
  const recent     = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  const STATS = [
    { label: 'Total Posts',       value: posts.length,       icon: '📋', bg: '#eef2ff', color: '#4f46e5' },
    { label: 'Job Posts',         value: jobPosts.length,    icon: '📢', bg: '#e0f2fe', color: '#0284c7' },
    { label: 'Referral Offers',   value: referOffers.length, icon: '🤝', bg: '#d1fae5', color: '#059669' },
    { label: 'Active Stories',    value: stories.length,     icon: '📸', bg: '#fef3c7', color: '#d97706' },
  ];

  if (loading) return <div className="full-center"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of all job posts and stories</p>
        </div>
        <Link to="/admin/posts/create" className="btn btn-primary btn-lg">➕ New Job Post</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent posts table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 className="section-title" style={{ margin: 0 }}>Recent Posts</h3>
          <Link to="/admin/posts" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding: 32 }}>
            <div className="empty-icon">📭</div>
            <h3>No posts yet</h3>
            <p>Create your first job post to get started.</p>
            <Link to="/admin/posts/create" className="btn btn-primary" style={{ marginTop: 12 }}>Create Post</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((post) => {
                  const badge = TYPE_BADGE[post.type] || { label: post.type, cls: 'badge-job' };
                  return (
                    <tr key={post.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {post.company_logo
                            ? <img src={post.company_logo} alt="" className="post-row-logo" />
                            : <div className="post-row-logo" style={{ background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏢</div>
                          }
                          <div>
                            <div className="post-title-cell">{post.job_title}</div>
                            <div className="post-meta-cell">{post.company}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                      <td className="post-meta-cell">{post.location || '—'}</td>
                      <td className="post-meta-cell">{post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/posts/edit/${post.id}`} className="btn btn-outline btn-sm">✏️ Edit</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
