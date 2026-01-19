'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Trash2,
  Loader2,
  Plus,
  X,
  GripVertical,
  Users,
  FileText,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { cn } from '@/lib/utils/cn';

interface SectionData {
  title: string;
  legalRef: string;
  penalty: string;
  description: string;
  docs: string[];
  notes: string[];
}

const DEPARTMENTS = [
  { id: 'evidenta', label: 'Compartimentul de Evidență', prefix: 'evidenta_', icon: Users },
  { id: 'stare-civila', label: 'Compartimentul de Stare Civilă', prefix: 'stare-civila_', icon: FileText },
];

const PAGE_KEY = 'seip';

export default function SeipEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isNew = id === 'nou';
  const defaultDept = searchParams.get('dept') || 'evidenta';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);

  // Form state
  const [department, setDepartment] = useState(defaultDept);
  const [sectionId, setSectionId] = useState('');
  const [data, setData] = useState<SectionData>({
    title: '',
    legalRef: '',
    penalty: '',
    description: '',
    docs: [],
    notes: [],
  });
  
  // New item inputs
  const [newDoc, setNewDoc] = useState('');
  const [newNote, setNewNote] = useState('');

  // Fetch existing section
  const fetchSection = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/page-content?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const item = await response.json();
      setExistingId(item.id);
      setSortOrder(item.sort_order);
      
      // Parse content_key to get department
      const deptPrefix = DEPARTMENTS.find(d => item.content_key.startsWith(d.prefix));
      if (deptPrefix) {
        setDepartment(deptPrefix.id);
        setSectionId(item.content_key.replace(deptPrefix.prefix, ''));
      }
      
      // Parse content
      try {
        const parsed = JSON.parse(item.content);
        setData({
          title: parsed.title || '',
          legalRef: parsed.legalRef || '',
          penalty: parsed.penalty || '',
          description: parsed.description || '',
          docs: parsed.docs || [],
          notes: parsed.notes || [],
        });
      } catch {
        toast.error('Eroare', 'Conținutul secțiunii este invalid');
      }
    } catch (error) {
      console.error('Error fetching section:', error);
      toast.error('Eroare', 'Nu s-a putut încărca secțiunea');
      router.push('/admin/informatii-publice/seip');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  // Add document
  const addDoc = () => {
    if (!newDoc.trim()) return;
    setData(prev => ({ ...prev, docs: [...prev.docs, newDoc.trim()] }));
    setNewDoc('');
  };

  // Remove document
  const removeDoc = (index: number) => {
    setData(prev => ({ ...prev, docs: prev.docs.filter((_, i) => i !== index) }));
  };

  // Update document
  const updateDoc = (index: number, value: string) => {
    setData(prev => ({
      ...prev,
      docs: prev.docs.map((d, i) => i === index ? value : d),
    }));
  };

  // Add note
  const addNote = () => {
    if (!newNote.trim()) return;
    setData(prev => ({ ...prev, notes: [...prev.notes, newNote.trim()] }));
    setNewNote('');
  };

  // Remove note
  const removeNote = (index: number) => {
    setData(prev => ({ ...prev, notes: prev.notes.filter((_, i) => i !== index) }));
  };

  // Update note
  const updateNote = (index: number, value: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map((n, i) => i === index ? value : n),
    }));
  };

  // Generate section ID from title
  const generateSectionId = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  // Save section
  const handleSave = async () => {
    if (!data.title.trim()) {
      toast.error('Eroare', 'Titlul este obligatoriu');
      return;
    }
    
    setSaving(true);
    
    try {
      const deptConfig = DEPARTMENTS.find(d => d.id === department);
      const contentKey = deptConfig?.prefix + (sectionId || generateSectionId(data.title));
      
      const contentData = {
        title: data.title,
        legalRef: data.legalRef || undefined,
        penalty: data.penalty || undefined,
        description: data.description || undefined,
        docs: data.docs,
        notes: data.notes,
      };
      
      if (isNew) {
        // Get max sort order for this department
        const response = await adminFetch(`/api/admin/page-content?page_key=${PAGE_KEY}`);
        const existingItems = await response.json();
        const deptItems = existingItems.filter((i: { content_key: string }) => i.content_key.startsWith(deptConfig?.prefix || ''));
        const maxOrder = deptItems.reduce((max: number, i: { sort_order: number }) => Math.max(max, i.sort_order), 0);
        
        await adminFetch('/api/admin/page-content', {
          method: 'POST',
          body: JSON.stringify({
            page_key: PAGE_KEY,
            content_key: contentKey,
            content: JSON.stringify(contentData),
            content_type: 'json',
            sort_order: maxOrder + 1,
          }),
        });
      } else {
        await adminFetch(`/api/admin/page-content?id=${existingId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            content: JSON.stringify(contentData),
          }),
        });
      }
      
      toast.success('Succes', isNew ? 'Secțiunea a fost creată' : 'Secțiunea a fost actualizată');
      router.push('/admin/informatii-publice/seip');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Eroare', 'Nu s-a putut salva secțiunea');
    } finally {
      setSaving(false);
    }
  };

  // Delete section
  const handleDelete = async () => {
    try {
      await adminFetch(`/api/admin/page-content?id=${existingId}`, {
        method: 'DELETE',
      });
      
      toast.success('Succes', 'Secțiunea a fost ștearsă');
      router.push('/admin/informatii-publice/seip');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge secțiunea');
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title={isNew ? 'Secțiune Nouă' : 'Editează Secțiune'}
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'SEIP', href: '/admin/informatii-publice/seip' },
            { label: isNew ? 'Nou' : 'Editează' },
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
        title={isNew ? 'Secțiune Nouă SEIP' : 'Editează Secțiune SEIP'}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'SEIP', href: '/admin/informatii-publice/seip' },
          { label: isNew ? 'Nou' : 'Editează' },
        ]}
        actions={
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/informatii-publice/seip')}
            >
              Înapoi
            </AdminButton>
            {!isNew && (
              <AdminButton
                variant="danger"
                icon={Trash2}
                onClick={() => setShowDeleteDialog(true)}
              >
                Șterge
              </AdminButton>
            )}
            <AdminButton
              icon={Save}
              onClick={handleSave}
              loading={saving}
            >
              Salvează
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <AdminCard title="Informații Generale">
            <div className="space-y-4">
              {/* Department Selection */}
              {isNew && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compartiment *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {DEPARTMENTS.map((dept) => {
                      const Icon = dept.icon;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => setDepartment(dept.id)}
                          className={cn(
                            'p-4 rounded-lg border-2 text-left transition-all',
                            department === dept.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Icon className={cn(
                            'w-5 h-5 mb-2',
                            department === dept.id ? 'text-blue-600' : 'text-gray-400'
                          )} />
                          <p className={cn(
                            'font-medium text-sm',
                            department === dept.id ? 'text-blue-700' : 'text-gray-900'
                          )}>
                            {dept.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <AdminInput
                label="Titlu secțiune *"
                value={data.title}
                onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="ex: Prima eliberare"
              />

              <AdminInput
                label="Referință legală (opțional)"
                value={data.legalRef}
                onChange={(e) => setData(prev => ({ ...prev, legalRef: e.target.value }))}
                placeholder="ex: Conf. art. 13 alin. (2) din OUG 97/2005"
              />

              <AdminInput
                label="Sancțiune (opțional)"
                value={data.penalty}
                onChange={(e) => setData(prev => ({ ...prev, penalty: e.target.value }))}
                placeholder="ex: Sancțiunea contravențională: 25-50 RON"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descriere (opțional)
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Text descriptiv care apare înainte de lista de acte..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </AdminCard>

          {/* Required Documents */}
          <AdminCard title={`Acte Necesare (${data.docs.length})`}>
            <div className="space-y-2">
              {data.docs.map((doc, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg group">
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0 mt-2 cursor-grab" />
                  <textarea
                    value={doc}
                    onChange={(e) => updateDoc(index, e.target.value)}
                    rows={2}
                    className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeDoc(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Add new document */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <textarea
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  rows={2}
                  placeholder="Adaugă act necesar..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addDoc();
                    }
                  }}
                />
                <AdminButton
                  size="sm"
                  icon={Plus}
                  onClick={addDoc}
                  disabled={!newDoc.trim()}
                >
                  Adaugă
                </AdminButton>
              </div>
            </div>
          </AdminCard>

          {/* Notes */}
          <AdminCard title={`Note (${data.notes.length})`}>
            <div className="space-y-2">
              {data.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg group">
                  <GripVertical className="w-4 h-4 text-blue-300 shrink-0 mt-2 cursor-grab" />
                  <textarea
                    value={note}
                    onChange={(e) => updateNote(index, e.target.value)}
                    rows={2}
                    className="flex-1 px-2 py-1 text-sm border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                  <button
                    onClick={() => removeNote(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Add new note */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                  placeholder="Adaugă notă..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                />
                <AdminButton
                  size="sm"
                  icon={Plus}
                  onClick={addNote}
                  disabled={!newNote.trim()}
                >
                  Adaugă
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Rezumat">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Compartiment:</span>
                <span className="font-medium">
                  {DEPARTMENTS.find(d => d.id === department)?.label.replace('Compartimentul de ', '') || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Acte necesare:</span>
                <span className="font-medium">{data.docs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Note:</span>
                <span className="font-medium">{data.notes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sancțiune:</span>
                <span className="font-medium">{data.penalty ? 'Da' : 'Nu'}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Sfaturi">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Titlu:</strong> Numele serviciului (ex: &quot;Prima eliberare&quot;)</p>
              <p><strong>Referință legală:</strong> Articolul din lege</p>
              <p><strong>Sancțiune:</strong> Amenda aplicabilă</p>
              <p><strong>Acte necesare:</strong> Lista documentelor necesare</p>
              <p><strong>Note:</strong> Observații importante</p>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete confirmation */}
      <AdminConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Șterge Secțiune"
        message={`Ești sigur că vrei să ștergi secțiunea "${data.title}"?`}
        confirmLabel="Șterge"
        variant="danger"
      />
    </div>
  );
}
