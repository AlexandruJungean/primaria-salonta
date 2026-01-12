'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Upload } from 'lucide-react';
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

interface DocumentFormData {
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  year: number;
  description: string;
  published: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  buget: 'Buget',
  dispozitii: 'Dispoziții',
  regulamente: 'Regulamente',
  licitatii: 'Licitații',
  achizitii: 'Achiziții Publice',
  formulare: 'Formulare',
  autorizatii: 'Autorizații Construire',
  altele: 'Alte Documente',
};

const RESTRICTED_CATEGORIES = ['buget', 'dispozitii', 'regulamente'];
const DELETE_LIMIT_HOURS = 24;

export default function DocumentEditPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const id = params.id as string;
  const isNew = id === 'nou';
  const categoryLabel = CATEGORY_LABELS[category] || category;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    year: currentYear,
    description: '',
    published: true,
  });
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormData, string>>>({});

  const loadDocument = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          file_url: data.file_url || '',
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          year: data.year || currentYear,
          description: data.description || '',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push(`/admin/documente/${category}`);
    } finally {
      setLoading(false);
    }
  }, [id, isNew, category, router, currentYear]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleChange = (field: keyof DocumentFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DocumentFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.file_url.trim()) newErrors.file_url = 'URL-ul fișierului este obligatoriu';
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
      const documentData = {
        title: formData.title.trim(),
        category,
        file_url: formData.file_url.trim(),
        file_name: formData.file_name.trim() || formData.title.trim(),
        file_size: formData.file_size || null,
        year: formData.year,
        description: formData.description.trim() || null,
        published: formData.published,
      };

      if (isNew) {
        const { error } = await supabase.from('documents').insert([documentData]);
        if (error) throw error;
        toast.success('Document adăugat', 'Documentul a fost salvat!');
      } else {
        const { error } = await supabase.from('documents').update(documentData).eq('id', id);
        if (error) throw error;
        toast.success('Document salvat', 'Modificările au fost salvate!');
      }

      router.push(`/admin/documente/${category}`);
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const canDelete = (): boolean => {
    if (!RESTRICTED_CATEGORIES.includes(category)) return true;
    return canDeleteItem(createdAt, DELETE_LIMIT_HOURS);
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Documentul a fost șters.');
      router.push(`/admin/documente/${category}`);
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
        title={isNew ? 'Încarcă Document Nou' : 'Editează Document'}
        breadcrumbs={[
          { label: 'Documente', href: '/admin/documente' },
          { label: categoryLabel, href: `/admin/documente/${category}` },
          { label: isNew ? 'Document Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push(`/admin/documente/${category}`)}>Înapoi</AdminButton>
            {!isNew && canDelete() && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Document">
            <div className="space-y-4">
              <AdminInput label="Titlu Document" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required error={errors.title} placeholder="Ex: Hotărâre buget local 2026" />
              <AdminTextarea label="Descriere (opțional)" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} placeholder="Descriere scurtă a documentului..." />
            </div>
          </AdminCard>

          <AdminCard title="Fișier Document">
            <div className="space-y-4">
              <AdminInput label="URL Fișier (PDF)" value={formData.file_url} onChange={(e) => handleChange('file_url', e.target.value)} required error={errors.file_url} placeholder="https://pub-xxx.r2.dev/documente/..." hint="URL-ul fișierului PDF din Cloudflare R2" />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Nume Fișier" value={formData.file_name} onChange={(e) => handleChange('file_name', e.target.value)} placeholder="document.pdf" />
                <AdminInput label="Mărime (bytes)" type="number" value={formData.file_size.toString()} onChange={(e) => handleChange('file_size', parseInt(e.target.value) || 0)} />
              </div>
              
              {formData.file_url && (
                <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                  <FileText className="w-10 h-10 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{formData.file_name || 'Document PDF'}</p>
                    <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      Deschide fișierul →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect
                label="Anul"
                value={formData.year.toString()}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
              />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-slate-900">Publicat</p><p className="text-sm text-slate-500">Vizibil pe website</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={(e) => handleChange('published', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">{isNew ? 'Salvează' : 'Salvează Modificările'}</AdminButton>
            </div>
          </AdminCard>

          {RESTRICTED_CATEGORIES.includes(category) && !isNew && !canDelete() && (
            <AdminCard className="bg-amber-50 border-amber-200">
              <p className="text-amber-800 text-sm">
                <strong>Notă:</strong> Acest document nu mai poate fi șters deoarece au trecut mai mult de 24 de ore de la creare.
              </p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Documentul?" message={`Ștergi "${formData.title}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
