'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Phone, Users } from 'lucide-react';
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

interface CouncilMember {
  id: string;
  name: string;
  party: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  sort_order: number;
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
      const { data, error } = await supabase
        .from('council_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
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
      const { error } = await supabase.from('council_members').delete().eq('id', itemToDelete.id);
      if (error) throw error;

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
      key: 'photo',
      label: '',
      className: 'w-16',
      render: (item: CouncilMember) => (
        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
          {item.photo_url ? (
            <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
              {item.name.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
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
      key: 'contact',
      label: 'Contact',
      render: (item: CouncilMember) => (
        <div className="space-y-1">
          {item.email && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span>{item.email}</span>
            </div>
          )}
          {item.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4" />
              <span>{item.phone}</span>
            </div>
          )}
          {!item.email && !item.phone && <span className="text-slate-400">-</span>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: CouncilMember) => (
        <AdminStatusBadge status={item.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'sort_order',
      label: 'Ordine',
      className: 'w-20',
      render: (item: CouncilMember) => <span className="text-slate-500">{item.sort_order}</span>,
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
