'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  ShieldCheck, 
  FileText,
  BookOpen,
  Search,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminCardGrid,
  AdminTable,
  AdminPagination,
  AdminConfirmDialog,
  AdminInput,
  AdminSelect,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Report {
  id: string;
  slug: string;
  report_type: string;
  title: string;
  summary: string | null;
  file_url: string | null;
  file_name: string | null;
  report_year: number | null;
  report_date: string | null;
  author: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
}

const REPORT_TYPES = [
  { id: 'audit', label: 'Rapoarte de Audit', icon: ShieldCheck, color: 'bg-blue-500', description: 'Rapoarte Curtea de Conturi' },
  { id: 'raport_primar', label: 'Rapoarte Primar', icon: FileText, color: 'bg-green-500', description: 'Rapoarte anuale ale primarului' },
  { id: 'raport_activitate', label: 'Rapoarte Activitate', icon: BookOpen, color: 'bg-purple-500', description: 'Rapoarte de activitate consilieri' },
  { id: 'studiu', label: 'Studii', icon: FileText, color: 'bg-amber-500', description: 'Studii de fezabilitate și impact' },
  { id: 'raport_curtea_conturi', label: 'Curtea de Conturi', icon: ShieldCheck, color: 'bg-red-500', description: 'Rapoarte oficiale' },
  { id: 'altele', label: 'Alte Rapoarte', icon: FileText, color: 'bg-slate-500', description: 'Alte tipuri de rapoarte' },
];

const REPORT_TYPE_LABELS: Record<string, string> = {
  audit: 'Raport Audit',
  raport_primar: 'Raport Primar',
  raport_activitate: 'Raport Activitate',
  studiu: 'Studiu',
  analiza: 'Analiză',
  raport_curtea_conturi: 'Curtea de Conturi',
  studiu_fezabilitate: 'Studiu Fezabilitate',
  studiu_impact: 'Studiu Impact',
  altele: 'Altele',
};

const ITEMS_PER_PAGE = 15;

export default function RapoartePage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/admin/reports';
      if (selectedType) {
        url += `?report_type=${selectedType}`;
      }
      
      const response = await adminFetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      // Apply client-side filters
      let filtered = data || [];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((r: Report) => 
          r.title.toLowerCase().includes(query) ||
          r.author?.toLowerCase().includes(query)
        );
      }
      
      if (yearFilter) {
        filtered = filtered.filter((r: Report) => r.report_year === parseInt(yearFilter));
      }
      
      setReports(filtered);
      
      // Calculate stats
      const counts: Record<string, number> = {};
      (data || []).forEach((r: Report) => {
        counts[r.report_type] = (counts[r.report_type] || 0) + 1;
      });
      setStats(counts);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Eroare', 'Nu s-au putut încărca rapoartele.');
    } finally {
      setLoading(false);
    }
  }, [selectedType, searchQuery, yearFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleEdit = (item: Report) => {
    router.push(`/admin/documente/rapoarte/${item.id}`);
  };

  const confirmDelete = (item: Report) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/reports?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Raportul a fost șters.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadReports();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge raportul.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Get unique years for filter
  const years = [...new Set(reports.map(r => r.report_year).filter(Boolean) as number[])].sort((a, b) => b - a);

  const columns = [
    {
      key: 'title',
      label: 'Titlu Raport',
      render: (item: Report) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
            {item.author && (
              <p className="text-sm text-slate-500">Autor: {item.author}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'report_type',
      label: 'Tip',
      className: 'w-40',
      render: (item: Report) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
          {REPORT_TYPE_LABELS[item.report_type] || item.report_type}
        </span>
      ),
    },
    {
      key: 'report_year',
      label: 'An',
      className: 'w-20',
      render: (item: Report) => (
        <span className="font-medium text-slate-700">{item.report_year || '-'}</span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      className: 'w-24',
      render: (item: Report) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.published 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {item.published ? 'Publicat' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'download',
      label: '',
      className: 'w-24',
      render: (item: Report) => item.file_url ? (
        <a
          href={item.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Descarcă
        </a>
      ) : null,
    },
  ];

  // Paginate
  const paginatedReports = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Rapoarte și Studii"
        description="Gestionează rapoartele de audit, studiile și alte documente oficiale"
        breadcrumbs={[
          { label: 'Documente', href: '/admin/documente' },
          { label: 'Rapoarte și Studii' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/documente/rapoarte/nou')}>
            Adaugă Raport Nou
          </AdminButton>
        }
      />

      {/* Type Cards */}
      {!selectedType && (
        <AdminCardGrid columns={3} className="mb-6">
          {REPORT_TYPES.map((type) => {
            const Icon = type.icon;
            const count = stats[type.id] || 0;
            return (
              <AdminCard 
                key={type.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{type.label}</h3>
                    <p className="text-sm text-slate-500">{count} rapoarte</p>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </AdminCardGrid>
      )}

      {/* Filter Controls */}
      {selectedType && (
        <AdminCard className="mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <AdminButton 
                variant="ghost" 
                onClick={() => {
                  setSelectedType(null);
                  setSearchQuery('');
                  setYearFilter('');
                  setCurrentPage(1);
                }}
              >
                ← Toate tipurile
              </AdminButton>
            </div>
            <div className="flex-1 min-w-[200px]">
              <AdminInput
                label=""
                placeholder="Caută după titlu sau autor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            {years.length > 0 && (
              <div className="w-32">
                <AdminSelect
                  label=""
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                  placeholder="An"
                />
              </div>
            )}
            <AdminButton type="button" icon={Search} variant="secondary" onClick={() => loadReports()}>
              Caută
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {/* Reports Table */}
      {selectedType && (
        <>
          <AdminTable
            data={paginatedReports}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="Nu există rapoarte în această categorie."
          />

          {totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={reports.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* All Reports Table (when no type selected) */}
      {!selectedType && (
        <>
          <AdminCard className="mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <AdminInput
                  label=""
                  placeholder="Caută în toate rapoartele..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <AdminButton type="button" icon={Search} variant="secondary" onClick={() => loadReports()}>
                Caută
              </AdminButton>
            </div>
          </AdminCard>

          <AdminTable
            data={paginatedReports}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="Nu există rapoarte. Apasă 'Adaugă Raport Nou' pentru a adăuga primul raport."
          />

          {totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={reports.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Raportul?"
        message={`Ești sigur că vrei să ștergi raportul "${itemToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
