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

interface InstitutionFormData {
  name: string;
  slug: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  schedule: string;
  icon: string;
  is_active: boolean;
  show_in_citizens: boolean;
  show_in_tourists: boolean;
  sort_order: number;
}

const initialFormData: InstitutionFormData = {
  name: '',
  slug: '',
  category: 'educatie',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  schedule: '',
  icon: 'building',
  is_active: true,
  show_in_citizens: true,
  show_in_tourists: false,
  sort_order: 0,
};

const CATEGORIES = [
  { value: 'educatie', label: 'Educație' },
  { value: 'sanatate', label: 'Sănătate' },
  { value: 'sport', label: 'Sport' },
  { value: 'cultura', label: 'Cultură' },
  { value: 'social', label: 'Social' },
  { value: 'altele', label: 'Altele' },
];

const ICONS = [
  { value: 'building', label: 'Clădire' },
  { value: 'bookOpen', label: 'Carte (Educație)' },
  { value: 'heart', label: 'Inimă (Sănătate)' },
  { value: 'landmark', label: 'Monument (Cultură)' },
  { value: 'users', label: 'Persoane (Social)' },
];

export default function InstitutieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<InstitutionFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof InstitutionFormData, string>>>({});

  const loadInstitution = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('institutions').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          category: data.category || 'educatie',
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          schedule: data.schedule || '',
          icon: data.icon || 'building',
          is_active: data.is_active ?? true,
          show_in_citizens: data.show_in_citizens ?? true,
          show_in_tourists: data.show_in_tourists ?? false,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading institution:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/institutii');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadInstitution();
  }, [loadInstitution]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 100);
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value, slug: isNew ? generateSlug(value) : prev.slug }));
  };

  const handleChange = (field: keyof InstitutionFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InstitutionFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Numele este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
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
      const institutionData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        schedule: formData.schedule.trim() || null,
        icon: formData.icon,
        is_active: formData.is_active,
        show_in_citizens: formData.show_in_citizens,
        show_in_tourists: formData.show_in_tourists,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const { error } = await supabase.from('institutions').insert([institutionData]);
        if (error) throw error;
        toast.success('Instituție adăugată', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('institutions').update(institutionData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/institutii');
    } catch (error) {
      console.error('Error saving institution:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('institutions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Instituția a fost ștearsă.');
      router.push('/admin/institutii');
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
        title={isNew ? 'Adaugă Instituție' : 'Editează Instituția'}
        breadcrumbs={[
          { label: 'Instituții', href: '/admin/institutii' },
          { label: isNew ? 'Instituție Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/institutii')}>Înapoi</AdminButton>
            {!isNew && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Generale">
            <div className="space-y-4">
              <AdminInput label="Nume Instituție" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required error={errors.name} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Slug (URL)" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} required error={errors.slug} />
                <AdminSelect label="Categorie" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} options={CATEGORIES} />
              </div>
              <AdminTextarea label="Descriere" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} />
            </div>
          </AdminCard>

          <AdminCard title="Contact">
            <div className="space-y-4">
              <AdminInput label="Adresă" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Telefon" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                <AdminInput label="Email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
              </div>
              <AdminInput label="Website" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} placeholder="https://..." />
              <AdminInput label="Program" value={formData.schedule} onChange={(e) => handleChange('schedule', e.target.value)} placeholder="Luni-Vineri: 08:00-16:00" />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect label="Icon" value={formData.icon} onChange={(e) => handleChange('icon', e.target.value)} options={ICONS} />
              <AdminInput label="Ordine afișare" type="number" value={formData.sort_order.toString()} onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)} />
              
              {[
                { field: 'is_active' as const, label: 'Activă', desc: 'Vizibilă pe website' },
                { field: 'show_in_citizens' as const, label: 'Pentru Cetățeni', desc: 'Afișează în meniul Cetățeni' },
                { field: 'show_in_tourists' as const, label: 'Pentru Turiști', desc: 'Afișează în meniul Turiști' },
              ].map(({ field, label, desc }) => (
                <div key={field} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div><p className="font-medium text-slate-900">{label}</p><p className="text-sm text-slate-500">{desc}</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData[field] as boolean} onChange={(e) => handleChange(field, e.target.checked)} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">{isNew ? 'Salvează' : 'Salvează Modificările'}</AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Instituția?" message={`Ștergi "${formData.name}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
