import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8">
      {/* Breadcrumbs - scrollable on mobile */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-3 lg:mb-4 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/admin" className="hover:text-blue-600 transition-colors flex-shrink-0">
            Acasă
          </Link>
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-2 flex-shrink-0">
              <ChevronRight className="w-4 h-4" />
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-700 font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title and Actions - stack on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{title}</h1>
          {description && (
            <p className="text-base lg:text-lg text-slate-500 mt-1 lg:mt-2">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
