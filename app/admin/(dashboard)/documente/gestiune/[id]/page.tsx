'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Upload, ExternalLink } from 'lucide-react';
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
import { adminFetch } from '@/lib/api-client';
interface DocumentFormData {
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  year: number | null;
  month: number | null;
  subcategory: string;
  description: string;
  document_date: string;
  published: boolean;
}

// Categories with 24h delete restriction
const RESTRICTED_CATEGORIES = ['buget', 'dispozitii', 'regulamente'];
const DELETE_LIMIT_HOURS = 24;

// Subcategory options for specific categories
const SUBCATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  mediu: [
    { value: 'salubrizare', label: 'Salubrizare' },
    { value: 'apa_canal', label: 'Apă și Canal' },
    { value: 'spatii_verzi', label: 'Spații Verzi' },
  ],
  formulare: [
    { value: 'achizitii_publice', label: 'Achiziții Publice' },
    { value: 'asistenta_sociala', label: 'Asistență Socială' },
    { value: 'autorizari_constructii', label: 'Autorizări Construcții' },
    { value: 'birou_agricol', label: 'Birou Agricol' },
    { value: 'centrul_zi', label: 'Centrul de Zi' },
    { value: 'dezvoltare_urbana', label: 'Dezvoltare Urbană' },
    { value: 'diverse', label: 'Diverse' },
    { value: 'evidenta_populatiei', label: 'Evidența Populației' },
    { value: 'impozite_taxe', label: 'Impozite și Taxe' },
    { value: 'protectie_civila', label: 'Protecție Civilă' },
    { value: 'resurse_umane', label: 'Resurse Umane' },
    { value: 'stare_civila', label: 'Stare Civilă' },
    { value: 'urbanism', label: 'Urbanism' },
    { value: 'transparenta', label: 'Transparență' },
  ],
  buget: [
    { value: 'buget_initial', label: 'Buget Inițial' },
    { value: 'rectificare', label: 'Rectificare Buget' },
    { value: 'ct_exec', label: 'Cont Execuție' },
    { value: 'sit_fin_q1', label: 'Situație Financiară T1' },
    { value: 'sit_fin_q2', label: 'Situație Financiară T2' },
    { value: 'sit_fin_q3', label: 'Situație Financiară T3' },
    { value: 'sit_fin_q4', label: 'Situație Financiară T4' },
    { value: 'buget_final', label: 'Buget Final' },
  ],
};

function DocumentEditContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id as string;
  const isNew = id === 'nou';
  
  // Get filter params from URL
  const filterType = searchParams.get('type') || 'category';
  const filterValue = searchParams.get('value') || '';
  const categoryLabel = searchParams.get('label') || 'Documente';
  
  const isRestricted = filterType === 'category' && RESTRICTED_CATEGORIES.includes(filterValue);
  const hasSubcategories = filterType === 'category' && SUBCATEGORY_OPTIONS[filterValue];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);
  const months = [
    { value: '1', label: 'Ianuarie' },
    { value: '2', label: 'Februarie' },
    { value: '3', label: 'Martie' },
    { value: '4', label: 'Aprilie' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Iunie' },
    { value: '7', label: 'Iulie' },
    { value: '8', label: 'August' },
    { value: '9', label: 'Septembrie' },
    { value: '10', label: 'Octombrie' },
    { value: '11', label: 'Noiembrie' },
    { value: '12', label: 'Decembrie' },
  ];

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    year: currentYear,
    month: null,
    subcategory: '',
    description: '',
    document_date: '',
    published: true,
  });
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormData, string>>>({});

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('category', 'documente');
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload eșuat');
      }
      
      setProgress(100);
      setFormData(prev => ({
        ...prev,
        file_url: data.url,
        file_name: file.name,
        file_size: file.size,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      toast.success('Fișier încărcat', 'Documentul a fost încărcat cu succes.');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Eroare la upload';
      toast.error('Eroare la încărcare', errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const loadDocument = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/documents?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      if (data) {
        setFormData({
          title: data.title || '',
          file_url: data.file_url || '',
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          year: data.year || null,
          month: data.month || null,
          subcategory: data.subcategory || '',
          description: data.description || '',
          document_date: data.document_date || '',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      goBack();
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const goBack = () => {
    const params = new URLSearchParams({
      type: filterType,
      value: filterValue,
      label: categoryLabel,
    });
    router.push(`/admin/documente/gestiune?${params.toString()}`);
  };

  const handleChange = (field: keyof DocumentFormData, value: string | boolean | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tip de fișier invalid', 'Sunt permise doar fișiere PDF și DOC/DOCX.');
      return;
    }

    await uploadFile(file);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DocumentFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.file_url.trim()) newErrors.file_url = 'Fișierul este obligatoriu';
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
      const documentData: Record<string, unknown> = {
        title: formData.title.trim(),
        file_url: formData.file_url.trim(),
        file_name: formData.file_name.trim() || formData.title.trim(),
        file_size: formData.file_size || null,
        year: formData.year,
        month: formData.month,
        subcategory: formData.subcategory || null,
        description: formData.description.trim() || null,
        document_date: formData.document_date || null,
        published: formData.published,
      };

      // Set category or source_folder based on filter type
      if (filterType === 'category') {
        documentData.category = filterValue;
      } else if (filterType === 'source_folder') {
        documentData.source_folder = filterValue;
        // Also set a default category for source_folder items
        documentData.category = 'altele';
      }

      if (isNew) {
        const response = await adminFetch('/api/admin/documents', {
          method: 'POST',
          body: JSON.stringify(documentData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Document adăugat', 'Documentul a fost salvat!');
      } else {
        const response = await adminFetch(`/api/admin/documents?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(documentData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Document salvat', 'Modificările au fost salvate!');
      }

      goBack();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const canDeleteDoc = (): boolean => {
    if (!isRestricted) return true;
    return canDeleteItem(createdAt, DELETE_LIMIT_HOURS);
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/documents?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Documentul a fost șters.');
      goBack();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
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
        title={isNew ? 'Încarcă Document Nou' : 'Editează Document'}
        breadcrumbs={[
          { label: 'Documente', href: '/admin/documente' },
          { label: categoryLabel, href: `/admin/documente/gestiune?type=${filterType}&value=${encodeURIComponent(filterValue)}&label=${encodeURIComponent(categoryLabel)}` },
          { label: isNew ? 'Document Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={goBack}>
              Înapoi
            </AdminButton>
            {!isNew && canDeleteDoc() && (
              <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>
                Șterge
              </AdminButton>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload Section */}
          <AdminCard title="Fișier Document">
            <div className="space-y-4">
              {/* File upload area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-1">
                    {uploading ? `Se încarcă... ${progress}%` : 'Click pentru a încărca sau trage fișierul aici'}
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOC, DOCX (max 10MB)</p>
                </label>
                {uploading && (
                  <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Current file display */}
              {formData.file_url && (
                <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{formData.file_name || 'Document'}</p>
                    <p className="text-sm text-slate-500">
                      {formData.file_size ? `${(formData.file_size / 1024).toFixed(1)} KB` : ''}
                    </p>
                  </div>
                  <a 
                    href={formData.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Deschide
                  </a>
                </div>
              )}

              {/* Manual URL input */}
              <details className="text-sm">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                  Sau introdu URL-ul manual
                </summary>
                <div className="mt-3 space-y-3">
                  <AdminInput
                    label="URL Fișier"
                    value={formData.file_url}
                    onChange={(e) => handleChange('file_url', e.target.value)}
                    placeholder="https://..."
                    error={errors.file_url}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Nume Fișier"
                      value={formData.file_name}
                      onChange={(e) => handleChange('file_name', e.target.value)}
                      placeholder="document.pdf"
                    />
                    <AdminInput
                      label="Mărime (bytes)"
                      type="number"
                      value={formData.file_size.toString()}
                      onChange={(e) => handleChange('file_size', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </details>
            </div>
          </AdminCard>

          {/* Document Info */}
          <AdminCard title="Informații Document">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Document"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                error={errors.title}
                placeholder="Ex: Hotărâre buget local 2026"
              />
              <AdminTextarea
                label="Descriere (opțional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Descriere scurtă a documentului..."
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* Settings */}
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AdminSelect
                  label="Anul"
                  value={formData.year?.toString() || ''}
                  onChange={(e) => handleChange('year', e.target.value ? parseInt(e.target.value) : null)}
                  options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                  placeholder="Selectează"
                />
                <AdminSelect
                  label="Luna (opțional)"
                  value={formData.month?.toString() || ''}
                  onChange={(e) => handleChange('month', e.target.value ? parseInt(e.target.value) : null)}
                  options={months}
                  placeholder="Selectează"
                />
              </div>

              <AdminInput
                label="Data Document (opțional)"
                type="date"
                value={formData.document_date}
                onChange={(e) => handleChange('document_date', e.target.value)}
              />

              {hasSubcategories && (
                <AdminSelect
                  label="Subcategorie"
                  value={formData.subcategory}
                  onChange={(e) => handleChange('subcategory', e.target.value)}
                  options={SUBCATEGORY_OPTIONS[filterValue]}
                  placeholder="Selectează subcategoria"
                />
              )}

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Publicat</p>
                  <p className="text-sm text-slate-500">Vizibil pe website</p>
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

              <AdminButton
                size="lg"
                icon={Save}
                onClick={handleSave}
                loading={saving}
                className="w-full"
              >
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>

          {/* Info about category */}
          <AdminCard className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Categorie: {categoryLabel}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {filterType === 'category' 
                    ? `Categoria: ${filterValue}` 
                    : `Folder sursă: ${filterValue}`}
                </p>
              </div>
            </div>
          </AdminCard>

          {isRestricted && !isNew && !canDeleteDoc() && (
            <AdminCard className="bg-amber-50 border-amber-200">
              <p className="text-amber-800 text-sm">
                <strong>Notă:</strong> Acest document nu mai poate fi șters deoarece au trecut mai mult de 24 de ore de la creare.
              </p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Documentul?"
        message={`Ștergi "${formData.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}

export default function DocumentEditPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <DocumentEditContent />
    </Suspense>
  );
}
