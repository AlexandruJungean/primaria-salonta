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
  Leaf,
  Droplets,
  TreePine,
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

// Category options for mediu
const CATEGORY_OPTIONS = [
  { value: 'salubrizare', label: 'Salubrizare', description: 'Documente despre gestionarea deșeurilor', icon: Trash2 },
  { value: 'apa_canal', label: 'Apă și Canal', description: 'Informații despre serviciile de apă', icon: Droplets },
  { value: 'spatii_verzi', label: 'Spații Verzi', description: 'Regulamente și informații', icon: TreePine },
];

export default function MediuEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [subcategory, setSubcategory] = useState('salubrizare');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  // Fetch existing document data
  const fetchDocument = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/documents?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const doc = await response.json();
      setTitle(doc.title || '');
      setSubcategory(doc.subcategory || 'salubrizare');
      setFileUrl(doc.file_url || '');
      setFileName(doc.file_name || '');
      setFileSize(doc.file_size || 0);
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Eroare', 'Nu s-a putut încărca documentul');
      router.push('/admin/informatii-publice/mediu');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'mediu');
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
      
      // Auto-fill title from filename if empty
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
        category: 'mediu',
        subcategory,
        published: true,
      };
      
      if (isNew) {
        await adminFetch('/api/admin/documents', {
          method: 'POST',
          body: JSON.stringify(docData),
        });
      } else {
        await adminFetch(`/api/admin/documents?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(docData),
        });
      }
      
      toast.success('Succes', isNew ? 'Documentul a fost creat' : 'Documentul a fost actualizat');
      router.push('/admin/informatii-publice/mediu');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare', 'Nu s-a putut salva documentul');
    } finally {
      setSaving(false);
    }
  };

  // Delete document
  const handleDelete = async () => {
    try {
      await adminFetch(`/api/admin/documents?id=${id}`, {
        method: 'DELETE',
      });
      
      toast.success('Succes', 'Documentul a fost șters');
      router.push('/admin/informatii-publice/mediu');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge documentul');
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title={isNew ? 'Document Nou' : 'Editează Document'}
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Mediu', href: '/admin/informatii-publice/mediu' },
            { label: isNew ? 'Nou' : 'Editează' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  const selectedCategory = CATEGORY_OPTIONS.find(c => c.value === subcategory);

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Document Nou' : 'Editează Document'}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Mediu', href: '/admin/informatii-publice/mediu' },
          { label: isNew ? 'Nou' : 'Editează' },
        ]}
        actions={
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/informatii-publice/mediu')}
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
          <AdminCard title="Detalii Document">
            <div className="space-y-4">
              <AdminInput
                label="Titlu *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titlul documentului"
              />
              
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Icon className={cn(
                          'w-5 h-5 mb-2',
                          subcategory === option.value ? 'text-green-600' : 'text-gray-400'
                        )} />
                        <p className={cn(
                          'font-medium text-sm',
                          subcategory === option.value ? 'text-green-700' : 'text-gray-900'
                        )}>
                          {option.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </AdminCard>

          {/* File Upload */}
          <AdminCard title="Fișier">
            {fileUrl ? (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 shrink-0" />
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
                    className="p-2 text-gray-400 hover:text-green-600 rounded"
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
                  'hover:border-green-500 hover:bg-green-50 transition-colors'
                )}
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Informații">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Categorie:</span>
                <span className="font-medium">{selectedCategory?.label || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fișier:</span>
                <span className="font-medium">{fileUrl ? 'Încărcat' : 'Lipsă'}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Despre Categorii">
            <div className="space-y-3 text-sm">
              {CATEGORY_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-gray-500 text-xs">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete confirmation */}
      <AdminConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Șterge Document"
        message={`Ești sigur că vrei să ștergi documentul "${title}"?`}
        confirmLabel="Șterge"
        variant="danger"
      />
    </div>
  );
}
