'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileCheck, AlertTriangle } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminConfirmDialog,
  AdminSelect,
  toast,
  canDeleteItem,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Declaration {
  id: string;
  person_name: string;
  position: string;
  department: string;
  declaration_year: number;
  avere_file_url: string | null;
  interese_file_url: string | null;
  published: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 15;
const DELETE_LIMIT_HOURS = 24;

const POSITION_TYPES = [
  { value: '', label: 'Toate' },
  { value: 'alesi', label: 'Aleși locali (Primar, Viceprimar)' },
  { value: 'functionari', label: 'Funcționari publici' },
];

export default function DeclaratiiPrimariePage() {
  const router = useRouter();
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Declaration | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: 10 }, (_, i) => currentYear - i);
    setYears(yearsList);
    setYearFilter(currentYear.toString());
  }, []);

  const loadDeclarations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        department: 'primaria',
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (yearFilter) {
        params.append('year', yearFilter);
      }

      if (positionFilter) {
        params.append('positionFilter', positionFilter);
      }

      const response = await adminFetch(`/api/admin/asset-declarations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();

      // Filter by position type client-side since the API doesn't support it
      let filteredData = result.data || [];
      if (positionFilter === 'alesi') {
        filteredData = filteredData.filter((d: Declaration) => {
          const pos = d.position?.toLowerCase() || '';
          return pos.includes('primar') || pos.includes('viceprimar');
        });
      } else if (positionFilter === 'functionari') {
        filteredData = filteredData.filter((d: Declaration) => {
          const pos = d.position?.toLowerCase() || '';
          return pos.includes('funcționar') || pos.includes('functionar') || pos.includes('secretar');
        });
      }

      setDeclarations(filteredData);
      setTotalCount(positionFilter ? filteredData.length : (result.count || 0));
    } catch (error) {
      console.error('Error loading declarations:', error);
      toast.error('Eroare', 'Nu s-au putut încărca declarațiile.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, yearFilter, positionFilter]);

  useEffect(() => {
    if (yearFilter) loadDeclarations();
  }, [loadDeclarations, yearFilter]);

  const handleEdit = (item: Declaration) => {
    router.push(`/admin/primaria/declaratii/${item.id}`);
  };

  const canDelete = (item: Declaration): boolean => {
    return canDeleteItem(item.created_at, DELETE_LIMIT_HOURS);
  };

  const confirmDelete = (item: Declaration) => {
    if (!canDelete(item)) {
      toast.warning('Nu se poate șterge', 'Declarațiile pot fi șterse doar în primele 24 de ore.');
      return;
    }
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/asset-declarations?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Declarația a fost ștearsă.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadDeclarations();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
    }
  };

  const isAlesLocal = (position: string) => {
    const pos = position?.toLowerCase() || '';
    return pos.includes('primar') || pos.includes('viceprimar');
  };

  const columns = [
    {
      key: 'person_name',
      label: 'Persoană',
      render: (item: Declaration) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900">{item.person_name}</p>
            {isAlesLocal(item.position) && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                Ales local
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{item.position}</p>
        </div>
      ),
    },
    {
      key: 'avere',
      label: 'Declarație Avere',
      className: 'w-36',
      render: (item: Declaration) => (
        item.avere_file_url ? (
          <a href={item.avere_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            <FileCheck className="w-4 h-4" /> Descarcă
          </a>
        ) : <span className="text-slate-400">-</span>
      ),
    },
    {
      key: 'interese',
      label: 'Declarație Interese',
      className: 'w-36',
      render: (item: Declaration) => (
        item.interese_file_url ? (
          <a href={item.interese_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            <FileCheck className="w-4 h-4" /> Descarcă
          </a>
        ) : <span className="text-slate-400">-</span>
      ),
    },
    {
      key: 'can_delete',
      label: '',
      className: 'w-10',
      render: (item: Declaration) => (
        !canDelete(item) ? <span title="Nu se poate șterge"><AlertTriangle className="w-4 h-4 text-amber-500" /></span> : null
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const yearOptions = years.map(y => ({ value: y.toString(), label: y.toString() }));

  return (
    <div>
      <AdminPageHeader
        title="Declarații de Avere - Primărie"
        description="Gestionează declarațiile de avere și interese ale aleșilor locali (primar, viceprimar) și funcționarilor publici"
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Declarații de Avere' },
        ]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/primaria/declaratii/nou')}>
            Adaugă Declarație
          </AdminButton>
        }
      />

      <AdminCard className="mb-6 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-amber-800"><strong>Atenție:</strong> Declarațiile pot fi șterse doar în primele 24 de ore de la încărcare.</p>
        </div>
      </AdminCard>

      <AdminCard className="mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="w-64">
            <AdminSelect 
              label="Tip persoană" 
              value={positionFilter} 
              onChange={(e) => { setPositionFilter(e.target.value); setCurrentPage(1); }} 
              options={POSITION_TYPES} 
            />
          </div>
          <div className="w-40">
            <AdminSelect label="Anul" value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }} options={yearOptions} />
          </div>
        </div>
      </AdminCard>

      <AdminTable data={declarations} columns={columns} loading={loading} onEdit={handleEdit} onDelete={confirmDelete} canDelete={canDelete} emptyMessage="Nu există declarații pentru anul selectat." />

      {totalPages > 1 && <AdminPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Declarația?" message={`Ștergi declarația pentru "${itemToDelete?.person_name}"?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
