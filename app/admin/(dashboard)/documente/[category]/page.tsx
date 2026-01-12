'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Search, Calendar, FileText, Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminConfirmDialog,
  AdminInput,
  AdminSelect,
  toast,
  canDeleteItem,
  formatDeleteTimeRemaining,
} from '@/components/admin';

interface Document {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  year: number;
  description: string | null;
  published: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 15;

const CATEGORY_LABELS: Record<string, string> = {
  buget: 'Buget',
  dispozitii: 'Dispoziții',
  regulamente: 'Regulamente',
  licitatii: 'Licitații',
  achizitii: 'Achiziții Publice',
  formulare: 'Formulare',
  autorizatii: 'Autorizații Construire',
  altele: 'Alte Documente',
};

// Categories with 24h delete restriction
const RESTRICTED_CATEGORIES = ['buget', 'dispozitii', 'regulamente'];
const DELETE_LIMIT_HOURS = 24;

export default function DocumenteCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const isRestricted = RESTRICTED_CATEGORIES.includes(category);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadYears();
  }, [category]);

  const loadYears = async () => {
    const { data } = await supabase
      .from('documents')
      .select('year')
      .eq('category', category)
      .order('year', { ascending: false });
    
    if (data) {
      const uniqueYears = [...new Set(data.map(d => d.year))];
      setYears(uniqueYears);
    }
  };

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (yearFilter) {
        query = query.eq('year', parseInt(yearFilter));
      }

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
      setLoading(false);
    }
  }, [category, currentPage, searchQuery, yearFilter]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDocuments();
  };

  const handleEdit = (item: Document) => {
    router.push(`/admin/documente/${category}/${item.id}`);
  };

  const canDelete = (item: Document): boolean => {
    if (!isRestricted) return true;
    return canDeleteItem(item.created_at, DELETE_LIMIT_HOURS);
  };

  const getDeleteTooltip = (item: Document): string => {
    if (!isRestricted) return 'Șterge';
    if (canDelete(item)) {
      const hoursRemaining = DELETE_LIMIT_HOURS - 
        (new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
      return `Șterge (${formatDeleteTimeRemaining(hoursRemaining)})`;
    }
    return 'Nu se poate șterge - au trecut mai mult de 24 ore';
  };

  const confirmDelete = (item: Document) => {
    if (!canDelete(item)) {
      toast.warning(
        'Nu se poate șterge',
        'Acest document poate fi șters doar în primele 24 de ore de la încărcare.'
      );
      return;
    }
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Șters cu succes', `Documentul "${itemToDelete.title}" a fost șters.`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge documentul.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const columns = [
    {
      key: 'title',
      label: 'Titlu Document',
      render: (item: Document) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
            <p className="text-sm text-slate-500">{item.file_name} • {formatFileSize(item.file_size)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'year',
      label: 'An',
      className: 'w-24',
      render: (item: Document) => (
        <span className="font-medium text-slate-700">{item.year}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Încărcat',
      className: 'w-32',
      render: (item: Document) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          {formatDate(item.created_at)}
        </div>
      ),
    },
    {
      key: 'download',
      label: '',
      className: 'w-24',
      render: (item: Document) => (
        <a
          href={item.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Descarcă
        </a>
      ),
    },
    ...(isRestricted ? [{
      key: 'can_delete',
      label: '',
      className: 'w-10',
      render: (item: Document) => (
        !canDelete(item) ? (
          <span title="Nu se poate șterge - au trecut 24h">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </span>
        ) : null
      ),
    }] : []),
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const yearOptions = years.map(y => ({ value: y.toString(), label: y.toString() }));

  return (
    <div>
      <AdminPageHeader
        title={categoryLabel}
        description={`Gestionează documentele din categoria ${categoryLabel}`}
        breadcrumbs={[
          { label: 'Documente', href: '/admin/documente' },
          { label: categoryLabel },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push(`/admin/documente/${category}/nou`)}>
            Încarcă Document Nou
          </AdminButton>
        }
      />

      {isRestricted && (
        <AdminCard className="mb-6 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="text-amber-800">
              <strong>Atenție:</strong> Documentele din această categorie pot fi șterse doar în primele 24 de ore de la încărcare.
            </p>
          </div>
        </AdminCard>
      )}

      <AdminCard className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <AdminInput
              label=""
              placeholder="Caută după titlu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-32">
            <AdminSelect
              label=""
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={yearOptions}
              placeholder="An"
            />
          </div>
          <AdminButton type="submit" icon={Search} variant="secondary">
            Caută
          </AdminButton>
        </form>
      </AdminCard>

      <AdminTable
        data={documents}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        canDelete={canDelete}
        deleteTooltip={getDeleteTooltip}
        emptyMessage={`Nu există documente în categoria ${categoryLabel}. Apasă 'Încarcă Document Nou' pentru a adăuga primul document.`}
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

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Documentul?"
        message={`Ești sigur că vrei să ștergi documentul "${itemToDelete?.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
