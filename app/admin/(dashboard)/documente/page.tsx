'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, FileText, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { adminFetch } from '@/lib/api-client';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminButton,
  AdminPagination,
  toast,
} from '@/components/admin';

interface UnifiedDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
  source_table: string;
  source_label: string;
  parent_info: string | null;
  admin_edit_url: string | null;
}

const ITEMS_PER_PAGE = 30;

const SOURCE_FILTERS = [
  { value: '', label: 'Toate sursele' },
  { value: 'documents', label: 'Documente generale' },
  { value: 'news_documents', label: 'Știri' },
  { value: 'council_decision_documents', label: 'Hotărâri CL' },
  { value: 'council_session_documents', label: 'Ordine de Zi' },
  { value: 'reports', label: 'Rapoarte' },
  { value: 'job_vacancy_documents', label: 'Carieră' },
  { value: 'program_documents', label: 'Programe' },
];

type SortField = 'created_at' | 'title' | 'file_name' | 'source_label';

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function DocumenteManagerPage() {
  const [documents, setDocuments] = useState<UnifiedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sort: sortField,
        dir: sortDir,
      });
      if (searchQuery) params.set('search', searchQuery);

      const response = await adminFetch(`/api/admin/all-documents?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();

      let data = result.data || [];
      if (sourceFilter) {
        data = data.filter((d: UnifiedDocument) => d.source_table === sourceFilter);
      }

      setDocuments(data);
      setTotalCount(sourceFilter ? data.length : result.count);
    } catch {
      toast.error('Eroare', 'Nu s-au putut încărca documentele.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortField, sortDir, sourceFilter]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDocuments();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
      : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Manager Documente"
        description={`${totalCount} documente din toate secțiunile`}
        breadcrumbs={[{ label: 'Documente' }]}
      />

      <AdminCard className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <AdminInput
              label=""
              placeholder="Caută după titlu sau nume fișier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-48">
            <AdminSelect
              label=""
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
              options={SOURCE_FILTERS}
            />
          </div>
          <AdminButton type="submit" icon={Search} variant="secondary">Caută</AdminButton>
          {(searchQuery || sourceFilter) && (
            <AdminButton
              type="button"
              icon={X}
              variant="ghost"
              onClick={() => { setSearchQuery(''); setSourceFilter(''); setCurrentPage(1); }}
            >
              Resetează
            </AdminButton>
          )}
        </form>
      </AdminCard>

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Nu s-au găsit documente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3">
                    <button onClick={() => toggleSort('title')} className="flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-600">
                      Titlu <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="text-left p-3 w-40">
                    <button onClick={() => toggleSort('source_label')} className="flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-600">
                      Sursa <SortIcon field="source_label" />
                    </button>
                  </th>
                  <th className="text-left p-3 w-24">Mărime</th>
                  <th className="text-left p-3 w-28">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-600">
                      Data <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="text-right p-3 w-20">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={`${doc.source_table}-${doc.id}`} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate max-w-md" title={doc.title}>{doc.title}</p>
                          <p className="text-xs text-slate-500 truncate" title={doc.file_name}>{doc.file_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {doc.source_label}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{formatFileSize(doc.file_size)}</td>
                    <td className="p-3 text-slate-500">{formatDate(doc.created_at)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Deschide fișierul"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {doc.admin_edit_url && (
                          <a
                            href={doc.admin_edit_url}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editează sursa"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
