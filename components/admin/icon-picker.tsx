'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { getIcon, ICON_OPTIONS } from '@/lib/constants/icon-map';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
  compact?: boolean;
}

export function IconPicker({ value, onChange, label, compact }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const CurrentIcon = getIcon(value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = search
    ? ICON_OPTIONS.filter(name => name.toLowerCase().includes(search.toLowerCase()))
    : ICON_OPTIONS;

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(''); }}
        className={`flex items-center gap-2 border border-slate-300 rounded-lg text-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${compact ? 'px-2 py-1.5' : 'px-3 py-2'}`}
      >
        <CurrentIcon className={`text-blue-600 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        {!compact && <span className="text-slate-700 text-sm">{value}</span>}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Caută icon..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1 p-2 max-h-52 overflow-y-auto">
            {filtered.map(name => {
              const Icon = getIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); }}
                  title={name}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    value === name
                      ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-8 text-center py-4 text-sm text-slate-400">Niciun rezultat</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
