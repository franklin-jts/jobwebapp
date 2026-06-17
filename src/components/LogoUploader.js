import React, { useRef, useState } from 'react';
import { uploadAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * LogoUploader
 * Props:
 *   value    — current company_logo URL (string)
 *   onChange — called with the new URL after upload
 */
export default function LogoUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(value || '');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type + size (max 2 MB)
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    if (file.size > 2 * 1024 * 1024)     return toast.error('Image must be under 2 MB');

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const { url } = await uploadAPI.image(file);
      setPreview(url);
      onChange(url);
      toast.success('Logo uploaded ✅');
    } catch (err) {
      toast.error('Upload failed: ' + String(err));
      setPreview(value || '');   // revert preview on failure
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
      {/* Preview box */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          width: 88, height: 88, borderRadius: 12,
          border: '2px dashed #c7d2fe',
          background: '#f8faff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          overflow: 'hidden', position: 'relative',
          transition: 'border-color 0.15s',
        }}
        title="Click to upload logo"
      >
        {uploading ? (
          <span className="spinner" />
        ) : preview ? (
          <img src={preview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: 28 }}>🏢</span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : preview ? '🔄 Change' : '📤 Upload Logo'}
        </button>
        {preview && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleRemove}>
            ✕ Remove
          </button>
        )}
      </div>

      <span className="input-hint">PNG, JPG, WebP — max 2 MB</span>

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
