'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Building2,
  FileText,
  Plus, 
  Edit2, 
  Trash2,
  Save,
  X,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Office {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  published: boolean;
}

interface RequiredDocument {
  id: string;
  office_id: string;
  title: string;
  items: string[];
  note: string | null;
  sort_order: number;
  published: boolean;
}

const ICON_OPTIONS = [
  { value: 'building2', label: 'Clădire' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'wheat', label: 'Agricol' },
  { value: 'briefcase', label: 'Servicii' },
  { value: 'users', label: 'Persoane' },
  { value: 'scale', label: 'Juridic' },
  { value: 'home', label: 'Casă' },
  { value: 'car', label: 'Auto' },
  { value: 'leaf', label: 'Mediu' },
  { value: 'fileText', label: 'Document' },
];

const COLOR_OPTIONS = [
  { value: 'primary', label: 'Albastru (Primary)' },
  { value: 'emerald', label: 'Verde (Emerald)' },
  { value: 'amber', label: 'Portocaliu (Amber)' },
  { value: 'blue', label: 'Albastru deschis' },
  { value: 'purple', label: 'Mov' },
  { value: 'rose', label: 'Roz' },
  { value: 'slate', label: 'Gri' },
];

type TabType = 'offices' | 'documents';

export default function ActeNecesareAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('offices');
  
  // Offices state
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [isNewOffice, setIsNewOffice] = useState(false);
  
  // Documents state
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [editingDocument, setEditingDocument] = useState<RequiredDocument | null>(null);
  const [isNewDocument, setIsNewDocument] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'office' | 'document'; id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Saving state
  const [saving, setSaving] = useState(false);

  // Load offices
  const loadOffices = useCallback(async () => {
    setLoadingOffices(true);
    try {
      const response = await adminFetch('/api/admin/required-documents?type=offices');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setOffices(data || []);
      if (data.length > 0 && !selectedOfficeId) {
        setSelectedOfficeId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading offices:', error);
      toast.error('Eroare', 'Nu s-au putut încărca birourile.');
    } finally {
      setLoadingOffices(false);
    }
  }, [selectedOfficeId]);

  // Load documents for selected office
  const loadDocuments = useCallback(async () => {
    if (!selectedOfficeId) return;
    
    setLoadingDocuments(true);
    try {
      const response = await adminFetch(`/api/admin/required-documents?type=documents&office_id=${selectedOfficeId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Eroare', 'Nu s-au putut încărca documentele.');
    } finally {
      setLoadingDocuments(false);
    }
  }, [selectedOfficeId]);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  useEffect(() => {
    if (activeTab === 'documents' && selectedOfficeId) {
      loadDocuments();
    }
  }, [activeTab, selectedOfficeId, loadDocuments]);

  // Office handlers
  const handleNewOffice = () => {
    setEditingOffice({
      id: '',
      name: '',
      slug: '',
      description: '',
      icon: 'building2',
      color: 'primary',
      sort_order: offices.length + 1,
      published: true,
    });
    setIsNewOffice(true);
  };

  const handleEditOffice = (office: Office) => {
    setEditingOffice({ ...office });
    setIsNewOffice(false);
  };

  const handleSaveOffice = async () => {
    if (!editingOffice) return;
    
    if (!editingOffice.name.trim()) {
      toast.error('Eroare', 'Numele biroului este obligatoriu.');
      return;
    }

    setSaving(true);
    try {
      const slug = editingOffice.slug || editingOffice.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...officeWithoutId } = editingOffice;
      const payload = {
        ...officeWithoutId,
        slug,
      };

      let response;
      if (isNewOffice) {
        response = await adminFetch('/api/admin/required-documents?type=offices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await adminFetch(`/api/admin/required-documents?type=offices&id=${editingOffice.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error('Failed to save');
      
      toast.success('Salvat', isNewOffice ? 'Biroul a fost creat.' : 'Biroul a fost actualizat.');
      setEditingOffice(null);
      loadOffices();
    } catch (error) {
      console.error('Error saving office:', error);
      toast.error('Eroare', 'Nu s-a putut salva biroul.');
    } finally {
      setSaving(false);
    }
  };

  // Document handlers
  const handleNewDocument = () => {
    if (!selectedOfficeId) {
      toast.error('Eroare', 'Selectați un birou mai întâi.');
      return;
    }
    setEditingDocument({
      id: '',
      office_id: selectedOfficeId,
      title: '',
      items: [''],
      note: '',
      sort_order: documents.length + 1,
      published: true,
    });
    setIsNewDocument(true);
  };

  const handleEditDocument = (doc: RequiredDocument) => {
    setEditingDocument({ 
      ...doc,
      items: doc.items.length > 0 ? doc.items : [''],
    });
    setIsNewDocument(false);
  };

  const handleSaveDocument = async () => {
    if (!editingDocument) return;
    
    if (!editingDocument.title.trim()) {
      toast.error('Eroare', 'Titlul este obligatoriu.');
      return;
    }

    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...docWithoutId } = editingDocument;
      const payload = {
        ...docWithoutId,
        items: editingDocument.items.filter(item => item.trim() !== ''),
        note: editingDocument.note?.trim() || null,
      };

      let response;
      if (isNewDocument) {
        response = await adminFetch('/api/admin/required-documents?type=documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await adminFetch(`/api/admin/required-documents?type=documents&id=${editingDocument.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error('Failed to save');
      
      toast.success('Salvat', isNewDocument ? 'Secțiunea a fost creată.' : 'Secțiunea a fost actualizată.');
      setEditingDocument(null);
      loadDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare', 'Nu s-a putut salva.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    if (!editingDocument) return;
    setEditingDocument({
      ...editingDocument,
      items: [...editingDocument.items, ''],
    });
  };

  const handleUpdateItem = (index: number, value: string) => {
    if (!editingDocument) return;
    const newItems = [...editingDocument.items];
    newItems[index] = value;
    setEditingDocument({ ...editingDocument, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    if (!editingDocument) return;
    const newItems = editingDocument.items.filter((_, i) => i !== index);
    setEditingDocument({ ...editingDocument, items: newItems.length > 0 ? newItems : [''] });
  };

  // Delete handlers
  const confirmDelete = (type: 'office' | 'document', id: string, name: string) => {
    setItemToDelete({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(
        `/api/admin/required-documents?type=${itemToDelete.type === 'office' ? 'offices' : 'documents'}&id=${itemToDelete.id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete');
      
      toast.success('Șters', `${itemToDelete.type === 'office' ? 'Biroul' : 'Secțiunea'} a fost șters.`);
      
      if (itemToDelete.type === 'office') {
        loadOffices();
      } else {
        loadDocuments();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const toggleDocExpand = (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  return (
    <div>
      <AdminPageHeader
        title="Acte Necesare"
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Acte Necesare' },
        ]}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('offices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'offices'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Birouri / Departamente
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Secțiuni / Documente
        </button>
      </div>

      {/* Offices Tab */}
      {activeTab === 'offices' && (
        <>
          <AdminCard className="mb-6">
            <div className="flex justify-between items-center">
              <p className="text-slate-600">Gestionează birourile și departamentele afișate pe pagina de Acte Necesare.</p>
              <AdminButton icon={Plus} onClick={handleNewOffice}>
                Adaugă Birou
              </AdminButton>
            </div>
          </AdminCard>

          {/* Office Edit Form */}
          {editingOffice && (
            <AdminCard className="mb-6 border-primary-200 bg-primary-50">
              <h3 className="font-semibold mb-4">{isNewOffice ? 'Birou Nou' : 'Editare Birou'}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput
                  label="Nume Birou"
                  value={editingOffice.name}
                  onChange={(e) => setEditingOffice({ ...editingOffice, name: e.target.value })}
                  required
                />
                <AdminInput
                  label="Slug (URL)"
                  value={editingOffice.slug}
                  onChange={(e) => setEditingOffice({ ...editingOffice, slug: e.target.value })}
                  placeholder="Se generează automat"
                />
                <AdminSelect
                  label="Iconiță"
                  value={editingOffice.icon}
                  onChange={(e) => setEditingOffice({ ...editingOffice, icon: e.target.value })}
                  options={ICON_OPTIONS}
                />
                <AdminSelect
                  label="Culoare"
                  value={editingOffice.color}
                  onChange={(e) => setEditingOffice({ ...editingOffice, color: e.target.value })}
                  options={COLOR_OPTIONS}
                />
                <div className="md:col-span-2">
                  <AdminTextarea
                    label="Descriere"
                    value={editingOffice.description || ''}
                    onChange={(e) => setEditingOffice({ ...editingOffice, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <AdminInput
                  label="Ordine Afișare"
                  type="number"
                  value={editingOffice.sort_order.toString()}
                  onChange={(e) => setEditingOffice({ ...editingOffice, sort_order: parseInt(e.target.value) || 0 })}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="office-published"
                    checked={editingOffice.published}
                    onChange={(e) => setEditingOffice({ ...editingOffice, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="office-published">Publicat</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <AdminButton icon={Save} onClick={handleSaveOffice} loading={saving}>
                  Salvează
                </AdminButton>
                <AdminButton icon={X} variant="secondary" onClick={() => setEditingOffice(null)}>
                  Anulează
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {/* Offices List */}
          <AdminCard>
            {loadingOffices ? (
              <div className="text-center py-8 text-slate-500">Se încarcă...</div>
            ) : offices.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Nu există birouri. Adaugă primul birou.</div>
            ) : (
              <div className="space-y-2">
                {offices.map((office) => (
                  <div
                    key={office.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="font-medium">{office.name}</p>
                        <p className="text-sm text-slate-500">/{office.slug} • Ordine: {office.sort_order}</p>
                      </div>
                      {!office.published && (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded">Draft</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditOffice(office)}
                        className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete('office', office.id, office.name)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <>
          <AdminCard className="mb-6">
            <div className="flex flex-wrap gap-4 items-end justify-between">
              <div className="flex-1 min-w-[200px] max-w-xs">
                <AdminSelect
                  label="Selectează Biroul"
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  options={offices.map(o => ({ value: o.id, label: o.name }))}
                  placeholder="Alege un birou..."
                />
              </div>
              <AdminButton icon={Plus} onClick={handleNewDocument} disabled={!selectedOfficeId}>
                Adaugă Secțiune
              </AdminButton>
            </div>
          </AdminCard>

          {/* Document Edit Form */}
          {editingDocument && (
            <AdminCard className="mb-6 border-primary-200 bg-primary-50">
              <h3 className="font-semibold mb-4">{isNewDocument ? 'Secțiune Nouă' : 'Editare Secțiune'}</h3>
              <div className="space-y-4">
                <AdminInput
                  label="Titlu Secțiune"
                  value={editingDocument.title}
                  onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lista de cerințe / documente necesare
                  </label>
                  <div className="space-y-2">
                    {editingDocument.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateItem(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder={`Element ${index + 1}`}
                        />
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddItem}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Adaugă element
                  </button>
                </div>

                <AdminTextarea
                  label="Notă (opțional)"
                  value={editingDocument.note || ''}
                  onChange={(e) => setEditingDocument({ ...editingDocument, note: e.target.value })}
                  rows={2}
                  placeholder="Informații suplimentare care vor apărea într-un box galben"
                />

                <div className="flex gap-4">
                  <AdminInput
                    label="Ordine Afișare"
                    type="number"
                    value={editingDocument.sort_order.toString()}
                    onChange={(e) => setEditingDocument({ ...editingDocument, sort_order: parseInt(e.target.value) || 0 })}
                  />
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="doc-published"
                      checked={editingDocument.published}
                      onChange={(e) => setEditingDocument({ ...editingDocument, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="doc-published">Publicat</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <AdminButton icon={Save} onClick={handleSaveDocument} loading={saving}>
                  Salvează
                </AdminButton>
                <AdminButton icon={X} variant="secondary" onClick={() => setEditingDocument(null)}>
                  Anulează
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {/* Documents List */}
          <AdminCard>
            {!selectedOfficeId ? (
              <div className="text-center py-8 text-slate-500">Selectează un birou pentru a vedea secțiunile.</div>
            ) : loadingDocuments ? (
              <div className="text-center py-8 text-slate-500">Se încarcă...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Nu există secțiuni pentru acest birou.</div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-50 rounded-lg hover:bg-slate-100"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => toggleDocExpand(doc.id)} className="text-slate-400 hover:text-slate-600">
                          {expandedDocs.has(doc.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-slate-500">{doc.items.length} elemente • Ordine: {doc.sort_order}</p>
                        </div>
                        {!doc.published && (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded">Draft</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditDocument(doc)}
                          className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete('document', doc.id, doc.title)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {expandedDocs.has(doc.id) && (
                      <div className="px-12 pb-4">
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {doc.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                        {doc.note && (
                          <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                            <strong>Notă:</strong> {doc.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={`Șterge ${itemToDelete?.type === 'office' ? 'Biroul' : 'Secțiunea'}?`}
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.name}"? ${itemToDelete?.type === 'office' ? 'Toate secțiunile asociate vor fi de asemenea șterse.' : ''} Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
