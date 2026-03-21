'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  Building2,
  FileText,
  Target,
  GraduationCap,
  Mail,
  Settings,
  ChevronRight,
  History,
  Info,
  Landmark,
  ShieldCheck,
  MoreHorizontal,
  Eye,
  UserCog,
  MapPin,
  CreditCard,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubPages?: boolean;
  requiredRole?: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Acasă',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    id: 'documente',
    label: 'Documente',
    href: '/admin/documente',
    icon: FileText,
  },
  {
    id: 'utilizatori',
    label: 'Utilizatori',
    href: '/admin/utilizatori',
    icon: UserCog,
    requiredRole: 'super_admin',
  },
  {
    id: 'logs',
    label: 'Jurnal Activitate',
    href: '/admin/logs',
    icon: History,
    requiredRole: 'super_admin',
  },
  {
    id: 'setari',
    label: 'Setări',
    href: '/admin/setari',
    icon: Settings,
  },
  {
    id: 'mesaje',
    label: 'Mesaje Primite',
    href: '/admin/mesaje',
    icon: Mail,
    hasSubPages: true,
  },
  {
    id: 'stiri',
    label: 'Știri și Anunțuri',
    href: '/admin/stiri',
    icon: Newspaper,
  },
  {
    id: 'evenimente',
    label: 'Evenimente',
    href: '/admin/evenimente',
    icon: Calendar,
  },
  {
    id: 'consiliul-local',
    label: 'Consiliul Local',
    href: '/admin/consiliul-local',
    icon: Users,
    hasSubPages: true,
  },
  {
    id: 'primaria',
    label: 'Primăria',
    href: '/admin/primaria',
    icon: Building2,
    hasSubPages: true,
  },
  {
    id: 'informatii-publice',
    label: 'Informații Publice',
    href: '/admin/informatii-publice',
    icon: Info,
    hasSubPages: true,
  },
  {
    id: 'monitorul-oficial',
    label: 'Monitorul Oficial',
    href: '/admin/monitorul-oficial',
    icon: Landmark,
    hasSubPages: true,
  },
  {
    id: 'transparenta',
    label: 'Transparență',
    href: '/admin/transparenta',
    icon: Eye,
    hasSubPages: true,
  },
  {
    id: 'programe',
    label: 'Programe și Strategii',
    href: '/admin/programe',
    icon: Target,
    hasSubPages: true,
  },
  {
    id: 'rapoarte-studii',
    label: 'Rapoarte și Studii',
    href: '/admin/rapoarte-studii',
    icon: ShieldCheck,
    hasSubPages: true,
  },
  {
    id: 'institutii',
    label: 'Instituții',
    href: '/admin/institutii',
    icon: GraduationCap,
    hasSubPages: true,
  },
  {
    id: 'localitatea',
    label: 'Localitatea',
    href: '/admin/localitatea',
    icon: MapPin,
    hasSubPages: true,
  },
  {
    id: 'servicii-online',
    label: 'Servicii Online',
    href: '/admin/servicii-online',
    icon: CreditCard,
    hasSubPages: true,
  },
  {
    id: 'altele',
    label: 'Altele',
    href: '/admin/altele',
    icon: MoreHorizontal,
    hasSubPages: true,
  },
];

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = item.href === '/admin'
    ? pathname === '/admin'
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  const classes = `
    w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all
    text-base font-medium
    ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
  `;

  return (
    <Link href={item.href} className={classes}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.hasSubPages && (
        <ChevronRight className="w-4 h-4 opacity-50" />
      )}
    </Link>
  );
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: string;
}

export function AdminSidebar({ isOpen = true, onClose, userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = navigationItems.filter(
    item => !item.requiredRole || item.requiredRole === userRole
  );

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-slate-800 min-h-screen flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <NextImage
              src="/logo/icon.webp"
              alt="Primăria Salonta"
              width={421}
              height={600}
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-white">Primăria Salonta</h1>
              <p className="text-sm text-slate-400">Panou Admin</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleItems.map(item => (
            <NavItemComponent key={item.id} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <Link
            href="/ro"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Înapoi la website
          </Link>
        </div>
      </aside>
    </>
  );
}
