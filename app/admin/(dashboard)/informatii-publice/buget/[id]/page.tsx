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
  X,
  Download,
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

interface DocumentItem {
  id?: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  isNew?: boolean;
}

export default function BugetEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state - simplified
  const [sectionTitle, setSectionTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  
  // Original values for editing
  const [originalSubcategory, setOriginalSubcategory] = useState('');
  const [originalYear, setOriginalYear] = useState(0);

  // Fetch existing section data
  const fetchSection = useCallback(async () => {
    if (isNew) return;

    try {
      // First get the main document to get subcategory and year
      const response = await adminFetch(`/api/admin/documents?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const mainDoc = await response.json();
      const sectionSubcategory = mainDoc.subcategory || '';
      const sectionYear = mainDoc.year || new Date().getFullYear();
      
      setOriginalSubcategory(sectionSubcategory);
      setOriginalYear(sectionYear);
      setSectionTitle(sectionSubcategory);
      setYear(sectionYear);
      
      // Now fetch all documents with same subcategory and year
      const allDocsResponse = await adminFetch('/api/admin/documents?category=buget&limit=500');
      if (!allDocsResponse.ok) throw new Error('Failed to fetch documents');
      
      const allDocsResult = await allDocsResponse.json();
      const allDocs = allDocsResult.data || [];
      
      // Filter documents that belong to this section
      const sectionDocs = allDocs.filter((doc: { subcategory: string; year: number }) => {
        return doc.subcategory === sectionSubcategory && doc.year === sectionYear;
      });
      
      setDocuments(sectionDocs.map((doc: { id: string; title: string; file_url: string; file_name: string; file_size: number }) => ({
        id: doc.id,
        title: doc.title,
        file_url: doc.file_url,
        file_name: doc.file_name,
        file_size: doc.file_size || 0,
      })));
    } catch (error) {
      console.error('Error fetching section:', error);
      toast.error('Eroare', 'Nu s-a putut încărca secțiunea');
      router.push('/admin/informatii-publice/buget');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'buget');
        formData.append('year', year.toString());
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
        
        // Add to documents list
        const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        setDocuments(prev => [...prev, {
          title: docTitle,
          file_url: result.url,
          file_name: result.filename || file.name,
          file_size: result.size || file.size,
          isNew: true,
        }]);
      }
      
      toast.success('Succes', 'Fișierele au fost încărcate');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', error instanceof Error ? error.message : 'Nu s-au putut încărca fișierele');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle document title change
  const handleDocTitleChange = (index: number, newTitle: string) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, title: newTitle } : doc
    ));
  };

  // Remove document from list (before save)
  const handleRemoveDoc = (index: number) => {
    const doc = documents[index];
    if (doc.id) {
      setDeleteDocId(doc.id);
    } else {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Delete existing document
  const handleDeleteDoc = async () => {
    if (!deleteDocId) return;
    
    try {
      const response = await adminFetch(`/api/admin/documents?id=${deleteDocId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setDocuments(prev => prev.filter(doc => doc.id !== deleteDocId));
      toast.success('Succes', 'Documentul a fost șters');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge documentul');
    } finally {
      setDeleteDocId(null);
    }
  };

  // Save section
  const handleSave = async () => {
    if (!sectionTitle.trim()) {
      toast.error('Eroare', 'Titlul secțiunii este obligatoriu');
      return;
    }
    
    if (documents.length === 0) {
      toast.error('Eroare', 'Trebuie să adaugi cel puțin un document');
      return;
    }
    
    setSaving(true);
    
    try {
      for (const doc of documents) {
        const docData = {
          title: doc.title,
          file_url: doc.file_url,
          file_name: doc.file_name,
          file_size: doc.file_size,
          category: 'buget',
          subcategory: sectionTitle,
          year,
          published: true,
        };
        
        if (doc.id && !doc.isNew) {
          // Update existing document
          await adminFetch(`/api/admin/documents?id=${doc.id}`, {
            method: 'PATCH',
            body: JSON.stringify(docData),
          });
        } else {
          // Create new document
          await adminFetch('/api/admin/documents', {
            method: 'POST',
            body: JSON.stringify(docData),
          });
        }
      }
      
      toast.success('Succes', isNew ? 'Secțiunea a fost creată' : 'Secțiunea a fost actualizată');
      router.push('/admin/informatii-publice/buget');
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Eroare', 'Nu s-a putut salva secțiunea');
    } finally {
      setSaving(false);
    }
  };

  // Delete entire section
  const handleDeleteSection = async () => {
    try {
      for (const doc of documents) {
        if (doc.id) {
          await adminFetch(`/api/admin/documents?id=${doc.id}`, {
            method: 'DELETE',
          });
        }
      }
      
      toast.success('Succes', 'Secțiunea a fost ștearsă');
      router.push('/admin/informatii-publice/buget');
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Eroare', 'Nu s-a putut șterge secțiunea');
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title={isNew ? 'Secțiune Nouă' : 'Editează Secțiune'}
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Buget', href: '/admin/informatii-publice/buget' },
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
        title={isNew ? 'Secțiune Nouă' : 'Editează Secțiune'}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Buget', href: '/admin/informatii-publice/buget' },
          { label: isNew ? 'Nou' : 'Editează' },
        ]}
        actions={
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/informatii-publice/buget')}
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
          <AdminCard title="Detalii Secțiune">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Secțiune *"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Ex: Buget inițial 2025, Rectificare buget martie 2025"
              />
              
              <AdminInput
                label="An *"
                type="number"
                value={year.toString()}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                min={2000}
                max={2100}
              />
            </div>
          </AdminCard>

          {/* Documents */}
          <AdminCard title="Documente Atașate">
            {/* Upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4',
                'flex flex-col items-center justify-center cursor-pointer',
                'hover:border-primary-500 hover:bg-primary-50 transition-colors'
              )}
            >
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click pentru a încărca documente</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />

            {/* Documents list */}
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nu există documente atașate
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id || index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => handleDocTitleChange(index, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        placeholder="Titlu document"
                      />
                      <p className="text-xs text-gray-400 mt-1 truncate" title={doc.file_name}>
                        {doc.file_name.length > 50 ? `${doc.file_name.substring(0, 50)}...` : doc.file_name}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-primary-600 rounded"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleRemoveDoc(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Informații">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Documente:</span>
                <span className="font-medium">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">An:</span>
                <span className="font-medium">{year}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Sfaturi">
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Poți adăuga mai multe documente la aceeași secțiune</li>
              <li>• Modifică titlul fiecărui document pentru claritate</li>
              <li>• Documentele sunt grupate pe an</li>
            </ul>
          </AdminCard>
        </div>
      </div>

      {/* Delete section confirmation */}
      <AdminConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteSection}
        title="Șterge Secțiune"
        message={`Ești sigur că vrei să ștergi secțiunea "${sectionTitle}"? Toate documentele atașate vor fi șterse.`}
        confirmLabel="Șterge"
        variant="danger"
      />

      {/* Delete single document confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        onConfirm={handleDeleteDoc}
        title="Șterge Document"
        message="Ești sigur că vrei să ștergi acest document?"
        confirmLabel="Șterge"
        variant="danger"
      />
    </div>
  );
}
