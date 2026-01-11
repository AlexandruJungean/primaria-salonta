'use client';

import { Link } from '@/components/ui/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export function Pagination({ currentPage, totalPages, basePath, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5; // Number of page buttons to show
    
    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      
      // Add ellipsis before middle pages if needed
      if (start > 2) {
        pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    const separator = basePath.includes('?') ? '&' : '?';
    return `${basePath}${separator}page=${page}`;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav 
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Paginare"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors"
          aria-label="Pagina anterioară"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-10 h-10 text-gray-500"
              >
                <MoreHorizontal className="w-5 h-5" />
              </span>
            );
          }

          const isActive = page === currentPage;

          return isActive ? (
            <span
              key={page}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white font-medium"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors font-medium"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors"
          aria-label="Pagina următoare"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </nav>
  );
}

// Info about current page position
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage,
  className 
}: PaginationInfoProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p className={cn('text-sm text-gray-600 text-center', className)}>
      Afișare {start}-{end} din {totalItems} rezultate
      {totalPages > 1 && (
        <span className="ml-2">
          (Pagina {currentPage} din {totalPages})
        </span>
      )}
    </p>
  );
}
