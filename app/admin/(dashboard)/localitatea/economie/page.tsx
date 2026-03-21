'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface EconomieData {
  restaurants: { name: string; url?: string; address?: string; featured?: boolean }[];
  hotels: { name: string; url?: string; descriptionKey?: string }[];
  tourismAgencies: { name: string; url?: string; descriptionKey?: string }[];
}

export default function AdminEconomiePage() {
  const [data, setData] = useState<EconomieData>({ restaurants: [], hotels: [], tourismAgencies: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-economie');
      if (!response.ok) throw new Error('Failed');
      const page = await response.json();
      const sd = page.structured_data || {};
      setData({
        restaurants: sd.restaurants || [],
        hotels: sd.hotels || [],
        tourismAgencies: sd.tourismAgencies || [],
      });
    } catch { toast.error('Eroare la încărcarea datelor'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-economie', {
        method: 'PATCH',
        body: JSON.stringify({ structured_data: { ...data } }),
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('Salvat cu succes');
    } catch { toast.error('Eroare la salvare'); }
    finally { setSaving(false); }
  };

  const updateList = <K extends keyof EconomieData>(key: K, items: EconomieData[K]) => {
    setData(d => ({ ...d, [key]: items }));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Economie"
        description="Gestionează restaurante, hoteluri și agenții de turism"
        breadcrumbs={[{ label: 'Localitatea', href: '/admin/localitatea' }, { label: 'Economie' }]}
        actions={<AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează'}</AdminButton>}
      />

      {/* Restaurants */}
      <AdminCard title="Restaurante" className="mb-6" actions={
        <AdminButton size="sm" variant="secondary" icon={Plus} onClick={() => updateList('restaurants', [...data.restaurants, { name: '' }])}>Adaugă</AdminButton>
      }>
        <div className="space-y-3">
          {data.restaurants.map((r, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input value={r.name} onChange={e => { const items = [...data.restaurants]; items[i] = { ...items[i], name: e.target.value }; updateList('restaurants', items); }} placeholder="Nume" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                <input value={r.url || ''} onChange={e => { const items = [...data.restaurants]; items[i] = { ...items[i], url: e.target.value }; updateList('restaurants', items); }} placeholder="URL (opțional)" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                <input value={r.address || ''} onChange={e => { const items = [...data.restaurants]; items[i] = { ...items[i], address: e.target.value }; updateList('restaurants', items); }} placeholder="Adresă (opțional)" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              </div>
              <label className="flex items-center gap-1 text-xs text-slate-500 shrink-0 pt-2">
                <input type="checkbox" checked={!!r.featured} onChange={e => { const items = [...data.restaurants]; items[i] = { ...items[i], featured: e.target.checked }; updateList('restaurants', items); }} className="w-3.5 h-3.5 rounded" />
                Recomandat
              </label>
              <button onClick={() => updateList('restaurants', data.restaurants.filter((_, j) => j !== i))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Hotels */}
      <AdminCard title="Hoteluri" className="mb-6" actions={
        <AdminButton size="sm" variant="secondary" icon={Plus} onClick={() => updateList('hotels', [...data.hotels, { name: '' }])}>Adaugă</AdminButton>
      }>
        <div className="space-y-3">
          {data.hotels.map((h, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={h.name} onChange={e => { const items = [...data.hotels]; items[i] = { ...items[i], name: e.target.value }; updateList('hotels', items); }} placeholder="Nume" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                <input value={h.url || ''} onChange={e => { const items = [...data.hotels]; items[i] = { ...items[i], url: e.target.value }; updateList('hotels', items); }} placeholder="URL" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              </div>
              <button onClick={() => updateList('hotels', data.hotels.filter((_, j) => j !== i))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Tourism Agencies */}
      <AdminCard title="Agenții de turism" actions={
        <AdminButton size="sm" variant="secondary" icon={Plus} onClick={() => updateList('tourismAgencies', [...data.tourismAgencies, { name: '' }])}>Adaugă</AdminButton>
      }>
        <div className="space-y-3">
          {data.tourismAgencies.map((a, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={a.name} onChange={e => { const items = [...data.tourismAgencies]; items[i] = { ...items[i], name: e.target.value }; updateList('tourismAgencies', items); }} placeholder="Nume" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                <input value={a.url || ''} onChange={e => { const items = [...data.tourismAgencies]; items[i] = { ...items[i], url: e.target.value }; updateList('tourismAgencies', items); }} placeholder="URL" className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              </div>
              <button onClick={() => updateList('tourismAgencies', data.tourismAgencies.filter((_, j) => j !== i))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="mt-6 flex justify-end">
        <AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează totul'}</AdminButton>
      </div>
    </div>
  );
}
