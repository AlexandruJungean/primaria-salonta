'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, FileText } from 'lucide-react';
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
import { adminFetch } from '@/lib/api-client';

interface SessionItem {
  id: string;
  slug: string;
  session_date: string;
  title: string;
  published: boolean;
  created_at: string;
  documents_count?: number;
}

const ITEMS_PER_PAGE = 15;

export default function OrdineDeZiListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SessionItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        source: 'sedinte',
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await adminFetch(`/api/admin/council-sessions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();

      setSessions(result.data || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Eroare', 'Nu s-au putut încărca ordinele de zi.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadSessions();
  };

  const handleEdit = (item: SessionItem) => {
    router.push(`/admin/consiliul-local/ordine-de-zi/${item.id}`);
  };

  const confirmDelete = (item: SessionItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/council-sessions?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Ordinea de zi a fost ștearsă.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'title',
      label: 'Ordine de Zi',
      render: (item: SessionItem) => (
        <div>
          <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
          <p className="text-sm text-slate-500">{formatDate(item.session_date)}</p>
        </div>
      ),
    },
    {
      key: 'documents',
      label: 'Documente',
      className: 'w-32',
      render: (item: SessionItem) => (
        <div className="flex items-center gap-2 text-slate-600">
          <FileText className="w-4 h-4" />
          <span>{item.documents_count || 0} documente</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: SessionItem) => (
        <AdminStatusBadge status={item.published ? 'enabled' : 'disabled'} />
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Ordine de Zi"
        description="Gestionează ordinele de zi pentru ședințele Consiliului Local"
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Ordine de Zi' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/consiliul-local/ordine-de-zi/nou')}>
            Adaugă Ordine de Zi
          </AdminButton>
        }
      />

      <AdminCard className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <AdminInput label="" placeholder="Caută după titlu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <AdminButton type="submit" icon={Search} variant="secondary">Caută</AdminButton>
        </form>
      </AdminCard>

      <AdminTable
        data={sessions}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există ordine de zi."
      />

      {totalPages > 1 && (
        <AdminPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      )}

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Ordinea de Zi?"
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
