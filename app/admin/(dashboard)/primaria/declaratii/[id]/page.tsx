'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminConfirmDialog,
  toast,
  canDeleteItem,
} from '@/components/admin';

interface DeclarationFormData {
  person_name: string;
  position: string;
  declaration_year: number;
  avere_file_url: string;
  avere_file_name: string;
  interese_file_url: string;
  interese_file_name: string;
  published: boolean;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const POSITIONS = [
  { value: 'Primar', label: 'Primar' },
  { value: 'Viceprimar', label: 'Viceprimar' },
  { value: 'Secretar General', label: 'Secretar General' },
  { value: 'Administrator Public', label: 'Administrator Public' },
  { value: 'Director', label: 'Director' },
  { value: 'Șef Serviciu', label: 'Șef Serviciu' },
];

const initialFormData: DeclarationFormData = {
  person_name: '',
  position: 'Primar',
  declaration_year: currentYear,
  avere_file_url: '',
  avere_file_name: '',
  interese_file_url: '',
  interese_file_name: '',
  published: true,
};

const DELETE_LIMIT_HOURS = 24;

export default function DeclaratiePrimarieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<DeclarationFormData>(initialFormData);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DeclarationFormData, string>>>({});

  const loadDeclaration = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase.from('asset_declarations').select('*').eq('id', id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          person_name: data.person_name || '',
          position: data.position || 'Primar',
          declaration_year: data.declaration_year || currentYear,
          avere_file_url: data.avere_file_url || '',
          avere_file_name: data.avere_file_name || '',
          interese_file_url: data.interese_file_url || '',
          interese_file_name: data.interese_file_name || '',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
      }
    } catch (error) {
      console.error('Error loading declaration:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/primaria/declaratii');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadDeclaration();
  }, [loadDeclaration]);

  const handleChange = (field: keyof DeclarationFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DeclarationFormData, string>> = {};
    if (!formData.person_name.trim()) newErrors.person_name = 'Numele este obligatoriu';
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
      const declarationData = {
        person_name: formData.person_name.trim(),
        position: formData.position,
        department: 'primaria',
        declaration_year: formData.declaration_year,
        avere_file_url: formData.avere_file_url.trim() || null,
        avere_file_name: formData.avere_file_name.trim() || null,
        interese_file_url: formData.interese_file_url.trim() || null,
        interese_file_name: formData.interese_file_name.trim() || null,
        published: formData.published,
      };

      if (isNew) {
        const { error } = await supabase.from('asset_declarations').insert([declarationData]);
        if (error) throw error;
        toast.success('Declarație adăugată', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase.from('asset_declarations').update(declarationData).eq('id', id);
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/primaria/declaratii');
    } catch (error) {
      console.error('Error saving declaration:', error);
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
      const { error } = await supabase.from('asset_declarations').delete().eq('id', id);
      if (error) throw error;
      toast.success('Șters', 'Declarația a fost ștearsă.');
      router.push('/admin/primaria/declaratii');
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
        title={isNew ? 'Adaugă Declarație' : 'Editează Declarația'}
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Declarații', href: '/admin/primaria/declaratii' },
          { label: isNew ? 'Declarație Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/primaria/declaratii')}>Înapoi</AdminButton>
            {!isNew && canDelete() && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Persoană">
            <div className="space-y-4">
              <AdminInput label="Nume Complet" value={formData.person_name} onChange={(e) => handleChange('person_name', e.target.value)} required error={errors.person_name} />
              <div className="grid grid-cols-2 gap-4">
                <AdminSelect label="Funcție" value={formData.position} onChange={(e) => handleChange('position', e.target.value)} options={POSITIONS} />
                <AdminSelect label="Anul" value={formData.declaration_year.toString()} onChange={(e) => handleChange('declaration_year', parseInt(e.target.value))} options={years.map(y => ({ value: y.toString(), label: y.toString() }))} />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Declarație de Avere">
            <div className="space-y-4">
              <AdminInput label="URL Fișier Avere (PDF)" value={formData.avere_file_url} onChange={(e) => handleChange('avere_file_url', e.target.value)} placeholder="https://..." />
              <AdminInput label="Nume Fișier" value={formData.avere_file_name} onChange={(e) => handleChange('avere_file_name', e.target.value)} placeholder="declaratie-avere.pdf" />
              {formData.avere_file_url && (
                <div className="p-4 bg-green-50 rounded-lg flex items-center gap-4">
                  <FileText className="w-8 h-8 text-green-600" />
                  <a href={formData.avere_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 hover:underline">Deschide fișierul →</a>
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Declarație de Interese">
            <div className="space-y-4">
              <AdminInput label="URL Fișier Interese (PDF)" value={formData.interese_file_url} onChange={(e) => handleChange('interese_file_url', e.target.value)} placeholder="https://..." />
              <AdminInput label="Nume Fișier" value={formData.interese_file_name} onChange={(e) => handleChange('interese_file_name', e.target.value)} placeholder="declaratie-interese.pdf" />
              {formData.interese_file_url && (
                <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <a href={formData.interese_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">Deschide fișierul →</a>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        <div>
          <AdminCard title="Setări">
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
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Declarația?" message={`Ștergi declarația pentru "${formData.person_name}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
