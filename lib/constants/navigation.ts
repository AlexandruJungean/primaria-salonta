import {
  MapPin,
  Clock,
  Palette,
  Map,
  Image,
  Eye,
  Globe,
  Award,
  TrendingUp,
  Building,
  BookOpen,
  Landmark,
  Heart,
  Utensils,
  Users,
  Bird,
  Waves,
  Scale,
  UserCircle,
  FileText,
  LayoutGrid,
  Calendar,
  Mic,
  FileCheck,
  Megaphone,
  MessageSquare,
  Newspaper,
  ShoppingCart,
  ClipboardList,
  Home as HomeIcon,
  Hammer,
  Receipt,
  Briefcase,
  FileSearch,
  Building2,
  TreePine,
  FileSpreadsheet,
  Bell,
  BadgeCheck,
  Wallet,
  Gavel,
  ScrollText,
  BarChart3,
  Target,
  Euro,
  Leaf,
  ShieldCheck,
  Siren,
  Video,
  Phone,
  CreditCard,
  Send,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  href: string;
  icon?: LucideIcon;
  children?: NavItem[];
}

// User-centric navigation structure (like Oradea City Hall)
// Grouped by WHO is visiting: Citizens, Businesses, City Hall, Tourists

export const MAIN_NAVIGATION: NavItem[] = [
  // 1. FOR CITIZENS - Services and information for residents
  {
    id: 'pentruCetateni',
    href: '/servicii-online',
    icon: Users,
    children: [
      // Online Services
      { id: 'platiOnline', href: '/servicii-online/plati', icon: CreditCard },
      { id: 'petitiiOnline', href: '/servicii-online/petitii', icon: Send },
      { id: 'formulare', href: '/servicii-online/formulare', icon: ClipboardList },
      // Taxes & Fees
      { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
      // Schedule & Audiences
      { id: 'program', href: '/primaria/program', icon: Calendar },
      { id: 'audiente', href: '/primaria/audiente', icon: Mic },
      // Announcements & Jobs
      { id: 'anunturi', href: '/transparenta/anunturi', icon: Megaphone },
      { id: 'concursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
      // Social Services
      { id: 'asistentaMedicala', href: '/institutii/asistenta-medicala', icon: Heart },
      { id: 'cantinaSociala', href: '/institutii/cantina-sociala', icon: Utensils },
      { id: 'centrulZi', href: '/institutii/centrul-de-zi', icon: Users },
    ],
  },
  // 2. FOR BUSINESSES - Permits, procurement, urban planning
  {
    id: 'pentruFirme',
    href: '/informatii-publice',
    icon: Briefcase,
    children: [
      // Procurement
      { id: 'achizitiiPublice', href: '/informatii-publice/achizitii', icon: ShoppingCart },
      // Urban Planning & Permits
      { id: 'autorizatiiConstruire', href: '/informatii-publice/autorizatii-construire', icon: Hammer },
      { id: 'certificateUrbanism', href: '/informatii-publice/certificate-urbanism', icon: HomeIcon },
      { id: 'planuriUrbanistice', href: '/informatii-publice/planuri-urbanistice', icon: Map },
      // Taxes (also relevant for businesses)
      { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
      // Jobs & Competitions
      { id: 'concursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
      // Economy
      { id: 'economie', href: '/localitatea/economie', icon: TrendingUp },
      // Environment
      { id: 'mediu', href: '/informatii-publice/mediu', icon: Leaf },
    ],
  },
  // 3. CITY HALL - Administration, Council, Transparency, Documents
  {
    id: 'primpieSalonta',
    href: '/primaria',
    icon: Building2,
    children: [
      // Leadership
      { id: 'conducere', href: '/primaria/conducere', icon: UserCircle },
      { id: 'organigrama', href: '/primaria/organigrama', icon: LayoutGrid },
      // Local Council
      { id: 'consiliulLocal', href: '/consiliul-local', icon: Users },
      { id: 'consilieriLocali', href: '/consiliul-local/consilieri', icon: Users },
      { id: 'comisii', href: '/consiliul-local/comisii', icon: Briefcase },
      // Transparency
      { id: 'transparenta', href: '/transparenta', icon: Eye },
      { id: 'declaratiiAvere', href: '/primaria/declaratii-avere', icon: FileCheck },
      { id: 'buget', href: '/informatii-publice/buget', icon: Wallet },
      // Official Documents
      { id: 'hotarari', href: '/consiliul-local/hotarari', icon: Gavel },
      { id: 'dispozitii', href: '/monitorul-oficial/dispozitii', icon: FileCheck },
      { id: 'regulamente', href: '/monitorul-oficial/regulamente', icon: Scale },
      // Reports
      { id: 'rapoarteAnuale', href: '/primaria/rapoarte-anuale', icon: BarChart3 },
      // Programs & Projects
      { id: 'programe', href: '/programe', icon: Target },
      // GDPR
      { id: 'gdpr', href: '/informatii-publice/gdpr', icon: ShieldCheck },
    ],
  },
  // 4. TOURIST IN SALONTA - Attractions, culture, history
  {
    id: 'turistSalonta',
    href: '/localitatea',
    icon: MapPin,
    children: [
      // About the City
      { id: 'localizare', href: '/localitatea/localizare', icon: MapPin },
      { id: 'istoric', href: '/localitatea/istoric', icon: Clock },
      { id: 'cultura', href: '/localitatea/cultura', icon: Palette },
      // Explore
      { id: 'galerie', href: '/localitatea/galerie', icon: Image },
      { id: 'excursieVirtuala', href: '/localitatea/excursie-virtuala', icon: Eye },
      { id: 'hartaDigitala', href: '/localitatea/harta-digitala', icon: Map },
      // Cultural Institutions
      { id: 'casaCultura', href: '/institutii/casa-cultura', icon: Building },
      { id: 'biblioteca', href: '/institutii/biblioteca', icon: BookOpen },
      { id: 'muzeu', href: '/institutii/muzeu', icon: Landmark },
      { id: 'cuibulDropiei', href: '/institutii/cuibul-dropiei', icon: Bird },
      // Recreation
      { id: 'bazinInot', href: '/institutii/bazin-inot', icon: Waves },
      // Twin Cities & Honorary Citizens
      { id: 'oraseInfratite', href: '/localitatea/orase-infratite', icon: Globe },
      { id: 'cetateniOnoare', href: '/localitatea/cetateni-de-onoare', icon: Award },
    ],
  },
];

// Secondary navigation - quick access items (shown separately in nav bar)
export const SECONDARY_NAVIGATION: NavItem[] = [
  {
    id: 'stiri',
    href: '/stiri',
    icon: Newspaper,
  },
  {
    id: 'camereWeb',
    href: '/camere-web',
    icon: Video,
  },
  {
    id: 'contact',
    href: '/contact',
    icon: Phone,
  },
];

// Full navigation (for mobile menu - includes all items with proper structure)
export const FULL_NAVIGATION: NavItem[] = [...MAIN_NAVIGATION, ...SECONDARY_NAVIGATION];

// Quick access links for homepage
export const QUICK_LINKS = [
  { id: 'platiOnline', href: '/servicii-online/plati', icon: CreditCard },
  { id: 'petitiiOnline', href: '/servicii-online/petitii', icon: Send },
  { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
  { id: 'anunturi', href: '/transparenta/anunturi', icon: Bell },
  { id: 'concursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
  { id: 'program', href: '/primaria/program', icon: Calendar },
];

