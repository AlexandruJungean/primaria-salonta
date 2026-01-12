'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, Hash, AlertTriangle } from 'lucide-react';
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
  AdminSelect,
  toast,
  canDeleteItem,
  formatDeleteTimeRemaining,
} from '@/components/admin';

interface DecisionItem {
  id: string;
  decision_number: number;
  decision_date: string;
  year: number;
  title: string;
  category: string | null;
  status: string;
  published: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 15;
const DELETE_LIMIT_HOURS = 24;

const CATEGORY_LABELS: Record<string, string> = {
  buget: 'Buget',
  urbanism: 'Urbanism',
  patrimoniu: 'Patrimoniu',
  taxe: 'Taxe',
  servicii_publice: 'Servicii Publice',
  administrativ: 'Administrativ',
  social: 'Social',
  cultura: 'Cultură',
  mediu: 'Mediu',
  altele: 'Altele',
};

export default function HotarariListPage() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DecisionItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    const { data } = await supabase
      .from('council_decisions')
      .select('year')
      .order('year', { ascending: false });
    
    if (data) {
      const uniqueYears = [...new Set(data.map(d => d.year))];
      setYears(uniqueYears);
    }
  };

  const loadDecisions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('council_decisions')
        .select('*', { count: 'exact' })
        .order('decision_date', { ascending: false })
        .order('decision_number', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (yearFilter) {
        query = query.eq('year', parseInt(yearFilter));
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setDecisions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading decisions:', error);
      toast.error('Eroare', 'Nu s-au putut încărca hotărârile.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, yearFilter]);

  useEffect(() => {
    loadDecisions();
  }, [loadDecisions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDecisions();
  };

  const handleEdit = (item: DecisionItem) => {
    router.push(`/admin/consiliul-local/hotarari/${item.id}`);
  };

  const canDelete = (item: DecisionItem): boolean => {
    return canDeleteItem(item.created_at, DELETE_LIMIT_HOURS);
  };

  const getDeleteTooltip = (item: DecisionItem): string => {
    if (canDelete(item)) {
      const hoursRemaining = DELETE_LIMIT_HOURS - 
        (new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
      return `Șterge (${formatDeleteTimeRemaining(hoursRemaining)})`;
    }
    return 'Nu se poate șterge - au trecut mai mult de 24 ore';
  };

  const confirmDelete = (item: DecisionItem) => {
    if (!canDelete(item)) {
      toast.warning(
        'Nu se poate șterge',
        'Hotărârile pot fi șterse doar în primele 24 de ore de la creare.'
      );
      return;
    }
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('council_decisions')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Hotărârea nr. ${itemToDelete.decision_number} a fost ștearsă.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadDecisions();
    } catch (error) {
      console.error('Error deleting decision:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge hotărârea.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'decision_number',
      label: 'Nr.',
      className: 'w-20',
      render: (item: DecisionItem) => (
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-900">{item.decision_number}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Titlu',
      render: (item: DecisionItem) => (
        <div>
          <p className="font-medium text-slate-900 line-clamp-2">{item.title}</p>
          {item.category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'decision_date',
      label: 'Data',
      className: 'w-32',
      render: (item: DecisionItem) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          {formatDate(item.decision_date)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: DecisionItem) => {
        const statusMap: Record<string, 'active' | 'inactive' | 'cancelled'> = {
          in_vigoare: 'active',
          abrogata: 'cancelled',
          modificata: 'pending' as 'active',
        };
        return <AdminStatusBadge status={statusMap[item.status] || 'active'} />;
      },
    },
    {
      key: 'can_delete',
      label: '',
      className: 'w-10',
      render: (item: DecisionItem) => (
        !canDelete(item) ? (
          <span title="Nu se poate șterge - au trecut 24h">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </span>
        ) : null
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const yearOptions = years.map(y => ({ value: y.toString(), label: y.toString() }));

  return (
    <div>
      <AdminPageHeader
        title="Hotărâri Consiliu Local"
        description="Gestionează hotărârile Consiliului Local Salonta"
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Hotărâri' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/consiliul-local/hotarari/nou')}>
            Adaugă Hotărâre Nouă
          </AdminButton>
        }
      />

      {/* Warning about delete restriction */}
      <AdminCard className="mb-6 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-amber-800">
            <strong>Atenție:</strong> Hotărârile pot fi șterse doar în primele 24 de ore de la creare.
          </p>
        </div>
      </AdminCard>

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
          <div className="w-40">
            <AdminSelect
              label=""
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={yearOptions}
              placeholder="Anul"
            />
          </div>
          <AdminButton type="submit" icon={Search} variant="secondary">
            Caută
          </AdminButton>
        </form>
      </AdminCard>

      <AdminTable
        data={decisions}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        canDelete={canDelete}
        deleteTooltip={getDeleteTooltip}
        emptyMessage="Nu există hotărâri. Apasă 'Adaugă Hotărâre Nouă' pentru a crea prima hotărâre."
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
        title="Șterge Hotărârea?"
        message={`Ești sigur că vrei să ștergi hotărârea nr. ${itemToDelete?.decision_number} - "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
