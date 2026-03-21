'use client';

import { useState } from 'react';
import { ImageIcon, X, Pencil } from 'lucide-react';

interface ImageFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageField({ value, onChange, label }: ImageFieldProps) {
  const [editing, setEditing] = useState(false);

  if (!value && !editing) {
    return (
      <div>
        {label && <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-xs">Adaugă imagine</span>
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        {label && <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>}
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="/images/..."
            className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
            onBlur={() => { if (value) setEditing(false); }}
            onKeyDown={e => { if (e.key === 'Enter' && value) setEditing(false); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {label && <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>}
      <div className="relative group w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={value}
          alt=""
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 bg-white/90 rounded-md hover:bg-white text-slate-700"
            title="Schimbă"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 bg-white/90 rounded-md hover:bg-white text-red-600"
            title="Șterge"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
