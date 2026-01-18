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
  AdminTextarea,
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

export default function AnunturiEditPage() {
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

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Fetch existing announcement data
  const fetchAnnouncement = useCallback(async () => {
    if (isNew) return;

    try {
      // First get the main document to get description and date
      const response = await adminFetch(`/api/admin/documents?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const mainDoc = await response.json();
      const announcementTitle = mainDoc.description || mainDoc.title;
      const announcementDate = mainDoc.document_date || '';
      
      setTitle(announcementTitle);
      setDate(announcementDate);
      
      // Now fetch all documents with same description and date
      const allDocsResponse = await adminFetch('/api/admin/documents?category=anunturi&limit=500');
      if (!allDocsResponse.ok) throw new Error('Failed to fetch documents');
      
      const allDocsResult = await allDocsResponse.json();
      const allDocs = allDocsResult.data || [];
      
      // Filter documents that belong to this announcement
      const announcementDocs = allDocs.filter((doc: { description: string; title: string; document_date: string }) => {
        const docTitle = doc.description || doc.title;
        const docDate = doc.document_date || '';
        return docTitle === announcementTitle && docDate === announcementDate;
      });
      
      setDocuments(announcementDocs.map((doc: { id: string; title: string; file_url: string; file_name: string; file_size: number }) => ({
        id: doc.id,
        title: doc.title,
        file_url: doc.file_url,
        file_name: doc.file_name,
        file_size: doc.file_size || 0,
      })));
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Eroare', 'Nu s-a putut încărca anunțul');
      router.push('/admin/informatii-publice/anunturi');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'anunturi');
        formData.append('year', new Date(date).getFullYear().toString());
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
      // If it's an existing document, show delete confirmation
      setDeleteDocId(doc.id);
    } else {
      // If it's a new document, just remove from list
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

  // Save announcement
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Eroare', 'Titlul anunțului este obligatoriu');
      return;
    }
    
    if (documents.length === 0) {
      toast.error('Eroare', 'Trebuie să adaugi cel puțin un document');
      return;
    }
    
    setSaving(true);
    
    try {
      // For existing documents, update them with new title/date if changed
      // For new documents, create them
      for (const doc of documents) {
        const docData = {
          title: doc.title,
          file_url: doc.file_url,
          file_name: doc.file_name,
          file_size: doc.file_size,
          category: 'anunturi',
          description: title,
          document_date: date,
          year: new Date(date).getFullYear(),
          published: true,
        };
        
        if (doc.id && !doc.isNew) {
          // Update existing document (PATCH requires id as query param)
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
      
      toast.success('Succes', isNew ? 'Anunțul a fost creat' : 'Anunțul a fost actualizat');
      router.push('/admin/informatii-publice/anunturi');
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Eroare', 'Nu s-a putut salva anunțul');
    } finally {
      setSaving(false);
    }
  };

  // Delete entire announcement
  const handleDeleteAnnouncement = async () => {
    try {
      for (const doc of documents) {
        if (doc.id) {
          await adminFetch(`/api/admin/documents?id=${doc.id}`, {
            method: 'DELETE',
          });
        }
      }
      
      toast.success('Succes', 'Anunțul a fost șters');
      router.push('/admin/informatii-publice/anunturi');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Eroare', 'Nu s-a putut șterge anunțul');
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title={isNew ? 'Anunț Nou' : 'Editează Anunț'}
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Anunțuri', href: '/admin/informatii-publice/anunturi' },
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
        title={isNew ? 'Anunț Nou' : 'Editează Anunț'}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Anunțuri', href: '/admin/informatii-publice/anunturi' },
          { label: isNew ? 'Nou' : 'Editează' },
        ]}
        actions={
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/informatii-publice/anunturi')}
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
          <AdminCard title="Detalii Anunț">
            <div className="space-y-4">
              <AdminInput
                label="Titlu Anunț *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titlul anunțului"
              />
              
              <AdminInput
                label="Data *"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
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
                      <p className="text-xs text-gray-400 mt-1">{doc.file_name}</p>
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
              {!isNew && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-green-600">Publicat</span>
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Sfaturi">
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Poți adăuga mai multe documente la același anunț</li>
              <li>• Modifică titlul fiecărui document pentru claritate</li>
              <li>• Data anunțului determină ordinea afișării</li>
            </ul>
          </AdminCard>
        </div>
      </div>

      {/* Delete announcement confirmation */}
      <AdminConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAnnouncement}
        title="Șterge Anunț"
        message={`Ești sigur că vrei să ștergi anunțul "${title}"? Toate documentele atașate vor fi șterse.`}
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
