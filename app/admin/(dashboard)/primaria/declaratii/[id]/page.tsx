'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Upload, X } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

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
  { value: 'Funcționar public', label: 'Funcționar public' },
];

const initialFormData: DeclarationFormData = {
  person_name: '',
  position: 'Funcționar public',
  declaration_year: currentYear,
  avere_file_url: '',
  avere_file_name: '',
  interese_file_url: '',
  interese_file_name: '',
  published: true,
};

export default function DeclaratiePrimarieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const avereFileRef = useRef<HTMLInputElement>(null);
  const intereseFileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<DeclarationFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingAvere, setUploadingAvere] = useState(false);
  const [uploadingInterese, setUploadingInterese] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DeclarationFormData, string>>>({});

  const loadDeclaration = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/asset-declarations?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();

      if (data) {
        setFormData({
          person_name: data.person_name || '',
          position: data.position || 'Funcționar public',
          declaration_year: data.declaration_year || currentYear,
          avere_file_url: data.avere_file_url || '',
          avere_file_name: data.avere_file_name || '',
          interese_file_url: data.interese_file_url || '',
          interese_file_name: data.interese_file_name || '',
          published: data.published ?? true,
        });
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

  const handleUploadFile = async (file: File, type: 'avere' | 'interese') => {
    if (type === 'avere') setUploadingAvere(true);
    else setUploadingInterese(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'declaratii');
      uploadFormData.append('subcategory', type === 'avere' ? 'avere' : 'interese');
      uploadFormData.append('year', formData.declaration_year.toString());

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      
      if (type === 'avere') {
        setFormData(prev => ({
          ...prev,
          avere_file_url: result.url,
          avere_file_name: file.name,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          interese_file_url: result.url,
          interese_file_name: file.name,
        }));
      }
      
      toast.success('Fișier încărcat', `Declarația de ${type} a fost încărcată.`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Eroare', 'Nu s-a putut încărca fișierul.');
    } finally {
      if (type === 'avere') setUploadingAvere(false);
      else setUploadingInterese(false);
    }
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
        const response = await adminFetch('/api/admin/asset-declarations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(declarationData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Declarație adăugată', 'Datele au fost salvate!');
      } else {
        const response = await adminFetch(`/api/admin/asset-declarations?id=${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(declarationData),
        });
        if (!response.ok) throw new Error('Failed to update');
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

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/asset-declarations?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
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
            {!isNew && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
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
            {formData.avere_file_url ? (
              <div className="p-4 bg-green-50 rounded-lg flex items-center gap-4">
                <FileText className="w-10 h-10 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Declarație Avere încărcată</p>
                  <p className="text-sm text-green-700">{formData.avere_file_name || 'Document PDF'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={formData.avere_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    Deschide
                  </a>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, avere_file_url: '', avere_file_name: '' }))}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Șterge fișierul"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                <input
                  ref={avereFileRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFile(file, 'avere');
                  }}
                  className="hidden"
                />
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Încarcă declarația de avere (PDF)</p>
                <AdminButton
                  icon={Upload}
                  onClick={() => avereFileRef.current?.click()}
                  loading={uploadingAvere}
                >
                  Selectează Fișier
                </AdminButton>
              </div>
            )}
          </AdminCard>

          <AdminCard title="Declarație de Interese">
            {formData.interese_file_url ? (
              <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
                <FileText className="w-10 h-10 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Declarație Interese încărcată</p>
                  <p className="text-sm text-blue-700">{formData.interese_file_name || 'Document PDF'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={formData.interese_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    Deschide
                  </a>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, interese_file_url: '', interese_file_name: '' }))}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Șterge fișierul"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                <input
                  ref={intereseFileRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFile(file, 'interese');
                  }}
                  className="hidden"
                />
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Încarcă declarația de interese (PDF)</p>
                <AdminButton
                  icon={Upload}
                  onClick={() => intereseFileRef.current?.click()}
                  loading={uploadingInterese}
                >
                  Selectează Fișier
                </AdminButton>
              </div>
            )}
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
