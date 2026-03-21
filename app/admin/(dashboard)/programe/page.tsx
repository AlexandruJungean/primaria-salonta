'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ChevronUp, ChevronDown, Pencil, Eye, EyeOff, Trash2, X, Check, Save } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, AdminConfirmDialog, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { getIcon } from '@/lib/constants/icon-map';
import { IconPicker } from '@/components/admin/icon-picker';

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
  show_in_cetateni: boolean;
  show_in_firme: boolean;
  show_in_primarie: boolean;
  show_in_turist: boolean;
}

const NAV_GROUPS = [
  { key: 'show_in_cetateni' as const, label: 'Cetățeni' },
  { key: 'show_in_firme' as const, label: 'Firme' },
  { key: 'show_in_primarie' as const, label: 'Primărie' },
  { key: 'show_in_turist' as const, label: 'Turist' },
];

export default function ProgramePage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Program>>({});
  const [saving, setSaving] = useState(false);

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

  const startEdit = (item: Program) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      short_description: item.short_description || '',
      icon: item.icon || 'target',
      published: item.published,
      show_in_cetateni: item.show_in_cetateni,
      show_in_firme: item.show_in_firme,
      show_in_primarie: item.show_in_primarie,
      show_in_turist: item.show_in_turist,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const response = await adminFetch(`/api/admin/programs?id=${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('Salvat cu succes');
      setEditingId(null);
      setEditForm({});
      await loadData();
    } catch {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

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

      {/* Edit form */}
      {editingId && (
        <AdminCard className="border-blue-300 ring-2 ring-blue-100 mb-6">
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <IconPicker
                value={editForm.icon || 'target'}
                onChange={icon => setEditForm(f => ({ ...f, icon }))}
                label="Icon"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Titlu</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descriere scurtă</label>
              <input
                type="text"
                value={editForm.short_description || ''}
                onChange={e => setEditForm(f => ({ ...f, short_description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vizibilitate</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editForm.published !== false} onChange={e => setEditForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                  <span className="text-sm text-slate-600">Publicat</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vizibil în meniul public</label>
                <div className="flex flex-wrap gap-4">
                  {NAV_GROUPS.map(group => (
                    <label key={group.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!editForm[group.key]} onChange={e => setEditForm(f => ({ ...f, [group.key]: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      <span className="text-sm text-slate-600">{group.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => { setEditingId(null); setEditForm({}); }} className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" /> Anulează
              </button>
              <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <Check className="w-4 h-4" /> {saving ? 'Se salvează...' : 'Salvează'}
              </button>
            </div>
          </div>
        </AdminCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((item, index) => {
          const ItemIcon = getIcon(item.icon || 'target');
          return (
            <AdminCard key={item.id} className={`transition-shadow ${item.published ? 'hover:shadow-md' : 'opacity-50'}`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <Link href={`/admin/programe/${item.id}`} className="flex items-start gap-3 flex-1 min-w-0 group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${item.published ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-slate-100'}`}>
                      <ItemIcon className={`w-5 h-5 ${item.published ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className={`text-sm font-semibold leading-tight transition-colors ${item.published ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-500'}`}>{item.title}</h3>
                      {item.short_description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.short_description}</p>}
                    </div>
                  </Link>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => toggleVisibility(item)} className={`p-1 rounded hover:bg-slate-100 ${item.published ? 'text-slate-400 hover:text-slate-600' : 'text-red-400 hover:text-red-600'}`}>{item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === programs.length - 1} className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400"><ChevronDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => startEdit(item)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Editează rapid"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { setItemToDelete(item); setDeleteDialogOpen(true); }} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600" title="Șterge"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1 pl-[52px]">
                  {!item.published && <span className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full">Ascuns</span>}
                  {item.show_in_cetateni && <span className="px-1.5 py-0.5 text-[10px] bg-green-100 text-green-700 rounded-full">Cetățeni</span>}
                  {item.show_in_firme && <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded-full">Firme</span>}
                  {item.show_in_primarie && <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">Primărie</span>}
                  {item.show_in_turist && <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full">Turist</span>}
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
