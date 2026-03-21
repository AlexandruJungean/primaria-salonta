'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Save, ExternalLink } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, toast } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { IconPicker } from '@/components/admin/icon-picker';
import { ImageField } from '@/components/admin/image-field';

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'url' | 'textarea' | 'checkbox' | 'image' | 'icon';
  placeholder?: string;
  required?: boolean;
}

interface StructuredPageEditorProps {
  pageSlug: string;
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  dataKey: string;
  fields: FieldConfig[];
  itemLabel?: string;
}

export function StructuredPageEditor({
  pageSlug,
  title,
  description,
  breadcrumbs,
  dataKey,
  fields,
  itemLabel = 'element',
}: StructuredPageEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/pages?slug=${pageSlug}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setItems(data.structured_data?.[dataKey] || []);
      setPageContent(data.content || '');
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  }, [pageSlug, dataKey]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await adminFetch(`/api/admin/pages?slug=${pageSlug}`, {
        method: 'PATCH',
        body: JSON.stringify({
          structured_data: { [dataKey]: items },
          content: pageContent,
        }),
      });
      if (!response.ok) throw new Error('Failed to save');
      toast.success('Salvat cu succes');
    } catch {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newItem: any = {};
    fields.forEach(f => {
      newItem[f.key] = f.type === 'checkbox' ? false : '';
    });
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateItem = (index: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    setItems(newItems);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          <AdminButton onClick={saveData} disabled={saving} icon={Save}>
            {saving ? 'Se salvează...' : 'Salvează'}
          </AdminButton>
        }
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <AdminCard key={index}>
            <div className="flex gap-3">
              {/* Reorder + delete */}
              <div className="flex flex-col gap-0.5 pt-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400 hover:text-slate-600"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400 hover:text-slate-600"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 mt-1"
                  title="Șterge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.map(field => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    {field.type === 'image' ? (
                      <ImageField
                        value={item[field.key] || ''}
                        onChange={val => updateItem(index, field.key, val)}
                        label={field.label}
                      />
                    ) : field.type === 'icon' ? (
                      <IconPicker
                        value={item[field.key] || 'fileText'}
                        onChange={val => updateItem(index, field.key, val)}
                        label={field.label}
                        compact
                      />
                    ) : field.type === 'textarea' ? (
                      <>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                        <textarea
                          value={item[field.key] || ''}
                          onChange={e => updateItem(index, field.key, e.target.value)}
                          rows={2}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </>
                    ) : field.type === 'checkbox' ? (
                      <>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={!!item[field.key]}
                            onChange={e => updateItem(index, field.key, e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600"
                          />
                          <span className="text-sm text-slate-600">Da</span>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                        <div className="flex gap-1">
                          <input
                            type={field.type === 'url' ? 'url' : 'text'}
                            value={item[field.key] || ''}
                            onChange={e => updateItem(index, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {field.type === 'url' && item[field.key] && (
                            <a href={item[field.key]} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-500 hover:text-blue-700 shrink-0">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {items.length === 0 && (
        <AdminCard>
          <div className="text-center py-8 text-slate-500">
            Nu există {itemLabel}. Adaugă primul.
          </div>
        </AdminCard>
      )}

      <div className="mt-4 flex justify-between">
        <AdminButton onClick={addItem} variant="secondary" icon={Plus}>
          Adaugă {itemLabel}
        </AdminButton>
        <AdminButton onClick={saveData} disabled={saving} icon={Save}>
          {saving ? 'Se salvează...' : 'Salvează totul'}
        </AdminButton>
      </div>
    </div>
  );
}
