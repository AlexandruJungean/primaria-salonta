'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
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

interface EventFormData {
  title: string;
  slug: string;
  event_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  location_address: string;
  description: string;
  program: string;
  featured_image: string;
  published: boolean;
  featured: boolean;
}

const initialFormData: EventFormData = {
  title: '',
  slug: '',
  event_type: 'cultural',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  location: '',
  location_address: '',
  description: '',
  program: '',
  featured_image: '',
  published: false,
  featured: false,
};

const EVENT_TYPES = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'sportiv', label: 'Sportiv' },
  { value: 'civic', label: 'Civic' },
  { value: 'educational', label: 'Educațional' },
  { value: 'administrativ', label: 'Administrativ' },
  { value: 'festival', label: 'Festival' },
  { value: 'altele', label: 'Altele' },
];

export default function EvenimenteEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  const loadEvent = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          event_type: data.event_type || 'cultural',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          start_time: data.start_time || '',
          end_time: data.end_time || '',
          location: data.location || '',
          location_address: data.location_address || '',
          description: data.description || '',
          program: data.program || '',
          featured_image: data.featured_image || '',
          published: data.published || false,
          featured: data.featured || false,
        });
      }
    } catch (error) {
      console.error('Error loading event:', error);
      toast.error('Eroare', 'Nu s-a putut încărca evenimentul.');
      router.push('/admin/evenimente');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    if (!formData.start_date) newErrors.start_date = 'Data de început este obligatorie';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează toate câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const eventData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        event_type: formData.event_type,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location.trim() || null,
        location_address: formData.location_address.trim() || null,
        description: formData.description.trim() || null,
        program: formData.program.trim() || null,
        featured_image: formData.featured_image.trim() || null,
        published: publish || formData.published,
        featured: formData.featured,
      };

      if (isNew) {
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) throw error;
        toast.success('Eveniment creat', 'Evenimentul a fost creat cu succes!');
      } else {
        const { error } = await supabase.from('events').update(eventData).eq('id', id);
        if (error) throw error;
        toast.success('Eveniment salvat', 'Modificările au fost salvate!');
      }

      router.push('/admin/evenimente');
    } catch (error: unknown) {
      console.error('Error saving event:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String(error.message) 
        : 'A apărut o eroare.';
      toast.error('Eroare la salvare', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    setDeleting(true);
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;

      toast.success('Eveniment șters', 'Evenimentul a fost șters cu succes!');
      router.push('/admin/evenimente');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge evenimentul.');
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
        title={isNew ? 'Adaugă Eveniment Nou' : 'Editează Evenimentul'}
        description={isNew ? 'Completează formularul pentru a crea un eveniment nou' : 'Modifică detaliile evenimentului'}
        breadcrumbs={[
          { label: 'Evenimente', href: '/admin/evenimente' },
          { label: isNew ? 'Eveniment Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/evenimente')}>
              Înapoi la listă
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
          <AdminCard title="Informații Principale">
            <div className="space-y-6">
              <AdminInput
                label="Titlu Eveniment"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Titlul evenimentului"
                required
                error={errors.title}
              />

              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="titlul-evenimentului"
                  required
                  error={errors.slug}
                />
                <AdminSelect
                  label="Tip Eveniment"
                  value={formData.event_type}
                  onChange={(e) => handleChange('event_type', e.target.value)}
                  options={EVENT_TYPES}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Data Început"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  required
                  error={errors.start_date}
                />
                <AdminInput
                  label="Data Sfârșit (opțional)"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Ora Început"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                />
                <AdminInput
                  label="Ora Sfârșit"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Locație">
            <div className="space-y-4">
              <AdminInput
                label="Nume Locație"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: Casa de Cultură Salonta"
              />
              <AdminInput
                label="Adresă (opțional)"
                value={formData.location_address}
                onChange={(e) => handleChange('location_address', e.target.value)}
                placeholder="Adresa completă"
              />
            </div>
          </AdminCard>

          <AdminCard title="Detalii">
            <div className="space-y-4">
              <AdminTextarea
                label="Descriere"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descrierea evenimentului..."
                rows={6}
              />
              <AdminTextarea
                label="Program (opțional)"
                value={formData.program}
                onChange={(e) => handleChange('program', e.target.value)}
                placeholder="Programul detaliat al evenimentului..."
                rows={6}
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Publicare">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Status</p>
                  <p className="text-sm text-slate-500">{formData.published ? 'Publicat' : 'Ciornă'}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleChange('published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Eveniment important</p>
                  <p className="text-sm text-slate-500">Afișează pe prima pagină</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <AdminButton size="lg" icon={Save} onClick={() => handleSave(false)} loading={saving} className="w-full">
                  {isNew ? 'Salvează Ciornă' : 'Salvează Modificările'}
                </AdminButton>
                {!formData.published && (
                  <AdminButton size="lg" variant="success" icon={Eye} onClick={() => handleSave(true)} loading={saving} className="w-full">
                    Salvează și Publică
                  </AdminButton>
                )}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Imagine principală">
            <div className="space-y-4">
              <AdminInput
                label="URL Imagine"
                value={formData.featured_image}
                onChange={(e) => handleChange('featured_image', e.target.value)}
                placeholder="https://..."
              />
              {formData.featured_image ? (
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              ) : (
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Nicio imagine selectată</p>
                  </div>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Evenimentul?"
        message={`Ești sigur că vrei să ștergi evenimentul "${formData.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
