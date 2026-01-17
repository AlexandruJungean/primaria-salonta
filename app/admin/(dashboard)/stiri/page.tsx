'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminConfirmDialog,
  AdminStatusBadge,
  AdminInput,
  toast,
} from '@/components/admin';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  view_count: number;
}

const ITEMS_PER_PAGE = 10;

export default function StiriListPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false, nullsFirst: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setNews(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Eroare', 'Nu s-au putut încărca știrile.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadNews();
  };

  const handleEdit = (item: NewsItem) => {
    router.push(`/admin/stiri/${item.id}`);
  };

  const handleView = (item: NewsItem) => {
    window.open(`/ro/stiri/${item.slug}`, '_blank');
  };

  const confirmDelete = (item: NewsItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Știrea "${itemToDelete.title}" a fost ștearsă.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge știrea.');
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

  const columns = [
    {
      key: 'title',
      label: 'Titlu',
      render: (item: NewsItem) => (
        <div>
          <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
          {item.excerpt && (
            <p className="text-sm text-slate-500 line-clamp-1 mt-1">{item.excerpt}</p>
          )}
        </div>
      ),
    },
    {
      key: 'published_at',
      label: 'Data publicării',
      className: 'w-36',
      render: (item: NewsItem) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          {formatDate(item.published_at || item.created_at)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: NewsItem) => (
        <AdminStatusBadge status={item.published ? 'published' : 'draft'} />
      ),
    },
    {
      key: 'view_count',
      label: 'Vizualizări',
      className: 'w-28',
      render: (item: NewsItem) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Eye className="w-4 h-4" />
          {item.view_count}
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Știri și Anunțuri"
        description="Gestionează știrile și anunțurile publicate pe website"
        breadcrumbs={[{ label: 'Știri și Anunțuri' }]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/stiri/nou')}
          >
            Adaugă Știre Nouă
          </AdminButton>
        }
      />

      {/* Search */}
      <AdminCard className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <AdminInput
              label=""
              placeholder="Caută după titlu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AdminButton type="submit" icon={Search} variant="secondary">
            Caută
          </AdminButton>
        </form>
      </AdminCard>

      {/* Table */}
      <AdminTable
        data={news}
        columns={columns}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există știri. Apasă 'Adaugă Știre Nouă' pentru a crea prima știre."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Știrea?"
        message={`Ești sigur că vrei să ștergi știrea "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
