'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ScrollText,
  Loader2,
  FileText,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Download,
  Archive,
  Paperclip,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface RegulamentDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  subcategory: string;
  parent_id: string | null;
}

interface RegulamentWithAnnexes extends RegulamentDocument {
  annexes: RegulamentDocument[];
}

interface RegulamentSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  documents: RegulamentWithAnnexes[];
}

export default function RegulamentePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<RegulamentSection[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<RegulamentDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/documents?category=regulamente&limit=500');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      const docs: RegulamentDocument[] = result.data || [];
      
      // Separate parent documents and annexes
      const parentDocs: RegulamentWithAnnexes[] = [];
      const annexesByParentId = new Map<string, RegulamentDocument[]>();
      
      docs.forEach(doc => {
        if (doc.parent_id) {
          const annexes = annexesByParentId.get(doc.parent_id) || [];
          annexes.push(doc);
          annexesByParentId.set(doc.parent_id, annexes);
        } else {
          parentDocs.push({ ...doc, annexes: [] });
        }
      });
      
      // Attach annexes to parent docs
      parentDocs.forEach(doc => {
        const annexes = annexesByParentId.get(doc.id);
        if (annexes) {
          doc.annexes = annexes;
        }
      });
      
      // Split into current and archive
      const currentDocs = parentDocs.filter(doc => doc.subcategory !== 'arhiva');
      const archiveDocs = parentDocs.filter(doc => doc.subcategory === 'arhiva');
      
      const sectionsData: RegulamentSection[] = [];
      
      if (currentDocs.length > 0) {
        sectionsData.push({
          id: 'actuale',
          label: 'Regulamente în Vigoare',
          icon: <ScrollText className="w-5 h-5 text-violet-600" />,
          documents: currentDocs,
        });
      }
      
      if (archiveDocs.length > 0) {
        sectionsData.push({
          id: 'arhiva',
          label: 'Arhivă Regulamente',
          icon: <Archive className="w-5 h-5 text-gray-500" />,
          documents: archiveDocs,
        });
      }
      
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Eroare', 'Nu s-au putut încărca documentele');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async () => {
    if (!deleteDoc) return;
    
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/documents?id=${deleteDoc.id}`, {
        method: 'DELETE',
      });
      
      toast.success('Succes', 'Documentul a fost șters');
      setDeleteDoc(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge documentul');
    } finally {
      setDeleting(false);
    }
  };

  const totalDocuments = sections.reduce((acc, sec) => acc + sec.documents.length, 0);

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Regulamente"
          description="Gestionează regulamentele instituției"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Regulamente' },
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
        title="Regulamente"
        description={`${totalDocuments} regulamente în ${sections.length} secțiuni`}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Regulamente' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/informatii-publice/regulamente/nou')}
          >
            Adaugă Regulament
          </AdminButton>
        }
      />

      {/* Info */}
      <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
        <div className="flex items-start gap-3">
          <ScrollText className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div className="text-sm text-violet-800">
            <p className="font-medium mb-1">Tipuri de regulamente:</p>
            <ul className="list-disc list-inside space-y-1 text-violet-700">
              <li><strong>Regulamente în Vigoare</strong> - regulamente active</li>
              <li><strong>Arhivă</strong> - regulamente expirate sau înlocuite</li>
            </ul>
            <p className="mt-2 text-violet-600">
              <Paperclip className="w-4 h-4 inline mr-1" />
              Regulamentele pot avea anexe atașate.
            </p>
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12">
            <ScrollText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nu există regulamente</p>
            <AdminButton
              icon={Plus}
              onClick={() => router.push('/admin/informatii-publice/regulamente/nou')}
            >
              Adaugă Primul Regulament
            </AdminButton>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <AdminCard key={section.id} className="overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    section.id === 'arhiva' ? 'bg-gray-200' : 'bg-violet-100'
                  }`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-500">
                      {section.documents.length} {section.documents.length === 1 ? 'regulament' : 'regulamente'}
                    </p>
                  </div>
                </div>
                {expandedId === section.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Documents List */}
              {expandedId === section.id && (
                <div className="border-t border-gray-200 divide-y divide-gray-100">
                  {section.documents.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-violet-600 shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate" title={doc.title}>
                            {doc.title.length > 60 ? `${doc.title.substring(0, 60)}...` : doc.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{doc.file_name}</span>
                            {doc.annexes.length > 0 && (
                              <span className="flex items-center gap-1 text-violet-500">
                                <Paperclip className="w-3 h-3" />
                                {doc.annexes.length} {doc.annexes.length === 1 ? 'anexă' : 'anexe'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                            title="Descarcă"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <AdminButton
                            variant="secondary"
                            size="sm"
                            icon={Edit}
                            onClick={() => router.push(`/admin/informatii-publice/regulamente/${doc.id}`)}
                          >
                            Editează
                          </AdminButton>
                          <button
                            onClick={() => setDeleteDoc(doc)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Șterge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Show annexes preview */}
                      {doc.annexes.length > 0 && (
                        <div className="mt-2 ml-9 pl-4 border-l-2 border-violet-200">
                          {doc.annexes.map(annex => (
                            <div key={annex.id} className="flex items-center gap-2 py-1 text-sm text-gray-600">
                              <Paperclip className="w-3 h-3 text-violet-400" />
                              <span className="truncate">{annex.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        isOpen={!!deleteDoc}
        onClose={() => setDeleteDoc(null)}
        onConfirm={handleDelete}
        title="Șterge Regulament"
        message={`Ești sigur că vrei să ștergi "${deleteDoc?.title}"? ${deleteDoc?.parent_id ? '' : 'Anexele vor fi de asemenea șterse.'}`}
        confirmLabel="Șterge"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
