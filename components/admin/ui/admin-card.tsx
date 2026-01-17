export interface AdminCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export function AdminCard({ children, title, description, className = '', actions, onClick }: AdminCardProps) {
  const baseClassName = `bg-white rounded-xl shadow-sm border border-slate-200 text-left w-full ${className}`;
  
  const content = (
    <>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={baseClassName} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}

interface AdminCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function AdminCardGrid({ children, columns = 3, className = '' }: AdminCardGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>{children}</div>;
}
