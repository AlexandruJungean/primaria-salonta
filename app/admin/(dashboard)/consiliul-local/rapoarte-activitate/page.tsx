'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  BookOpen,
  Search,
  Calendar,
  ExternalLink,
  X,
  User,
  Users,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
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

const ITEMS_PER_PAGE = 15;

const CATEGORY_LABELS: Record<string, string> = {
  comisie: 'Comisie',
  consilier: 'Consilier',
};

export default function RapoarteActivitatePage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/reports?report_type=raport_activitate');
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
      
      if (categoryFilter) {
        filtered = filtered.filter((r: Report) => r.category === categoryFilter);
      }
      
      setReports(filtered);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Eroare', 'Nu s-au putut încărca rapoartele.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, yearFilter, categoryFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleEdit = (item: Report) => {
    router.push(`/admin/consiliul-local/rapoarte-activitate/${item.id}`);
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

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || yearFilter || categoryFilter;

  // Get unique years for filter
  const years = [...new Set(reports.map(r => r.report_year).filter(Boolean) as number[])].sort((a, b) => b - a);
  const categories = [...new Set(reports.map(r => r.category).filter(Boolean) as string[])];

  const columns = [
    {
      key: 'title',
      label: 'Titlu Raport',
      render: (item: Report) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.category === 'comisie' ? 'bg-purple-100' : 'bg-emerald-100'
          }`}>
            {item.category === 'comisie' ? (
              <Users className={`w-5 h-5 text-purple-600`} />
            ) : (
              <User className={`w-5 h-5 text-emerald-600`} />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
            {item.author && (
              <p className="text-sm text-slate-500">{item.author}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Tip',
      className: 'w-32',
      render: (item: Report) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.category === 'comisie' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {CATEGORY_LABELS[item.category || ''] || item.category || 'General'}
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
        title="Rapoarte de Activitate"
        description="Gestionează rapoartele de activitate ale comisiilor și consilierilor"
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Rapoarte Activitate' },
        ]}
        actions={
          <AdminButton 
            icon={Plus} 
            onClick={() => router.push('/admin/consiliul-local/rapoarte-activitate/nou')}
          >
            Adaugă Raport Nou
          </AdminButton>
        }
      />

      {/* Filters */}
      <AdminCard className="mb-6">
        <form onSubmit={(e) => { e.preventDefault(); loadReports(); }} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <AdminInput
              label=""
              placeholder="Caută după titlu sau autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {categories.length > 0 && (
            <div className="w-40">
              <AdminSelect
                label=""
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={categories.map(c => ({ 
                  value: c, 
                  label: CATEGORY_LABELS[c] || c 
                }))}
                placeholder="Tip"
              />
            </div>
          )}
          <AdminButton type="submit" icon={Search} variant="secondary">
            Caută
          </AdminButton>
          {hasActiveFilters && (
            <AdminButton type="button" icon={X} variant="ghost" onClick={clearFilters}>
              Resetează
            </AdminButton>
          )}
        </form>
      </AdminCard>

      <AdminTable
        data={paginatedReports}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există rapoarte de activitate. Apasă 'Adaugă Raport Nou' pentru a adăuga primul raport."
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

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Raportul?"
        message={`Ești sigur că vrei să ștergi raportul "${itemToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
