interface AdminStatusBadgeProps {
  status: 'active' | 'inactive' | 'draft' | 'published' | 'pending' | 'completed' | 'cancelled';
  size?: 'sm' | 'md';
}

const statusConfig = {
  active: { label: 'În lucru', className: 'bg-amber-100 text-amber-800' },
  inactive: { label: 'Inactiv', className: 'bg-slate-100 text-slate-600' },
  draft: { label: 'Ciornă', className: 'bg-slate-100 text-slate-600' },
  published: { label: 'Publicat', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Nou', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Rezolvat', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Respins', className: 'bg-red-100 text-red-800' },
};

export function AdminStatusBadge({ status, size = 'md' }: AdminStatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.className} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
