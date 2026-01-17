'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { History, Filter, User, Calendar, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminPagination,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  resource_title: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface Admin {
  id: string;
  full_name: string;
  email: string;
}

const ITEMS_PER_PAGE = 50;

const ACTION_OPTIONS = [
  { value: '', label: 'Toate acțiunile' },
  { value: 'create', label: 'Creare' },
  { value: 'update', label: 'Modificare' },
  { value: 'delete', label: 'Ștergere' },
  { value: 'upload', label: 'Încărcare' },
  { value: 'login', label: 'Autentificare' },
  { value: 'logout', label: 'Deconectare' },
];

const RESOURCE_OPTIONS = [
  { value: '', label: 'Toate resursele' },
  { value: 'news', label: 'Știri' },
  { value: 'event', label: 'Evenimente' },
  { value: 'document', label: 'Documente' },
  { value: 'declaration', label: 'Declarații' },
  { value: 'petition', label: 'Petiții' },
  { value: 'contact', label: 'Mesaje contact' },
  { value: 'gallery', label: 'Galerie' },
  { value: 'institution', label: 'Instituții' },
  { value: 'council_session', label: 'Ședințe CL' },
  { value: 'council_decision', label: 'Hotărâri CL' },
  { value: 'job_vacancy', label: 'Concursuri' },
  { value: 'program', label: 'Programe' },
  { value: 'webcam', label: 'Camere web' },
  { value: 'staff', label: 'Personal' },
  { value: 'council_member', label: 'Consilieri' },
];

const getActionColor = (action: string) => {
  switch (action) {
    case 'create': return 'bg-green-100 text-green-800';
    case 'update': return 'bg-blue-100 text-blue-800';
    case 'delete': return 'bg-red-100 text-red-800';
    case 'upload': return 'bg-purple-100 text-purple-800';
    case 'login': return 'bg-emerald-100 text-emerald-800';
    case 'logout': return 'bg-slate-100 text-slate-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    create: 'Creare',
    update: 'Modificare',
    delete: 'Ștergere',
    upload: 'Încărcare',
    login: 'Autentificare',
    logout: 'Deconectare',
    view: 'Vizualizare',
  };
  return labels[action] || action;
};

const getResourceLabel = (resourceType: string) => {
  const labels: Record<string, string> = {
    news: 'Știre',
    event: 'Eveniment',
    document: 'Document',
    declaration: 'Declarație',
    petition: 'Petiție',
    contact: 'Mesaj contact',
    gallery: 'Galerie',
    institution: 'Instituție',
    council_session: 'Ședință CL',
    council_decision: 'Hotărâre CL',
    job_vacancy: 'Concurs',
    program: 'Program',
    webcam: 'Cameră web',
    office_hours: 'Program lucru',
    staff: 'Personal',
    council_member: 'Consilier',
    user: 'Utilizator',
    settings: 'Setări',
  };
  return labels[resourceType] || resourceType;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAdmins = async () => {
    try {
      const response = await adminFetch('/api/admin/audit-logs', {
        method: 'POST',
        body: JSON.stringify({ action: 'getAdmins' }),
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (actionFilter) params.append('action', actionFilter);
      if (resourceFilter) params.append('resourceType', resourceFilter);
      if (userFilter) params.append('userId', userFilter);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (searchQuery) params.append('search', searchQuery);

      const response = await adminFetch(`/api/admin/audit-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setLogs(result.data || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, actionFilter, resourceFilter, userFilter, dateFrom, dateTo, searchQuery]);

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs();
  };

  const resetFilters = () => {
    setActionFilter('');
    setResourceFilter('');
    setUserFilter('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const adminOptions = [
    { value: '', label: 'Toți utilizatorii' },
    ...admins.map(a => ({ value: a.id, label: a.full_name || a.email })),
  ];

  return (
    <div>
      <AdminPageHeader
        title="Jurnal de Activitate"
        description="Istoricul tuturor acțiunilor efectuate de administratori"
        breadcrumbs={[{ label: 'Jurnal de Activitate' }]}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/logs/erori">
              <AdminButton icon={AlertTriangle} variant="secondary">
                Erori Server
              </AdminButton>
            </Link>
            <AdminButton icon={RefreshCw} onClick={loadLogs} variant="secondary">
              Reîmprospătează
            </AdminButton>
          </div>
        }
      />

      {/* Filters */}
      <AdminCard className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Filter className="w-4 h-4" />
            Filtre
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminSelect
              label="Acțiune"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
              options={ACTION_OPTIONS}
            />
            <AdminSelect
              label="Tip resursă"
              value={resourceFilter}
              onChange={(e) => { setResourceFilter(e.target.value); setCurrentPage(1); }}
              options={RESOURCE_OPTIONS}
            />
            <AdminSelect
              label="Utilizator"
              value={userFilter}
              onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
              options={adminOptions}
            />
            <form onSubmit={handleSearch}>
              <AdminInput
                label="Caută"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută în titlu, email..."
              />
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminInput
              label="De la data"
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
            />
            <AdminInput
              label="Până la data"
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
            />
            <div className="flex items-end">
              <AdminButton variant="ghost" onClick={resetFilters}>
                Resetează filtrele
              </AdminButton>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Stats */}
      <div className="mb-6 text-sm text-slate-600">
        {totalCount} înregistrări găsite
      </div>

      {/* Logs List */}
      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Nu există înregistrări în jurnal.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="py-4 flex items-start gap-4">
                {/* Action Badge */}
                <div className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                  {getActionLabel(log.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-900">
                      {log.user_name || log.user_email || 'Utilizator necunoscut'}
                    </span>
                    <span className="text-slate-500">a {log.action === 'create' ? 'creat' : log.action === 'update' ? 'modificat' : log.action === 'delete' ? 'șters' : 'acționat asupra'}</span>
                    <span className="font-medium text-slate-700">
                      {getResourceLabel(log.resource_type)}
                    </span>
                  </div>
                  
                  {log.resource_title && (
                    <p className="text-sm text-slate-600 mt-1 truncate">
                      <FileText className="w-3 h-3 inline mr-1" />
                      {log.resource_title}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(log.created_at)}
                    </span>
                    {log.ip_address && log.ip_address !== 'unknown' && (
                      <span>IP: {log.ip_address}</span>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Pagination */}
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
