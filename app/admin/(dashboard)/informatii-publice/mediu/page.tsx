'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Leaf,
  Loader2,
  FileText,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Download,
  Droplets,
  TreePine,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface MediuDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  subcategory: string;
}

interface MediuSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  documents: MediuDocument[];
}

// Category configuration matching the public page
const CATEGORY_CONFIG = [
  { id: 'salubrizare', label: 'Salubrizare', icon: <Trash2 className="w-5 h-5 text-green-600" /> },
  { id: 'apa_canal', label: 'Apă și Canal', icon: <Droplets className="w-5 h-5 text-blue-600" /> },
  { id: 'spatii_verzi', label: 'Spații Verzi', icon: <TreePine className="w-5 h-5 text-emerald-600" /> },
];

export default function MediuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<MediuSection[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<MediuDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/documents?category=mediu&limit=500');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      const docs: MediuDocument[] = result.data || [];
      
      // Group documents by subcategory
      const groupedMap = new Map<string, MediuDocument[]>();
      
      docs.forEach((doc) => {
        const subcategory = doc.subcategory || 'salubrizare';
        if (!groupedMap.has(subcategory)) {
          groupedMap.set(subcategory, []);
        }
        groupedMap.get(subcategory)!.push(doc);
      });
      
      // Build sections array based on config order
      const sectionsData: MediuSection[] = CATEGORY_CONFIG
        .filter(config => groupedMap.has(config.id) && groupedMap.get(config.id)!.length > 0)
        .map(config => ({
          id: config.id,
          label: config.label,
          icon: config.icon,
          documents: groupedMap.get(config.id) || [],
        }));
      
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
          title="Mediu"
          description="Gestionează documentele despre mediu"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Mediu' },
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
        title="Mediu"
        description={`${totalDocuments} documente în ${sections.length} categorii`}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Mediu' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/informatii-publice/mediu/nou')}
          >
            Adaugă Document
          </AdminButton>
        }
      />

      {/* Info about categories */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Leaf className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Categorii disponibile:</p>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li><strong>Salubrizare</strong> - documente despre gestionarea deșeurilor</li>
              <li><strong>Apă și Canal</strong> - informații despre serviciile de apă</li>
              <li><strong>Spații Verzi</strong> - regulamente și informații despre spații verzi</li>
            </ul>
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12">
            <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nu există documente despre mediu</p>
            <AdminButton
              icon={Plus}
              onClick={() => router.push('/admin/informatii-publice/mediu/nou')}
            >
              Adaugă Primul Document
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
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-500">
                      {section.documents.length} {section.documents.length === 1 ? 'document' : 'documente'}
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
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-green-600 shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate" title={doc.title}>
                          {doc.title.length > 60 ? `${doc.title.substring(0, 60)}...` : doc.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate" title={doc.file_name}>
                          {doc.file_name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Descarcă"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          icon={Edit}
                          onClick={() => router.push(`/admin/informatii-publice/mediu/${doc.id}`)}
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
        title="Șterge Document"
        message={`Ești sigur că vrei să ștergi documentul "${deleteDoc?.title}"?`}
        confirmLabel="Șterge"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
