'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

export default function AdminIstoricPage() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-istoric');
      if (!response.ok) throw new Error('Failed');
      const page = await response.json();
      setContent(page.content || '');
      setImages(page.structured_data?.images || []);
    } catch { toast.error('Eroare la încărcarea datelor'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-istoric', {
        method: 'PATCH',
        body: JSON.stringify({ content, structured_data: { images } }),
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
        title="Istoric"
        description="Editează conținutul paginii de istorie a Municipiului Salonta"
        breadcrumbs={[{ label: 'Localitatea', href: '/admin/localitatea' }, { label: 'Istoric' }]}
        actions={<AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează'}</AdminButton>}
      />

      <AdminCard title="Imagini" className="mb-6">
        <p className="text-sm text-slate-500 mb-3">Conținutul textual al paginii de istoric este gestionat prin fișierele de traducere (ro.json, hu.json, en.json). Aici poți modifica imaginile asociate.</p>
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex gap-3">
              <input value={img.src} onChange={e => { const items = [...images]; items[i] = { ...items[i], src: e.target.value }; setImages(items); }} placeholder="Cale imagine" className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              <input value={img.alt} onChange={e => { const items = [...images]; items[i] = { ...items[i], alt: e.target.value }; setImages(items); }} placeholder="Text alternativ" className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
              <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-sm">×</button>
            </div>
          ))}
          <button onClick={() => setImages([...images, { src: '', alt: '' }])} className="text-sm text-blue-600 hover:text-blue-700">+ Adaugă imagine</button>
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează'}</AdminButton>
      </div>
    </div>
  );
}
