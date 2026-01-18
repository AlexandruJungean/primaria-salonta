'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp,
  DollarSign,
  RefreshCw,
  Info,
  Plus, 
  Search,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminInput,
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
  year: number | null;
  published: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 15;

type TabType = 'executie' | 'buget' | 'rectificare' | 'altele';

const TABS: { key: TabType; label: string; icon: typeof TrendingUp }[] = [
  { key: 'executie', label: 'Cont de execuție', icon: TrendingUp },
  { key: 'buget', label: 'Buget general', icon: DollarSign },
  { key: 'rectificare', label: 'Rectificări bugetare', icon: RefreshCw },
  { key: 'altele', label: 'Alte documente', icon: Info },
];

export default function DocumenteFinanciareAdminPage() {
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('executie');
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Load documents
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        source_folder: 'documente-si-informatii-financiare',
        subcategory: activeTab,
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
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Document actions
  const handleEditDocument = (doc: Document) => {
    router.push(`/admin/monitorul-oficial/documente-financiare/${doc.id}`);
  };

  const confirmDeleteDocument = (doc: Document) => {
    setItemToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/documents?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Documentul a fost șters.');
      loadDocuments();
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
        <p className="font-medium text-slate-900">{item.title}</p>
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

  const currentTabInfo = TABS.find(t => t.key === activeTab)!;

  return (
    <div>
      <AdminPageHeader
        title="Documente și Informații Financiare"
        breadcrumbs={[
          { label: 'Monitorul Oficial' },
          { label: 'Documente Financiare' },
        ]}
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Add */}
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
            onClick={() => router.push(`/admin/monitorul-oficial/documente-financiare/nou?subcategory=${activeTab}`)}
          >
            Încarcă Document
          </AdminButton>
        </div>
      </AdminCard>

      <AdminTable
        data={documents}
        columns={documentColumns}
        loading={loading}
        onEdit={handleEditDocument}
        onDelete={confirmDeleteDocument}
        emptyMessage={`Nu există documente în categoria "${currentTabInfo.label}". Apasă 'Încarcă Document' pentru a adăuga.`}
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

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Documentul?"
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
