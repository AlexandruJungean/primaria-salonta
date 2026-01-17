'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  FileSearch,
  Search,
  Calendar,
  ExternalLink,
  X,
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

export default function StudiiPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch studies (studiu_fezabilitate type)
      const response = await adminFetch('/api/admin/reports?report_type=studiu_fezabilitate');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
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
    } catch (error) {
      console.error('Error loading studies:', error);
      toast.error('Eroare', 'Nu s-au putut încărca studiile.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, yearFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleEdit = (item: Report) => {
    router.push(`/admin/rapoarte-studii/studii/${item.id}`);
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

      toast.success('Șters', 'Studiul a fost șters.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadReports();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge studiul.');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || yearFilter;
  const years = [...new Set(reports.map(r => r.report_year).filter(Boolean) as number[])].sort((a, b) => b - a);

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'title',
      label: 'Titlu Studiu',
      render: (item: Report) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900" title={item.title}>{truncateText(item.title)}</p>
            {item.summary && (
              <p className="text-sm text-slate-500 truncate">{truncateText(item.summary, 50)}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'report_date',
      label: 'Data',
      className: 'w-28',
      render: (item: Report) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          {formatDate(item.report_date)}
        </div>
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
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Descarcă
        </a>
      ) : null,
    },
  ];

  const paginatedReports = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Studii"
        description="Gestionează studiile de fezabilitate și documentațiile tehnice"
        breadcrumbs={[
          { label: 'Rapoarte și Studii' },
          { label: 'Studii' },
        ]}
        actions={
          <AdminButton 
            icon={Plus} 
            onClick={() => router.push('/admin/rapoarte-studii/studii/nou')}
          >
            Adaugă Studiu Nou
          </AdminButton>
        }
      />

      <AdminCard className="mb-6">
        <form onSubmit={(e) => { e.preventDefault(); loadReports(); }} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <AdminInput
              label=""
              placeholder="Caută după titlu..."
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
        emptyMessage="Nu există studii. Apasă 'Adaugă Studiu Nou' pentru a adăuga primul studiu."
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
        title="Șterge Studiul?"
        message={`Ești sigur că vrei să ștergi studiul "${itemToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
