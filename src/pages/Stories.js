import React, { useEffect, useRef, useState } from 'react';
import { storiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Stories() {
  const [stories, setStories]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [form, setForm]                 = useState({ image_url: '', caption: '', link_url: '' });
  const [preview, setPreview]           = useState('');
  const [selected, setSelected]         = useState(null);
  const [viewers, setViewers]           = useState([]);
  const [loadingViewers, setLoadingViewers] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    storiesAPI.list()
      .then(setStories)
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openStory = async (story) => {
    setSelected(story);
    setViewers([]);
    setLoadingViewers(true);
    try {
      const data = await storiesAPI.viewers(story.id);
      setViewers(data);
    } catch {
      setViewers([]);
    } finally {
      setLoadingViewers(false);
    }
  };

  const closeStory = () => { setSelected(null); setViewers([]); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      set('image_url', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_url) return toast.error('Please add an image');
    setUploading(true);
    try {
      const story = await storiesAPI.create(form);
      setStories((prev) => [story, ...prev]);
      setForm({ image_url: '', caption: '', link_url: '' });
      setPreview('');
      toast.success('Story uploaded! 🎉');
    } catch (err) {
      toast.error(String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await storiesAPI.delete(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) closeStory();
      toast.success('Story deleted');
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Stories</h2>
          <p>Upload stories that appear at the top of the mobile app feed</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selected ? '360px 1fr 300px' : '360px 1fr',
        gap: 24,
        alignItems: 'flex-start',
        transition: 'grid-template-columns 0.3s',
      }}>

        {/* ── Upload form ─────────────────────────────────────── */}
        <div className="card">
          <h3 className="section-title">📤 Upload New Story</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              {preview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '9/16', background: '#000', marginBottom: 4 }}>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => { setPreview(''); set('image_url', ''); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, fontSize: 14, cursor: 'pointer' }}>
                    ×
                  </button>
                </div>
              ) : (
                <div className="upload-box" onClick={() => fileRef.current.click()}>
                  <div className="upload-icon">🖼️</div>
                  <p>Click to upload story image</p>
                  <span>JPG, PNG, WEBP — 9:16 ratio recommended</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Or paste image URL</label>
              <input className="input" placeholder="https://..."
                value={form.image_url.startsWith('data:') ? '' : form.image_url}
                onChange={(e) => { set('image_url', e.target.value); setPreview(e.target.value); }} />
            </div>
            <div className="form-group">
              <label>Caption (optional)</label>
              <input className="input" placeholder="e.g. We're hiring at Google!"
                value={form.caption} onChange={(e) => set('caption', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Link URL (optional)</label>
              <input className="input" placeholder="https://apply.link"
                value={form.link_url} onChange={(e) => set('link_url', e.target.value)} />
              <span className="input-hint">Tapping the story in the app will open this link</span>
            </div>
            <button type="submit" className="btn btn-success btn-lg" style={{ justifyContent: 'center' }} disabled={uploading}>
              {uploading ? <span className="spinner spinner-sm" /> : '📤 Upload Story'}
            </button>
          </form>
        </div>

        {/* ── Stories grid ─────────────────────────────────────── */}
        <div>
          <h3 className="section-title">📸 Live Stories ({stories.length})</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div className="spinner" />
            </div>
          ) : stories.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📸</div>
              <h3>No stories yet</h3>
              <p>Upload your first story — it will appear at the top of the app feed.</p>
            </div>
          ) : (
            <div className="story-grid">
              {stories.map((s) => (
                <div
                  key={s.id}
                  className="story-card"
                  onClick={() => openStory(s)}
                  style={{
                    cursor: 'pointer',
                    outline: selected?.id === s.id ? '3px solid #4f46e5' : 'none',
                    outlineOffset: 3,
                  }}
                >
                  <img src={s.image_url} alt={s.caption || 'story'} />

                  {/* 👁 View count badge — top left */}
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 20, padding: '3px 8px',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 700, color: '#fff',
                    zIndex: 2,
                  }}>
                    👁 {s.view_count ?? 0}
                  </div>

                  {s.caption && (
                    <div className="story-card-overlay"><p>{s.caption}</p></div>
                  )}
                  <button
                    className="story-delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                    title="Delete story"
                  >🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Viewers panel (Instagram style) ──────────────────── */}
        {selected && (
          <div className="card" style={{ position: 'sticky', top: 24, padding: 0, overflow: 'hidden' }}>

            {/* Story preview — Instagram 9:16 style */}
            <div style={{ position: 'relative', background: '#000', aspectRatio: '9/16', maxHeight: 260, overflow: 'hidden' }}>
              <img
                src={selected.image_url}
                alt={selected.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Top progress bar */}
              <div style={{
                position: 'absolute', top: 10, left: 10, right: 10,
                height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 2,
              }}>
                <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 2 }} />
              </div>
              {/* Caption */}
              {selected.caption && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '24px 12px 10px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                }}>
                  {selected.caption}
                </div>
              )}
              {/* Close */}
              <button onClick={closeStory} style={{
                position: 'absolute', top: 24, right: 10,
                background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                borderRadius: '50%', width: 26, height: 26, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>

            {/* View count row */}
            <div style={{ padding: '14px 16px 0' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#f8fafc', borderRadius: 10, padding: '10px 14px',
                marginBottom: 14,
              }}>
                <span style={{ fontSize: 20 }}>👁</span>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#4f46e5', lineHeight: 1 }}>
                    {selected.view_count ?? viewers.length ?? 0}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Total Views</div>
                </div>
              </div>

              {/* Viewers list header */}
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, marginBottom: 10 }}>
                VIEWERS
              </div>
            </div>

            {/* Viewer rows */}
            <div style={{ padding: '0 16px 16px', maxHeight: 260, overflowY: 'auto' }}>
              {loadingViewers ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                  <div className="spinner" style={{ width: 24, height: 24 }} />
                </div>
              ) : viewers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: 13 }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>👀</div>
                  No views yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {viewers.map((v, i) => (
                    <div key={v.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 10,
                      background: '#f8fafc',
                    }}>
                      <img
                        src={v.avatar || `https://i.pravatar.cc/32?u=${v.email || i}`}
                        alt={v.name}
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.name || v.username || 'Anonymous'}
                        </div>
                        {v.viewed_at && (
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {new Date(v.viewed_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
