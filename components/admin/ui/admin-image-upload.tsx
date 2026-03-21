'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { adminFetch } from '@/lib/api-client';

interface AdminImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  maxWidth?: number;
  hint?: string;
}

export function AdminImageUpload({
  label,
  value,
  onChange,
  category = 'imagini',
  aspectRatio = 'auto',
  maxWidth = 300,
  hint,
}: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Sunt permise doar imagini (JPG, PNG, WebP, GIF).');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Eroare la încărcare');
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcare');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const aspectClass = aspectRatio === 'square'
    ? 'aspect-square'
    : aspectRatio === 'video'
      ? 'aspect-video'
      : 'aspect-[4/3]';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {value ? (
        <div className="space-y-3">
          <div className={`${aspectClass} bg-slate-100 rounded-lg overflow-hidden relative`} style={{ maxWidth }}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
              title="Șterge imaginea"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Schimbă imaginea
          </button>
        </div>
      ) : (
        <div
          className={`${aspectClass} border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors`}
          style={{ maxWidth }}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-center p-4">
            {uploading ? (
              <>
                <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-slate-500">Se încarcă...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Click pentru a încărca</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP</p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
