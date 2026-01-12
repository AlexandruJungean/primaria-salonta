'use client';

import { Eye, Pencil, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminButton } from './admin-button';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  canDelete?: (item: T) => boolean;
  deleteTooltip?: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

export function AdminTable<T extends { id: string }>({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  canDelete = () => true,
  deleteTooltip,
  emptyMessage = 'Nu există date de afișat.',
  loading = false,
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-slate-500 mt-4">Se încarcă...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-base font-semibold text-slate-700 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 text-right text-base font-semibold text-slate-700 w-48">
                  Acțiuni
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                {columns.map(column => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-base text-slate-900 ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key as string] || '-')}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Vizualizează"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Editează"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => canDelete(item) && onDelete(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            canDelete(item)
                              ? 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title={deleteTooltip ? deleteTooltip(item) : (canDelete(item) ? 'Șterge' : 'Nu se poate șterge')}
                          disabled={!canDelete(item)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: AdminPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 rounded-b-xl">
      <p className="text-base text-slate-600">
        Afișare {startItem} - {endItem} din {totalItems} rezultate
      </p>
      <div className="flex items-center gap-2">
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={ChevronLeft}
        >
          Anterior
        </AdminButton>
        <span className="px-4 py-2 text-base font-medium text-slate-700">
          Pagina {currentPage} din {totalPages}
        </span>
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={ChevronRight}
          iconPosition="right"
        >
          Următor
        </AdminButton>
      </div>
    </div>
  );
}
