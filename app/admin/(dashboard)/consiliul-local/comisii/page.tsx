'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users } from 'lucide-react';
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

interface Commission {
  id: string;
  name: string;
  description: string | null;
  commission_number: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  member_count?: number;
}

export default function ComisiiPage() {
  const router = useRouter();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Commission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCommissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/commissions');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCommissions(data || []);
    } catch (error) {
      console.error('Error loading commissions:', error);
      toast.error('Eroare', 'Nu s-au putut încărca comisiile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommissions();
  }, [loadCommissions]);

  const handleEdit = (item: Commission) => {
    router.push(`/admin/consiliul-local/comisii/${item.id}`);
  };

  const confirmDelete = (item: Commission) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/commissions?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Comisia a fost ștearsă.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadCommissions();
    } catch (error) {
      console.error('Error deleting commission:', error);
      toast.error('Eroare', 'Nu s-a putut șterge comisia.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Denumire Comisie',
      render: (item: Commission) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          {item.description && <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>}
        </div>
      ),
    },
    {
      key: 'members',
      label: 'Membri',
      className: 'w-24 text-center',
      render: (item: Commission) => (
        <div className="flex items-center justify-center gap-1.5">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">{item.member_count || 0}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: Commission) => (
        <AdminStatusBadge status={item.is_active ? 'enabled' : 'disabled'} />
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Comisii de Specialitate"
        description="Gestionează comisiile Consiliului Local"
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Comisii' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/consiliul-local/comisii/nou')}>
            Adaugă Comisie
          </AdminButton>
        }
      />

      <AdminTable
        data={commissions}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există comisii."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Comisia?"
        message={`Ești sigur că vrei să ștergi comisia "${itemToDelete?.name}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
