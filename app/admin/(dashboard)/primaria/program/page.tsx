'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Clock, MapPin } from 'lucide-react';
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

interface OfficeHour {
  id: string;
  office_id: string;
  name: string;
  room: string | null;
  floor: string | null;
  hours: { days: string; from: string; to: string }[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export default function ProgramPage() {
  const router = useRouter();
  const [officeHours, setOfficeHours] = useState<OfficeHour[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OfficeHour | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadOfficeHours = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('office_hours')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setOfficeHours(data || []);
    } catch (error) {
      console.error('Error loading office hours:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOfficeHours();
  }, [loadOfficeHours]);

  const handleEdit = (item: OfficeHour) => {
    router.push(`/admin/primaria/program/${item.id}`);
  };

  const confirmDelete = (item: OfficeHour) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('office_hours')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Programul pentru "${itemToDelete.name}" a fost șters.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadOfficeHours();
    } catch (error) {
      console.error('Error deleting office hours:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge programul.');
    } finally {
      setDeleting(false);
    }
  };

  const formatHours = (hours: { days: string; from: string; to: string }[]) => {
    if (!hours || hours.length === 0) return '-';
    return hours.map(h => `${h.days}: ${h.from} - ${h.to}`).join(' | ');
  };

  const columns = [
    {
      key: 'name',
      label: 'Birou / Serviciu',
      render: (item: OfficeHour) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          {(item.room || item.floor) && (
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>
                {item.room && `Camera ${item.room}`}
                {item.room && item.floor && ' - '}
                {item.floor}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'hours',
      label: 'Program',
      render: (item: OfficeHour) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{formatHours(item.hours)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: OfficeHour) => (
        <AdminStatusBadge status={item.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'sort_order',
      label: 'Ordine',
      className: 'w-20',
      render: (item: OfficeHour) => (
        <span className="text-slate-500">{item.sort_order}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Program cu Publicul"
        description="Gestionează programul de lucru al birourilor și serviciilor"
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Program cu Publicul' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/primaria/program/nou')}>
            Adaugă Program Nou
          </AdminButton>
        }
      />

      <AdminTable
        data={officeHours}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există program definit. Apasă 'Adaugă Program Nou' pentru a adăuga primul birou."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Programul?"
        message={`Ești sigur că vrei să ștergi programul pentru "${itemToDelete?.name}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
