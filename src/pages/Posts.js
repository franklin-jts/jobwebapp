import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TYPE_BADGE = {
  job_post:         { label: '📢 Job Post',         cls: 'badge-job' },
  referral_offer:   { label: '🤝 Referral Offer',   cls: 'badge-refer' },
  referral_request: { label: '🙋 Referral Request', cls: 'badge-request' },
};

export default function Posts() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    postsAPI.feed(0, 100)
      .then(setPosts)
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? It will be removed from the app too.')) return;
    try {
      await postsAPI.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Post deleted');
    } catch (e) {
      toast.error(String(e));
    }
  };

  const filtered = posts
    .filter((p) => filter === 'all' || p.type === filter)
    .filter((p) =>
      !search ||
      p.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      p.company?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Job Posts</h2>
          <p>All posts visible in the mobile app</p>
        </div>
        <Link to="/admin/posts/create" className="btn btn-primary btn-lg">➕ New Post</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="input" style={{ maxWidth: 280, height: 38 }} placeholder="🔍 Search by title or company..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { key: 'all',              label: 'All' },
              { key: 'job_post',         label: '📢 Jobs' },
              { key: 'referral_offer',   label: '🤝 Offers' },
              { key: 'referral_request', label: '🙋 Requests' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8' }}>{filtered.length} posts</span>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No posts found</h3>
            <p>Try a different filter or create a new post.</p>
            <Link to="/admin/posts/create" className="btn btn-primary" style={{ marginTop: 12 }}>Create Post</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job / Company</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Skills</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => {
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
                      <td className="post-meta-cell">{post.salary || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 180 }}>
                          {(post.skills || []).slice(0, 3).map((s) => (
                            <span key={s} style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{s}</span>
                          ))}
                          {(post.skills || []).length > 3 && <span style={{ fontSize: 11, color: '#94a3b8' }}>+{post.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="post-meta-cell">{post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/posts/edit/${post.id}`} className="btn btn-outline btn-sm">✏️ Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>🗑 Delete</button>
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
