import React, { useEffect, useRef, useState } from 'react';
import { storiesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image_url: '', caption: '', link_url: '' });
  const [preview, setPreview] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    storiesAPI.list()
      .then(setStories)
      .catch(() => {
        // stories endpoint may not exist yet — show empty state gracefully
        setStories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Handle file → convert to base64 data URL for preview
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      set('image_url', ev.target.result); // send as base64 or swap with upload URL
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
    } catch (e) {
      toast.error(String(e));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await storiesAPI.delete(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
      toast.success('Story deleted');
    } catch (e) {
      toast.error(String(e));
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

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Upload form */}
        <div className="card">
          <h3 className="section-title">📤 Upload New Story</h3>
          <form onSubmit={handleSubmit} className="form-grid">

            {/* File picker */}
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

            {/* Or paste URL */}
            <div className="form-group">
              <label>Or paste image URL</label>
              <input className="input" placeholder="https://..." value={form.image_url.startsWith('data:') ? '' : form.image_url}
                onChange={(e) => { set('image_url', e.target.value); setPreview(e.target.value); }} />
            </div>

            <div className="form-group">
              <label>Caption (optional)</label>
              <input className="input" placeholder="e.g. We're hiring at Google!" value={form.caption} onChange={(e) => set('caption', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Link URL (optional)</label>
              <input className="input" placeholder="https://apply.link" value={form.link_url} onChange={(e) => set('link_url', e.target.value)} />
              <span className="input-hint">Tapping the story in the app will open this link</span>
            </div>

            <button type="submit" className="btn btn-success btn-lg" style={{ justifyContent: 'center' }} disabled={uploading}>
              {uploading ? <span className="spinner spinner-sm" /> : '📤 Upload Story'}
            </button>
          </form>
        </div>

        {/* Stories grid */}
        <div>
          <h3 className="section-title">📸 Live Stories ({stories.length})</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
          ) : stories.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📸</div>
              <h3>No stories yet</h3>
              <p>Upload your first story — it will appear at the top of the app feed.</p>
            </div>
          ) : (
            <div className="story-grid">
              {stories.map((s) => (
                <div key={s.id} className="story-card">
                  <img src={s.image_url} alt={s.caption || 'story'} />
                  {s.caption && (
                    <div className="story-card-overlay">
                      <p>{s.caption}</p>
                    </div>
                  )}
                  <button className="story-delete-btn" onClick={() => handleDelete(s.id)} title="Delete story">🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
