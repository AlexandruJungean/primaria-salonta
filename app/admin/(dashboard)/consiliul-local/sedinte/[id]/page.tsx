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
  AdminSelect,
  AdminConfirmDialog,
  toast,
  canDeleteItem,
} from '@/components/admin';

interface SessionFormData {
  slug: string;
  title: string;
  session_date: string;
  session_type: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
  published: boolean;
}

const initialFormData: SessionFormData = {
  slug: '',
  title: '',
  session_date: '',
  session_type: 'ordinara',
  description: '',
  location: 'Sala de Consiliu, Primăria Salonta',
  start_time: '10:00',
  end_time: '',
  status: 'scheduled',
  published: true,
};

const SESSION_TYPES = [
  { value: 'ordinara', label: 'Ședință Ordinară' },
  { value: 'extraordinara', label: 'Ședință Extraordinară' },
  { value: 'de_indata', label: 'Ședință de Îndată' },
];

const STATUSES = [
  { value: 'scheduled', label: 'Programată' },
  { value: 'in_progress', label: 'În desfășurare' },
  { value: 'completed', label: 'Finalizată' },
  { value: 'cancelled', label: 'Anulată' },
];

const DELETE_LIMIT_HOURS = 24;

export default function SedintaEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<SessionFormData>(initialFormData);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SessionFormData, string>>>({});

  const loadSession = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('council_sessions').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          slug: data.slug || '',
          title: data.title || '',
          session_date: data.session_date || '',
          session_type: data.session_type || 'ordinara',
          description: data.description || '',
          location: data.location || 'Sala de Consiliu, Primăria Salonta',
          start_time: data.start_time || '10:00',
          end_time: data.end_time || '',
          status: data.status || 'scheduled',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/sedinte');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const generateSlug = (date: string, type: string) => {
    if (!date) return '';
    const formattedDate = date.replace(/-/g, '-');
    return `sedinta-${type}-${formattedDate}`;
  };

  const handleDateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      session_date: value,
      slug: isNew ? generateSlug(value, prev.session_type) : prev.slug,
      title: isNew ? `Ședința ${SESSION_TYPES.find(t => t.value === prev.session_type)?.label || ''} din ${value}` : prev.title,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      session_type: value,
      slug: isNew ? generateSlug(prev.session_date, value) : prev.slug,
      title: isNew && prev.session_date ? `Ședința ${SESSION_TYPES.find(t => t.value === value)?.label || ''} din ${prev.session_date}` : prev.title,
    }));
  };

  const handleChange = (field: keyof SessionFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SessionFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    if (!formData.session_date) newErrors.session_date = 'Data este obligatorie';
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
      const sessionData = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        session_date: formData.session_date,
        session_type: formData.session_type,
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        status: formData.status,
        published: formData.published,
      };

      if (isNew) {
        const { error } = await supabase.from('council_sessions').insert([sessionData]);
        if (error) throw error;
        toast.success('Ședință adăugată', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('council_sessions').update(sessionData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/consiliul-local/sedinte');
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const canDelete = (): boolean => canDeleteItem(createdAt, DELETE_LIMIT_HOURS);

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('council_sessions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Ședința a fost ștearsă.');
      router.push('/admin/consiliul-local/sedinte');
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
        title={isNew ? 'Adaugă Ședință Nouă' : 'Editează Ședința'}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Ședințe', href: '/admin/consiliul-local/sedinte' },
          { label: isNew ? 'Ședință Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/sedinte')}>Înapoi</AdminButton>
            {!isNew && canDelete() && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Ședință">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Data Ședință" type="date" value={formData.session_date} onChange={(e) => handleDateChange(e.target.value)} required error={errors.session_date} />
                <AdminSelect label="Tip Ședință" value={formData.session_type} onChange={(e) => handleTypeChange(e.target.value)} options={SESSION_TYPES} />
              </div>
              <AdminInput label="Titlu" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required error={errors.title} />
              <AdminInput label="Slug (URL)" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} required error={errors.slug} />
              <AdminTextarea label="Descriere (opțional)" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} />
            </div>
          </AdminCard>

          <AdminCard title="Locație și Orar">
            <div className="space-y-4">
              <AdminInput label="Locație" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Sala de Consiliu" />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Ora Început" type="time" value={formData.start_time} onChange={(e) => handleChange('start_time', e.target.value)} />
                <AdminInput label="Ora Sfârșit" type="time" value={formData.end_time} onChange={(e) => handleChange('end_time', e.target.value)} />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect label="Status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)} options={STATUSES} />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-slate-900">Publicată</p><p className="text-sm text-slate-500">Vizibilă pe website</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={(e) => handleChange('published', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">{isNew ? 'Salvează' : 'Salvează Modificările'}</AdminButton>
            </div>
          </AdminCard>

          {!isNew && !canDelete() && (
            <AdminCard className="bg-amber-50 border-amber-200">
              <p className="text-amber-800 text-sm"><strong>Notă:</strong> Această ședință nu mai poate fi ștearsă (au trecut 24h).</p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Ședința?" message={`Ștergi "${formData.title}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
