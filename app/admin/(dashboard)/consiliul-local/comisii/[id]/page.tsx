'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
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

interface CommissionFormData {
  name: string;
  description: string;
  commission_number: number;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: CommissionFormData = {
  name: '',
  description: '',
  commission_number: 0,
  is_active: true,
  sort_order: 0,
};

export default function ComisieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<CommissionFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CommissionFormData, string>>>({});

  const loadCommission = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('council_commissions').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          commission_number: data.commission_number || 0,
          is_active: data.is_active ?? true,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading commission:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/comisii');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadCommission();
  }, [loadCommission]);

  const handleChange = (field: keyof CommissionFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommissionFormData, string>> = {};
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
      const commissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        commission_number: formData.commission_number || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const { error } = await supabase.from('council_commissions').insert([commissionData]);
        if (error) throw error;
        toast.success('Comisie adăugată', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('council_commissions').update(commissionData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/consiliul-local/comisii');
    } catch (error) {
      console.error('Error saving commission:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('council_commissions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Comisia a fost ștearsă.');
      router.push('/admin/consiliul-local/comisii');
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
        title={isNew ? 'Adaugă Comisie' : 'Editează Comisia'}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Comisii', href: '/admin/consiliul-local/comisii' },
          { label: isNew ? 'Comisie Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/comisii')}>Înapoi</AdminButton>
            {!isNew && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminCard title="Informații Comisie">
            <div className="space-y-4">
              <AdminInput label="Denumire Comisie" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required error={errors.name} placeholder="Ex: Comisia pentru buget-finanțe" />
              <AdminInput label="Număr Comisie" type="number" value={formData.commission_number.toString()} onChange={(e) => handleChange('commission_number', parseInt(e.target.value) || 0)} placeholder="Ex: 1" />
              <AdminTextarea label="Descriere (opțional)" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} placeholder="Descrierea domeniului de activitate al comisiei..." />
            </div>
          </AdminCard>
        </div>

        <div>
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-slate-900">Activă</p><p className="text-sm text-slate-500">Comisie în funcție</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <AdminInput label="Ordine afișare" type="number" value={formData.sort_order.toString()} onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)} />
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">{isNew ? 'Salvează' : 'Salvează Modificările'}</AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Comisia?" message={`Ștergi "${formData.name}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
