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

interface DecisionFormData {
  slug: string;
  decision_number: number;
  decision_date: string;
  year: number;
  title: string;
  summary: string;
  category: string;
  status: string;
  published: boolean;
}

const currentYear = new Date().getFullYear();

const initialFormData: DecisionFormData = {
  slug: '',
  decision_number: 1,
  decision_date: '',
  year: currentYear,
  title: '',
  summary: '',
  category: 'administrativ',
  status: 'in_vigoare',
  published: true,
};

const CATEGORIES = [
  { value: 'buget', label: 'Buget' },
  { value: 'urbanism', label: 'Urbanism' },
  { value: 'patrimoniu', label: 'Patrimoniu' },
  { value: 'taxe', label: 'Taxe' },
  { value: 'servicii_publice', label: 'Servicii Publice' },
  { value: 'administrativ', label: 'Administrativ' },
  { value: 'social', label: 'Social' },
  { value: 'cultura', label: 'Cultură' },
  { value: 'mediu', label: 'Mediu' },
  { value: 'altele', label: 'Altele' },
];

const STATUSES = [
  { value: 'in_vigoare', label: 'În vigoare' },
  { value: 'modificata', label: 'Modificată' },
  { value: 'abrogata', label: 'Abrogată' },
];

const DELETE_LIMIT_HOURS = 24;

export default function HotarareEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<DecisionFormData>(initialFormData);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DecisionFormData, string>>>({});

  const loadDecision = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('council_decisions').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          slug: data.slug || '',
          decision_number: data.decision_number || 1,
          decision_date: data.decision_date || '',
          year: data.year || currentYear,
          title: data.title || '',
          summary: data.summary || '',
          category: data.category || 'administrativ',
          status: data.status || 'in_vigoare',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
      }
    } catch (error) {
      console.error('Error loading decision:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/hotarari');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadDecision();
  }, [loadDecision]);

  const generateSlug = (number: number, year: number) => {
    return `hotarare-${number}-${year}`;
  };

  const handleNumberChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      decision_number: value,
      slug: isNew ? generateSlug(value, prev.year) : prev.slug,
    }));
  };

  const handleYearChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      year: value,
      slug: isNew ? generateSlug(prev.decision_number, value) : prev.slug,
    }));
  };

  const handleChange = (field: keyof DecisionFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DecisionFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    if (!formData.decision_date) newErrors.decision_date = 'Data este obligatorie';
    if (!formData.decision_number) newErrors.decision_number = 'Numărul este obligatoriu';
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
      const decisionData = {
        slug: formData.slug.trim(),
        decision_number: formData.decision_number,
        decision_date: formData.decision_date,
        year: formData.year,
        title: formData.title.trim(),
        summary: formData.summary.trim() || null,
        category: formData.category,
        status: formData.status,
        published: formData.published,
      };

      if (isNew) {
        const { error } = await supabase.from('council_decisions').insert([decisionData]);
        if (error) throw error;
        toast.success('Hotărâre adăugată', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('council_decisions').update(decisionData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/consiliul-local/hotarari');
    } catch (error) {
      console.error('Error saving decision:', error);
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
      const { error } = await supabase.from('council_decisions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Hotărârea a fost ștearsă.');
      router.push('/admin/consiliul-local/hotarari');
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

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Hotărâre Nouă' : 'Editează Hotărârea'}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Hotărâri', href: '/admin/consiliul-local/hotarari' },
          { label: isNew ? 'Hotărâre Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/hotarari')}>Înapoi</AdminButton>
            {!isNew && canDelete() && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Hotărâre">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <AdminInput label="Număr Hotărâre" type="number" value={formData.decision_number.toString()} onChange={(e) => handleNumberChange(parseInt(e.target.value) || 1)} required error={errors.decision_number} />
                <AdminInput label="Data" type="date" value={formData.decision_date} onChange={(e) => handleChange('decision_date', e.target.value)} required error={errors.decision_date} />
                <AdminSelect label="Anul" value={formData.year.toString()} onChange={(e) => handleYearChange(parseInt(e.target.value))} options={years.map(y => ({ value: y.toString(), label: y.toString() }))} />
              </div>
              <AdminInput label="Slug (URL)" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} required error={errors.slug} />
              <AdminInput label="Titlu Hotărâre" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required error={errors.title} placeholder="Ex: privind aprobarea bugetului local..." />
              <AdminTextarea label="Rezumat (opțional)" value={formData.summary} onChange={(e) => handleChange('summary', e.target.value)} rows={4} placeholder="Rezumatul hotărârii..." />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Clasificare">
            <div className="space-y-4">
              <AdminSelect label="Categorie" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} options={CATEGORIES} />
              <AdminSelect label="Status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)} options={STATUSES} />
            </div>
          </AdminCard>

          <AdminCard title="Publicare">
            <div className="space-y-4">
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
              <p className="text-amber-800 text-sm"><strong>Notă:</strong> Această hotărâre nu mai poate fi ștearsă (au trecut 24h).</p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Hotărârea?" message={`Ștergi hotărârea nr. ${formData.decision_number}?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
