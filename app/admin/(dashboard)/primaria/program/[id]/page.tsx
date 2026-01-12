'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';

interface HourEntry {
  days: string;
  from: string;
  to: string;
}

interface ProgramFormData {
  office_id: string;
  name: string;
  room: string;
  floor: string;
  hours: HourEntry[];
  is_active: boolean;
  sort_order: number;
}

const initialFormData: ProgramFormData = {
  office_id: '',
  name: '',
  room: '',
  floor: '',
  hours: [{ days: 'Luni - Vineri', from: '08:00', to: '16:00' }],
  is_active: true,
  sort_order: 0,
};

export default function ProgramEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<ProgramFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProgramFormData, string>>>({});

  const loadProgram = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase
        .from('office_hours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          office_id: data.office_id || '',
          name: data.name || '',
          room: data.room || '',
          floor: data.floor || '',
          hours: data.hours || [{ days: 'Luni - Vineri', from: '08:00', to: '16:00' }],
          is_active: data.is_active ?? true,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading program:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/primaria/program');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  const handleChange = (field: keyof ProgramFormData, value: string | boolean | number | HourEntry[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleHourChange = (index: number, field: keyof HourEntry, value: string) => {
    const newHours = [...formData.hours];
    newHours[index] = { ...newHours[index], [field]: value };
    handleChange('hours', newHours);
  };

  const addHourEntry = () => {
    handleChange('hours', [...formData.hours, { days: '', from: '08:00', to: '16:00' }]);
  };

  const removeHourEntry = (index: number) => {
    if (formData.hours.length > 1) {
      handleChange('hours', formData.hours.filter((_, i) => i !== index));
    }
  };

  const generateOfficeId = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      office_id: isNew ? generateOfficeId(value) : prev.office_id,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProgramFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Numele este obligatoriu';
    if (!formData.office_id.trim()) newErrors.office_id = 'ID-ul este obligatoriu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează toate câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const programData = {
        office_id: formData.office_id.trim(),
        name: formData.name.trim(),
        room: formData.room.trim() || null,
        floor: formData.floor.trim() || null,
        hours: formData.hours.filter(h => h.days.trim()),
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const { error } = await supabase.from('office_hours').insert([programData]);
        if (error) throw error;
        toast.success('Program adăugat', 'Datele au fost salvate cu succes!');
      } else {
        const { error } = await supabase.from('office_hours').update(programData).eq('id', id);
        if (error) throw error;
        toast.success('Program salvat', 'Modificările au fost salvate!');
      }

      router.push('/admin/primaria/program');
    } catch (error: unknown) {
      console.error('Error saving program:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    setDeleting(true);
    try {
      const { error } = await supabase.from('office_hours').delete().eq('id', id);
      if (error) throw error;

      toast.success('Șters', 'Programul a fost șters.');
      router.push('/admin/primaria/program');
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Program Nou' : 'Editează Program'}
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Program cu Publicul', href: '/admin/primaria/program' },
          { label: isNew ? 'Program Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/primaria/program')}>
              Înapoi
            </AdminButton>
            {!isNew && (
              <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>
                Șterge
              </AdminButton>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Birou">
            <div className="space-y-4">
              <AdminInput
                label="Nume Birou / Serviciu"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Serviciul Taxe și Impozite"
                required
                error={errors.name}
              />
              <AdminInput
                label="ID unic"
                value={formData.office_id}
                onChange={(e) => handleChange('office_id', e.target.value)}
                placeholder="serviciul-taxe-impozite"
                required
                error={errors.office_id}
                hint="Folosit intern pentru identificare"
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Cameră"
                  value={formData.room}
                  onChange={(e) => handleChange('room', e.target.value)}
                  placeholder="Ex: 12"
                />
                <AdminInput
                  label="Etaj"
                  value={formData.floor}
                  onChange={(e) => handleChange('floor', e.target.value)}
                  placeholder="Ex: Parter sau Etaj 1"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Program de Lucru">
            <div className="space-y-4">
              {formData.hours.map((hour, index) => (
                <div key={index} className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <AdminInput
                      label="Zile"
                      value={hour.days}
                      onChange={(e) => handleHourChange(index, 'days', e.target.value)}
                      placeholder="Ex: Luni - Vineri"
                    />
                  </div>
                  <div className="w-32">
                    <AdminInput
                      label="De la"
                      type="time"
                      value={hour.from}
                      onChange={(e) => handleHourChange(index, 'from', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <AdminInput
                      label="Până la"
                      type="time"
                      value={hour.to}
                      onChange={(e) => handleHourChange(index, 'to', e.target.value)}
                    />
                  </div>
                  {formData.hours.length > 1 && (
                    <button
                      onClick={() => removeHourEntry(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <AdminButton variant="secondary" icon={Plus} onClick={addHourEntry}>
                Adaugă interval
              </AdminButton>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Activ</p>
                  <p className="text-sm text-slate-500">Afișează pe website</p>
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
              <AdminInput
                label="Ordine afișare"
                type="number"
                value={formData.sort_order.toString()}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              />
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Programul?"
        message={`Ești sigur că vrei să ștergi programul pentru "${formData.name}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
