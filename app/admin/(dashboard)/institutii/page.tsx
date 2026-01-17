'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Building } from 'lucide-react';
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

interface Institution {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  educatie: 'Educație',
  sanatate: 'Sănătate',
  sport: 'Sport',
  cultura: 'Cultură',
  social: 'Social',
  altele: 'Altele',
};

export default function InstitutiiPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Institution | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/institutions');
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      
      // Sort by category then by sort_order
      const sorted = (data || []).sort((a: Institution, b: Institution) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.sort_order - b.sort_order;
      });
      
      setInstitutions(sorted);
    } catch (error) {
      console.error('Error loading institutions:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

  const handleEdit = (item: Institution) => {
    router.push(`/admin/institutii/${item.id}`);
  };

  const confirmDelete = (item: Institution) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/institutions?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      toast.success('Șters', 'Instituția a fost ștearsă.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadInstitutions();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Eroare', error.message || 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Instituție',
      render: (item: Institution) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Adresă',
      render: (item: Institution) => (
        item.address ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{item.address}</span>
          </div>
        ) : <span className="text-slate-400">-</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: Institution) => (
        <AdminStatusBadge status={item.is_active ? 'enabled' : 'disabled'} />
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Instituții"
        description="Gestionează instituțiile publice (educație, sănătate, sport, etc.)"
        breadcrumbs={[{ label: 'Instituții' }]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/institutii/nou')}>
            Adaugă Instituție
          </AdminButton>
        }
      />

      <AdminTable
        data={institutions}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există instituții."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Instituția?"
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.name}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
