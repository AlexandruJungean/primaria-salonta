'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Target, Euro, MapPin } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminConfirmDialog,
  AdminStatusBadge,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Program {
  id: string;
  title: string;
  slug: string;
  program_type: string;
  status: string;
  total_value: number | null;
  currency: string;
  published: boolean;
  created_at: string;
}

// Conform CHECK constraint din DB
const TYPE_LABELS: Record<string, string> = {
  pnrr: 'PNRR',
  pmud: 'PMUD',
  strategie: 'Strategie',
  sna: 'SNA',
  svsu: 'SVSU',
  proiecte_europene: 'Proiecte Europene',
  proiecte_locale: 'Proiecte Locale',
  regional_nord_vest: 'Program Regional Nord-Vest',
  altele: 'Altele',
};

// Conform CHECK constraint din DB
const STATUS_LABELS: Record<string, string> = {
  planificat: 'Planificat',
  in_desfasurare: 'În desfășurare',
  finalizat: 'Finalizat',
  anulat: 'Anulat',
};

export default function ProgramePage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    try {
      // Only fetch top-level programs (parent_id is null)
      const response = await adminFetch('/api/admin/programs?top_level=true');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const handleEdit = (item: Program) => {
    router.push(`/admin/programe/${item.id}`);
  };

  const confirmDelete = (item: Program) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/programs?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Programul a fost șters.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadPrograms();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
    }
  };

  const formatBudget = (value: number | null, currency: string) => {
    if (!value) return '-';
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: currency || 'RON', maximumFractionDigits: 0 }).format(value);
  };

  const columns = [
    {
      key: 'title',
      label: 'Program/Proiect',
      render: (item: Program) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">{TYPE_LABELS[item.program_type] || item.program_type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'total_value',
      label: 'Valoare totală',
      className: 'w-40',
      render: (item: Program) => (
        item.total_value ? (
          <div className="flex items-center gap-2 text-slate-600">
            <Euro className="w-4 h-4" />
            <span>{formatBudget(item.total_value, item.currency)}</span>
          </div>
        ) : <span className="text-slate-400">-</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: Program) => {
        const statusMap: Record<string, 'pending' | 'active' | 'completed' | 'cancelled'> = {
          planificat: 'pending',
          in_derulare: 'active',
          finalizat: 'completed',
          suspendat: 'cancelled',
          anulat: 'cancelled',
        };
        return <AdminStatusBadge status={statusMap[item.status] || 'pending'} />;
      },
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Programe și Proiecte"
        description="Gestionează programele și proiectele primăriei"
        breadcrumbs={[{ label: 'Programe și Proiecte' }]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/programe/nou')}>
            Adaugă Program Nou
          </AdminButton>
        }
      />

      <AdminTable
        data={programs}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există programe."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Programul?"
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
