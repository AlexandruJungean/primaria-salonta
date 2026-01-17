'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Upload, FileText, X } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminDateInput,
  AdminTextarea,
  AdminConfirmDialog,
  toast,
  canDeleteItem,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface SessionFormData {
  slug: string;
  title: string;
  session_date: string;
  description: string;
  location: string;
  start_time: string;
  meeting_url: string;
  meeting_id: string;
  meeting_passcode: string;
  published: boolean;
}

interface SessionDocument {
  id: string;
  session_id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  title: string;
  sort_order: number;
}

const initialFormData: SessionFormData = {
  slug: '',
  title: '',
  session_date: new Date().toISOString().split('T')[0],
  description: '',
  location: 'Sala de Consiliu, Primăria Salonta',
  start_time: '10:00',
  meeting_url: '',
  meeting_id: '',
  meeting_passcode: '',
  published: true,
};



const DELETE_LIMIT_HOURS = 24;

export default function OrdineDeZiEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SessionFormData>(initialFormData);
  const [documents, setDocuments] = useState<SessionDocument[]>([]);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SessionFormData, string>>>({});

  // Document upload form state
  const [docTitle, setDocTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadSession = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/council-sessions?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        setFormData({
          slug: data.slug || '',
          title: data.title || '',
          session_date: data.session_date || '',
          description: data.description || '',
          location: data.location || 'Sala de Consiliu, Primăria Salonta',
          start_time: data.start_time || '10:00',
          meeting_url: data.meeting_url || '',
          meeting_id: data.meeting_id || '',
          meeting_passcode: data.meeting_passcode || '',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/ordine-de-zi');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const generateSlug = (date: string) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleDateString('ro-RO', { month: 'long' });
    const year = dateObj.getFullYear();
    return `sedinta-${day}-${month}-${year}`.toLowerCase().replace(/\s+/g, '-');
  };

  const generateTitle = (date: string) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return `Ședința CL din ${dateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  const handleDateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      session_date: value,
      slug: generateSlug(value), // Always auto-generate slug
      title: isNew ? generateTitle(value) : prev.title,
    }));
    setErrors(prev => ({ ...prev, session_date: undefined }));
  };

  const handleChange = (field: keyof SessionFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SessionFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    if (!formData.session_date) newErrors.session_date = 'Data este obligatorie';
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
      const sessionData = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        session_date: formData.session_date,
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        start_time: formData.start_time || null,
        meeting_url: formData.meeting_url.trim() || null,
        meeting_id: formData.meeting_id.trim() || null,
        meeting_passcode: formData.meeting_passcode.trim() || null,
        published: formData.published,
        source: 'sedinte', // Important: set source for ordine de zi
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/council-sessions', {
          method: 'POST',
          body: JSON.stringify(sessionData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Ordine de zi adăugată', 'Datele au fost salvate!');
        router.push('/admin/consiliul-local/ordine-de-zi');
      } else {
        const response = await adminFetch(`/api/admin/council-sessions?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(sessionData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Date salvate', 'Modificările au fost salvate!');
        router.push('/admin/consiliul-local/ordine-de-zi');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      toast.error('Selectează fișier', 'Te rog selectează un fișier pentru încărcare.');
      return;
    }

    setUploading(true);
    try {
      const year = new Date(formData.session_date).getFullYear();
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('session_id', id);
      uploadFormData.append('document_type', 'ordine_de_zi');
      uploadFormData.append('title', docTitle || selectedFile.name.replace(/\.[^/.]+$/, ''));
      uploadFormData.append('year', year.toString());

      const response = await adminFetch('/api/admin/council-sessions/documents', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Failed to upload');

      toast.success('Document încărcat', 'Documentul a fost adăugat cu succes!');
      
      // Reset form
      setSelectedFile(null);
      setDocTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reload session to get updated documents
      loadSession();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Eroare la încărcare', 'Nu s-a putut încărca documentul.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (doc: SessionDocument) => {
    try {
      const response = await adminFetch(
        `/api/admin/council-sessions/documents?id=${doc.id}&fileUrl=${encodeURIComponent(doc.file_url)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Documentul a fost șters.');
      loadSession();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge documentul.');
    }
  };

  const canDelete = (): boolean => canDeleteItem(createdAt, DELETE_LIMIT_HOURS);

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/council-sessions?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Ordinea de zi a fost ștearsă.');
      router.push('/admin/consiliul-local/ordine-de-zi');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
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
    return <div className="flex items-center justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Ordine de Zi' : 'Editează Ordinea de Zi'}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Ordine de Zi', href: '/admin/consiliul-local/ordine-de-zi' },
          { label: isNew ? 'Adaugă Nou' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/ordine-de-zi')}>Înapoi</AdminButton>
            {!isNew && canDelete() && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Ședință">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AdminDateInput label="Data Ședință" value={formData.session_date} onChange={handleDateChange} required error={errors.session_date} />
                <AdminInput label="Ora Început" type="time" value={formData.start_time} onChange={(e) => handleChange('start_time', e.target.value)} />
              </div>
              <AdminInput label="Titlu" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required error={errors.title} />
              <p className="text-sm text-slate-500">Slug generat automat: <code className="bg-slate-100 px-2 py-1 rounded">{formData.slug}</code></p>
              <AdminInput label="Locație" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Sala de Consiliu, Primăria Salonta" />
              <AdminTextarea label="Descriere (opțional)" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
            </div>
          </AdminCard>

          <AdminCard title="Întâlnire Online (opțional)">
            <div className="space-y-4">
              <AdminInput 
                label="Link întâlnire (Zoom/Meet)" 
                value={formData.meeting_url} 
                onChange={(e) => handleChange('meeting_url', e.target.value)} 
                placeholder="https://us06web.zoom.us/j/..." 
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput 
                  label="Meeting ID" 
                  value={formData.meeting_id} 
                  onChange={(e) => handleChange('meeting_id', e.target.value)} 
                  placeholder="931 751 3142" 
                />
                <AdminInput 
                  label="Cod acces (Passcode)" 
                  value={formData.meeting_passcode} 
                  onChange={(e) => handleChange('meeting_passcode', e.target.value)} 
                  placeholder="abc123" 
                />
              </div>
            </div>
          </AdminCard>

          {/* Documents Section - Only show after session is saved */}
          {!isNew && (
            <AdminCard title="Documente Atașate">
              <div className="space-y-4">
                {/* Upload form */}
                <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <p className="text-sm font-medium text-slate-700">Adaugă Document Nou</p>
                  <AdminInput
                    label="Titlu Document"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Ex: Ordine de zi, Convocator, etc."
                  />
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileSelect}
                      className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <AdminButton
                      icon={Upload}
                      onClick={handleUploadDocument}
                      loading={uploading}
                      disabled={!selectedFile}
                    >
                      Încarcă
                    </AdminButton>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-slate-500">
                      Fișier selectat: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>

                {/* Documents list */}
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Nu există documente atașate.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{doc.title}</p>
                            {doc.file_size && (
                              <p className="text-sm text-slate-500">{formatFileSize(doc.file_size)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Deschide"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Șterge"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AdminCard>
          )}

          {isNew && (
            <AdminCard className="bg-blue-50 border-blue-200">
              <p className="text-blue-800">
                <strong>Notă:</strong> Salvează ordinea de zi pentru a putea adăuga documente.
              </p>
            </AdminCard>
          )}
        </div>

        <div className="space-y-6">
          <AdminCard title="Publicare">
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

          {!isNew && !canDelete() && (
            <AdminCard className="bg-amber-50 border-amber-200">
              <p className="text-amber-800 text-sm"><strong>Notă:</strong> Nu mai poate fi ștearsă (au trecut 24h).</p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Ordinea de Zi?" message={`Ștergi "${formData.title}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
