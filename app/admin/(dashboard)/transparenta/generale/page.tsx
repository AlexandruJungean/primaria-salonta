'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  FileText, 
  ExternalLink as ExternalLinkIcon,
  X,
  Edit2,
  Trash2,
  Type,
  Link as LinkIcon,
  FileStack,
  Save,
  CreditCard,
  Users,
  Scale,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { adminFetch } from '@/lib/api-client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminConfirmDialog,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  toast,
} from '@/components/admin';

// Types
interface Document {
  id: string;
  title: string;
  subcategory: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  year: number | null;
  published: boolean;
  created_at: string;
}

interface PageContent {
  id: string;
  page_key: string;
  content_key: string;
  content: string;
  content_type: string;
  sort_order: number;
  is_active: boolean;
}

interface ExternalLink {
  id: string;
  page_key: string;
  title: string;
  url: string;
  description: string | null;
  link_type: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

type TabType = 'documents' | 'content' | 'links';
type DocSubcategory = 'dispozitii' | 'rapoarte' | 'formulare';

const ITEMS_PER_PAGE = 15;
const PAGE_KEY = 'transparenta-generale';

const DOC_SUBCATEGORY_TABS: { key: DocSubcategory; label: string; icon: React.ReactNode }[] = [
  { key: 'dispozitii', label: 'Dispoziții', icon: <FileText className="w-4 h-4" /> },
  { key: 'rapoarte', label: 'Rapoarte Anuale', icon: <FileStack className="w-4 h-4" /> },
  { key: 'formulare', label: 'Formulare', icon: <FileText className="w-4 h-4" /> },
];

const LINK_TYPE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefon' },
  { value: 'document', label: 'Document' },
];

// Content section config
const CONTENT_SECTIONS = [
  { 
    key: 'cont_plati', 
    title: 'Cont pentru plăți copiere documente', 
    icon: CreditCard,
    color: 'blue'
  },
  { 
    key: 'ghid_cetatean', 
    title: 'Ghidul Cetățeanului - Transparența în Administrația Publică', 
    icon: Users,
    color: 'primary'
  },
  { 
    key: 'contestare', 
    title: 'Modalități de contestare', 
    icon: Scale,
    color: 'amber'
  },
];

// Helper functions
const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function GeneralePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [docSubcategory, setDocSubcategory] = useState<DocSubcategory>('dispozitii');
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Content state
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [editingContentKey, setEditingContentKey] = useState<string | null>(null);
  const [editingContentValue, setEditingContentValue] = useState('');
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [savingContent, setSavingContent] = useState(false);
  
  // Links state
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [editingLink, setEditingLink] = useState<ExternalLink | null>(null);
  const [newLink, setNewLink] = useState<Partial<ExternalLink> | null>(null);
  const [savingLink, setSavingLink] = useState(false);
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'document' | 'link'; item: Document | ExternalLink } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load documents - only parent documents (no annexes)
  const loadDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .eq('source_folder', 'generale')
        .eq('subcategory', docSubcategory)
        .is('parent_id', null); // Only parent documents

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      query = query
        .order('year', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setDocuments(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Eroare', 'Nu s-au putut încărca documentele.');
    } finally {
      setLoadingDocs(false);
    }
  }, [docSubcategory, currentPage, searchQuery]);

  // Load content
  const loadContent = useCallback(async () => {
    setLoadingContent(true);
    try {
      const response = await adminFetch(`/api/admin/page-content?page_key=${PAGE_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setContents(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Eroare', 'Nu s-a putut încărca conținutul.');
    } finally {
      setLoadingContent(false);
    }
  }, []);

  // Load links
  const loadLinks = useCallback(async () => {
    setLoadingLinks(true);
    try {
      const response = await adminFetch(`/api/admin/external-links?page_key=${PAGE_KEY}`);
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
    } else if (activeTab === 'content') {
      loadContent();
    } else if (activeTab === 'links') {
      loadLinks();
    }
  }, [activeTab, loadDocuments, loadContent, loadLinks]);

  // Reset page when subcategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [docSubcategory]);

  // Document handlers
  const handleEditDocument = (doc: Document) => {
    router.push(`/admin/transparenta/generale/${doc.id}`);
  };

  const confirmDeleteDocument = (doc: Document) => {
    setItemToDelete({ type: 'document', item: doc });
    setDeleteDialogOpen(true);
  };

  // Content handlers
  const getContentByKey = (key: string): PageContent | undefined => {
    return contents.find(c => c.content_key === key);
  };

  const startEditContent = (key: string) => {
    const content = getContentByKey(key);
    if (content) {
      setEditingContentKey(key);
      setEditingContentId(content.id);
      setEditingContentValue(content.content);
    }
  };

  const cancelEditContent = () => {
    setEditingContentKey(null);
    setEditingContentId(null);
    setEditingContentValue('');
  };

  const saveContent = async () => {
    if (!editingContentId) return;
    
    setSavingContent(true);
    try {
      const response = await adminFetch(`/api/admin/page-content?id=${editingContentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: editingContentValue }),
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success('Salvat', 'Conținutul a fost actualizat.');
      cancelEditContent();
      loadContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Eroare', 'Nu s-a putut salva conținutul.');
    } finally {
      setSavingContent(false);
    }
  };

  // Link handlers
  const startEditLink = (link: ExternalLink) => {
    setEditingLink({ ...link });
    setNewLink(null);
  };

  const startNewLink = () => {
    setNewLink({
      page_key: PAGE_KEY,
      title: '',
      url: '',
      description: '',
      link_type: 'website',
      icon: 'external',
      sort_order: links.length + 1,
      is_active: true,
    });
    setEditingLink(null);
  };

  const cancelEditLink = () => {
    setEditingLink(null);
    setNewLink(null);
  };

  const saveLink = async () => {
    const linkData = editingLink || newLink;
    if (!linkData) return;

    if (!linkData.title || !linkData.url) {
      toast.error('Eroare', 'Titlul și URL-ul sunt obligatorii.');
      return;
    }

    setSavingLink(true);
    try {
      if (editingLink?.id) {
        const response = await adminFetch(`/api/admin/external-links?id=${editingLink.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: linkData.title,
            url: linkData.url,
            description: linkData.description,
            link_type: linkData.link_type,
            icon: linkData.icon,
            is_active: linkData.is_active,
          }),
        });

        if (!response.ok) throw new Error('Failed to update');
        toast.success('Salvat', 'Link-ul a fost actualizat.');
      } else {
        const response = await adminFetch('/api/admin/external-links', {
          method: 'POST',
          body: JSON.stringify(linkData),
        });

        if (!response.ok) throw new Error('Failed to create');
        toast.success('Adăugat', 'Link-ul a fost adăugat.');
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

  // Delete handler
  const handleDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      if (itemToDelete.type === 'document') {
        const response = await adminFetch(`/api/admin/documents?id=${itemToDelete.item.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
      } else {
        const response = await adminFetch(`/api/admin/external-links?id=${itemToDelete.item.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
      }

      toast.success('Șters', `${itemToDelete.type === 'document' ? 'Documentul' : 'Link-ul'} a fost șters.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      
      if (itemToDelete.type === 'document') {
        loadDocuments();
      } else {
        loadLinks();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
    }
  };

  // Document columns
  const documentColumns = [
    {
      key: 'title',
      label: 'Titlu Document',
      render: (item: Document) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate max-w-md" title={item.title}>{item.title}</p>
            <p className="text-sm text-slate-500">{item.file_name} • {formatFileSize(item.file_size)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'year',
      label: 'An',
      className: 'w-20',
      render: (item: Document) => (
        <span className="font-medium text-slate-700">{item.year || '-'}</span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      className: 'w-24',
      render: (item: Document) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {item.published ? 'Publicat' : 'Draft'}
        </span>
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Transparență - Generale"
        description="Gestionează documentele, textele și link-urile de pe pagina de transparență generală"
        breadcrumbs={[
          { label: 'Transparență' },
          { label: 'Generale' },
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
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'content'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Type className="w-4 h-4" />
          Texte
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
          {/* Document Subcategory Tabs */}
          <div className="flex gap-2 mb-4">
            {DOC_SUBCATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDocSubcategory(tab.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  docSubcategory === tab.key
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
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
                onClick={() => router.push('/admin/transparenta/generale/nou')}
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
            emptyMessage={`Nu există ${DOC_SUBCATEGORY_TABS.find(t => t.key === docSubcategory)?.label.toLowerCase() || 'documente'}. Apasă 'Încarcă Document' pentru a adăuga.`}
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

      {/* Content Tab - 3 Large Text Blocks */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <AdminCard className="bg-blue-50 border-blue-200">
            <p className="text-blue-800">
              <strong>Info:</strong> Textele sunt stocate în limba română și sunt traduse automat în alte limbi de Google Translate. 
              Folosește formatarea cu linii noi pentru a structura conținutul.
            </p>
          </AdminCard>

          {loadingContent ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <AdminCard key={i}>
                  <div className="animate-pulse h-40 bg-slate-100 rounded"></div>
                </AdminCard>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {CONTENT_SECTIONS.map((section) => {
                const content = getContentByKey(section.key);
                const Icon = section.icon;
                const isEditing = editingContentKey === section.key;
                
                return (
                  <AdminCard key={section.key}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        section.color === 'blue' ? 'bg-blue-100' :
                        section.color === 'amber' ? 'bg-amber-100' :
                        'bg-primary-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          section.color === 'blue' ? 'text-blue-600' :
                          section.color === 'amber' ? 'text-amber-600' :
                          'text-primary-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-slate-900 mb-3">
                          {section.title}
                        </h3>
                        
                        {isEditing ? (
                          <div className="space-y-3">
                            <AdminTextarea
                              label=""
                              value={editingContentValue}
                              onChange={(e) => setEditingContentValue(e.target.value)}
                              rows={12}
                              placeholder="Introduceți conținutul..."
                            />
                            <div className="flex gap-2">
                              <AdminButton
                                icon={Save}
                                onClick={saveContent}
                                disabled={savingContent}
                              >
                                {savingContent ? 'Se salvează...' : 'Salvează'}
                              </AdminButton>
                              <AdminButton
                                icon={X}
                                variant="ghost"
                                onClick={cancelEditContent}
                              >
                                Anulează
                              </AdminButton>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                              <p className="text-slate-700 whitespace-pre-line text-sm">
                                {content?.content || 'Nu există conținut. Click pe Editează pentru a adăuga.'}
                              </p>
                            </div>
                            <AdminButton
                              icon={Edit2}
                              variant="secondary"
                              onClick={() => startEditContent(section.key)}
                            >
                              Editează
                            </AdminButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </AdminCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <AdminButton icon={Plus} onClick={startNewLink}>
              Adaugă Link
            </AdminButton>
          </div>

          {/* New/Edit Link Form */}
          {(newLink || editingLink) && (
            <AdminCard className="mb-4 border-primary-200 bg-primary-50">
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
                  placeholder="https://... sau mailto:..."
                  required
                />
                <AdminInput
                  label="Descriere (opțional)"
                  value={(editingLink || newLink)?.description || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingLink) setEditingLink({ ...editingLink, description: val });
                    else if (newLink) setNewLink({ ...newLink, description: val });
                  }}
                />
                <AdminSelect
                  label="Tip Link"
                  value={(editingLink || newLink)?.link_type || 'website'}
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
          ) : links.length === 0 ? (
            <AdminCard>
              <p className="text-center text-slate-500 py-8">
                Nu există link-uri. Apasă "Adaugă Link" pentru a adăuga primul.
              </p>
            </AdminCard>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <AdminCard key={link.id}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <ExternalLinkIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{link.title}</p>
                      <p className="text-sm text-slate-500 truncate">{link.url}</p>
                      {link.description && (
                        <p className="text-sm text-slate-400">{link.description}</p>
                      )}
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
