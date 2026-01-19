'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  HardHat,
  Loader2,
  Trash2,
  Edit2,
  Save,
  X,
  GripVertical,
  FileText,
  CheckCircle,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminInput,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface ContentItem {
  id: string;
  page_key: string;
  content_key: string;
  content: string;
  content_type: string;
  sort_order: number;
  is_active: boolean;
}

const PAGE_KEY = 'receptie-lucrari';

export default function ReceptieLucrariAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Content state
  const [section1Title, setSection1Title] = useState<ContentItem | null>(null);
  const [section1Items, setSection1Items] = useState<ContentItem[]>([]);
  const [section2Intro, setSection2Intro] = useState<ContentItem | null>(null);
  const [section2Items, setSection2Items] = useState<ContentItem[]>([]);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newItem, setNewItem] = useState<{ section: 'section1' | 'section2'; content: string } | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/page-content?page_key=${PAGE_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data: ContentItem[] = await response.json();
      
      // Parse content
      setSection1Title(data.find(c => c.content_key === 'section1_title') || null);
      setSection1Items(
        data
          .filter(c => c.content_key.startsWith('section1_item_'))
          .sort((a, b) => a.sort_order - b.sort_order)
      );
      setSection2Intro(data.find(c => c.content_key === 'section2_intro') || null);
      setSection2Items(
        data
          .filter(c => c.content_key.startsWith('section2_item_'))
          .sort((a, b) => a.sort_order - b.sort_order)
      );
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Eroare', 'Nu s-a putut încărca conținutul');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Save edited item
  const handleSaveEdit = async (item: ContentItem) => {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/page-content?id=${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: editContent }),
      });
      
      toast.success('Succes', 'Conținutul a fost actualizat');
      setEditingId(null);
      fetchContent();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Eroare', 'Nu s-a putut salva');
    } finally {
      setSaving(false);
    }
  };

  // Create section title if it doesn't exist
  const handleCreateSectionTitle = async (section: 'section1' | 'section2', content: string) => {
    setSaving(true);
    try {
      const contentKey = section === 'section1' ? 'section1_title' : 'section2_intro';
      
      await adminFetch('/api/admin/page-content', {
        method: 'POST',
        body: JSON.stringify({
          page_key: PAGE_KEY,
          content_key: contentKey,
          content,
          content_type: 'text',
          sort_order: 0,
        }),
      });
      
      toast.success('Succes', 'Titlul a fost creat');
      fetchContent();
    } catch (error) {
      console.error('Error creating:', error);
      toast.error('Eroare', 'Nu s-a putut crea');
    } finally {
      setSaving(false);
    }
  };

  // Add new item
  const handleAddItem = async () => {
    if (!newItem || !newItem.content.trim()) return;
    
    setSaving(true);
    try {
      const items = newItem.section === 'section1' ? section1Items : section2Items;
      const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
      const nextIndex = items.length + 1;
      
      await adminFetch('/api/admin/page-content', {
        method: 'POST',
        body: JSON.stringify({
          page_key: PAGE_KEY,
          content_key: `${newItem.section}_item_${nextIndex}`,
          content: newItem.content,
          content_type: 'text',
          sort_order: nextOrder,
        }),
      });
      
      toast.success('Succes', 'Elementul a fost adăugat');
      setNewItem(null);
      fetchContent();
    } catch (error) {
      console.error('Error adding:', error);
      toast.error('Eroare', 'Nu s-a putut adăuga');
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await adminFetch(`/api/admin/page-content?id=${deleteItem.id}`, {
        method: 'DELETE',
      });
      
      toast.success('Succes', 'Elementul a fost șters');
      setDeleteItem(null);
      fetchContent();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge');
    }
  };

  // Render editable item
  const renderItem = (item: ContentItem) => {
    const isEditing = editingId === item.id;
    
    return (
      <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0 mt-1 cursor-grab" />
        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <AdminButton
                size="sm"
                icon={Save}
                onClick={() => handleSaveEdit(item)}
                loading={saving}
              >
                Salvează
              </AdminButton>
              <AdminButton
                size="sm"
                variant="secondary"
                icon={X}
                onClick={() => setEditingId(null)}
              >
                Anulează
              </AdminButton>
            </div>
          </div>
        ) : (
          <>
            <p className="flex-1 text-gray-700">{item.content}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setEditContent(item.content);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteItem(item)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Recepție Lucrări"
          description="Gestionează conținutul paginii"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Recepție Lucrări' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Recepție Lucrări"
        description="Gestionează conținutul paginii de recepție lucrări"
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Recepție Lucrări' },
        ]}
      />

      {/* Info */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <HardHat className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Despre această pagină:</p>
            <p className="text-amber-700">
              Aici poți edita conținutul paginii de recepție lucrări de construcții. 
              Adaugă, modifică sau șterge elementele din fiecare secțiune.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1 - Initial Documents */}
      <AdminCard className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <HardHat className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secțiunea 1: Documente inițiale</h3>
                <p className="text-sm text-gray-500">Documente pentru depunere la registratură</p>
              </div>
            </div>
            <AdminButton
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => setNewItem({ section: 'section1', content: '' })}
            >
              Adaugă
            </AdminButton>
          </div>
        </div>
        
        <div className="p-4">
          {/* Section Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Titlul secțiunii:</label>
            {section1Title ? (
              <div className="flex items-center gap-2">
                {editingId === section1Title.id ? (
                  <div className="flex-1 space-y-2">
                    <AdminInput
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <AdminButton
                        size="sm"
                        icon={Save}
                        onClick={() => handleSaveEdit(section1Title)}
                        loading={saving}
                      >
                        Salvează
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        icon={X}
                        onClick={() => setEditingId(null)}
                      >
                        Anulează
                      </AdminButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 text-gray-900 font-medium">{section1Title.content}</p>
                    <button
                      onClick={() => {
                        setEditingId(section1Title.id);
                        setEditContent(section1Title.content);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <AdminInput
                  placeholder="Titlul secțiunii..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1"
                />
                <AdminButton
                  size="sm"
                  onClick={() => {
                    handleCreateSectionTitle('section1', editContent);
                    setEditContent('');
                  }}
                  disabled={!editContent.trim()}
                >
                  Creează
                </AdminButton>
              </div>
            )}
          </div>
          
          {/* Items */}
          <div className="space-y-2">
            {section1Items.map(renderItem)}
            
            {/* New item form */}
            {newItem?.section === 'section1' && (
              <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <textarea
                  placeholder="Textul noului element..."
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  <AdminButton
                    size="sm"
                    icon={Plus}
                    onClick={handleAddItem}
                    loading={saving}
                    disabled={!newItem.content.trim()}
                  >
                    Adaugă
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    icon={X}
                    onClick={() => setNewItem(null)}
                  >
                    Anulează
                  </AdminButton>
                </div>
              </div>
            )}
            
            {section1Items.length === 0 && !newItem && (
              <p className="text-gray-400 text-sm py-4 text-center">
                Nu există elemente. Apasă &quot;Adaugă&quot; pentru a crea primul element.
              </p>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Section 2 - On-Site Documents */}
      <AdminCard className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secțiunea 2: Documente pentru teren</h3>
                <p className="text-sm text-gray-500">Documente prezentate pe teren la recepție</p>
              </div>
            </div>
            <AdminButton
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => setNewItem({ section: 'section2', content: '' })}
            >
              Adaugă
            </AdminButton>
          </div>
        </div>
        
        <div className="p-4">
          {/* Section Intro */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Text introductiv (opțional):</label>
            {section2Intro ? (
              <div className="flex items-start gap-2">
                {editingId === section2Intro.id ? (
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <AdminButton
                        size="sm"
                        icon={Save}
                        onClick={() => handleSaveEdit(section2Intro)}
                        loading={saving}
                      >
                        Salvează
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        icon={X}
                        onClick={() => setEditingId(null)}
                      >
                        Anulează
                      </AdminButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 text-gray-700 text-sm">{section2Intro.content}</p>
                    <button
                      onClick={() => {
                        setEditingId(section2Intro.id);
                        setEditContent(section2Intro.content);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <textarea
                  placeholder="Text introductiv pentru secțiune..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <AdminButton
                  size="sm"
                  onClick={() => {
                    handleCreateSectionTitle('section2', editContent);
                    setEditContent('');
                  }}
                  disabled={!editContent.trim()}
                >
                  Creează
                </AdminButton>
              </div>
            )}
          </div>
          
          {/* Items */}
          <div className="space-y-2">
            {section2Items.map(renderItem)}
            
            {/* New item form */}
            {newItem?.section === 'section2' && (
              <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <textarea
                  placeholder="Textul noului element..."
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  <AdminButton
                    size="sm"
                    icon={Plus}
                    onClick={handleAddItem}
                    loading={saving}
                    disabled={!newItem.content.trim()}
                  >
                    Adaugă
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    icon={X}
                    onClick={() => setNewItem(null)}
                  >
                    Anulează
                  </AdminButton>
                </div>
              </div>
            )}
            
            {section2Items.length === 0 && !newItem && (
              <p className="text-gray-400 text-sm py-4 text-center">
                Nu există elemente. Apasă &quot;Adaugă&quot; pentru a crea primul element.
              </p>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Delete confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Șterge Element"
        message={`Ești sigur că vrei să ștergi acest element?`}
        confirmLabel="Șterge"
        variant="danger"
      />
    </div>
  );
}
