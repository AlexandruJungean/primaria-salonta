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
  Info,
  Landmark,
  Scale,
  FolderOpen,
  MoreHorizontal,
  Network,
  ScrollText,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  Heart,
  Eye,
  Megaphone,
  MessageSquare,
  FileSearch,
  ShoppingCart,
  Wallet,
  Receipt,
  BadgeCheck,
  Hammer,
  Home,
  Map,
  Leaf,
  Siren,
  Dog,
  FileSignature,
  Wheat,
  Tag,
  HardHat,
  Radio,
  FileQuestion,
  AlertCircle,
  ClipboardList,
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
      { id: 'hotarari-republicate', label: 'Hotărâri Republicate', href: '/admin/consiliul-local/hotarari-republicate', icon: ScrollText },
      { id: 'consilieri', label: 'Consilieri Locali', href: '/admin/consiliul-local/consilieri', icon: Users },
      { id: 'comisii', label: 'Comisii', href: '/admin/consiliul-local/comisii', icon: Briefcase },
      { id: 'declaratii-cl', label: 'Declarații Avere', href: '/admin/consiliul-local/declaratii', icon: FileCheck },
      { id: 'rapoarte-activitate', label: 'Rapoarte Activitate', href: '/admin/consiliul-local/rapoarte-activitate', icon: FileText },
    ],
  },
  {
    id: 'primaria',
    label: 'Primăria',
    icon: Building2,
    children: [
      { id: 'conducere', label: 'Conducere', href: '/admin/primaria/conducere', icon: UserCircle },
      { id: 'audiente', label: 'Audiențe', href: '/admin/primaria/audiente', icon: Calendar },
      { id: 'program', label: 'Program cu Publicul', href: '/admin/primaria/program', icon: Clock },
      { id: 'declaratii-p', label: 'Declarații Avere', href: '/admin/primaria/declaratii', icon: FileCheck },
      { id: 'organigrama', label: 'Organigrama', href: '/admin/primaria/organigrama', icon: Network },
      { id: 'regulament', label: 'Regulament ROF', href: '/admin/primaria/regulament', icon: ScrollText },
      { id: 'rapoarte-primar', label: 'Rapoarte Primar', href: '/admin/primaria/rapoarte-primar', icon: FileText },
      { id: 'legislatie', label: 'Legislație', href: '/admin/primaria/legislatie', icon: Scale },
    ],
  },
  {
    id: 'informatii-publice',
    label: 'Informații Publice',
    icon: Info,
    children: [
      { id: 'ip-achizitii', label: 'Achiziții Publice', href: '/admin/informatii-publice/achizitii', icon: ShoppingCart },
      { id: 'ip-acte-necesare', label: 'Acte Necesare', href: '/admin/informatii-publice/acte-necesare', icon: FileText },
      { id: 'ip-adapost-caini', label: 'Adăpost Câini', href: '/admin/informatii-publice/adapost-caini', icon: Dog },
      { id: 'ip-anunturi', label: 'Anunțuri', href: '/admin/informatii-publice/anunturi', icon: Megaphone },
      { id: 'ip-autorizatii', label: 'Autorizații Construire', href: '/admin/informatii-publice/autorizatii-construire', icon: Hammer },
      { id: 'ip-buget', label: 'Buget', href: '/admin/informatii-publice/buget', icon: Wallet },
      { id: 'ip-certificate', label: 'Certificate Urbanism', href: '/admin/informatii-publice/certificate-urbanism', icon: Home },
      { id: 'ip-concursuri', label: 'Concursuri', href: '/admin/informatii-publice/concursuri', icon: BadgeCheck },
      { id: 'ip-dispozitii', label: 'Dispoziții', href: '/admin/informatii-publice/dispozitii', icon: FileSignature },
      { id: 'ip-formulare', label: 'Formulare', href: '/admin/informatii-publice/formulare', icon: ClipboardList },
      { id: 'ip-gdpr', label: 'GDPR', href: '/admin/informatii-publice/gdpr', icon: ShieldCheck },
      { id: 'ip-taxe', label: 'Taxe și Impozite', href: '/admin/informatii-publice/taxe-impozite', icon: Receipt },
      { id: 'ip-licitatii', label: 'Licitații', href: '/admin/informatii-publice/licitatii', icon: Gavel },
      { id: 'ip-mediu', label: 'Mediu', href: '/admin/informatii-publice/mediu', icon: Leaf },
      { id: 'ip-oferte', label: 'Oferte Terenuri', href: '/admin/informatii-publice/oferte-terenuri', icon: Wheat },
      { id: 'ip-planuri', label: 'Planuri Urbanistice', href: '/admin/informatii-publice/planuri-urbanistice', icon: Map },
      { id: 'ip-publicatii-casatorie', label: 'Publicații Căsătorie', href: '/admin/informatii-publice/publicatii-casatorie', icon: Heart },
      { id: 'ip-publicatii-vanzare', label: 'Publicații Vânzare', href: '/admin/informatii-publice/publicatii-vanzare', icon: Tag },
      { id: 'ip-receptie', label: 'Recepție Lucrări', href: '/admin/informatii-publice/receptie-lucrari', icon: HardHat },
      { id: 'ip-regulamente', label: 'Regulamente', href: '/admin/informatii-publice/regulamente', icon: ScrollText },
      { id: 'ip-retele', label: 'Rețele Telecom', href: '/admin/informatii-publice/retele-telecom', icon: Radio },
      { id: 'ip-seip', label: 'SEIP', href: '/admin/informatii-publice/seip', icon: Network },
      { id: 'ip-solicitare', label: 'Solicitare Informații', href: '/admin/informatii-publice/solicitare-informatii', icon: FileQuestion },
      { id: 'ip-somatii', label: 'Somații', href: '/admin/informatii-publice/somatii', icon: AlertCircle },
      { id: 'ip-coronavirus', label: 'Coronavirus', href: '/admin/informatii-publice/coronavirus', icon: Siren },
    ],
  },
  {
    id: 'monitorul-oficial',
    label: 'Monitorul Oficial',
    icon: Landmark,
    children: [
      { id: 'mol-statut', label: 'Statut UAT', href: '/admin/monitorul-oficial/statut', icon: FileText },
      { id: 'mol-regulamente', label: 'Regulamente', href: '/admin/monitorul-oficial/regulamente', icon: Scale },
      { id: 'mol-hotarari', label: 'Hotărâri (Registre)', href: '/admin/monitorul-oficial/hotarari', icon: Gavel },
      { id: 'mol-dispozitii', label: 'Dispoziții (Registre)', href: '/admin/monitorul-oficial/dispozitii', icon: FileCheck },
      { id: 'mol-financiare', label: 'Documente Financiare', href: '/admin/monitorul-oficial/documente-financiare', icon: BookOpen },
      { id: 'mol-alte', label: 'Alte Documente', href: '/admin/monitorul-oficial/alte-documente', icon: FolderOpen },
    ],
  },
  {
    id: 'transparenta',
    label: 'Transparență',
    icon: Eye,
    children: [
      { id: 'tr-generale', label: 'Generale', href: '/admin/transparenta/generale', icon: FileText },
      { id: 'tr-anunturi', label: 'Anunțuri', href: '/admin/transparenta/anunturi', icon: Megaphone },
      { id: 'tr-dezbateri', label: 'Dezbateri Publice', href: '/admin/transparenta/dezbateri-publice', icon: MessageSquare },
      { id: 'tr-buletin', label: 'Buletin Informativ', href: '/admin/transparenta/buletin-informativ', icon: Newspaper },
    ],
  },
  {
    id: 'rapoarte-studii',
    label: 'Rapoarte și Studii',
    icon: ShieldCheck,
    children: [
      { id: 'rs-rapoarte', label: 'Rapoarte de Audit', href: '/admin/rapoarte-studii/rapoarte', icon: ShieldCheck },
      { id: 'rs-studii', label: 'Studii', href: '/admin/rapoarte-studii/studii', icon: FileSearch },
    ],
  },
  {
    id: 'altele',
    label: 'Altele',
    icon: MoreHorizontal,
    children: [
      { id: 'programe', label: 'Programe și Proiecte', href: '/admin/programe', icon: Target },
      { id: 'institutii', label: 'Instituții', href: '/admin/institutii', icon: GraduationCap },
      { id: 'cariera', label: 'Carieră / Concursuri', href: '/admin/cariera', icon: Briefcase },
      { id: 'voluntariat', label: 'Voluntariat', href: '/admin/voluntariat', icon: Heart },
      { id: 'faq', label: 'Întrebări Frecvente', href: '/admin/faq', icon: HelpCircle },
      { id: 'galerie', label: 'Galerie Foto', href: '/admin/galerie', icon: Image },
      { id: 'webcams', label: 'Camere Web', href: '/admin/webcams', icon: Video },
      { id: 'logs', label: 'Jurnal Activitate', href: '/admin/logs', icon: History },
    ],
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
