'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Video, MapPin, Link as LinkIcon } from 'lucide-react';
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

interface Webcam {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  stream_url: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export default function WebcamsPage() {
  const router = useRouter();
  const [webcams, setWebcams] = useState<Webcam[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Webcam | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadWebcams = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webcams')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setWebcams(data || []);
    } catch (error) {
      console.error('Error loading webcams:', error);
      toast.error('Eroare', 'Nu s-au putut încărca camerele web.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWebcams();
  }, [loadWebcams]);

  const handleEdit = (item: Webcam) => {
    router.push(`/admin/webcams/${item.id}`);
  };

  const confirmDelete = (item: Webcam) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('webcams')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Camera "${itemToDelete.name}" a fost ștearsă.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadWebcams();
    } catch (error) {
      console.error('Error deleting webcam:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge camera.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'preview',
      label: '',
      className: 'w-32',
      render: (item: Webcam) => (
        <div className="w-28 h-20 bg-slate-100 rounded-lg overflow-hidden">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Cameră',
      render: (item: Webcam) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          {item.location && (
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          )}
          {item.description && (
            <p className="text-sm text-slate-500 line-clamp-1 mt-1">{item.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stream_url',
      label: 'Stream URL',
      className: 'w-64',
      render: (item: Webcam) => (
        item.stream_url ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <LinkIcon className="w-4 h-4" />
            <span className="truncate max-w-[200px]">{item.stream_url}</span>
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: Webcam) => (
        <AdminStatusBadge status={item.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'sort_order',
      label: 'Ordine',
      className: 'w-20',
      render: (item: Webcam) => (
        <span className="text-slate-500">{item.sort_order}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Camere Web"
        description="Gestionează camerele web afișate pe website"
        breadcrumbs={[{ label: 'Camere Web' }]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/webcams/nou')}>
            Adaugă Cameră Nouă
          </AdminButton>
        }
      />

      <AdminTable
        data={webcams}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există camere web configurate. Apasă 'Adaugă Cameră Nouă' pentru a adăuga prima cameră."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Camera?"
        message={`Ești sigur că vrei să ștergi camera "${itemToDelete?.name}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
