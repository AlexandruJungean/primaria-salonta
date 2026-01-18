'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  ExternalLink,
  X,
} from 'lucide-react';
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
  source_folder: string | null;
  subcategory: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  year: number | null;
  description: string | null;
  published: boolean;
  created_at: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocumentListProps {
  filterType: 'category' | 'source_folder';
  filterValue: string;
  pageTitle: string;
  breadcrumbs: BreadcrumbItem[];
  basePath: string; // e.g., '/admin/primaria/organigrama'
  hideYearColumn?: boolean;
  hideYearFilter?: boolean;
  hideCreatedAtColumn?: boolean;
}

const ITEMS_PER_PAGE = 20;
const RESTRICTED_CATEGORIES = ['buget', 'dispozitii', 'regulamente'];
const DELETE_LIMIT_HOURS = 24;

const SUBCATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  // Category-based subcategories
  achizitii: [
    { value: 'documente', label: 'Documente Achiziții' },
    { value: 'formulare', label: 'Formulare necesare' },
  ],
  mediu: [
    { value: 'salubrizare', label: 'Salubrizare' },
    { value: 'apa_canal', label: 'Apă și Canal' },
    { value: 'spatii_verzi', label: 'Spații Verzi' },
  ],
  formulare: [
    { value: 'achizitii_publice', label: 'Achiziții Publice' },
    { value: 'asistenta_sociala', label: 'Asistență Socială' },
    { value: 'autorizari_constructii', label: 'Autorizări Construcții' },
    { value: 'birou_agricol', label: 'Birou Agricol' },
    { value: 'centrul_zi', label: 'Centrul de Zi' },
    { value: 'dezvoltare_urbana', label: 'Dezvoltare Urbană' },
    { value: 'diverse', label: 'Diverse' },
    { value: 'evidenta_populatiei', label: 'Evidența Populației' },
    { value: 'impozite_taxe', label: 'Impozite și Taxe' },
    { value: 'protectie_civila', label: 'Protecție Civilă' },
    { value: 'resurse_umane', label: 'Resurse Umane' },
    { value: 'stare_civila', label: 'Stare Civilă' },
    { value: 'urbanism', label: 'Urbanism' },
    { value: 'transparenta', label: 'Transparență' },
  ],
  // Source folder-based subcategories
  'generale': [
    { value: 'dispozitii', label: 'Dispoziții' },
    { value: 'rapoarte', label: 'Rapoarte anuale' },
    { value: 'formulare', label: 'Formulare' },
  ],
  'buletin-informativ': [
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
  ],
  'documente-si-informatii-financiare': [
    { value: 'executie', label: 'Cont de execuție' },
    { value: 'buget', label: 'Buget general' },
    { value: 'rectificare', label: 'Rectificare bugetară' },
    { value: 'altele', label: 'Alte documente' },
  ],
  'hotararile-autoritatii-deliberative': [
    { value: 'registru_hotarari', label: 'Registru Hotărâri Adoptate' },
    { value: 'registru_proiecte', label: 'Registru Proiecte de Hotărâri' },
  ],
};

export function DocumentList({
  filterType,
  filterValue,
  pageTitle,
  breadcrumbs,
  basePath,
  hideYearColumn = false,
  hideYearFilter = false,
  hideCreatedAtColumn = false,
}: DocumentListProps) {
  const router = useRouter();
  
  const isRestricted = filterType === 'category' && RESTRICTED_CATEGORIES.includes(filterValue);
  const hasSubcategories = SUBCATEGORY_OPTIONS[filterValue];

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadFilters();
  }, [filterType, filterValue]);

  const loadFilters = async () => {
    let baseQuery = supabase.from('documents').select('year, subcategory');
    
    if (filterType === 'category') {
      baseQuery = baseQuery.eq('category', filterValue);
    } else if (filterType === 'source_folder') {
      baseQuery = baseQuery.eq('source_folder', filterValue);
    }

    // Exclude annexes from filter options
    baseQuery = baseQuery.is('parent_id', null);

    const { data } = await baseQuery;
    
    if (data) {
      const uniqueYears = [...new Set(data.map(d => d.year).filter(Boolean) as number[])].sort((a, b) => b - a);
      const uniqueSubcategories = [...new Set(data.map(d => d.subcategory).filter(Boolean) as string[])].sort();
      setYears(uniqueYears);
      setSubcategories(uniqueSubcategories);
    }
  };

  const loadDocuments = useCallback(async () => {
    if (!filterValue) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' });

      if (filterType === 'category') {
        query = query.eq('category', filterValue);
      } else if (filterType === 'source_folder') {
        query = query.eq('source_folder', filterValue);
      }

      // Exclude annexes (documents with parent_id) from the main list
      query = query.is('parent_id', null);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (yearFilter) {
        query = query.eq('year', parseInt(yearFilter));
      }

      if (subcategoryFilter) {
        query = query.eq('subcategory', subcategoryFilter);
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
      setLoading(false);
    }
  }, [filterType, filterValue, currentPage, searchQuery, yearFilter, subcategoryFilter]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDocuments();
  };

  const handleEdit = (item: Document) => {
    router.push(`${basePath}/${item.id}`);
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

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setSubcategoryFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || yearFilter || subcategoryFilter;

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

  const getSubcategoryLabel = (subcategory: string | null): string => {
    if (!subcategory) return '-';
    const options = SUBCATEGORY_OPTIONS[filterValue];
    if (options) {
      const option = options.find(o => o.value === subcategory);
      if (option) return option.label;
    }
    return subcategory;
  };

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
          <div className="min-w-0">
            <p className="font-medium text-slate-900" title={item.title}>{truncateText(item.title)}</p>
            <p className="text-sm text-slate-500 truncate">{truncateText(item.file_name, 40)} • {formatFileSize(item.file_size)}</p>
          </div>
        </div>
      ),
    },
    ...(hasSubcategories || subcategories.length > 0 ? [{
      key: 'subcategory',
      label: 'Subcategorie',
      className: 'w-40',
      render: (item: Document) => (
        <span className="text-sm text-slate-600">{getSubcategoryLabel(item.subcategory)}</span>
      ),
    }] : []),
    ...(!hideYearColumn ? [{
      key: 'year',
      label: 'An',
      className: 'w-20',
      render: (item: Document) => (
        <span className="font-medium text-slate-700">{item.year || '-'}</span>
      ),
    }] : []),
    ...(!hideCreatedAtColumn ? [{
      key: 'created_at',
      label: 'Încărcat',
      className: 'w-28',
      render: (item: Document) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          {formatDate(item.created_at)}
        </div>
      ),
    }] : []),
    {
      key: 'published',
      label: 'Status',
      className: 'w-24',
      render: (item: Document) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.published 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {item.published ? 'Publicat' : 'Draft'}
        </span>
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
  const subcategoryOptions = hasSubcategories 
    ? SUBCATEGORY_OPTIONS[filterValue] 
    : subcategories.map(s => ({ value: s, label: s }));

  return (
    <div>
      <AdminPageHeader
        title={pageTitle}
        description={`Gestionează documentele (${loading ? '...' : totalCount} documente)`}
        breadcrumbs={breadcrumbs}
        actions={
          <AdminButton 
            icon={Plus} 
            onClick={() => router.push(`${basePath}/nou`)}
          >
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
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <AdminInput
              label=""
              placeholder="Caută după titlu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!hideYearFilter && years.length > 0 && (
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
          )}
          {subcategoryOptions && subcategoryOptions.length > 0 && (
            <div className="w-48">
              <AdminSelect
                label=""
                value={subcategoryFilter}
                onChange={(e) => {
                  setSubcategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={subcategoryOptions}
                placeholder="Subcategorie"
              />
            </div>
          )}
          <AdminButton type="submit" icon={Search} variant="secondary">
            Caută
          </AdminButton>
          {hasActiveFilters && (
            <AdminButton type="button" icon={X} variant="ghost" onClick={clearFilters}>
              Resetează
            </AdminButton>
          )}
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
        emptyMessage={`Nu există documente. Apasă 'Încarcă Document Nou' pentru a adăuga primul document.`}
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
