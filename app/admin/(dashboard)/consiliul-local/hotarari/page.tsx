'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, AlertTriangle, Gavel } from 'lucide-react';
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
  canDeleteItem,
  formatDeleteTimeRemaining,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface SessionItem {
  id: string;
  slug: string;
  session_date: string;
  title: string;
  published: boolean;
  created_at: string;
  decisions_count?: number;
}

const ITEMS_PER_PAGE = 15;
const DELETE_LIMIT_HOURS = 24;

export default function HotarariListPage() {
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
        source: 'hotarari',
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
      toast.error('Eroare', 'Nu s-au putut încărca hotărârile.');
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
    router.push(`/admin/consiliul-local/hotarari/${item.id}`);
  };

  const canDelete = (item: SessionItem): boolean => {
    return canDeleteItem(item.created_at, DELETE_LIMIT_HOURS);
  };

  const getDeleteTooltip = (item: SessionItem): string => {
    if (canDelete(item)) {
      const hoursRemaining = DELETE_LIMIT_HOURS - 
        (new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
      return `Șterge (${formatDeleteTimeRemaining(hoursRemaining)})`;
    }
    return 'Nu se poate șterge - au trecut mai mult de 24 ore';
  };

  const confirmDelete = (item: SessionItem) => {
    if (!canDelete(item)) {
      toast.warning('Nu se poate șterge', 'Hotărârile pot fi șterse doar în primele 24 de ore.');
      return;
    }
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

      toast.success('Șters', 'Ședința cu hotărârile a fost ștearsă.');
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
      key: 'date',
      label: 'Data Ședinței',
      render: (item: SessionItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{formatDate(item.session_date)}</p>
            <p className="text-sm text-slate-500">{item.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'decisions',
      label: 'Hotărâri',
      className: 'w-36',
      render: (item: SessionItem) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Gavel className="w-4 h-4" />
          <span className="font-medium">{item.decisions_count || 0} hotărâri</span>
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
    {
      key: 'can_delete',
      label: '',
      className: 'w-10',
      render: (item: SessionItem) => (
        !canDelete(item) ? (
          <span title="Nu se poate șterge - au trecut 24h">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </span>
        ) : null
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Hotărâri Consiliul Local"
        description="Gestionează hotărârile pe ședințe ale Consiliului Local"
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Hotărâri' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/consiliul-local/hotarari/nou')}>
            Adaugă Ședință Nouă
          </AdminButton>
        }
      />

      <AdminCard className="mb-6 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-amber-800">
            <strong>Atenție:</strong> Ședințele pot fi șterse doar în primele 24 de ore de la creare.
          </p>
        </div>
      </AdminCard>

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
        canDelete={canDelete}
        deleteTooltip={getDeleteTooltip}
        emptyMessage="Nu există ședințe cu hotărâri."
      />

      {totalPages > 1 && (
        <AdminPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      )}

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Ședința?"
        message={`Ești sigur că vrei să ștergi ședința din "${itemToDelete ? formatDate(itemToDelete.session_date) : ''}" cu toate hotărârile?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
