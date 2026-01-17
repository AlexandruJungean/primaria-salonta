'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Scale, 
  ExternalLink, 
  FileText,
  Star,
  GripVertical,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';

interface LegislationLink {
  id: string;
  title: string;
  description: string | null;
  external_url: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_primary: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export default function LegislatiePage() {
  const router = useRouter();
  const [links, setLinks] = useState<LegislationLink[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LegislationLink | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('legislation_links')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error loading legislation links:', error);
      toast.error('Eroare', 'Nu s-au putut încărca link-urile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const handleEdit = (item: LegislationLink) => {
    router.push(`/admin/primaria/legislatie/${item.id}`);
  };

  const confirmDelete = (item: LegislationLink) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('legislation_links')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Link-ul "${itemToDelete.title}" a fost șters.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge link-ul.');
    } finally {
      setDeleting(false);
    }
  };

  const getLinkUrl = (item: LegislationLink): string | null => {
    return item.external_url || item.file_url || null;
  };

  const getLinkType = (item: LegislationLink): 'external' | 'file' | 'none' => {
    if (item.external_url) return 'external';
    if (item.file_url) return 'file';
    return 'none';
  };

  const columns = [
    {
      key: 'title',
      label: 'Titlu',
      render: (item: LegislationLink) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.is_primary ? 'bg-amber-100' : 'bg-slate-100'
          }`}>
            {item.is_primary ? (
              <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
            ) : (
              <Scale className="w-5 h-5 text-slate-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 flex items-center gap-2">
              {item.title}
              {item.is_primary && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                  Principal
                </span>
              )}
            </p>
            {item.description && (
              <p className="text-sm text-slate-500 truncate max-w-md">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tip Link',
      className: 'w-32',
      render: (item: LegislationLink) => {
        const type = getLinkType(item);
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
            type === 'external' 
              ? 'bg-blue-100 text-blue-700' 
              : type === 'file'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-500'
          }`}>
            {type === 'external' ? (
              <>
                <ExternalLink className="w-3 h-3" />
                Extern
              </>
            ) : type === 'file' ? (
              <>
                <FileText className="w-3 h-3" />
                Fișier
              </>
            ) : (
              'Niciun link'
            )}
          </span>
        );
      },
    },
    {
      key: 'sort_order',
      label: 'Ordine',
      className: 'w-20',
      render: (item: LegislationLink) => (
        <div className="flex items-center gap-2 text-slate-500">
          <GripVertical className="w-4 h-4" />
          <span>{item.sort_order}</span>
        </div>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      className: 'w-24',
      render: (item: LegislationLink) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.published 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {item.published ? 'Publicat' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'link',
      label: '',
      className: 'w-24',
      render: (item: LegislationLink) => {
        const url = getLinkUrl(item);
        if (!url) return null;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Deschide
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Legislație"
        description={`Gestionează link-urile către actele normative (${loading ? '...' : links.length} link-uri)`}
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Legislație' },
        ]}
        actions={
          <AdminButton 
            icon={Plus} 
            onClick={() => router.push('/admin/primaria/legislatie/nou')}
          >
            Adaugă Link Nou
          </AdminButton>
        }
      />

      <AdminCard className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Despre Legislație</p>
            <p className="text-sm text-blue-700 mt-1">
              Link-urile pot fi externe (către legislatie.just.ro, cdep.ro) sau documente încărcate. 
              Link-ul marcat ca <strong>Principal</strong> va fi afișat evidențiat în partea de sus a paginii.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminTable
        data={links}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există link-uri de legislație. Apasă 'Adaugă Link Nou' pentru a adăuga primul link."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Link-ul?"
        message={`Ești sigur că vrei să ștergi link-ul "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
