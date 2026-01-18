'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Upload, ExternalLink, RefreshCw, X, Plus, Paperclip } from 'lucide-react';
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

interface Annex {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocumentEditProps {
  filterType: 'category' | 'source_folder';
  filterValue: string;
  pageTitle: string;
  breadcrumbs: BreadcrumbItem[];
  basePath: string;
  defaultSubcategory?: string;
}

const RESTRICTED_CATEGORIES = ['buget', 'dispozitii', 'regulamente'];
const DELETE_LIMIT_HOURS = 24;

const SUBCATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  // Category-based subcategories
  achizitii: [
    { value: 'documente', label: 'Documente Achiziții' },
    { value: 'formulare', label: 'Formulare necesare' },
  ],
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
  // Source folder-based subcategories
  'generale': [
    { value: 'dispozitii', label: 'Dispoziții' },
    { value: 'rapoarte', label: 'Rapoarte anuale' },
    { value: 'formulare', label: 'Formulare' },
  ],
  'buletin-informativ': [
    { value: 'a', label: 'a) Acte normative' },
    { value: 'b', label: 'b) Structura organizatorică' },
    { value: 'c', label: 'c) Conducere' },
    { value: 'd', label: 'd) Contact' },
    { value: 'e', label: 'e) Audiențe' },
    { value: 'f', label: 'f) Buget' },
    { value: 'g', label: 'g) Programe și strategii' },
    { value: 'h', label: 'h) Documente interes public' },
    { value: 'i', label: 'i) Categorii documente' },
    { value: 'j', label: 'j) Contestare' },
  ],
  'documente-si-informatii-financiare': [
    { value: 'executie', label: 'Cont de execuție' },
    { value: 'buget', label: 'Buget general' },
    { value: 'rectificare', label: 'Rectificare bugetară' },
    { value: 'altele', label: 'Alte documente' },
  ],
  'hotararile-autoritatii-deliberative': [
    { value: 'registru_hotarari', label: 'Registru Hotărâri Adoptate' },
    { value: 'registru_proiecte', label: 'Registru Proiecte de Hotărâri' },
  ],
  'alte-documente': [
    { value: 'transparenta', label: 'Raport Transparență Decizională' },
    { value: 'raport_primar', label: 'Raport Primar' },
    { value: 'documente', label: 'Documente' },
    { value: 'registru', label: 'Registru' },
  ],
};

export function DocumentEdit({
  filterType,
  filterValue,
  pageTitle,
  breadcrumbs,
  basePath,
  defaultSubcategory,
}: DocumentEditProps) {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id as string;
  const isNew = id === 'nou';
  
  const isRestricted = filterType === 'category' && RESTRICTED_CATEGORIES.includes(filterValue);
  const hasSubcategories = SUBCATEGORY_OPTIONS[filterValue];
  
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
  const [showUploadArea, setShowUploadArea] = useState(false);
  
  // Annexes state
  const [annexes, setAnnexes] = useState<Annex[]>([]);
  const [loadingAnnexes, setLoadingAnnexes] = useState(false);
  const [uploadingAnnex, setUploadingAnnex] = useState(false);
  const [annexProgress, setAnnexProgress] = useState(0);
  const [deleteAnnexDialogOpen, setDeleteAnnexDialogOpen] = useState(false);
  const [annexToDelete, setAnnexToDelete] = useState<Annex | null>(null);
  const [deletingAnnex, setDeletingAnnex] = useState(false);
  
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    year: currentYear,
    month: null,
    subcategory: defaultSubcategory || '',
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

  // Load annexes
  const loadAnnexes = useCallback(async () => {
    if (isNew) return;
    
    setLoadingAnnexes(true);
    try {
      const response = await adminFetch(`/api/admin/documents?parent_id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch annexes');
      const data = await response.json();
      setAnnexes(data || []);
    } catch (error) {
      console.error('Error loading annexes:', error);
    } finally {
      setLoadingAnnexes(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    loadDocument();
    loadAnnexes();
  }, [loadDocument, loadAnnexes]);

  // Upload annex
  const uploadAnnex = async (file: File) => {
    if (isNew) {
      toast.error('Salvează mai întâi', 'Trebuie să salvezi documentul înainte de a adăuga anexe.');
      return;
    }
    
    setUploadingAnnex(true);
    setAnnexProgress(0);
    
    try {
      // First, upload the file
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('category', 'documente');
      
      const uploadResponse = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload eșuat');
      }
      
      setAnnexProgress(50);
      
      // Then, create the annex document with parent_id
      const annexData = {
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        file_url: uploadData.url,
        file_name: file.name,
        file_size: file.size,
        parent_id: id,
        published: true,
        category: 'anexa',
      };
      
      const createResponse = await adminFetch('/api/admin/documents', {
        method: 'POST',
        body: JSON.stringify(annexData),
      });
      
      if (!createResponse.ok) throw new Error('Failed to create annex');
      
      setAnnexProgress(100);
      toast.success('Anexă adăugată', 'Anexa a fost încărcată cu succes.');
      loadAnnexes();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Eroare la upload';
      toast.error('Eroare la încărcare', errorMsg);
    } finally {
      setUploadingAnnex(false);
      setAnnexProgress(0);
    }
  };

  const handleAnnexFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tip de fișier invalid', 'Sunt permise doar fișiere PDF și DOC/DOCX.');
      return;
    }

    await uploadAnnex(file);
    // Reset input
    e.target.value = '';
  };

  const confirmDeleteAnnex = (annex: Annex) => {
    setAnnexToDelete(annex);
    setDeleteAnnexDialogOpen(true);
  };

  const handleDeleteAnnex = async () => {
    if (!annexToDelete) return;
    
    setDeletingAnnex(true);
    try {
      const response = await adminFetch(`/api/admin/documents?id=${annexToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Anexă ștearsă', 'Anexa a fost ștearsă.');
      setDeleteAnnexDialogOpen(false);
      setAnnexToDelete(null);
      loadAnnexes();
    } catch (error) {
      console.error('Error deleting annex:', error);
      toast.error('Eroare', 'Nu s-a putut șterge anexa.');
    } finally {
      setDeletingAnnex(false);
    }
  };

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

      if (filterType === 'category') {
        documentData.category = filterValue;
      } else if (filterType === 'source_folder') {
        documentData.source_folder = filterValue;
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

  const editBreadcrumbs = [
    ...breadcrumbs.slice(0, -1),
    { label: breadcrumbs[breadcrumbs.length - 1].label, href: basePath },
    { label: isNew ? 'Document Nou' : 'Editare' },
  ];

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Încarcă Document Nou' : 'Editează Document'}
        breadcrumbs={editBreadcrumbs}
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
          <AdminCard title="Fișier Document">
            <div className="space-y-4">
              {/* Show file info when file exists and upload area is hidden */}
              {formData.file_url && !showUploadArea ? (
                <div className="space-y-4">
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
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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

          {/* Annexes Section - only show for existing documents and subcategory 'rapoarte' */}
          {!isNew && formData.subcategory === 'rapoarte' && (
            <AdminCard title="Anexe / Fișiere Atașate">
              <div className="space-y-4">
                {/* Upload new annex */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleAnnexFileChange}
                    className="hidden"
                    id="annex-upload"
                    disabled={uploadingAnnex}
                  />
                  <label htmlFor="annex-upload" className="cursor-pointer flex items-center justify-center gap-3">
                    {uploadingAnnex ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                        <span className="text-sm text-slate-600">Se încarcă... {annexProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-600">Adaugă anexă (PDF, DOC, DOCX)</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Annexes list */}
                {loadingAnnexes ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                ) : annexes.length > 0 ? (
                  <ul className="space-y-2">
                    {annexes.map((annex) => (
                      <li key={annex.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{annex.title}</p>
                          <p className="text-xs text-slate-500">{annex.file_name}</p>
                        </div>
                        <a
                          href={annex.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => confirmDeleteAnnex(annex)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nu există anexe. Folosește butonul de mai sus pentru a adăuga.
                  </p>
                )}
              </div>
            </AdminCard>
          )}
        </div>

        <div className="space-y-6">
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

          <AdminCard className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">{pageTitle}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {filterType === 'category' 
                    ? `Categoria: ${filterValue}` 
                    : `Folder: ${filterValue}`}
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

      <AdminConfirmDialog
        isOpen={deleteAnnexDialogOpen}
        onClose={() => setDeleteAnnexDialogOpen(false)}
        onConfirm={handleDeleteAnnex}
        title="Șterge Anexa?"
        message={`Ești sigur că vrei să ștergi anexa "${annexToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deletingAnnex}
      />
    </div>
  );
}
