'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, MapPin } from 'lucide-react';
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

interface EventItem {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const EVENT_TYPE_LABELS: Record<string, string> = {
  cultural: 'Cultural',
  sportiv: 'Sportiv',
  civic: 'Civic',
  educational: 'Educațional',
  administrativ: 'Administrativ',
  festival: 'Festival',
  altele: 'Altele',
};

export default function EvenimenteListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('start_date', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setEvents(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Eroare', 'Nu s-au putut încărca evenimentele.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadEvents();
  };

  const handleEdit = (item: EventItem) => {
    router.push(`/admin/evenimente/${item.id}`);
  };

  const handleView = (item: EventItem) => {
    window.open(`/ro/evenimente/${item.slug}`, '_blank');
  };

  const confirmDelete = (item: EventItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Evenimentul "${itemToDelete.title}" a fost șters.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge evenimentul.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'title',
      label: 'Titlu',
      render: (item: EventItem) => (
        <div>
          <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
          <p className="text-sm text-slate-500 capitalize">
            {EVENT_TYPE_LABELS[item.event_type] || item.event_type}
          </p>
        </div>
      ),
    },
    {
      key: 'start_date',
      label: 'Data',
      className: 'w-40',
      render: (item: EventItem) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(item.start_date)}</span>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Locație',
      className: 'w-48',
      render: (item: EventItem) => (
        item.location ? (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: EventItem) => (
        <AdminStatusBadge status={item.published ? 'published' : 'draft'} />
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Evenimente"
        description="Gestionează evenimentele publicate pe website"
        breadcrumbs={[{ label: 'Evenimente' }]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/evenimente/nou')}
          >
            Adaugă Eveniment Nou
          </AdminButton>
        }
      />

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

      <AdminTable
        data={events}
        columns={columns}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există evenimente. Apasă 'Adaugă Eveniment Nou' pentru a crea primul eveniment."
      />

      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Evenimentul?"
        message={`Ești sigur că vrei să ștergi evenimentul "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
