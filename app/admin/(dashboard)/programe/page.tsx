'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ChevronUp, ChevronDown, Pencil, Eye, EyeOff, Trash2, Target } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, AdminConfirmDialog, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Program {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  program_type: string;
  status: string;
  icon: string | null;
  published: boolean;
  sort_order: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  planificat: { label: 'Planificat', color: 'bg-slate-100 text-slate-600' },
  in_desfasurare: { label: 'În desfășurare', color: 'bg-blue-100 text-blue-700' },
  finalizat: { label: 'Finalizat', color: 'bg-green-100 text-green-700' },
  anulat: { label: 'Anulat', color: 'bg-red-100 text-red-700' },
};

export default function ProgramePage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/programs?top_level=true');
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setPrograms((data || []).sort((a: Program, b: Program) => a.sort_order - b.sort_order));
    } catch {
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleVisibility = async (item: Program) => {
    try {
      const response = await adminFetch(`/api/admin/programs?id=${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published: !item.published }),
      });
      if (!response.ok) throw new Error('Failed');
      toast.success(item.published ? 'Program ascuns' : 'Program activat');
      await loadData();
    } catch {
      toast.error('Eroare la schimbarea vizibilității');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= programs.length) return;

    const newItems = [...programs];
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setPrograms(newItems);

    try {
      await Promise.all([
        adminFetch(`/api/admin/programs?id=${newItems[index].id}`, { method: 'PATCH', body: JSON.stringify({ sort_order: index }) }),
        adminFetch(`/api/admin/programs?id=${newItems[swapIndex].id}`, { method: 'PATCH', body: JSON.stringify({ sort_order: swapIndex }) }),
      ]);
    } catch {
      toast.error('Eroare la reordonare');
      await loadData();
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/programs?id=${itemToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed');
      toast.success('Programul a fost șters');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      await loadData();
    } catch {
      toast.error('Eroare la ștergere');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Programe și Strategii"
        description="Gestionează programele și proiectele primăriei"
        breadcrumbs={[{ label: 'Programe și Strategii' }]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/programe/nou')}>
            Adaugă Program
          </AdminButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((item, index) => {
          const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.planificat;
          return (
            <AdminCard
              key={item.id}
              className={`transition-shadow ${item.published ? 'hover:shadow-md' : 'opacity-50'}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <Link href={`/admin/programe/${item.id}`} className="flex items-start gap-3 flex-1 min-w-0 group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${item.published ? 'bg-green-50 group-hover:bg-green-100' : 'bg-slate-100'}`}>
                      <Target className={`w-5 h-5 ${item.published ? 'text-green-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className={`text-sm font-semibold leading-tight transition-colors ${item.published ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-500'}`}>
                        {item.title}
                      </h3>
                      {item.short_description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.short_description}</p>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => toggleVisibility(item)} className={`p-1 rounded hover:bg-slate-100 ${item.published ? 'text-slate-400 hover:text-slate-600' : 'text-red-400 hover:text-red-600'}`} title={item.published ? 'Ascunde' : 'Activează'}>
                      {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400 hover:text-slate-600"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === programs.length - 1} className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400 hover:text-slate-600"><ChevronDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => router.push(`/admin/programe/${item.id}`)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Editează"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { setItemToDelete(item); setDeleteDialogOpen(true); }} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600" title="Șterge"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 pl-[52px]">
                  {!item.published && <span className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full">Ascuns</span>}
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {programs.length === 0 && (
        <AdminCard><div className="text-center py-8 text-slate-500">Nu există programe.</div></AdminCard>
      )}

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Programul?"
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
