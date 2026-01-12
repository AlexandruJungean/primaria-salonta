'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';

interface MemberFormData {
  name: string;
  party: string;
  bio: string;
  email: string;
  phone: string;
  photo_url: string;
  mandate_start: string;
  mandate_end: string;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: MemberFormData = {
  name: '',
  party: '',
  bio: '',
  email: '',
  phone: '',
  photo_url: '',
  mandate_start: '',
  mandate_end: '',
  is_active: true,
  sort_order: 0,
};

export default function ConsilierEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});

  const loadMember = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('council_members').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          party: data.party || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          photo_url: data.photo_url || '',
          mandate_start: data.mandate_start || '',
          mandate_end: data.mandate_end || '',
          is_active: data.is_active ?? true,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading member:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/consilieri');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  const handleChange = (field: keyof MemberFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Numele este obligatoriu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const memberData = {
        name: formData.name.trim(),
        party: formData.party.trim() || null,
        bio: formData.bio.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        photo_url: formData.photo_url.trim() || null,
        mandate_start: formData.mandate_start || null,
        mandate_end: formData.mandate_end || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const { error } = await supabase.from('council_members').insert([memberData]);
        if (error) throw error;
        toast.success('Consilier adăugat', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('council_members').update(memberData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/consiliul-local/consilieri');
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('council_members').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Consilierul a fost șters.');
      router.push('/admin/consiliul-local/consilieri');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Consilier' : 'Editează Consilierul'}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Consilieri', href: '/admin/consiliul-local/consilieri' },
          { label: isNew ? 'Consilier Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/consilieri')}>Înapoi</AdminButton>
            {!isNew && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Date Personale">
            <div className="space-y-4">
              <AdminInput label="Nume complet" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required error={errors.name} />
              <AdminInput label="Partid Politic" value={formData.party} onChange={(e) => handleChange('party', e.target.value)} placeholder="Ex: PNL, PSD, etc." />
              <AdminTextarea label="Biografie (opțional)" value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={4} />
            </div>
          </AdminCard>

          <AdminCard title="Contact & Mandat">
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
              <AdminInput label="Telefon" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              <AdminInput label="Început mandat" type="date" value={formData.mandate_start} onChange={(e) => handleChange('mandate_start', e.target.value)} />
              <AdminInput label="Sfârșit mandat" type="date" value={formData.mandate_end} onChange={(e) => handleChange('mandate_end', e.target.value)} />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-slate-900">Activ</p><p className="text-sm text-slate-500">Consilier în funcție</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <AdminInput label="Ordine afișare" type="number" value={formData.sort_order.toString()} onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)} />
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">{isNew ? 'Salvează' : 'Salvează Modificările'}</AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Fotografie">
            <div className="space-y-4">
              <AdminInput label="URL Fotografie" value={formData.photo_url} onChange={(e) => handleChange('photo_url', e.target.value)} />
              {formData.photo_url ? (
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden max-w-[200px] mx-auto">
                  <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center max-w-[200px] mx-auto">
                  <ImageIcon className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Consilierul?" message={`Ștergi "${formData.name}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
