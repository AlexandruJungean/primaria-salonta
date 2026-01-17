'use client';

import { useState } from 'react';
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
  Briefcase,
  Mail,
  Image,
  Video,
  Settings,
  ChevronDown,
  ChevronRight,
  Gavel,
  ListChecks,
  UserCircle,
  Clock,
  FileCheck,
  History,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Acasă',
    href: '/admin',
    icon: LayoutDashboard,
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
    icon: Users,
    children: [
      { id: 'ordine-de-zi', label: 'Ordine de Zi', href: '/admin/consiliul-local/ordine-de-zi', icon: ListChecks },
      { id: 'hotarari', label: 'Hotărâri', href: '/admin/consiliul-local/hotarari', icon: Gavel },
      { id: 'consilieri', label: 'Consilieri Locali', href: '/admin/consiliul-local/consilieri', icon: Users },
      { id: 'comisii', label: 'Comisii', href: '/admin/consiliul-local/comisii', icon: Briefcase },
      { id: 'declaratii-cl', label: 'Declarații Avere', href: '/admin/consiliul-local/declaratii', icon: FileCheck },
    ],
  },
  {
    id: 'primaria',
    label: 'Primăria',
    icon: Building2,
    children: [
      { id: 'conducere', label: 'Conducere', href: '/admin/primaria/conducere', icon: UserCircle },
      { id: 'program', label: 'Program cu Publicul', href: '/admin/primaria/program', icon: Clock },
      { id: 'declaratii-p', label: 'Declarații Avere', href: '/admin/primaria/declaratii', icon: FileCheck },
    ],
  },
  {
    id: 'documente',
    label: 'Documente',
    href: '/admin/documente',
    icon: FileText,
  },
  {
    id: 'programe',
    label: 'Programe și Proiecte',
    href: '/admin/programe',
    icon: Target,
  },
  {
    id: 'institutii',
    label: 'Instituții',
    href: '/admin/institutii',
    icon: GraduationCap,
  },
  {
    id: 'cariera',
    label: 'Carieră / Concursuri',
    href: '/admin/cariera',
    icon: Briefcase,
  },
  {
    id: 'mesaje',
    label: 'Mesaje Primite',
    icon: Mail,
    children: [
      { id: 'petitii', label: 'Petiții Online', href: '/admin/mesaje/petitii', icon: Mail },
      { id: 'contact', label: 'Mesaje Contact', href: '/admin/mesaje/contact', icon: Mail },
    ],
  },
  {
    id: 'galerie',
    label: 'Galerie Foto',
    href: '/admin/galerie',
    icon: Image,
  },
  {
    id: 'webcams',
    label: 'Camere Web',
    href: '/admin/webcams',
    icon: Video,
  },
  {
    id: 'logs',
    label: 'Jurnal Activitate',
    href: '/admin/logs',
    icon: History,
  },
  {
    id: 'setari',
    label: 'Setări',
    href: '/admin/setari',
    icon: Settings,
  },
];

function NavItemComponent({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(
    item.children?.some(child => pathname.startsWith(child.href || '')) || false
  );

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname || 
    (hasChildren && item.children?.some(child => pathname.startsWith(child.href || '')));

  const Icon = item.icon;

  const baseClasses = `
    w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all
    text-base font-medium
  `;

  const activeClasses = isActive
    ? 'bg-blue-600 text-white'
    : 'text-slate-300 hover:bg-slate-700 hover:text-white';

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${baseClasses} ${activeClasses}`}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{item.label}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => (
              <NavItemComponent key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`${baseClasses} ${activeClasses}`}
      style={{ paddingLeft: `${16 + level * 16}px` }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="w-72 bg-slate-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
            <NextImage
              src="/logo/logo-transparent.webp"
              alt="Primăria Salonta"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Primăria Salonta</h1>
            <p className="text-sm text-slate-400">Panou Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map(item => (
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
  );
}
