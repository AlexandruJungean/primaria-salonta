'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Trash2,
  Upload,
  FileText,
  Loader2,
  Download,
  ScrollText,
  Archive,
  Plus,
  Paperclip,
  X,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { cn } from '@/lib/utils/cn';

interface AnnexDocument {
  id?: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  isNew?: boolean;
}

// Category options
const CATEGORY_OPTIONS = [
  { value: '', label: 'În Vigoare', description: 'Regulament activ', icon: ScrollText },
  { value: 'arhiva', label: 'Arhivă', description: 'Regulament expirat', icon: Archive },
];

export default function RegulamenteEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAnnex, setUploadingAnnex] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAnnex, setDeleteAnnex] = useState<AnnexDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const annexInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [annexes, setAnnexes] = useState<AnnexDocument[]>([]);

  // Fetch existing document data
  const fetchDocument = useCallback(async () => {
    if (isNew) return;

    try {
      // Fetch main document
      const response = await adminFetch(`/api/admin/documents?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const doc = await response.json();
      setTitle(doc.title || '');
      setSubcategory(doc.subcategory || '');
      setFileUrl(doc.file_url || '');
      setFileName(doc.file_name || '');
      setFileSize(doc.file_size || 0);
      
      // Fetch annexes (documents with parent_id = this document's id)
      const annexResponse = await adminFetch(`/api/admin/documents?category=regulamente&limit=100`);
      if (annexResponse.ok) {
        const result = await annexResponse.json();
        const allDocs = result.data || [];
        const docAnnexes = allDocs.filter((d: { parent_id: string }) => d.parent_id === id);
        setAnnexes(docAnnexes.map((a: AnnexDocument) => ({ ...a, isNew: false })));
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Eroare', 'Nu s-a putut încărca documentul');
      router.push('/admin/informatii-publice/regulamente');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // Handle main file upload
  const handleFileUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'regulamente');
      formData.append('skipCompression', 'true');
      
      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        headers: {},
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const result = await response.json();
      
      setFileUrl(result.url);
      setFileName(result.filename || file.name);
      setFileSize(result.size || file.size);
      
      if (!title) {
        const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        setTitle(docTitle);
      }
      
      toast.success('Succes', 'Fișierul a fost încărcat');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', error instanceof Error ? error.message : 'Nu s-a putut încărca fișierul');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle annex file upload
  const handleAnnexUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    
    setUploadingAnnex(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'regulamente');
      formData.append('skipCompression', 'true');
      
      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        headers: {},
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const result = await response.json();
      const annexTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      
      setAnnexes(prev => [...prev, {
        title: annexTitle,
        file_url: result.url,
        file_name: result.filename || file.name,
        file_size: result.size || file.size,
        isNew: true,
      }]);
      
      toast.success('Succes', 'Anexa a fost încărcată');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', error instanceof Error ? error.message : 'Nu s-a putut încărca anexa');
    } finally {
      setUploadingAnnex(false);
      if (annexInputRef.current) {
        annexInputRef.current.value = '';
      }
    }
  };

  // Update annex title
  const updateAnnexTitle = (index: number, newTitle: string) => {
    setAnnexes(prev => prev.map((a, i) => i === index ? { ...a, title: newTitle } : a));
  };

  // Remove annex
  const removeAnnex = (index: number) => {
    const annex = annexes[index];
    if (annex.id && !annex.isNew) {
      setDeleteAnnex(annex);
    } else {
      setAnnexes(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Confirm delete annex from database
  const confirmDeleteAnnex = async () => {
    if (!deleteAnnex?.id) return;
    
    try {
      await adminFetch(`/api/admin/documents?id=${deleteAnnex.id}`, {
        method: 'DELETE',
      });
      
      setAnnexes(prev => prev.filter(a => a.id !== deleteAnnex.id));
      toast.success('Succes', 'Anexa a fost ștearsă');
    } catch (error) {
      console.error('Error deleting annex:', error);
      toast.error('Eroare', 'Nu s-a putut șterge anexa');
    } finally {
      setDeleteAnnex(null);
    }
  };

  // Save document
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Eroare', 'Titlul este obligatoriu');
      return;
    }
    
    if (!fileUrl) {
      toast.error('Eroare', 'Trebuie să încarci un fișier');
      return;
    }
    
    setSaving(true);
    
    try {
      const docData = {
        title,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        category: 'regulamente',
        subcategory: subcategory || null,
        published: true,
      };
      
      let parentId = id;
      
      if (isNew) {
        const response = await adminFetch('/api/admin/documents', {
          method: 'POST',
          body: JSON.stringify(docData),
        });
        
        if (!response.ok) throw new Error('Failed to create document');
        
        const created = await response.json();
        parentId = created.id;
      } else {
        await adminFetch(`/api/admin/documents?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(docData),
        });
      }
      
      // Save new annexes
      for (const annex of annexes) {
        if (annex.isNew) {
          await adminFetch('/api/admin/documents', {
            method: 'POST',
            body: JSON.stringify({
              title: annex.title,
              file_url: annex.file_url,
              file_name: annex.file_name,
              file_size: annex.file_size,
              category: 'regulamente',
              parent_id: parentId,
              published: true,
            }),
          });
        } else if (annex.id) {
          // Update existing annex title if changed
          await adminFetch(`/api/admin/documents?id=${annex.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: annex.title }),
          });
        }
      }
      
      toast.success('Succes', isNew ? 'Regulamentul a fost creat' : 'Regulamentul a fost actualizat');
      router.push('/admin/informatii-publice/regulamente');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare', 'Nu s-a putut salva regulamentul');
    } finally {
      setSaving(false);
    }
  };

  // Delete document
  const handleDelete = async () => {
    try {
      // Delete annexes first
      for (const annex of annexes) {
        if (annex.id) {
          await adminFetch(`/api/admin/documents?id=${annex.id}`, {
            method: 'DELETE',
          });
        }
      }
      
      // Delete main document
      await adminFetch(`/api/admin/documents?id=${id}`, {
        method: 'DELETE',
      });
      
      toast.success('Succes', 'Regulamentul a fost șters');
      router.push('/admin/informatii-publice/regulamente');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge regulamentul');
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title={isNew ? 'Regulament Nou' : 'Editează Regulament'}
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Regulamente', href: '/admin/informatii-publice/regulamente' },
            { label: isNew ? 'Nou' : 'Editează' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Regulament Nou' : 'Editează Regulament'}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Regulamente', href: '/admin/informatii-publice/regulamente' },
          { label: isNew ? 'Nou' : 'Editează' },
        ]}
        actions={
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/informatii-publice/regulamente')}
            >
              Înapoi
            </AdminButton>
            {!isNew && (
              <AdminButton
                variant="danger"
                icon={Trash2}
                onClick={() => setShowDeleteDialog(true)}
              >
                Șterge
              </AdminButton>
            )}
            <AdminButton
              icon={Save}
              onClick={handleSave}
              loading={saving}
            >
              Salvează
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Detalii Regulament">
            <div className="space-y-4">
              <AdminInput
                label="Titlu *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titlul regulamentului"
              />
              
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSubcategory(option.value)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left transition-all',
                          subcategory === option.value
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Icon className={cn(
                          'w-5 h-5 mb-2',
                          subcategory === option.value ? 'text-violet-600' : 'text-gray-400'
                        )} />
                        <p className={cn(
                          'font-medium text-sm',
                          subcategory === option.value ? 'text-violet-700' : 'text-gray-900'
                        )}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Main File Upload */}
          <AdminCard title="Fișier Principal">
            {fileUrl ? (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-violet-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{fileName}</p>
                  <p className="text-sm text-gray-500">
                    {fileSize > 0 ? `${(fileSize / 1024).toFixed(1)} KB` : 'Fișier încărcat'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-violet-600 rounded"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Schimbă
                  </AdminButton>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed border-gray-300 rounded-lg p-8',
                  'flex flex-col items-center justify-center cursor-pointer',
                  'hover:border-violet-500 hover:bg-violet-50 transition-colors'
                )}
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">Click pentru a încărca</p>
                    <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </AdminCard>

          {/* Annexes */}
          <AdminCard title={`Anexe (${annexes.length})`}>
            {annexes.length > 0 && (
              <div className="space-y-3 mb-4">
                {annexes.map((annex, index) => (
                  <div key={annex.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-violet-500 shrink-0" />
                    <input
                      type="text"
                      value={annex.title}
                      onChange={(e) => updateAnnexTitle(index, e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Titlul anexei"
                    />
                    <a
                      href={annex.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-violet-600"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => removeAnnex(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => annexInputRef.current?.click()}
              disabled={uploadingAnnex}
              className={cn(
                'w-full border-2 border-dashed border-gray-300 rounded-lg p-4',
                'flex items-center justify-center gap-2 cursor-pointer',
                'hover:border-violet-500 hover:bg-violet-50 transition-colors',
                uploadingAnnex && 'opacity-50 cursor-not-allowed'
              )}
            >
              {uploadingAnnex ? (
                <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
              ) : (
                <>
                  <Plus className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Adaugă Anexă</span>
                </>
              )}
            </button>
            <input
              ref={annexInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files && handleAnnexUpload(e.target.files)}
            />
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Informații">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium">{subcategory === 'arhiva' ? 'Arhivă' : 'În Vigoare'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fișier:</span>
                <span className="font-medium">{fileUrl ? 'Încărcat' : 'Lipsă'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Anexe:</span>
                <span className="font-medium">{annexes.length}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Despre Anexe">
            <div className="text-sm text-gray-600 space-y-2">
              <p>Anexele sunt documente suplimentare atașate la regulament.</p>
              <p>Ele vor fi afișate sub documentul principal pe site.</p>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete document confirmation */}
      <AdminConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Șterge Regulament"
        message={`Ești sigur că vrei să ștergi "${title}"? ${annexes.length > 0 ? `Cele ${annexes.length} anexe vor fi de asemenea șterse.` : ''}`}
        confirmLabel="Șterge"
        variant="danger"
      />

      {/* Delete annex confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteAnnex}
        onClose={() => setDeleteAnnex(null)}
        onConfirm={confirmDeleteAnnex}
        title="Șterge Anexă"
        message={`Ești sigur că vrei să ștergi anexa "${deleteAnnex?.title}"?`}
        confirmLabel="Șterge"
        variant="danger"
      />
    </div>
  );
}
