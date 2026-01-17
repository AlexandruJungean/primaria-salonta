'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Phone } from 'lucide-react';
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

interface StaffMember {
  id: string;
  name: string;
  position_type: string;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// Conform CHECK constraint din DB: 'primar', 'viceprimar', 'secretar', 'administrator', 'sef_serviciu', 'altele'
const POSITION_LABELS: Record<string, string> = {
  primar: 'Primar',
  viceprimar: 'Viceprimar',
  secretar: 'Secretar General',
  administrator: 'Administrator Public',
  sef_serviciu: 'Șef Serviciu',
  altele: 'Altele',
};

export default function ConducerePage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error loading staff:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleEdit = (item: StaffMember) => {
    router.push(`/admin/primaria/conducere/${item.id}`);
  };

  const confirmDelete = (item: StaffMember) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `${itemToDelete.name} a fost șters din conducere.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge membrul.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'photo',
      label: '',
      className: 'w-16',
      render: (item: StaffMember) => (
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
      label: 'Nume',
      render: (item: StaffMember) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-sm text-slate-500">{POSITION_LABELS[item.position_type] || item.position_type}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (item: StaffMember) => (
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
      render: (item: StaffMember) => (
        <AdminStatusBadge status={item.is_active ? 'enabled' : 'disabled'} />
      ),
    },
    {
      key: 'sort_order',
      label: 'Ordine',
      className: 'w-20',
      render: (item: StaffMember) => (
        <span className="text-slate-500">{item.sort_order}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Conducerea Primăriei"
        description="Gestionează membrii conducerii primăriei"
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Conducere' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/primaria/conducere/nou')}>
            Adaugă Persoană
          </AdminButton>
        }
      />

      <AdminTable
        data={staff}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există membri în conducere. Apasă 'Adaugă Persoană' pentru a adăuga primul membru."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge din Conducere?"
        message={`Ești sigur că vrei să ștergi pe "${itemToDelete?.name}" din conducere? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
