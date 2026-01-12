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
} from '@/components/admin';

interface ProgramFormData {
  title: string;
  slug: string;
  program_type: string;
  smis_code: string;
  project_code: string;
  description: string;
  objectives: string;
  total_value: string;
  eu_funding: string;
  national_funding: string;
  local_funding: string;
  currency: string;
  start_date: string;
  end_date: string;
  status: string;
  progress_percentage: number;
  featured_image: string;
  published: boolean;
  featured: boolean;
}

const initialFormData: ProgramFormData = {
  title: '',
  slug: '',
  program_type: 'local',
  smis_code: '',
  project_code: '',
  description: '',
  objectives: '',
  total_value: '',
  eu_funding: '',
  national_funding: '',
  local_funding: '',
  currency: 'RON',
  start_date: '',
  end_date: '',
  status: 'in_derulare',
  progress_percentage: 0,
  featured_image: '',
  published: true,
  featured: false,
};

// Conform CHECK constraint din DB
const PROGRAM_TYPES = [
  { value: 'pnrr', label: 'PNRR' },
  { value: 'regional_nord_vest', label: 'Program Regional Nord-Vest' },
  { value: 'european', label: 'Proiect European' },
  { value: 'local', label: 'Proiect Local' },
  { value: 'strategie', label: 'Strategie' },
  { value: 'pmud', label: 'PMUD' },
  { value: 'sna', label: 'SNA' },
  { value: 'svsu', label: 'SVSU' },
  { value: 'altele', label: 'Altele' },
];

// Conform CHECK constraint din DB
const STATUSES = [
  { value: 'planificat', label: 'Planificat' },
  { value: 'in_derulare', label: 'În desfășurare' },
  { value: 'finalizat', label: 'Finalizat' },
  { value: 'suspendat', label: 'Suspendat' },
  { value: 'anulat', label: 'Anulat' },
];

const CURRENCIES = [
  { value: 'RON', label: 'RON' },
  { value: 'EUR', label: 'EUR' },
];

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
      const { data, error } = await supabase.from('programs').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          program_type: data.program_type || 'local',
          smis_code: data.smis_code || '',
          project_code: data.project_code || '',
          description: data.description || '',
          objectives: data.objectives || '',
          total_value: data.total_value?.toString() || '',
          eu_funding: data.eu_funding?.toString() || '',
          national_funding: data.national_funding?.toString() || '',
          local_funding: data.local_funding?.toString() || '',
          currency: data.currency || 'RON',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          status: data.status || 'in_derulare',
          progress_percentage: data.progress_percentage || 0,
          featured_image: data.featured_image || '',
          published: data.published ?? true,
          featured: data.featured ?? false,
        });
      }
    } catch (error) {
      console.error('Error loading program:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/programe');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 100);
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value, slug: isNew ? generateSlug(value) : prev.slug }));
  };

  const handleChange = (field: keyof ProgramFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProgramFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    if (formData.progress_percentage < 0 || formData.progress_percentage > 100) {
      newErrors.progress_percentage = 'Procentul trebuie să fie între 0 și 100';
    }
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
      const programData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        program_type: formData.program_type,
        smis_code: formData.smis_code.trim() || null,
        project_code: formData.project_code.trim() || null,
        description: formData.description.trim() || null,
        objectives: formData.objectives.trim() || null,
        total_value: formData.total_value ? parseFloat(formData.total_value) : null,
        eu_funding: formData.eu_funding ? parseFloat(formData.eu_funding) : null,
        national_funding: formData.national_funding ? parseFloat(formData.national_funding) : null,
        local_funding: formData.local_funding ? parseFloat(formData.local_funding) : null,
        currency: formData.currency,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: formData.status,
        progress_percentage: formData.progress_percentage,
        featured_image: formData.featured_image.trim() || null,
        published: formData.published,
        featured: formData.featured,
      };

      if (isNew) {
        const { error } = await supabase.from('programs').insert([programData]);
        if (error) throw error;
        toast.success('Program adăugat', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('programs').update(programData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/programe');
    } catch (error) {
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
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Programul a fost șters.');
      router.push('/admin/programe');
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
        title={isNew ? 'Adaugă Program Nou' : 'Editează Programul'}
        breadcrumbs={[
          { label: 'Programe și Proiecte', href: '/admin/programe' },
          { label: isNew ? 'Program Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/programe')}>Înapoi</AdminButton>
            {!isNew && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Program">
            <div className="space-y-4">
              <AdminInput label="Titlu Program" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required error={errors.title} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Slug (URL)" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} required error={errors.slug} />
                <AdminSelect label="Tip Program" value={formData.program_type} onChange={(e) => handleChange('program_type', e.target.value)} options={PROGRAM_TYPES} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Cod SMIS" value={formData.smis_code} onChange={(e) => handleChange('smis_code', e.target.value)} placeholder="Ex: 12345" />
                <AdminInput label="Cod Proiect" value={formData.project_code} onChange={(e) => handleChange('project_code', e.target.value)} placeholder="Ex: C10-I3" />
              </div>
              <AdminTextarea label="Descriere" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} />
              <AdminTextarea label="Obiective" value={formData.objectives} onChange={(e) => handleChange('objectives', e.target.value)} rows={4} />
            </div>
          </AdminCard>

          <AdminCard title="Finanțare">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Valoare totală" type="number" value={formData.total_value} onChange={(e) => handleChange('total_value', e.target.value)} />
                <AdminSelect label="Monedă" value={formData.currency} onChange={(e) => handleChange('currency', e.target.value)} options={CURRENCIES} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <AdminInput label="Finanțare UE" type="number" value={formData.eu_funding} onChange={(e) => handleChange('eu_funding', e.target.value)} />
                <AdminInput label="Finanțare națională" type="number" value={formData.national_funding} onChange={(e) => handleChange('national_funding', e.target.value)} />
                <AdminInput label="Finanțare locală" type="number" value={formData.local_funding} onChange={(e) => handleChange('local_funding', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Data început" type="date" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
                <AdminInput label="Data finalizare" type="date" value={formData.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect label="Status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)} options={STATUSES} />
              <AdminInput 
                label="Progres (%)" 
                type="number" 
                value={formData.progress_percentage.toString()} 
                onChange={(e) => handleChange('progress_percentage', parseInt(e.target.value) || 0)} 
                error={errors.progress_percentage}
                hint="Între 0 și 100"
              />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-slate-900">Publicat</p><p className="text-sm text-slate-500">Vizibil pe website</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={(e) => handleChange('published', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-slate-900">Evidențiat</p><p className="text-sm text-slate-500">Afișat prioritar</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => handleChange('featured', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">{isNew ? 'Salvează' : 'Salvează Modificările'}</AdminButton>
            </div>
          </AdminCard>
          
          <AdminCard title="Imagine">
            <div className="space-y-4">
              <AdminInput label="URL imagine" value={formData.featured_image} onChange={(e) => handleChange('featured_image', e.target.value)} placeholder="https://..." />
              {formData.featured_image && (
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Programul?" message={`Ștergi "${formData.title}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
