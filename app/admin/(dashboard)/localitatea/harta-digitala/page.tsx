'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

export default function AdminHartaDigitalaPage() {
  const [externalUrl, setExternalUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-harta-digitala');
      if (!response.ok) throw new Error('Failed');
      const page = await response.json();
      setExternalUrl(page.structured_data?.externalUrl || '');
    } catch { toast.error('Eroare la încărcarea datelor'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/pages?slug=localitatea-harta-digitala', {
        method: 'PATCH',
        body: JSON.stringify({ structured_data: { externalUrl } }),
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
        title="Harta Digitală"
        description="Configurează link-ul către harta digitală interactivă"
        breadcrumbs={[{ label: 'Localitatea', href: '/admin/localitatea' }, { label: 'Harta Digitală' }]}
        actions={<AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează'}</AdminButton>}
      />

      <AdminCard title="URL Hartă Externă">
        <p className="text-sm text-slate-500 mb-3">Link-ul către platforma de hartă digitală interactivă (map2web.eu).</p>
        <input value={externalUrl} onChange={e => setExternalUrl(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" placeholder="https://salonta-city.map2web.eu/" />
      </AdminCard>

      <div className="mt-6 flex justify-end">
        <AdminButton onClick={saveData} disabled={saving} icon={Save}>{saving ? 'Se salvează...' : 'Salvează'}</AdminButton>
      </div>
    </div>
  );
}
