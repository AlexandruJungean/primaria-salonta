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
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-semibold text-slate-700 whitespace-nowrap ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-semibold text-slate-700 w-32 sm:w-48">
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
                    className={`px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-slate-900 ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key as string] || '-')}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="p-1.5 sm:p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Vizualizează"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 sm:p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Editează"
                        >
                          <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => canDelete(item) && onDelete(item)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            canDelete(item)
                              ? 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title={deleteTooltip ? deleteTooltip(item) : (canDelete(item) ? 'Șterge' : 'Nu se poate șterge')}
                          disabled={!canDelete(item)}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(val) && val >= 1 && val <= totalPages) {
        onPageChange(val);
      } else {
        (e.target as HTMLInputElement).value = currentPage.toString();
      }
    }
  };

  const handlePageBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val);
    } else {
      e.target.value = currentPage.toString();
    }
  };

  // Show page number buttons for quick navigation
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white border-t border-slate-200 rounded-b-xl">
      <p className="text-sm sm:text-base text-slate-600 order-2 sm:order-1">
        {startItem} - {endItem} din {totalItems}
      </p>
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={ChevronLeft}
        >
          <span className="hidden sm:inline">Anterior</span>
        </AdminButton>

        {/* Page numbers */}
        <div className="hidden md:flex items-center gap-1">
          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="px-1 text-slate-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`min-w-[32px] h-8 px-2 text-sm rounded-md transition-colors ${
                  p === currentPage
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Editable page input (always visible on mobile, alongside buttons on desktop) */}
        <div className="flex items-center gap-1.5 md:ml-2 md:pl-2 md:border-l md:border-slate-200">
          <span className="text-xs text-slate-400 hidden md:inline">pag.</span>
          <input
            key={currentPage}
            type="number"
            defaultValue={currentPage}
            min={1}
            max={totalPages}
            onKeyDown={handlePageInput}
            onBlur={handlePageBlur}
            className="w-14 h-8 px-2 text-sm text-center border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-slate-400">/ {totalPages}</span>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={ChevronRight}
          iconPosition="right"
        >
          <span className="hidden sm:inline">Următor</span>
        </AdminButton>
      </div>
    </div>
  );
}
