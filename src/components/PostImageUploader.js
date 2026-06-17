import React, { useRef, useState } from 'react';
import { uploadAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * PostImageUploader
 * Full-width banner image uploader for job posts.
 * Uploaded image URL is stored as `post_image` on the post.
 * The mobile app reads this URL and renders it as a banner inside the post card.
 *
 * Props:
 *   value    — current post_image URL (string)
 *   onChange — called with the new URL after successful upload
 */
export default function PostImageUploader({ value, onChange }) {
  const inputRef  = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(value || '');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/'))    return toast.error('Please select an image file');
    if (file.size > 5 * 1024 * 1024)        return toast.error('Image must be under 5 MB');

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const { url } = await uploadAPI.image(file);
      setPreview(url);
      onChange(url);
      toast.success('Post image uploaded ✅');
    } catch (err) {
      toast.error('Upload failed: ' + String(err));
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Banner preview area */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          width: '100%',
          height: preview ? 220 : 120,
          borderRadius: 12,
          border: preview ? 'none' : '2px dashed #c7d2fe',
          background: preview ? 'transparent' : '#f8faff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s',
          position: 'relative',
        }}
        title="Click to upload post image"
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span className="spinner" />
            <span style={{ fontSize: 12, color: '#64748b' }}>Uploading…</span>
          </div>
        ) : preview ? (
          <>
            <img
              src={preview}
              alt="post banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
            />
            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 12,
              background: 'rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>🔄 Click to change</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🖼️</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>Click to upload post image</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>This image shows as a banner in the mobile feed</div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : preview ? '🔄 Change Image' : '📤 Upload Image'}
        </button>
        {preview && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleRemove}>
            ✕ Remove
          </button>
        )}
      </div>

      <span className="input-hint">PNG, JPG, WebP — max 5 MB · Recommended: 1200 × 630 px</span>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
