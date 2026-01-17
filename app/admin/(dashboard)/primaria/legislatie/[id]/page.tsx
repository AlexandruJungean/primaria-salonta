'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Upload, 
  ExternalLink, 
  FileText,
  Star,
  Link as LinkIcon,
  RefreshCw,
  X,
  Download,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { adminFetch } from '@/lib/api-client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';

interface LegislationFormData {
  title: string;
  description: string;
  external_url: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  is_primary: boolean;
  sort_order: number;
  published: boolean;
}

const initialFormData: LegislationFormData = {
  title: '',
  description: '',
  external_url: '',
  file_url: '',
  file_name: '',
  file_size: null,
  is_primary: false,
  sort_order: 0,
  published: true,
};

export default function LegislatieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<LegislationFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadArea, setShowUploadArea] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadLink();
    } else {
      // Get next sort_order for new links
      getNextSortOrder();
    }
  }, [id, isNew]);

  const getNextSortOrder = async () => {
    const { data } = await supabase
      .from('legislation_links')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);
    
    const nextOrder = data && data.length > 0 ? (data[0].sort_order || 0) + 1 : 1;
    setFormData(prev => ({ ...prev, sort_order: nextOrder }));
  };

  const loadLink = async () => {
    try {
      const { data, error } = await supabase
        .from('legislation_links')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        toast.error('Eroare', 'Link-ul nu a fost găsit.');
        router.push('/admin/primaria/legislatie');
        return;
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        external_url: data.external_url || '',
        file_url: data.file_url || '',
        file_name: data.file_name || '',
        file_size: data.file_size,
        is_primary: data.is_primary || false,
        sort_order: data.sort_order || 0,
        published: data.published ?? true,
      });
    } catch (error) {
      console.error('Error loading link:', error);
      toast.error('Eroare', 'Nu s-a putut încărca link-ul.');
      router.push('/admin/primaria/legislatie');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LegislationFormData, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string; size: number } | null> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'legislatie');
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return {
        url: result.url,
        name: file.name,
        size: file.size,
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare la încărcare', 'Nu s-a putut încărca fișierul.');
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      setFormData(prev => ({
        ...prev,
        file_url: result.url,
        file_name: result.name,
        file_size: result.size,
      }));
      setShowUploadArea(false);
      toast.success('Fișier încărcat', 'Documentul a fost încărcat cu succes.');
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file_url: '',
      file_name: '',
      file_size: null,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Eroare', 'Titlul este obligatoriu.');
      return;
    }

    if (!formData.external_url && !formData.file_url) {
      toast.error('Eroare', 'Trebuie să adaugi fie un link extern, fie să încarci un document.');
      return;
    }

    setSaving(true);
    try {
      const saveData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        external_url: formData.external_url.trim() || null,
        file_url: formData.file_url || null,
        file_name: formData.file_name || null,
        file_size: formData.file_size,
        is_primary: formData.is_primary,
        sort_order: formData.sort_order,
        published: formData.published,
      };

      // If setting as primary, unset other primary links first
      if (formData.is_primary) {
        await supabase
          .from('legislation_links')
          .update({ is_primary: false })
          .neq('id', id)
          .eq('is_primary', true);
      }

      if (isNew) {
        const { error } = await supabase
          .from('legislation_links')
          .insert([saveData]);

        if (error) throw error;
        toast.success('Creat cu succes', 'Link-ul a fost adăugat.');
      } else {
        const { error } = await supabase
          .from('legislation_links')
          .update(saveData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Salvat cu succes', 'Link-ul a fost actualizat.');
      }

      router.push('/admin/primaria/legislatie');
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error('Eroare', 'Nu s-a putut salva link-ul.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('legislation_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Șters cu succes', 'Link-ul a fost șters.');
      router.push('/admin/primaria/legislatie');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Eroare', 'Nu s-a putut șterge link-ul.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Link Legislație' : 'Editează Link Legislație'}
        description={isNew ? 'Adaugă un nou link către un act normativ' : 'Modifică detaliile link-ului'}
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Legislație', href: '/admin/primaria/legislatie' },
          { label: isNew ? 'Nou' : 'Editează' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <AdminButton
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/primaria/legislatie')}
            >
              Înapoi
            </AdminButton>
            {!isNew && (
              <AdminButton
                variant="danger"
                icon={Trash2}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Șterge
              </AdminButton>
            )}
            <AdminButton
              icon={Save}
              onClick={handleSave}
              loading={saving}
            >
              {isNew ? 'Creează' : 'Salvează'}
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații de Bază">
            <div className="space-y-4">
              <AdminInput
                label="Titlu"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Legea 544/2001 - Acces la informații publice"
                required
              />
              <AdminTextarea
                label="Descriere (opțional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="O scurtă descriere a actului normativ..."
                rows={3}
              />
            </div>
          </AdminCard>

          {/* External URL */}
          <AdminCard title="Link Extern">
            <div className="space-y-4">
              <AdminInput
                label="URL Extern"
                value={formData.external_url}
                onChange={(e) => handleChange('external_url', e.target.value)}
                placeholder="https://legislatie.just.ro/..."
              />
              <p className="text-sm text-slate-500">
                Link-ul extern are prioritate asupra documentului încărcat. Dacă este completat, vizitatorii vor fi redirecționați către acest URL.
              </p>
              {formData.external_url && (
                <a
                  href={formData.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Verifică link-ul
                </a>
              )}
            </div>
          </AdminCard>

          {/* File Upload */}
          <AdminCard title="Document Încărcat (Alternativ)">
            <div className="space-y-4">
              {formData.file_url && !showUploadArea ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{formData.file_name || 'Document'}</p>
                      <p className="text-sm text-slate-500">
                        {formatFileSize(formData.file_size)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={formData.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Descarcă
                      </a>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Șterge fișierul"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                      <p className="text-slate-600 mb-1">
                        {uploading ? 'Se încarcă...' : 'Click pentru a încărca un document'}
                      </p>
                      <p className="text-sm text-slate-400">PDF, DOC, DOCX</p>
                    </label>
                    {uploading && (
                      <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
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
              <p className="text-sm text-slate-500">
                Încarcă un document local doar dacă nu ai un link extern. Documentul încărcat va fi folosit doar dacă câmpul "URL Extern" este gol.
              </p>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-700">Publicat</label>
                  <p className="text-sm text-slate-500">Afișează pe website</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('published', !formData.published)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.published ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-700 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Link Principal
                  </label>
                  <p className="text-sm text-slate-500">Evidențiat în pagină</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('is_primary', !formData.is_primary)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_primary ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_primary ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <AdminInput
                label="Ordine de afișare"
                type="number"
                value={formData.sort_order.toString()}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </AdminCard>

          {/* Preview Card */}
          <AdminCard title="Preview">
            <div className={`p-4 rounded-lg ${formData.is_primary ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                {formData.is_primary ? (
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500 mt-0.5" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-slate-900">{formData.title || 'Titlu link...'}</p>
                  {formData.description && (
                    <p className="text-sm text-slate-600 mt-1">{formData.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    {formData.external_url ? (
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Link extern
                      </span>
                    ) : formData.file_url ? (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Document local
                      </span>
                    ) : (
                      <span className="text-red-500">Niciun link configurat</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Link-ul?"
        message={`Ești sigur că vrei să ștergi link-ul "${formData.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
