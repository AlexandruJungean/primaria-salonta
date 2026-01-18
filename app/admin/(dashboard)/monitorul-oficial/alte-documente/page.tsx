'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileStack, 
  LinkIcon, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  ExternalLink as ExternalLinkIcon,
  Save,
  X,
  FileCheck,
  ScrollText,
  Users,
  Archive,
  Zap,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminInput,
  AdminSelect,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  year: number | null;
  subcategory: string | null;
  published: boolean;
  created_at: string;
}

interface ExternalLink {
  id: string;
  page_key: string;
  title: string;
  url: string;
  description: string | null;
  link_type: string;
  section: string | null;
  sort_order: number;
  is_active: boolean;
}

const ITEMS_PER_PAGE = 15;

// Document tabs - different source folders and subcategories
const DOCUMENT_TABS = [
  { 
    id: 'minute', 
    label: 'Minute Ședințe', 
    icon: ScrollText,
    sourceFolder: 'minute-sedinte-consiliu',
    subcategory: null,
    color: 'green'
  },
  { 
    id: 'transparenta', 
    label: 'Rapoarte Transparență', 
    icon: FileCheck,
    sourceFolder: 'alte-documente',
    subcategory: 'transparenta',
    color: 'blue'
  },
  { 
    id: 'raport_primar', 
    label: 'Rapoarte Primar', 
    icon: FileCheck,
    sourceFolder: 'alte-documente',
    subcategory: 'raport_primar',
    color: 'blue'
  },
  { 
    id: 'documente', 
    label: 'Documente', 
    icon: Users,
    sourceFolder: 'alte-documente',
    subcategory: 'documente',
    color: 'purple'
  },
  { 
    id: 'arhiva', 
    label: 'Arhivă Mandate 2020-2024', 
    icon: Archive,
    sourceFolder: 'arhiva-validare-mandate-2020-2024',
    subcategory: null,
    color: 'indigo'
  },
];

// Link sections
const LINK_SECTIONS = [
  { value: 'quick_links', label: 'Acces rapid la pagini conexe' },
  { value: 'other_links', label: 'Alte linkuri utile' },
  { value: 'transparency_links', label: 'Link-uri secțiune transparență' },
];

const LINK_TYPE_OPTIONS = [
  { value: 'internal', label: 'Link intern' },
  { value: 'external', label: 'Link extern' },
];

export default function AlteDocumenteAdminPage() {
  const router = useRouter();
  
  // Main tab state
  const [activeTab, setActiveTab] = useState<'documents' | 'links'>('documents');
  
  // Document sub-tab state
  const [activeDocTab, setActiveDocTab] = useState(DOCUMENT_TABS[0].id);
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Links state
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [editingLink, setEditingLink] = useState<ExternalLink | null>(null);
  const [newLink, setNewLink] = useState<Partial<ExternalLink> | null>(null);
  const [savingLink, setSavingLink] = useState(false);
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'document' | 'link'; item: Document | ExternalLink } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const currentDocTab = DOCUMENT_TABS.find(t => t.id === activeDocTab) || DOCUMENT_TABS[0];

  // Load documents
  const loadDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const params = new URLSearchParams({
        source_folder: currentDocTab.sourceFolder,
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        parents_only: 'true',
      });
      if (currentDocTab.subcategory) {
        params.set('subcategory', currentDocTab.subcategory);
      }
      if (searchQuery) params.set('search', searchQuery);

      const response = await adminFetch(`/api/admin/documents?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDocuments(data.data || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Eroare', 'Nu s-au putut încărca documentele.');
    } finally {
      setLoadingDocs(false);
    }
  }, [currentPage, searchQuery, currentDocTab]);

  // Load links
  const loadLinks = useCallback(async () => {
    setLoadingLinks(true);
    try {
      const response = await adminFetch(`/api/admin/external-links?page_key=alte-documente`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setLinks(data || []);
    } catch (error) {
      console.error('Error loading links:', error);
      toast.error('Eroare', 'Nu s-au putut încărca link-urile.');
    } finally {
      setLoadingLinks(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'documents') {
      loadDocuments();
    }
  }, [loadDocuments, activeTab]);

  useEffect(() => {
    if (activeTab === 'links') {
      loadLinks();
    }
  }, [activeTab, loadLinks]);

  // Reset page when changing doc tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeDocTab]);

  // Document actions
  const handleNewDocument = () => {
    const params = new URLSearchParams({
      source_folder: currentDocTab.sourceFolder,
    });
    if (currentDocTab.subcategory) {
      params.set('subcategory', currentDocTab.subcategory);
    }
    router.push(`/admin/monitorul-oficial/alte-documente/nou?${params}`);
  };

  const handleEditDocument = (doc: Document) => {
    router.push(`/admin/monitorul-oficial/alte-documente/${doc.id}`);
  };

  const confirmDeleteDocument = (doc: Document) => {
    setItemToDelete({ type: 'document', item: doc });
    setDeleteDialogOpen(true);
  };

  // Link actions
  const startNewLink = () => {
    setNewLink({
      page_key: 'alte-documente',
      title: '',
      url: '',
      description: '',
      link_type: 'internal',
      section: 'quick_links',
      sort_order: links.length,
      is_active: true,
    });
    setEditingLink(null);
  };

  const startEditLink = (link: ExternalLink) => {
    setEditingLink({ ...link });
    setNewLink(null);
  };

  const cancelEditLink = () => {
    setEditingLink(null);
    setNewLink(null);
  };

  const saveLink = async () => {
    const linkData = editingLink || newLink;
    if (!linkData?.title || !linkData?.url) {
      toast.error('Eroare', 'Completează titlul și URL-ul.');
      return;
    }

    setSavingLink(true);
    try {
      if (editingLink) {
        const response = await adminFetch(`/api/admin/external-links?id=${editingLink.id}`, {
          method: 'PATCH',
          body: JSON.stringify(linkData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Succes', 'Link-ul a fost actualizat.');
      } else {
        const response = await adminFetch('/api/admin/external-links', {
          method: 'POST',
          body: JSON.stringify(linkData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Succes', 'Link-ul a fost adăugat.');
      }
      cancelEditLink();
      loadLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error('Eroare', 'Nu s-a putut salva link-ul.');
    } finally {
      setSavingLink(false);
    }
  };

  const confirmDeleteLink = (link: ExternalLink) => {
    setItemToDelete({ type: 'link', item: link });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      if (itemToDelete.type === 'document') {
        const response = await adminFetch(`/api/admin/documents?id=${itemToDelete.item.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
        toast.success('Șters', 'Documentul a fost șters.');
        loadDocuments();
      } else {
        const response = await adminFetch(`/api/admin/external-links?id=${itemToDelete.item.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
        toast.success('Șters', 'Link-ul a fost șters.');
        loadLinks();
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

  const documentColumns = [
    {
      key: 'title',
      label: 'Titlu',
      className: 'min-w-[300px]',
      render: (item: Document) => (
        <div>
          <p className="font-medium text-slate-900">{item.title}</p>
        </div>
      ),
    },
    {
      key: 'year',
      label: 'An',
      className: 'w-20',
      render: (item: Document) => (
        <span className="text-slate-600">{item.year || '-'}</span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      className: 'w-24',
      render: (item: Document) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.published 
            ? 'bg-green-100 text-green-700' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          {item.published ? 'Publicat' : 'Draft'}
        </span>
      ),
    },
  ];

  // Group links by section
  const linksBySection = LINK_SECTIONS.map(section => ({
    ...section,
    links: links.filter(l => l.section === section.value)
  }));

  return (
    <div>
      <AdminPageHeader
        title="Alte Documente"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Alte Documente' },
      ]}
      />

      {/* Main Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileStack className="w-4 h-4" />
          Documente
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'links'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Link-uri
        </button>
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <>
          {/* Document Sub-Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {DOCUMENT_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeDocTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? `bg-${tab.color}-600 text-white`
                      : `bg-white text-slate-600 hover:bg-slate-100 border border-slate-200`
                  }`}
                  style={isActive ? { 
                    backgroundColor: tab.color === 'blue' ? '#2563eb' : 
                                     tab.color === 'green' ? '#16a34a' :
                                     tab.color === 'purple' ? '#9333ea' :
                                     tab.color === 'indigo' ? '#4f46e5' : '#2563eb'
                  } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AdminCard className="mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <AdminInput
                  label=""
                  placeholder="Caută după titlu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <AdminButton 
                icon={Search} 
                variant="secondary"
                onClick={() => {
                  setCurrentPage(1);
                  loadDocuments();
                }}
              >
                Caută
              </AdminButton>
              <AdminButton 
                icon={Plus} 
                onClick={handleNewDocument}
              >
                Încarcă Document
              </AdminButton>
            </div>
          </AdminCard>

          <AdminTable
            data={documents}
            columns={documentColumns}
            loading={loadingDocs}
            onEdit={handleEditDocument}
            onDelete={confirmDeleteDocument}
            emptyMessage="Nu există documente în această categorie."
          />

          {totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <AdminCard className="bg-blue-50 border-blue-200">
            <p className="text-blue-800">
              <strong>Info:</strong> Gestionează link-urile care apar în diferite secțiuni ale paginii "Alte Documente".
            </p>
          </AdminCard>

          <div className="flex justify-end">
            <AdminButton icon={Plus} onClick={startNewLink}>
              Adaugă Link
            </AdminButton>
          </div>

          {/* New/Edit Link Form */}
          {(newLink || editingLink) && (
            <AdminCard className="border-primary-200 bg-primary-50">
              <h3 className="font-semibold text-slate-900 mb-4">
                {newLink ? 'Adaugă Link Nou' : 'Editează Link'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <AdminInput
                  label="Titlu"
                  value={(editingLink || newLink)?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingLink) setEditingLink({ ...editingLink, title: val });
                    else if (newLink) setNewLink({ ...newLink, title: val });
                  }}
                  required
                />
                <AdminInput
                  label="URL"
                  value={(editingLink || newLink)?.url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingLink) setEditingLink({ ...editingLink, url: val });
                    else if (newLink) setNewLink({ ...newLink, url: val });
                  }}
                  placeholder="/pagina sau https://..."
                  required
                />
                <AdminSelect
                  label="Secțiune"
                  value={(editingLink || newLink)?.section || 'quick_links'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingLink) setEditingLink({ ...editingLink, section: val });
                    else if (newLink) setNewLink({ ...newLink, section: val });
                  }}
                  options={LINK_SECTIONS}
                />
                <AdminSelect
                  label="Tip Link"
                  value={(editingLink || newLink)?.link_type || 'internal'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingLink) setEditingLink({ ...editingLink, link_type: val });
                    else if (newLink) setNewLink({ ...newLink, link_type: val });
                  }}
                  options={LINK_TYPE_OPTIONS}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <AdminButton
                  icon={Save}
                  onClick={saveLink}
                  disabled={savingLink}
                >
                  {savingLink ? 'Se salvează...' : 'Salvează'}
                </AdminButton>
                <AdminButton
                  icon={X}
                  variant="ghost"
                  onClick={cancelEditLink}
                >
                  Anulează
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {loadingLinks ? (
            <AdminCard>
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded"></div>
                ))}
              </div>
            </AdminCard>
          ) : (
            <div className="space-y-6">
              {linksBySection.map(section => (
                <div key={section.value}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-slate-900">{section.label}</h3>
                    <span className="text-sm text-slate-500">({section.links.length})</span>
                  </div>
                  
                  {section.links.length === 0 ? (
                    <AdminCard className="bg-slate-50">
                      <p className="text-center text-slate-500 py-4">
                        Nu există link-uri în această secțiune.
                      </p>
                    </AdminCard>
                  ) : (
                    <div className="space-y-2">
                      {section.links.map((link) => (
                        <AdminCard key={link.id}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <ExternalLinkIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900">{link.title}</p>
                              <p className="text-sm text-slate-500 truncate">{link.url}</p>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                link.link_type === 'internal' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {link.link_type === 'internal' ? 'Intern' : 'Extern'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <AdminButton
                                icon={Edit2}
                                variant="ghost"
                                onClick={() => startEditLink(link)}
                              >
                                Editează
                              </AdminButton>
                              <AdminButton
                                icon={Trash2}
                                variant="ghost"
                                onClick={() => confirmDeleteLink(link)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Șterge
                              </AdminButton>
                            </div>
                          </div>
                        </AdminCard>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={`Șterge ${itemToDelete?.type === 'document' ? 'Documentul' : 'Link-ul'}?`}
        message={`Ești sigur că vrei să ștergi "${
          itemToDelete?.type === 'document' 
            ? (itemToDelete.item as Document).title 
            : (itemToDelete?.item as ExternalLink)?.title
        }"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
