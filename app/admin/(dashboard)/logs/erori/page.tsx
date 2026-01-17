'use client';

import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Search, Filter, RefreshCw, Check, X, ChevronDown, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminPagination,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface ErrorLog {
  id: string;
  endpoint: string;
  method: string;
  error_message: string;
  error_stack: string | null;
  error_code: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  request_body: Record<string, unknown> | null;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 30;

const SEVERITY_OPTIONS = [
  { value: '', label: 'Toate severitățile' },
  { value: 'critical', label: '🔴 Critică' },
  { value: 'high', label: '🟠 Înaltă' },
  { value: 'medium', label: '🟡 Medie' },
  { value: 'low', label: '🟢 Scăzută' },
];

const RESOLVED_OPTIONS = [
  { value: '', label: 'Toate' },
  { value: 'false', label: 'Nerezolvate' },
  { value: 'true', label: 'Rezolvate' },
];

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityLabel = (severity: string) => {
  const labels: Record<string, string> = {
    critical: 'Critică',
    high: 'Înaltă',
    medium: 'Medie',
    low: 'Scăzută',
  };
  return labels[severity] || severity;
};

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-blue-100 text-blue-700';
    case 'POST': return 'bg-green-100 text-green-700';
    case 'PATCH': return 'bg-yellow-100 text-yellow-700';
    case 'PUT': return 'bg-orange-100 text-orange-700';
    case 'DELETE': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function ErrorLogsPage() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  
  // Filters
  const [severityFilter, setSeverityFilter] = useState('');
  const [resolvedFilter, setResolvedFilter] = useState('false'); // Default: show unresolved
  const [endpointFilter, setEndpointFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (severityFilter) params.append('severity', severityFilter);
      if (resolvedFilter) params.append('resolved', resolvedFilter);
      if (endpointFilter) params.append('endpoint', endpointFilter);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (searchQuery) params.append('search', searchQuery);

      const response = await adminFetch(`/api/admin/error-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setLogs(result.data || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, severityFilter, resolvedFilter, endpointFilter, dateFrom, dateTo, searchQuery]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs();
  };

  const resetFilters = () => {
    setSeverityFilter('');
    setResolvedFilter('false');
    setEndpointFilter('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleResolve = async (logId: string, resolved: boolean) => {
    try {
      const response = await adminFetch(`/api/admin/error-logs?id=${logId}`, {
        method: 'PATCH',
        body: JSON.stringify({ resolved }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      // Refresh the list
      loadLogs();
    } catch (error) {
      console.error('Error updating log:', error);
      alert('Eroare la actualizare');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Count unresolved errors by severity
  const criticalCount = logs.filter(l => l.severity === 'critical' && !l.resolved).length;
  const highCount = logs.filter(l => l.severity === 'high' && !l.resolved).length;

  return (
    <div>
      <AdminPageHeader
        title="Jurnal Erori Server"
        description="Monitorizare și gestionare erori API"
        breadcrumbs={[
          { label: 'Jurnal de Activitate', href: '/admin/logs' },
          { label: 'Erori Server' },
        ]}
        actions={
          <AdminButton icon={RefreshCw} onClick={loadLogs} variant="secondary">
            Reîmprospătează
          </AdminButton>
        }
      />

      {/* Alert for critical/high errors */}
      {(criticalCount > 0 || highCount > 0) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Atenție! Există erori nerezolvate</p>
            <p className="text-sm text-red-600">
              {criticalCount > 0 && <span className="mr-3">🔴 {criticalCount} critice</span>}
              {highCount > 0 && <span>🟠 {highCount} înalte</span>}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <AdminCard className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Filter className="w-4 h-4" />
            Filtre
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminSelect
              label="Severitate"
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
              options={SEVERITY_OPTIONS}
            />
            <AdminSelect
              label="Status"
              value={resolvedFilter}
              onChange={(e) => { setResolvedFilter(e.target.value); setCurrentPage(1); }}
              options={RESOLVED_OPTIONS}
            />
            <AdminInput
              label="Endpoint"
              value={endpointFilter}
              onChange={(e) => setEndpointFilter(e.target.value)}
              placeholder="/api/admin/..."
            />
            <form onSubmit={handleSearch}>
              <AdminInput
                label="Caută în mesaj"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută..."
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
        {totalCount} erori găsite
      </div>

      {/* Error Logs List */}
      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Check className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p>Nu există erori de afișat.</p>
            <p className="text-sm mt-1">Sistemul funcționează normal.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`py-4 ${log.resolved ? 'opacity-60' : ''}`}
              >
                {/* Main Row */}
                <div className="flex items-start gap-4">
                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    className="mt-1 p-1 hover:bg-slate-100 rounded"
                  >
                    {expandedLog === log.id ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Severity Badge */}
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityStyles(log.severity)}`}>
                    {getSeverityLabel(log.severity)}
                  </div>

                  {/* Method Badge */}
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                    {log.method}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <code className="font-mono text-slate-600 truncate max-w-md">
                        {log.endpoint}
                      </code>
                      {log.resolved && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Rezolvat
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-red-600 mt-1 truncate">
                      {log.error_message}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(log.created_at)}
                      </span>
                      {log.ip_address && log.ip_address !== 'unknown' && (
                        <span>IP: {log.ip_address}</span>
                      )}
                      {log.error_code && (
                        <span>Cod: {log.error_code}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!log.resolved ? (
                      <button
                        onClick={() => handleResolve(log.id, true)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Marchează ca rezolvat"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResolve(log.id, false)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                        title="Redeschide"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLog === log.id && (
                  <div className="mt-4 ml-10 p-4 bg-slate-50 rounded-lg text-sm">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-500 text-xs uppercase mb-1">User Agent</p>
                        <p className="text-slate-700 text-xs truncate">{log.user_agent || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase mb-1">User ID</p>
                        <p className="text-slate-700 text-xs">{log.user_id || 'N/A'}</p>
                      </div>
                    </div>

                    {log.error_message && (
                      <div className="mb-4">
                        <p className="text-slate-500 text-xs uppercase mb-1">Mesaj Eroare Complet</p>
                        <pre className="text-red-600 text-xs bg-red-50 p-2 rounded overflow-x-auto">
                          {log.error_message}
                        </pre>
                      </div>
                    )}

                    {log.error_stack && (
                      <div className="mb-4">
                        <p className="text-slate-500 text-xs uppercase mb-1">Stack Trace</p>
                        <pre className="text-slate-600 text-xs bg-white p-2 rounded border overflow-x-auto max-h-40">
                          {log.error_stack}
                        </pre>
                      </div>
                    )}

                    {log.request_body && Object.keys(log.request_body).length > 0 && (
                      <div>
                        <p className="text-slate-500 text-xs uppercase mb-1">Request Body</p>
                        <pre className="text-slate-600 text-xs bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(log.request_body, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.resolved_at && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-green-600 text-xs">
                          ✓ Rezolvat la {formatDate(log.resolved_at)}
                          {log.resolution_notes && ` - ${log.resolution_notes}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
