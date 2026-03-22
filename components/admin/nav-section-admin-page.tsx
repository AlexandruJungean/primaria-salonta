'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown, Pencil, X, Check, Eye, EyeOff, Lock, Trash2, Plus } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, AdminConfirmDialog, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { getIcon } from '@/lib/constants/icon-map';
import { IconPicker } from '@/components/admin/icon-picker';

interface NavPage {
  id: string;
  section_id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  public_path: string | null;
  admin_path: string;
  sort_order: number;
  is_active: boolean;
  is_custom?: boolean;
  page_id?: string | null;
  show_in_cetateni: boolean;
  show_in_firme: boolean;
  show_in_primarie: boolean;
  show_in_turist: boolean;
}

interface NavSection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  is_custom?: boolean;
}

interface NavSectionAdminPageProps {
  sectionSlug: string;
  breadcrumbLabel: string;
  allowCustomPages?: boolean;
}

const NAV_GROUPS = [
  { key: 'show_in_cetateni' as const, label: 'Cetățeni' },
  { key: 'show_in_firme' as const, label: 'Firme' },
  { key: 'show_in_primarie' as const, label: 'Primărie' },
  { key: 'show_in_turist' as const, label: 'Turist' },
];

export function NavSectionAdminPage({ sectionSlug, breadcrumbLabel, allowCustomPages = true }: NavSectionAdminPageProps) {
  const router = useRouter();
  const [section, setSection] = useState<NavSection | null>(null);
  const [pages, setPages] = useState<NavPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NavPage>>({});
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NavPage | null>(null);
  const [editingSection, setEditingSection] = useState(false);
  const [sectionForm, setSectionForm] = useState({ title: '', icon: '' });
  const [savingSection, setSavingSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/navigation?section=${sectionSlug}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSection(data.section);
      setPages(data.pages);
    } catch (error) {
      console.error('Error loading section data:', error);
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  }, [sectionSlug]);

  useEffect(() => { loadData(); }, [loadData]);

  const startEditSection = () => {
    if (!section) return;
    setSectionForm({ title: section.title, icon: section.icon });
    setEditingSection(true);
  };

  const saveSection = async () => {
    if (!section) return;
    setSavingSection(true);
    try {
      const response = await adminFetch(`/api/admin/navigation?id=${section.id}&type=section`, {
        method: 'PATCH',
        body: JSON.stringify(sectionForm),
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('Grupul a fost actualizat');
      setEditingSection(false);
      await loadData();
    } catch {
      toast.error('Eroare la salvare');
    } finally {
      setSavingSection(false);
    }
  };

  const deleteSection = async () => {
    if (!section) return;
    try {
      const response = await adminFetch(`/api/admin/navigation?id=${section.id}&type=section`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('Grupul a fost șters');
      router.push('/admin');
    } catch {
      toast.error('Eroare la ștergerea grupului');
    }
  };

  const createCustomPage = async () => {
    if (!section) return;
    setCreating(true);
    try {
      const maxOrder = pages.reduce((max, p) => Math.max(max, p.sort_order), 0);
      const response = await adminFetch('/api/admin/navigation', {
        method: 'POST',
        body: JSON.stringify({
          is_custom: true,
          section_id: section.id,
          title: 'Pagină nouă',
          sort_order: maxOrder + 1,
        }),
      });
      if (!response.ok) throw new Error('Failed to create');
      const result = await response.json();
      toast.success('Pagina a fost creată');
      router.push(`/admin/pagini-custom/${result.page.id}`);
    } catch {
      toast.error('Eroare la crearea paginii');
    } finally {
      setCreating(false);
    }
  };

  const deleteCustomPage = async (page: NavPage) => {
    try {
      const response = await adminFetch(`/api/admin/navigation?id=${page.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Pagina a fost ștearsă');
      setDeleteTarget(null);
      await loadData();
    } catch {
      toast.error('Eroare la ștergerea paginii');
    }
  };

  const startEdit = (page: NavPage) => {
    setEditingId(page.id);
    setEditForm({
      title: page.title,
      description: page.description || '',
      icon: page.icon,
      is_active: page.is_active,
      show_in_cetateni: page.show_in_cetateni,
      show_in_firme: page.show_in_firme,
      show_in_primarie: page.show_in_primarie,
      show_in_turist: page.show_in_turist,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const response = await adminFetch(`/api/admin/navigation?id=${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error('Failed to save');
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

  const toggleVisibility = async (page: NavPage) => {
    try {
      const response = await adminFetch(`/api/admin/navigation?id=${page.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !page.is_active }),
      });
      if (!response.ok) throw new Error('Failed to toggle');
      toast.success(page.is_active ? 'Pagina a fost ascunsă' : 'Pagina a fost activată');
      await loadData();
    } catch {
      toast.error('Eroare la schimbarea vizibilității');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newPages = [...pages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newPages.length) return;

    [newPages[index], newPages[swapIndex]] = [newPages[swapIndex], newPages[index]];
    setPages(newPages);

    try {
      const response = await adminFetch('/api/admin/navigation/reorder', {
        method: 'PUT',
        body: JSON.stringify({ orderedIds: newPages.map(p => p.id) }),
      });
      if (!response.ok) throw new Error('Failed to reorder');
    } catch {
      toast.error('Eroare la reordonare');
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!section) {
    return <div className="text-center py-20 text-slate-500">Secțiunea nu a fost găsită.</div>;
  }

  return (
    <div>
      <AdminPageHeader
        title={section.title}
        description={section.description || undefined}
        breadcrumbs={[{ label: breadcrumbLabel }]}
        actions={
          <div className="flex items-center gap-2">
            {section.is_custom && (
              <>
                <AdminButton onClick={startEditSection} variant="secondary" icon={Pencil}>
                  Editează grup
                </AdminButton>
                <button
                  onClick={() => setShowDeleteSection(true)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Șterge grupul"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            {allowCustomPages && (
              <AdminButton onClick={createCustomPage} disabled={creating} icon={Plus}>
                {creating ? 'Se creează...' : 'Adaugă Pagină'}
              </AdminButton>
            )}
          </div>
        }
      />

      {/* Section edit form */}
      {editingSection && (
        <AdminCard className="border-blue-300 ring-2 ring-blue-100 mb-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Editează grupul</h3>
            <div className="flex items-end gap-3">
              <IconPicker
                value={sectionForm.icon}
                onChange={icon => setSectionForm(f => ({ ...f, icon }))}
                label="Icon"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nume grup</label>
                <input
                  type="text"
                  value={sectionForm.title}
                  onChange={e => setSectionForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setEditingSection(false)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" /> Anulează
              </button>
              <button
                onClick={saveSection}
                disabled={savingSection}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> {savingSection ? 'Se salvează...' : 'Salvează'}
              </button>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Edit form */}
      {editingId && (() => {
        const EditIcon = getIcon(editForm.icon || '');
        return (
        <AdminCard className="border-blue-300 ring-2 ring-blue-100 mb-6">
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <IconPicker
                value={editForm.icon || ''}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Descriere (opțional)</label>
              <input
                type="text"
                value={editForm.description || ''}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descriere scurtă..."
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vizibilitate</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is_active !== false}
                    onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Pagina este activă</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vizibil în meniul public</label>
                <div className="flex flex-wrap gap-4">
                  {NAV_GROUPS.map(group => (
                    <label key={group.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editForm[group.key]}
                        onChange={e => setEditForm(f => ({ ...f, [group.key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600">{group.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" /> Anulează
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> {saving ? 'Se salvează...' : 'Salvează'}
              </button>
            </div>
          </div>
        </AdminCard>
        );
      })()}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page, index) => {
          const PageIcon = getIcon(page.icon);

          return (
            <AdminCard
              key={page.id}
              className={`transition-shadow ${page.is_active ? 'hover:shadow-md' : 'opacity-50'}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <Link href={page.admin_path} className="flex items-start gap-3 flex-1 min-w-0 group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${page.is_active ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-slate-100'}`}>
                      <PageIcon className={`w-5 h-5 ${page.is_active ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className={`text-sm font-semibold leading-tight transition-colors ${page.is_active ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-500'}`}>
                        {page.title}
                      </h3>
                      {page.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{page.description}</p>
                      )}
                    </div>
                  </Link>
                  {/* Actions */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => toggleVisibility(page)}
                      className={`p-1 rounded hover:bg-slate-100 ${page.is_active ? 'text-slate-400 hover:text-slate-600' : 'text-red-400 hover:text-red-600'}`}
                      title={page.is_active ? 'Ascunde pagina' : 'Activează pagina'}
                    >
                      {page.is_active
                        ? <Eye className="w-3.5 h-3.5" />
                        : <EyeOff className="w-3.5 h-3.5" />
                      }
                    </button>
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed text-slate-400 hover:text-slate-600"
                      title="Mută sus"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === pages.length - 1}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed text-slate-400 hover:text-slate-600"
                      title="Mută jos"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startEdit(page)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                      title="Editează"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {page.is_custom ? (
                      <button
                        onClick={() => setDeleteTarget(page)}
                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                        title="Șterge pagina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div
                        className="p-1 text-slate-300 cursor-default"
                        title="Nu poate fi șters"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1 pl-[52px]">
                  {!page.is_active && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full">Ascuns</span>
                  )}
                  {page.show_in_cetateni && <span className="px-1.5 py-0.5 text-[10px] bg-green-100 text-green-700 rounded-full">Cetățeni</span>}
                  {page.show_in_firme && <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded-full">Firme</span>}
                  {page.show_in_primarie && <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">Primărie</span>}
                  {page.show_in_turist && <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full">Turist</span>}
                </div>
              </div>
            </AdminCard>
          );
        })}

        {/* Add page card */}
        {allowCustomPages && (
          <button
            onClick={createCustomPage}
            disabled={creating}
            className="border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center gap-2 py-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">
              {creating ? 'Se creează...' : 'Adaugă pagină'}
            </span>
          </button>
        )}
      </div>

      {pages.length === 0 && (
        <AdminCard>
          <div className="text-center py-8 text-slate-500">
            Nu există pagini în această secțiune.
          </div>
        </AdminCard>
      )}

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteCustomPage(deleteTarget);
        }}
        title="Șterge pagina personalizată?"
        message={`Ești sigur că vrei să ștergi pagina „${deleteTarget?.title}"? Conținutul paginii va fi șters definitiv.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
      />

      <AdminConfirmDialog
        isOpen={showDeleteSection}
        onClose={() => setShowDeleteSection(false)}
        onConfirm={deleteSection}
        title="Șterge grupul de pagini?"
        message={`Ești sigur că vrei să ștergi grupul „${section?.title}"? Toate paginile din grup vor fi șterse definitiv.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
      />
    </div>
  );
}
