'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
interface ReportFormData {
  title: string;
  report_type: string;
  category: string;
  summary: string;
  file_url: string;
  file_name: string;
  file_size: number;
  report_year: number | null;
  report_date: string;
  author: string;
  published: boolean;
}

const REPORT_TYPES = [
  { value: 'audit', label: 'Raport de Audit' },
  { value: 'raport_primar', label: 'Raport Primar' },
  { value: 'raport_activitate', label: 'Raport Activitate' },
  { value: 'studiu', label: 'Studiu' },
  { value: 'analiza', label: 'Analiză' },
  { value: 'raport_curtea_conturi', label: 'Raport Curtea de Conturi' },
  { value: 'studiu_fezabilitate', label: 'Studiu de Fezabilitate' },
  { value: 'studiu_impact', label: 'Studiu de Impact' },
  { value: 'altele', label: 'Altele' },
];

const REPORT_CATEGORIES = [
  { value: 'comisie', label: 'Comisie de Specialitate' },
  { value: 'consilier', label: 'Consilier Local' },
  { value: 'primar', label: 'Primar' },
  { value: 'audit_extern', label: 'Audit Extern' },
  { value: 'curtea_conturi', label: 'Curtea de Conturi' },
  { value: 'altele', label: 'Altele' },
];

export default function ReportEditPage() {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id as string;
  const isNew = id === 'nou';
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    report_type: 'audit',
    category: '',
    summary: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    report_year: currentYear,
    report_date: '',
    author: '',
    published: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData, string>>>({});

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('category', 'rapoarte');
      
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

  const loadReport = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/reports?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      if (data) {
        setFormData({
          title: data.title || '',
          report_type: data.report_type || 'audit',
          category: data.category || '',
          summary: data.summary || '',
          file_url: data.file_url || '',
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          report_year: data.report_year || null,
          report_date: data.report_date || '',
          author: data.author || '',
          published: data.published ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading report:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/documente/rapoarte');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleChange = (field: keyof ReportFormData, value: string | boolean | number | null) => {
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
    const newErrors: Partial<Record<keyof ReportFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.report_type) newErrors.report_type = 'Tipul raportului este obligatoriu';
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
      const reportData = {
        title: formData.title.trim(),
        report_type: formData.report_type,
        category: formData.category || null,
        summary: formData.summary.trim() || null,
        file_url: formData.file_url.trim(),
        file_name: formData.file_name.trim() || formData.title.trim(),
        file_size: formData.file_size || null,
        report_year: formData.report_year,
        report_date: formData.report_date || null,
        author: formData.author.trim() || null,
        published: formData.published,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/reports', {
          method: 'POST',
          body: JSON.stringify(reportData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Raport adăugat', 'Raportul a fost salvat!');
      } else {
        const response = await adminFetch(`/api/admin/reports?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(reportData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Raport salvat', 'Modificările au fost salvate!');
      }

      router.push('/admin/documente/rapoarte');
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/reports?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Raportul a fost șters.');
      router.push('/admin/documente/rapoarte');
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
        title={isNew ? 'Adaugă Raport Nou' : 'Editează Raport'}
        breadcrumbs={[
          { label: 'Documente', href: '/admin/documente' },
          { label: 'Rapoarte și Studii', href: '/admin/documente/rapoarte' },
          { label: isNew ? 'Raport Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/documente/rapoarte')}>
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
          {/* File Upload Section */}
          <AdminCard title="Fișier Raport">
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

              {errors.file_url && (
                <p className="text-sm text-red-500">{errors.file_url}</p>
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
                  />
                  <AdminInput
                    label="Nume Fișier"
                    value={formData.file_name}
                    onChange={(e) => handleChange('file_name', e.target.value)}
                    placeholder="raport.pdf"
                  />
                </div>
              </details>
            </div>
          </AdminCard>

          {/* Report Info */}
          <AdminCard title="Informații Raport">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Raport"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                error={errors.title}
                placeholder="Ex: Raport audit financiar 2024"
              />
              <AdminTextarea
                label="Descriere (opțional)"
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={4}
                placeholder="Rezumat sau descriere scurtă a raportului..."
              />
              <AdminInput
                label="Autor (opțional)"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Ex: Curtea de Conturi, Consilier Ion Popescu"
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* Settings */}
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect
                label="Tip Raport"
                value={formData.report_type}
                onChange={(e) => handleChange('report_type', e.target.value)}
                options={REPORT_TYPES}
                required
                error={errors.report_type}
              />

              <AdminSelect
                label="Categorie (opțional)"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={REPORT_CATEGORIES}
                placeholder="Selectează categoria"
              />

              <div className="grid grid-cols-2 gap-3">
                <AdminSelect
                  label="Anul"
                  value={formData.report_year?.toString() || ''}
                  onChange={(e) => handleChange('report_year', e.target.value ? parseInt(e.target.value) : null)}
                  options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                  placeholder="An"
                />
                <AdminInput
                  label="Data (opțional)"
                  type="date"
                  value={formData.report_date}
                  onChange={(e) => handleChange('report_date', e.target.value)}
                />
              </div>

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
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Raportul?"
        message={`Ștergi "${formData.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
