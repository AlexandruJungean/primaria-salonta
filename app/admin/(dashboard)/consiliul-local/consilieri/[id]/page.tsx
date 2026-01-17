'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface MemberFormData {
  name: string;
  party: string;
  is_active: boolean;
}

const initialFormData: MemberFormData = {
  name: '',
  party: '',
  is_active: true,
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
      const response = await adminFetch(`/api/admin/council-members?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        setFormData({
          name: data.name || '',
          party: data.party || '',
          is_active: data.is_active ?? true,
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
        is_active: formData.is_active,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/council-members', {
          method: 'POST',
          body: JSON.stringify(memberData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Consilier adăugat', 'Datele au fost salvate!');
      } else {
        const response = await adminFetch(`/api/admin/council-members?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(memberData),
        });
        if (!response.ok) throw new Error('Failed to update');
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
      const response = await adminFetch(`/api/admin/council-members?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
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

      <div className="max-w-xl">
        <AdminCard title="Date Consilier">
          <div className="space-y-4">
            <AdminInput 
              label="Nume complet" 
              value={formData.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              required 
              error={errors.name} 
            />
            <AdminInput 
              label="Partid Politic" 
              value={formData.party} 
              onChange={(e) => handleChange('party', e.target.value)} 
              placeholder="Ex: UDMR, PNL, PSD, etc." 
            />
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Activ</p>
                <p className="text-sm text-slate-500">Consilier în funcție</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={(e) => handleChange('is_active', e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 italic">Consilierii sunt afișați în ordine alfabetică pe website.</p>
            <AdminButton 
              size="lg" 
              icon={Save} 
              onClick={handleSave} 
              loading={saving} 
              className="w-full"
            >
              {isNew ? 'Salvează' : 'Salvează Modificările'}
            </AdminButton>
          </div>
        </AdminCard>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Consilierul?" message={`Ștergi "${formData.name}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
