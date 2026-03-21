'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface LocalizareData {
  coordinates: { latitude: string; longitude: string; altitude: string; area: string };
  distances: { city: string; km: number }[];
  accessibility: string[];
  mapEmbedUrl: string;
  description: string;
}

export default function AdminLocalizarePage() {
  const [data, setData] = useState<LocalizareData>({
    coordinates: { latitude: '', longitude: '', altitude: '', area: '' },
    distances: [],
    accessibility: [],
    mapEmbedUrl: '',
    description: '',
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-localizare');
      if (!response.ok) throw new Error('Failed');
      const page = await response.json();
      if (page.structured_data) setData(page.structured_data);
      setContent(page.content || '');
    } catch { toast.error('Eroare la încărcarea datelor'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-localizare', {
        method: 'PATCH',
        body: JSON.stringify({ structured_data: data, content }),
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('Salvat cu succes');
    } catch { toast.error('Eroare la salvare'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Localizare"
        description="Editează datele geografice și harta"
        breadcrumbs={[{ label: 'Localitatea', href: '/admin/localitatea' }, { label: 'Localizare' }]}
        actions={<AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează'}</AdminButton>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminCard title="Coordonate">
          <div className="space-y-3">
            {(['latitude', 'longitude', 'altitude', 'area'] as const).map(key => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">{key}</label>
                <input value={data.coordinates[key]} onChange={e => setData(d => ({ ...d, coordinates: { ...d.coordinates, [key]: e.target.value } }))} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Distanțe">
          <div className="space-y-2">
            {data.distances.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input value={d.city} onChange={e => { const items = [...data.distances]; items[i] = { ...items[i], city: e.target.value }; setData(prev => ({ ...prev, distances: items })); }} placeholder="Oraș" className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                <input type="number" value={d.km} onChange={e => { const items = [...data.distances]; items[i] = { ...items[i], km: parseInt(e.target.value) || 0 }; setData(prev => ({ ...prev, distances: items })); }} placeholder="km" className="w-24 px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                <button onClick={() => setData(prev => ({ ...prev, distances: prev.distances.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 text-sm">×</button>
              </div>
            ))}
            <button onClick={() => setData(d => ({ ...d, distances: [...d.distances, { city: '', km: 0 }] }))} className="text-sm text-blue-600 hover:text-blue-700">+ Adaugă distanță</button>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Introducere" className="mb-6">
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" placeholder="Text introductiv..." />
      </AdminCard>

      <AdminCard title="Descriere amplasare" className="mb-6">
        <textarea value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} rows={4} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
      </AdminCard>

      <AdminCard title="URL Hartă Google Maps" className="mb-6">
        <input value={data.mapEmbedUrl} onChange={e => setData(d => ({ ...d, mapEmbedUrl: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg" placeholder="https://www.google.com/maps/embed?..." />
      </AdminCard>

      <AdminCard title="Accesibilitate">
        <div className="space-y-2">
          {data.accessibility.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input value={item} onChange={e => { const items = [...data.accessibility]; items[i] = e.target.value; setData(d => ({ ...d, accessibility: items })); }} className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              <button onClick={() => setData(d => ({ ...d, accessibility: d.accessibility.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 text-sm">×</button>
            </div>
          ))}
          <button onClick={() => setData(d => ({ ...d, accessibility: [...d.accessibility, ''] }))} className="text-sm text-blue-600 hover:text-blue-700">+ Adaugă rută</button>
        </div>
      </AdminCard>

      <div className="mt-6 flex justify-end">
        <AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează totul'}</AdminButton>
      </div>
    </div>
  );
}
