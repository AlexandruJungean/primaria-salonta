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
  Calendar,
  FileText,
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

const SECTION_OPTIONS = [
  { value: 'a', label: 'a) Acte normative' },
  { value: 'b', label: 'b) Structura organizatorică' },
  { value: 'c', label: 'c) Conducere' },
  { value: 'd', label: 'd) Contact' },
  { value: 'e', label: 'e) Audiențe' },
  { value: 'f', label: 'f) Buget' },
  { value: 'g', label: 'g) Programe și strategii' },
  { value: 'h', label: 'h) Documente interes public' },
  { value: 'i', label: 'i) Categorii documente' },
  { value: 'j', label: 'j) Contestare' },
];

const LINK_TYPE_OPTIONS = [
  { value: 'internal', label: 'Link intern' },
  { value: 'external', label: 'Link extern' },
];

export default function BuletinInformativAdminPage() {
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'documents' | 'links'>('documents');
  
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

  // Load documents
  const loadDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const params = new URLSearchParams({
        source_folder: 'buletin-informativ',
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        parents_only: 'true',
      });
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
  }, [currentPage, searchQuery]);

  // Load links
  const loadLinks = useCallback(async () => {
    setLoadingLinks(true);
    try {
      const response = await adminFetch(`/api/admin/external-links?page_key=buletin-informativ`);
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
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    if (activeTab === 'links') {
      loadLinks();
    }
  }, [activeTab, loadLinks]);

  // Document actions
  const handleEditDocument = (doc: Document) => {
    router.push(`/admin/transparenta/buletin-informativ/${doc.id}`);
  };

  const confirmDeleteDocument = (doc: Document) => {
    setItemToDelete({ type: 'document', item: doc });
    setDeleteDialogOpen(true);
  };

  // Link actions
  const startNewLink = () => {
    setNewLink({
      page_key: 'buletin-informativ',
      title: '',
      url: '',
      description: '',
      link_type: 'internal',
      section: 'a',
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const documentColumns = [
    {
      key: 'title',
      label: 'Titlu',
      className: 'min-w-[300px]',
      render: (item: Document) => (
        <div>
          <p className="font-medium text-slate-900">{item.title}</p>
          {item.subcategory && (
            <span className="text-xs text-slate-500">Secțiunea {item.subcategory}</span>
          )}
        </div>
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

  return (
    <div>
      <AdminPageHeader
        title="Buletin Informativ"
        breadcrumbs={[
          { label: 'Transparență' },
          { label: 'Buletin Informativ' },
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
                onClick={() => router.push('/admin/transparenta/buletin-informativ/nou')}
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
            emptyMessage="Nu există documente. Apasă 'Încarcă Document' pentru a adăuga."
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
        <div className="space-y-4">
          <AdminCard className="bg-blue-50 border-blue-200">
            <p className="text-blue-800">
              <strong>Info:</strong> Adaugă link-uri care vor apărea în secțiunile buletinului informativ.
              Link-urile interne sunt către pagini din site, iar cele externe către alte site-uri.
            </p>
          </AdminCard>

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
                  placeholder="/pagina sau https://..."
                  required
                />
                <AdminSelect
                  label="Secțiune"
                  value={(editingLink || newLink)?.section || 'a'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingLink) setEditingLink({ ...editingLink, section: val });
                    else if (newLink) setNewLink({ ...newLink, section: val });
                  }}
                  options={SECTION_OPTIONS}
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
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Secțiunea {link.section}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          link.link_type === 'internal' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {link.link_type === 'internal' ? 'Intern' : 'Extern'}
                        </span>
                      </div>
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
