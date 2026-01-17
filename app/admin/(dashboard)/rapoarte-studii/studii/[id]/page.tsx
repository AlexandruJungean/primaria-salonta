'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Upload, ExternalLink, FileSearch, RefreshCw, X } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface ReportFormData {
  title: string;
  summary: string;
  file_url: string;
  file_name: string;
  file_size: number;
  report_date: string;
  author: string;
  published: boolean;
}

export default function StudiuEditPage() {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id as string;
  const isNew = id === 'nou';

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    summary: '',
    file_url: '',
    file_name: '',
    file_size: 0,
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
      formDataUpload.append('category', 'studii');
      
      const response = await adminFetch('/api/admin/upload', {
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
          summary: data.summary || '',
          file_url: data.file_url || '',
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          report_date: data.report_date || '',
          author: data.author || '',
          published: data.published ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading study:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/rapoarte-studii/studii');
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
        report_type: 'studiu_fezabilitate', // Fixed type for this section
        summary: formData.summary.trim() || null,
        file_url: formData.file_url.trim(),
        file_name: formData.file_name.trim() || formData.title.trim(),
        file_size: formData.file_size || null,
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
        toast.success('Studiu adăugat', 'Studiul a fost salvat!');
      } else {
        const response = await adminFetch(`/api/admin/reports?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(reportData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Studiu salvat', 'Modificările au fost salvate!');
      }

      router.push('/admin/rapoarte-studii/studii');
    } catch (error) {
      console.error('Error saving study:', error);
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
      toast.success('Șters', 'Studiul a fost șters.');
      router.push('/admin/rapoarte-studii/studii');
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
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Studiu' : 'Editează Studiu'}
        breadcrumbs={[
          { label: 'Rapoarte și Studii' },
          { label: 'Studii', href: '/admin/rapoarte-studii/studii' },
          { label: isNew ? 'Studiu Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/rapoarte-studii/studii')}>
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
          <AdminCard title="Fișier Studiu">
            <div className="space-y-4">
              {/* Show file info when file exists and upload area is hidden */}
              {formData.file_url && !showUploadArea ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-600" />
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
                      className="flex items-center gap-1 px-3 py-2 text-sm text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Deschide
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUploadArea(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Schimbă documentul
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        handleFileChange(e);
                        setShowUploadArea(false);
                      }}
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
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {showUploadArea && formData.file_url && (
                    <button
                      type="button"
                      onClick={() => setShowUploadArea(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Anulează
                    </button>
                  )}
                </div>
              )}

              {errors.file_url && (
                <p className="text-sm text-red-500">{errors.file_url}</p>
              )}
            </div>
          </AdminCard>

          {/* Report Info */}
          <AdminCard title="Informații Studiu">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Studiu"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                error={errors.title}
                placeholder="Ex: Studiu de fezabilitate pentru..."
              />
              <AdminInput
                label="Autor / Instituție"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Ex: Compania de proiectare X"
              />
              <AdminTextarea
                label="Rezumat (opțional)"
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={3}
                placeholder="Descriere scurtă a studiului..."
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminInput
                label="Data Studiu"
                type="date"
                value={formData.report_date}
                onChange={(e) => handleChange('report_date', e.target.value)}
              />

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
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
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

          <AdminCard className="bg-emerald-50 border-emerald-200">
            <div className="flex items-start gap-3">
              <FileSearch className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-900">Studiu de Fezabilitate</p>
                <p className="text-sm text-emerald-700 mt-1">
                  Studii, analize și documentații tehnice pentru proiecte.
                </p>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Studiul?"
        message={`Ștergi "${formData.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
