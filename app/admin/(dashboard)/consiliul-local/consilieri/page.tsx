'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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

interface CouncilMember {
  id: string;
  name: string;
  party: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ConsilieriPage() {
  const router = useRouter();
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CouncilMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/council-members');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Eroare', 'Nu s-au putut încărca consilierii.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleEdit = (item: CouncilMember) => {
    router.push(`/admin/consiliul-local/consilieri/${item.id}`);
  };

  const confirmDelete = (item: CouncilMember) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/council-members?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', `Consilierul ${itemToDelete.name} a fost șters.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Eroare', 'Nu s-a putut șterge consilierul.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Consilier',
      render: (item: CouncilMember) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          {item.party && <p className="text-sm text-slate-500">{item.party}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: CouncilMember) => (
        <AdminStatusBadge status={item.is_active ? 'enabled' : 'disabled'} />
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Consilieri Locali"
        description="Gestionează consilierii Consiliului Local Salonta"
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Consilieri Locali' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/consiliul-local/consilieri/nou')}>
            Adaugă Consilier
          </AdminButton>
        }
      />

      <AdminTable
        data={members}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există consilieri."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Consilierul?"
        message={`Ești sigur că vrei să ștergi consilierul "${itemToDelete?.name}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
