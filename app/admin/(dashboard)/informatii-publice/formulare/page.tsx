'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ClipboardList,
  Loader2,
  FileText,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { cn } from '@/lib/utils/cn';

interface FormDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  subcategory: string;
}

interface FormCategory {
  id: string;
  label: string;
  icon: string;
  documents: FormDocument[];
}

// Category configuration matching the public page
const CATEGORY_CONFIG = [
  { id: 'achizitii_publice', label: 'Achiziții Publice', icon: '📋' },
  { id: 'asistenta_sociala', label: 'Asistență Socială', icon: '🤝' },
  { id: 'autorizari_constructii', label: 'Autorizări Construcții', icon: '🏗️' },
  { id: 'birou_agricol', label: 'Birou Agricol', icon: '🌾' },
  { id: 'centrul_zi', label: 'Centrul de Zi', icon: '👴' },
  { id: 'dezvoltare_urbana', label: 'Dezvoltare Urbană', icon: '🏙️' },
  { id: 'diverse', label: 'Diverse', icon: '📁' },
  { id: 'evidenta_populatiei', label: 'Evidența Populației', icon: '🪪' },
  { id: 'impozite_taxe', label: 'Impozite și Taxe', icon: '💰' },
  { id: 'protectie_civila', label: 'Protecție Civilă', icon: '🛡️' },
  { id: 'resurse_umane', label: 'Resurse Umane', icon: '👥' },
  { id: 'stare_civila', label: 'Stare Civilă', icon: '📜' },
  { id: 'urbanism', label: 'Urbanism și Amenajare', icon: '🗺️' },
  { id: 'transparenta', label: 'Transparență', icon: '🔍' },
];

export default function FormularePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FormCategory[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<FormDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/documents?category=formulare&limit=500');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      const docs: FormDocument[] = result.data || [];
      
      // Group documents by subcategory
      const groupedMap = new Map<string, FormDocument[]>();
      
      docs.forEach((doc) => {
        const subcategory = doc.subcategory || 'diverse';
        if (!groupedMap.has(subcategory)) {
          groupedMap.set(subcategory, []);
        }
        groupedMap.get(subcategory)!.push(doc);
      });
      
      // Build categories array based on config order
      const categoriesWithDocs: FormCategory[] = CATEGORY_CONFIG
        .filter(config => groupedMap.has(config.id))
        .map(config => ({
          id: config.id,
          label: config.label,
          icon: config.icon,
          documents: groupedMap.get(config.id) || [],
        }));
      
      // Add uncategorized documents to "diverse" if they don't match any category
      const knownIds = new Set(CATEGORY_CONFIG.map(c => c.id));
      groupedMap.forEach((docs, subcategory) => {
        if (!knownIds.has(subcategory)) {
          const diverseCategory = categoriesWithDocs.find(c => c.id === 'diverse');
          if (diverseCategory) {
            diverseCategory.documents.push(...docs);
          } else {
            categoriesWithDocs.push({
              id: 'diverse',
              label: 'Diverse',
              icon: '📁',
              documents: docs,
            });
          }
        }
      });
      
      setCategories(categoriesWithDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Eroare', 'Nu s-au putut încărca formularele');
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
      
      toast.success('Succes', 'Formularul a fost șters');
      setDeleteDoc(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge formularul');
    } finally {
      setDeleting(false);
    }
  };

  const totalDocuments = categories.reduce((acc, cat) => acc + cat.documents.length, 0);

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Formulare"
          description="Gestionează formularele tipizate"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Formulare' },
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
        title="Formulare"
        description={`${totalDocuments} formulare în ${categories.length} categorii`}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Formulare' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/informatii-publice/formulare/nou')}
          >
            Adaugă Formular
          </AdminButton>
        }
      />

      {categories.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nu există formulare</p>
            <AdminButton
              icon={Plus}
              onClick={() => router.push('/admin/informatii-publice/formulare/nou')}
            >
              Adaugă Primul Formular
            </AdminButton>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <AdminCard key={category.id} className="overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setExpandedId(expandedId === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-500">
                      {category.documents.length} {category.documents.length === 1 ? 'formular' : 'formulare'}
                    </p>
                  </div>
                </div>
                {expandedId === category.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Documents List */}
              {expandedId === category.id && (
                <div className="border-t border-gray-200 divide-y divide-gray-100">
                  {category.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                      
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
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="Descarcă"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          icon={Edit}
                          onClick={() => router.push(`/admin/informatii-publice/formulare/${doc.id}`)}
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
        title="Șterge Formular"
        message={`Ești sigur că vrei să ștergi formularul "${deleteDoc?.title}"?`}
        confirmLabel="Șterge"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
