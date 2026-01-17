'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Upload, ExternalLink, Users, User, RefreshCw, X } from 'lucide-react';
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

const CATEGORY_OPTIONS = [
  { value: 'comisie', label: 'Comisie de Specialitate' },
  { value: 'consilier', label: 'Consilier Local' },
];

// Get years for a specific mandate
function getYearsForMandate(mandate: string): number[] {
  const [start, end] = mandate.split('-').map(Number);
  const years: number[] = [];
  for (let y = start; y < end; y++) {
    years.push(y);
  }
  return years.sort((a, b) => b - a);
}

// Get mandate for a year
function getMandateForYear(year: number): string {
  if (year >= 2024) return '2024-2028';
  if (year >= 2020) return '2020-2024';
  if (year >= 2016) return '2016-2020';
  if (year >= 2012) return '2012-2016';
  return '2008-2012';
}

export default function RaportActivitateEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id as string;
  const isNew = id === 'nou';
  
  // Get defaults from query params for new reports
  const defaultMandate = searchParams.get('mandate') || '2024-2028';
  const defaultType = searchParams.get('type') || 'consilier';
  const defaultYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
  
  const currentYear = new Date().getFullYear();
  
  // Calculate available years based on mandate
  const [selectedMandate, setSelectedMandate] = useState(defaultMandate);
  const availableYears = getYearsForMandate(selectedMandate);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    category: defaultType,
    summary: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    report_year: defaultYear || availableYears[0] || currentYear,
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
        const reportYear = data.report_year || currentYear;
        setSelectedMandate(getMandateForYear(reportYear));
        setFormData({
          title: data.title || '',
          category: data.category || 'consilier',
          summary: data.summary || '',
          file_url: data.file_url || '',
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          report_year: reportYear,
          report_date: data.report_date || '',
          author: data.author || '',
          published: data.published ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading report:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/rapoarte-activitate');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router, currentYear]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleChange = (field: keyof ReportFormData, value: string | boolean | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleMandateChange = (mandate: string) => {
    setSelectedMandate(mandate);
    const yearsInMandate = getYearsForMandate(mandate);
    // If current year is not in new mandate, pick the first year of new mandate
    if (!yearsInMandate.includes(formData.report_year || 0)) {
      setFormData(prev => ({ ...prev, report_year: yearsInMandate[0] || null }));
    }
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
        report_type: 'raport_activitate', // Fixed type for this section
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

      router.push('/admin/consiliul-local/rapoarte-activitate');
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
      router.push('/admin/consiliul-local/rapoarte-activitate');
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
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isCommittee = formData.category === 'comisie';

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Raport de Activitate' : 'Editează Raport'}
        breadcrumbs={[
          { label: 'Consiliul Local' },
          { label: 'Rapoarte Activitate', href: '/admin/consiliul-local/rapoarte-activitate' },
          { label: isNew ? 'Raport Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/rapoarte-activitate')}>
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
              {formData.file_url && !showUploadArea ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isCommittee ? 'bg-purple-100' : 'bg-emerald-100'}`}>
                      <FileText className={`w-6 h-6 ${isCommittee ? 'text-purple-600' : 'text-emerald-600'}`} />
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
                      className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${isCommittee ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-50' : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'}`}
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
                  <div className={`border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors ${isCommittee ? 'hover:border-purple-400' : 'hover:border-emerald-400'}`}>
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
                          className={`h-2 rounded-full transition-all duration-300 ${isCommittee ? 'bg-purple-500' : 'bg-emerald-500'}`}
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
          <AdminCard title="Informații Raport">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Raport"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                error={errors.title}
                placeholder={isCommittee ? 'Ex: Raport de activitate Comisia economică 2025' : 'Ex: Raport activitate consilier 2025'}
              />
              <AdminInput
                label={isCommittee ? 'Denumire Comisie' : 'Nume Consilier'}
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder={isCommittee ? 'Ex: Comisia economică' : 'Ex: Popescu Ion'}
              />
              <AdminTextarea
                label="Rezumat (opțional)"
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={3}
                placeholder="Descriere scurtă a raportului..."
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect
                label="Tip Raport"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={CATEGORY_OPTIONS}
                required
              />
              
              <AdminSelect
                label="Mandat"
                value={selectedMandate}
                onChange={(e) => handleMandateChange(e.target.value)}
                options={[
                  { value: '2024-2028', label: 'Mandatul 2024-2028' },
                  { value: '2020-2024', label: 'Mandatul 2020-2024' },
                  { value: '2016-2020', label: 'Mandatul 2016-2020' },
                  { value: '2012-2016', label: 'Mandatul 2012-2016' },
                ]}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <AdminSelect
                  label="Anul"
                  value={formData.report_year?.toString() || ''}
                  onChange={(e) => handleChange('report_year', e.target.value ? parseInt(e.target.value) : null)}
                  options={availableYears.map(y => ({ value: y.toString(), label: y.toString() }))}
                  placeholder="Selectează"
                />
                <AdminInput
                  label="Data"
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
                  <div className={`w-14 h-7 bg-slate-200 peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${isCommittee ? 'peer-focus:ring-purple-300 peer-checked:bg-purple-600' : 'peer-focus:ring-emerald-300 peer-checked:bg-emerald-600'}`}></div>
                </label>
              </div>

              <AdminButton
                size="lg"
                icon={Save}
                onClick={handleSave}
                loading={saving}
                className={`w-full ${isCommittee ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard className={isCommittee ? 'bg-purple-50 border-purple-200' : 'bg-emerald-50 border-emerald-200'}>
            <div className="flex items-start gap-3">
              {isCommittee ? (
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
              ) : (
                <User className="w-5 h-5 text-emerald-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${isCommittee ? 'text-purple-900' : 'text-emerald-900'}`}>
                  Raport de Activitate
                </p>
                <p className={`text-sm mt-1 ${isCommittee ? 'text-purple-700' : 'text-emerald-700'}`}>
                  {isCommittee ? 'Comisie de Specialitate' : 'Consilier Local'}
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
        title="Șterge Raportul?"
        message={`Ștergi "${formData.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
