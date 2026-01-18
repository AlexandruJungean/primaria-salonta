'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Wallet,
  Loader2,
  Calendar,
  FileText,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  FolderOpen,
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

interface BudgetDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
}

interface BudgetSection {
  id: string;
  year: number;
  subcategory: string;
  displayTitle: string;
  documents: BudgetDocument[];
}


export default function BugetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<BudgetSection[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteSection, setDeleteSection] = useState<BudgetSection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/documents?category=buget&limit=500');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      const docs = result.data || [];
      
      // Group documents by subcategory + year
      const groupedMap = new Map<string, BudgetSection>();
      
      docs.forEach((doc: { id: string; title: string; subcategory: string; year: number; file_url: string; file_name: string }) => {
        const subcategory = doc.subcategory || 'altele';
        const year = doc.year || new Date().getFullYear();
        const key = `${subcategory}_${year}`;
        
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            id: doc.id,
            year,
            subcategory,
            displayTitle: subcategory || 'Fără titlu',
            documents: [],
          });
        }
        
        groupedMap.get(key)!.documents.push({
          id: doc.id,
          title: doc.title,
          file_url: doc.file_url,
          file_name: doc.file_name,
        });
      });
      
      // Sort by year descending, then by subcategory
      const sorted = Array.from(groupedMap.values()).sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return a.subcategory.localeCompare(b.subcategory);
      });
      
      setSections(sorted);
    } catch (error) {
      console.error('Error fetching budget sections:', error);
      toast.error('Eroare', 'Nu s-au putut încărca secțiunile de buget');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async () => {
    if (!deleteSection) return;
    
    setDeleting(true);
    try {
      // Delete all documents in this section
      for (const doc of deleteSection.documents) {
        await adminFetch(`/api/admin/documents?id=${doc.id}`, {
          method: 'DELETE',
        });
      }
      
      toast.success('Succes', 'Secțiunea a fost ștearsă');
      setDeleteSection(null);
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Eroare', 'Nu s-a putut șterge secțiunea');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Buget"
          description="Gestionează documentele de buget"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Buget' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  // Group sections by year for display
  const sectionsByYear = sections.reduce((acc, section) => {
    if (!acc[section.year]) {
      acc[section.year] = [];
    }
    acc[section.year].push(section);
    return acc;
  }, {} as Record<number, BudgetSection[]>);

  const years = Object.keys(sectionsByYear).map(Number).sort((a, b) => b - a);

  return (
    <div>
      <AdminPageHeader
        title="Buget"
        description="Gestionează documentele de buget"
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Buget' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/informatii-publice/buget/nou')}
          >
            Adaugă Secțiune
          </AdminButton>
        }
      />

      {sections.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nu există documente de buget</p>
            <AdminButton
              icon={Plus}
              onClick={() => router.push('/admin/informatii-publice/buget/nou')}
            >
              Adaugă Prima Secțiune
            </AdminButton>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-6">
          {years.map((year) => (
            <AdminCard key={year}>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <FolderOpen className="w-6 h-6 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">{year}</h2>
                <span className="text-sm text-gray-500">
                  ({sectionsByYear[year].length} {sectionsByYear[year].length === 1 ? 'secțiune' : 'secțiuni'})
                </span>
              </div>

              <div className="divide-y divide-gray-200">
                {sectionsByYear[year].map((section) => (
                  <div key={`${section.subcategory}_${section.year}`} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-primary-600" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate max-w-xl" title={section.displayTitle}>
                          {section.displayTitle.length > 80 ? `${section.displayTitle.substring(0, 80)}...` : section.displayTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {section.year}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {section.documents.length} {section.documents.length === 1 ? 'document' : 'documente'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          {expandedId === section.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          icon={Edit}
                          onClick={() => router.push(`/admin/informatii-publice/buget/${section.id}`)}
                        >
                          Editează
                        </AdminButton>
                        <button
                          onClick={() => setDeleteSection(section)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded documents list */}
                    {expandedId === section.id && (
                      <div className="mt-4 ml-14 space-y-2">
                        {section.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={doc.title}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border border-gray-200',
                              'hover:bg-gray-50 hover:border-primary-300 transition-colors'
                            )}
                          >
                            <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                            <span className="text-sm text-gray-700 truncate max-w-md">
                              {doc.title.length > 80 ? `${doc.title.substring(0, 80)}...` : doc.title}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto shrink-0">
                              {doc.file_name.split('.').pop()?.toUpperCase()}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        isOpen={!!deleteSection}
        onClose={() => setDeleteSection(null)}
        onConfirm={handleDelete}
        title="Șterge Secțiune"
        message={`Ești sigur că vrei să ștergi secțiunea "${deleteSection?.displayTitle}"? Toate documentele atașate vor fi șterse.`}
        confirmLabel="Șterge"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
