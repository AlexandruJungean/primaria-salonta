'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, ArrowLeft, Trash2, FileText, Upload, ExternalLink, 
  RefreshCw, X, Paperclip, Plus, Download 
} from 'lucide-react';
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

interface DocumentFormData {
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  year: number | null;
  description: string;
  document_date: string;
  published: boolean;
}

interface Annex {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export default function HotarariRepublicateEditPage() {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id as string;
  const isNew = id === 'nou';
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    year: currentYear,
    description: '',
    document_date: '',
    published: true,
  });
  const [annexes, setAnnexes] = useState<Annex[]>([]);
  const [uploadingAnnex, setUploadingAnnex] = useState(false);
  const [annexProgress, setAnnexProgress] = useState(0);
  const [newAnnexTitle, setNewAnnexTitle] = useState('');
  const [showAnnexUpload, setShowAnnexUpload] = useState(false);
  const [pendingAnnexFile, setPendingAnnexFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [annexToDelete, setAnnexToDelete] = useState<Annex | null>(null);
  const [deletingAnnex, setDeletingAnnex] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormData, string>>>({});

  const basePath = '/admin/consiliul-local/hotarari-republicate';

  const uploadFile = async (file: File, isAnnex = false) => {
    if (isAnnex) {
      setUploadingAnnex(true);
      setAnnexProgress(0);
    } else {
      setUploading(true);
      setProgress(0);
    }
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('category', 'hotarari-republicate');
      
      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload eșuat');
      }
      
      if (isAnnex) {
        setAnnexProgress(100);
        return { url: data.url, fileName: file.name, fileSize: file.size };
      } else {
        setProgress(100);
        setFormData(prev => ({
          ...prev,
          file_url: data.url,
          file_name: file.name,
          file_size: file.size,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        toast.success('Fișier încărcat', 'Documentul a fost încărcat cu succes.');
      }
      
      return null;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Eroare la upload';
      toast.error('Eroare la încărcare', errorMsg);
      return null;
    } finally {
      if (isAnnex) {
        setUploadingAnnex(false);
      } else {
        setUploading(false);
      }
    }
  };

  const loadDocument = useCallback(async () => {
    if (isNew) return;

    try {
      // Load main document
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
          description: data.description || '',
          document_date: data.document_date || '',
          published: data.published ?? true,
        });
      }
      
      // Load annexes (documents with parent_id = this document)
      const annexResponse = await adminFetch(`/api/admin/documents?parent_id=${id}`);
      if (annexResponse.ok) {
        const annexData = await annexResponse.json();
        if (Array.isArray(annexData)) {
          setAnnexes(annexData.map((a: Annex) => ({
            id: a.id,
            title: a.title,
            file_url: a.file_url,
            file_name: a.file_name,
            file_size: a.file_size,
            created_at: a.created_at,
          })));
        }
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
    router.push(basePath);
  };

  const handleChange = (field: keyof DocumentFormData, value: string | boolean | number | null) => {
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

  const handleAnnexFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tip de fișier invalid', 'Sunt permise doar fișiere PDF și DOC/DOCX.');
      return;
    }

    setPendingAnnexFile(file);
    setNewAnnexTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleAddAnnex = async () => {
    if (!pendingAnnexFile || !newAnnexTitle.trim()) {
      toast.error('Date lipsă', 'Selectează un fișier și introdu un titlu pentru anexă.');
      return;
    }

    const uploadResult = await uploadFile(pendingAnnexFile, true);
    if (!uploadResult) return;

    try {
      const annexData = {
        title: newAnnexTitle.trim(),
        file_url: uploadResult.url,
        file_name: uploadResult.fileName,
        file_size: uploadResult.fileSize,
        year: formData.year,
        source_folder: 'hotarari-republicate',
        category: 'altele',
        parent_id: id,
        published: true,
      };

      const response = await adminFetch('/api/admin/documents', {
        method: 'POST',
        body: JSON.stringify(annexData),
      });

      if (!response.ok) throw new Error('Failed to create annex');
      
      const newAnnex = await response.json();
      setAnnexes(prev => [...prev, {
        id: newAnnex.id,
        title: newAnnexTitle.trim(),
        file_url: uploadResult.url,
        file_name: uploadResult.fileName,
        file_size: uploadResult.fileSize,
        created_at: new Date().toISOString(),
      }]);
      
      toast.success('Anexă adăugată', 'Anexa a fost salvată cu succes.');
      setPendingAnnexFile(null);
      setNewAnnexTitle('');
      setShowAnnexUpload(false);
    } catch (error) {
      console.error('Error adding annex:', error);
      toast.error('Eroare', 'Nu s-a putut adăuga anexa.');
    }
  };

  const handleDeleteAnnex = async () => {
    if (!annexToDelete) return;
    
    setDeletingAnnex(true);
    try {
      const response = await adminFetch(`/api/admin/documents?id=${annexToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setAnnexes(prev => prev.filter(a => a.id !== annexToDelete.id));
      toast.success('Anexă ștearsă', 'Anexa a fost ștearsă.');
    } catch (error) {
      console.error('Error deleting annex:', error);
      toast.error('Eroare', 'Nu s-a putut șterge anexa.');
    } finally {
      setDeletingAnnex(false);
      setAnnexToDelete(null);
    }
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
      const documentData = {
        title: formData.title.trim(),
        file_url: formData.file_url.trim(),
        file_name: formData.file_name.trim() || formData.title.trim(),
        file_size: formData.file_size || null,
        year: formData.year,
        description: formData.description.trim() || null,
        document_date: formData.document_date || null,
        source_folder: 'hotarari-republicate',
        category: 'altele',
        published: formData.published,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/documents', {
          method: 'POST',
          body: JSON.stringify(documentData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Hotărâre adăugată', 'Hotărârea a fost salvată!');
      } else {
        const response = await adminFetch(`/api/admin/documents?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(documentData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Hotărâre salvată', 'Modificările au fost salvate!');
      }

      goBack();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      // Delete all annexes first
      for (const annex of annexes) {
        await adminFetch(`/api/admin/documents?id=${annex.id}`, { method: 'DELETE' });
      }
      
      // Then delete the main document
      const response = await adminFetch(`/api/admin/documents?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Hotărârea și anexele au fost șterse.');
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
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Hotărâre Republicată' : 'Editează Hotărâre Republicată'}
        breadcrumbs={[
          { label: 'Consiliul Local' },
          { label: 'Hotărâri Republicate', href: basePath },
          { label: isNew ? 'Hotărâre Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={goBack}>
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
          {/* Main Document Upload */}
          <AdminCard title="Fișier Hotărâre">
            <div className="space-y-4">
              {formData.file_url && !showUploadArea ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-600" />
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
                      className="flex items-center gap-1 px-3 py-2 text-sm text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
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
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
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
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
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
                <p className="text-sm text-red-600">{errors.file_url}</p>
              )}
            </div>
          </AdminCard>

          {/* Document Info */}
          <AdminCard title="Informații Hotărâre">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Hotărâre"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                error={errors.title}
                placeholder="Ex: Hotărârea nr. 123/2026 republicată"
              />
              <AdminTextarea
                label="Descriere (opțional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Descriere scurtă a hotărârii..."
              />
            </div>
          </AdminCard>

          {/* Annexes Section - Only show for existing documents */}
          {!isNew && (
            <AdminCard title="Anexe">
              <div className="space-y-4">
                {/* Existing Annexes */}
                {annexes.length > 0 ? (
                  <div className="space-y-2">
                    {annexes.map((annex) => (
                      <div 
                        key={annex.id} 
                        className="p-3 bg-amber-50 rounded-lg flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">{annex.title}</p>
                          <p className="text-xs text-slate-500">
                            {annex.file_size ? `${(annex.file_size / 1024).toFixed(1)} KB` : ''}
                          </p>
                        </div>
                        <a 
                          href={annex.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Descarcă
                        </a>
                        <button
                          type="button"
                          onClick={() => setAnnexToDelete(annex)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nu există anexe pentru această hotărâre.
                  </p>
                )}

                {/* Add Annex Section */}
                {showAnnexUpload ? (
                  <div className="border-t pt-4 space-y-4">
                    <p className="font-medium text-slate-700 text-sm">Adaugă anexă nouă</p>
                    
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-amber-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleAnnexFileSelect}
                        className="hidden"
                        id="annex-upload"
                        disabled={uploadingAnnex}
                      />
                      <label htmlFor="annex-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                          {pendingAnnexFile ? pendingAnnexFile.name : 'Selectează fișier anexă'}
                        </p>
                      </label>
                    </div>

                    {pendingAnnexFile && (
                      <AdminInput
                        label="Titlu anexă"
                        value={newAnnexTitle}
                        onChange={(e) => setNewAnnexTitle(e.target.value)}
                        placeholder="Ex: Anexa 1 - Lista beneficiari"
                      />
                    )}

                    <div className="flex gap-2">
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        icon={X}
                        onClick={() => {
                          setShowAnnexUpload(false);
                          setPendingAnnexFile(null);
                          setNewAnnexTitle('');
                        }}
                      >
                        Anulează
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        icon={Plus}
                        onClick={handleAddAnnex}
                        loading={uploadingAnnex}
                        disabled={!pendingAnnexFile || !newAnnexTitle.trim()}
                      >
                        Salvează anexa
                      </AdminButton>
                    </div>
                    
                    {uploadingAnnex && (
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${annexProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAnnexUpload(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors w-full justify-center border border-amber-200"
                  >
                    <Plus className="w-4 h-4" />
                    Adaugă anexă
                  </button>
                )}
              </div>
            </AdminCard>
          )}

          {isNew && (
            <AdminCard className="bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Paperclip className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Anexe</p>
                  <p className="text-sm text-amber-700 mt-1">
                    După salvarea hotărârii, vei putea adăuga anexe și alte documente asociate.
                  </p>
                </div>
              </div>
            </AdminCard>
          )}
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminSelect
                label="Anul"
                value={formData.year?.toString() || ''}
                onChange={(e) => handleChange('year', e.target.value ? parseInt(e.target.value) : null)}
                options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                placeholder="Selectează"
              />

              <AdminInput
                label="Data Hotărâre (opțional)"
                type="date"
                value={formData.document_date}
                onChange={(e) => handleChange('document_date', e.target.value)}
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
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
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

          <AdminCard className="bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Hotărâri Republicate</p>
                <p className="text-sm text-amber-700 mt-1">
                  Hotărârile Consiliului Local care au fost republicate sau rectificate.
                </p>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete Document Dialog */}
      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Hotărârea?"
        message={`Ștergi "${formData.title}"${annexes.length > 0 ? ` și cele ${annexes.length} anexe asociate` : ''}?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />

      {/* Delete Annex Dialog */}
      <AdminConfirmDialog
        isOpen={!!annexToDelete}
        onClose={() => setAnnexToDelete(null)}
        onConfirm={handleDeleteAnnex}
        title="Șterge Anexa?"
        message={`Ștergi anexa "${annexToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deletingAnnex}
      />
    </div>
  );
}
