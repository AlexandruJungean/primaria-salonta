'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminConfirmDialog,
  AdminStatusBadge,
  toast,
} from '@/components/admin';

interface Commission {
  id: string;
  name: string;
  description: string | null;
  commission_number: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
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
      const { data, error } = await supabase
        .from('council_commissions')
        .select('*')
        .order('commission_number', { ascending: true });

      if (error) throw error;
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
      const { error } = await supabase.from('council_commissions').delete().eq('id', itemToDelete.id);
      if (error) throw error;

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
      key: 'commission_number',
      label: 'Nr.',
      className: 'w-16',
      render: (item: Commission) => (
        <span className="font-bold text-slate-900">{item.commission_number || '-'}</span>
      ),
    },
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
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: Commission) => (
        <AdminStatusBadge status={item.is_active ? 'active' : 'inactive'} />
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
