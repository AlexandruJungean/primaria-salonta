'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminTable,
  AdminConfirmDialog,
  AdminStatusBadge,
  toast,
} from '@/components/admin';

interface FAQ {
  id: string;
  category: string | null;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FAQ | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      toast.error('Eroare', 'Nu s-au putut încărca întrebările frecvente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  const handleEdit = (item: FAQ) => {
    router.push(`/admin/faq/${item.id}`);
  };

  const confirmDelete = (item: FAQ) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', 'Întrebarea a fost ștearsă.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge întrebarea.');
    } finally {
      setDeleting(false);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const columns = [
    {
      key: 'question',
      label: 'Întrebare',
      render: (item: FAQ) => (
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <p className="font-semibold text-slate-900 line-clamp-2">{item.question}</p>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1 ml-6">
            {stripHtml(item.answer)}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (item: FAQ) => (
        <AdminStatusBadge status={item.published ? 'published' : 'draft'} />
      ),
    },
    {
      key: 'sort_order',
      label: 'Ordine',
      className: 'w-20',
      render: (item: FAQ) => (
        <span className="text-slate-500">{item.sort_order}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Întrebări Frecvente (FAQ)"
        description="Gestionează întrebările frecvente afișate pe pagina FAQ"
        breadcrumbs={[
          { label: 'Altele' },
          { label: 'Întrebări Frecvente' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/faq/nou')}>
            Adaugă Întrebare Nouă
          </AdminButton>
        }
      />

      <AdminTable
        data={faqs}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există întrebări frecvente. Apasă 'Adaugă Întrebare Nouă' pentru a adăuga prima întrebare."
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Întrebarea?"
        message={`Ești sigur că vrei să ștergi întrebarea "${itemToDelete?.question?.substring(0, 50)}..."? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
