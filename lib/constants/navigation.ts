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
  HelpCircle,
  AlertTriangle,
  Stethoscope,
  GraduationCap,
  Bus,
  Dumbbell,
  Wheat,
  Store,
  FileStack,
  BookMarked,
  Folder,
  FolderOpen,
  CircleDollarSign,
  ListChecks,
  Speech,
  Info,
  FileArchive,
  Flag,
  Dog,
  FileSignature,
  Tag,
  HardHat,
  Radio,
  Network,
  FileQuestion,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  href: string;
  icon?: LucideIcon;
  children?: NavItem[];
  label?: string; // Direct label for dynamic items (bypasses translation)
}

// Group of related items (from same second-root path)
export interface NavGroup {
  groupId: string; // Translation key for group header
  groupHref?: string; // Optional link for the group header itself
  groupIcon?: LucideIcon;
  items: NavItem[];
  isDynamic?: boolean; // Flag for dynamically loaded items
  dynamicType?: string; // Type identifier for dynamic loading
}

// Main navigation section with groups and standalone items
export interface NavSection {
  id: string;
  href: string;
  icon?: LucideIcon;
  groups?: NavGroup[]; // Grouped items (from same second-root)
  standaloneItems?: NavItem[]; // Ungrouped/standalone items
}

// User-centric navigation structure
// Grouped by WHO is visiting: Citizens, Businesses, City Hall, Tourists

export const MAIN_NAVIGATION: NavSection[] = [
  // 1. FOR CITIZENS - Services and information for residents
  {
    id: 'pentruCetateni',
    href: '/servicii-online',
    icon: Users,
    groups: [
      // Public Information group - Column 1 (citizen-relevant)
      {
        groupId: 'informatiiPublice',
        groupHref: '/informatii-publice',
        groupIcon: FileSearch,
        items: [
          { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
          { id: 'carieraConcursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
          { id: 'acteNecesare', href: '/informatii-publice/acte-necesare', icon: FileText },
          { id: 'formulare', href: '/informatii-publice/formulare', icon: ClipboardList },
          { id: 'adapostCaini', href: '/informatii-publice/adapost-caini', icon: Dog },
        ],
      },
      // Public Information group - Column 2 (citizen-relevant continuation)
      {
        groupId: 'informatiiPubliceContinuare',
        groupIcon: FileSearch,
        items: [
          { id: 'anunturi', href: '/informatii-publice/anunturi', icon: Megaphone },
          { id: 'publicatiiCasatorie', href: '/informatii-publice/publicatii-casatorie', icon: Heart },
          { id: 'somatii', href: '/informatii-publice/somatii', icon: AlertCircle },
          { id: 'solicitareInformatii', href: '/informatii-publice/solicitare-informatii', icon: FileQuestion },
        ],
      },
      // Transparency group
      {
        groupId: 'transparenta',
        groupHref: '/transparenta',
        groupIcon: Eye,
        items: [
          { id: 'anunturi', href: '/transparenta/anunturi', icon: Megaphone },
          { id: 'dezbateriPublice', href: '/transparenta/dezbateri-publice', icon: Speech },
          { id: 'buletinInformativ', href: '/transparenta/buletin-informativ', icon: Info },
          { id: 'generale', href: '/transparenta/generale', icon: FileText },
        ],
      },
      // Online Services group
      {
        groupId: 'serviciiOnline',
        groupHref: '/servicii-online',
        groupIcon: CreditCard,
        items: [
          { id: 'platiOnline', href: '/servicii-online/plati', icon: CreditCard },
          { id: 'petitiiOnline', href: '/servicii-online/petitii', icon: Send },
          { id: 'problemeSociale', href: '/servicii-online/probleme-sociale', icon: Heart },
        ],
      },
      // Social Institutions group - items loaded dynamically
      {
        groupId: 'institutii',
        groupHref: '/institutii',
        groupIcon: Building,
        items: [], // Populated dynamically from database
        isDynamic: true, // Flag for dynamic loading
        dynamicType: 'institutions-social',
      },
      // City Hall services group
      {
        groupId: 'primaria',
        groupHref: '/primaria',
        groupIcon: Building2,
        items: [
          { id: 'program', href: '/primaria/program', icon: Calendar },
          { id: 'audiente', href: '/primaria/audiente', icon: Mic },
        ],
      },
    ],
    standaloneItems: [
      { id: 'raporteazaProblema', href: '/raporteaza-problema', icon: AlertTriangle },
      { id: 'evenimente', href: '/evenimente', icon: Calendar },
      { id: 'stareCivila', href: '/stare-civila', icon: FileText },
      { id: 'registruAgricol', href: '/registru-agricol', icon: Wheat },
      { id: 'sanatate', href: '/sanatate', icon: Stethoscope },
      { id: 'educatie', href: '/educatie', icon: GraduationCap },
      { id: 'transport', href: '/transport', icon: Bus },
      { id: 'voluntariat', href: '/voluntariat', icon: Heart },
      { id: 'faq', href: '/faq', icon: HelpCircle },
    ],
  },
  // 2. FOR BUSINESSES - Permits, procurement, urban planning
  {
    id: 'pentruFirme',
    href: '/informatii-publice',
    icon: Briefcase,
    groups: [
      // Public Information group - Column 1 (business-relevant)
      {
        groupId: 'informatiiPublice',
        groupHref: '/informatii-publice',
        groupIcon: FileSearch,
        items: [
          { id: 'achizitiiPublice', href: '/informatii-publice/achizitii', icon: ShoppingCart },
          { id: 'autorizatiiConstruire', href: '/informatii-publice/autorizatii-construire', icon: Hammer },
          { id: 'certificateUrbanism', href: '/informatii-publice/certificate-urbanism', icon: HomeIcon },
          { id: 'planuriUrbanistice', href: '/informatii-publice/planuri-urbanistice', icon: Map },
          { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
          { id: 'carieraConcursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
          { id: 'mediu', href: '/informatii-publice/mediu', icon: Leaf },
        ],
      },
      // Public Information group - Column 2 (business-relevant continuation)
      {
        groupId: 'informatiiPubliceContinuare',
        groupIcon: FileSearch,
        items: [
          { id: 'licitatii', href: '/informatii-publice/licitatii', icon: Gavel },
          { id: 'formulare', href: '/informatii-publice/formulare', icon: ClipboardList },
          { id: 'oferteTerenuri', href: '/informatii-publice/oferte-terenuri', icon: Wheat },
          { id: 'receptieLucrari', href: '/informatii-publice/receptie-lucrari', icon: HardHat },
          { id: 'regulamente', href: '/informatii-publice/regulamente', icon: ScrollText },
          { id: 'reteleTelecom', href: '/informatii-publice/retele-telecom', icon: Radio },
          { id: 'publicatiiVanzare', href: '/informatii-publice/publicatii-vanzare', icon: Tag },
        ],
      },
      // Locality - Economy
      {
        groupId: 'localitatea',
        groupHref: '/localitatea',
        groupIcon: MapPin,
        items: [
          { id: 'economie', href: '/localitatea/economie', icon: TrendingUp },
        ],
      },
    ],
    standaloneItems: [
      { id: 'agentiEconomici', href: '/agenti-economici', icon: Store },
    ],
  },
  // 3. CITY HALL - Administration, Council, Transparency, Documents
  {
    id: 'primpieSalonta',
    href: '/primaria',
    icon: Building2,
    groups: [
      // City Hall group
      {
        groupId: 'primaria',
        groupHref: '/primaria',
        groupIcon: Building2,
        items: [
          { id: 'conducere', href: '/primaria/conducere', icon: UserCircle },
          { id: 'organigrama', href: '/primaria/organigrama', icon: LayoutGrid },
          { id: 'program', href: '/primaria/program', icon: Calendar },
          { id: 'audiente', href: '/primaria/audiente', icon: Mic },
          { id: 'declaratiiAvere', href: '/primaria/declaratii-avere', icon: FileCheck },
          { id: 'rapoarteAnuale', href: '/primaria/rapoarte-anuale', icon: BarChart3 },
          { id: 'legislatie', href: '/primaria/legislatie', icon: Scale },
          { id: 'regulamentPrimarie', href: '/primaria/regulament', icon: ScrollText },
        ],
      },
      // Programs & Strategies group
      {
        groupId: 'programe',
        groupHref: '/programe',
        groupIcon: Target,
        items: [
          { id: 'strategieDezvoltare', href: '/programe/strategie-dezvoltare', icon: TrendingUp },
          { id: 'pmud', href: '/programe/pmud', icon: Bus },
          { id: 'pnrr', href: '/programe/pnrr', icon: Euro },
          { id: 'proiecteEuropene', href: '/programe/proiecte-europene', icon: Globe },
          { id: 'proiecteLocale', href: '/programe/proiecte-locale', icon: MapPin },
          { id: 'programRegionalNordVest', href: '/programe/program-regional-nord-vest', icon: Building2 },
          { id: 'svsu', href: '/programe/svsu', icon: Siren },
          { id: 'sna', href: '/programe/sna', icon: ShieldCheck },
        ],
      },
      // Local Council group
      {
        groupId: 'consiliulLocal',
        groupHref: '/consiliul-local',
        groupIcon: Users,
        items: [
          { id: 'consilieriLocali', href: '/consiliul-local/consilieri', icon: Users },
          { id: 'comisii', href: '/consiliul-local/comisii', icon: Briefcase },
          { id: 'sedinte', href: '/consiliul-local/sedinte', icon: Calendar },
          { id: 'ordineZi', href: '/consiliul-local/ordine-de-zi', icon: ListChecks },
          { id: 'hotarari', href: '/consiliul-local/hotarari', icon: Gavel },
          { id: 'hotarariRepublicate', href: '/consiliul-local/hotarari-republicate', icon: FileStack },
          { id: 'declaratiiAvereConsiliu', href: '/consiliul-local/declaratii-avere', icon: FileCheck },
          { id: 'rapoarteActivitate', href: '/consiliul-local/rapoarte-activitate', icon: BarChart3 },
        ],
      },
      // Public Information group (administration-relevant)
      {
        groupId: 'informatiiPublice',
        groupHref: '/informatii-publice',
        groupIcon: FileSearch,
        items: [
          { id: 'buget', href: '/informatii-publice/buget', icon: Wallet },
          { id: 'gdpr', href: '/informatii-publice/gdpr', icon: ShieldCheck },
          { id: 'dispozitii', href: '/informatii-publice/dispozitii', icon: FileSignature },
          { id: 'regulamente', href: '/informatii-publice/regulamente', icon: ScrollText },
          { id: 'seip', href: '/informatii-publice/seip', icon: Network },
          { id: 'somatii', href: '/informatii-publice/somatii', icon: AlertCircle },
          { id: 'coronavirus', href: '/informatii-publice/coronavirus', icon: Siren },
        ],
      },
      // Official Monitor group
      {
        groupId: 'monitorulOficial',
        groupHref: '/monitorul-oficial',
        groupIcon: BookMarked,
        items: [
          { id: 'statutUat', href: '/monitorul-oficial/statut', icon: Flag },
          { id: 'regulamente', href: '/monitorul-oficial/regulamente', icon: Scale },
          { id: 'hotarariMol', href: '/monitorul-oficial/hotarari', icon: Gavel },
          { id: 'dispozitii', href: '/monitorul-oficial/dispozitii', icon: FileCheck },
          { id: 'documenteFinanciare', href: '/monitorul-oficial/documente-financiare', icon: CircleDollarSign },
          { id: 'alteDocumente', href: '/monitorul-oficial/alte-documente', icon: FolderOpen },
        ],
      },
      // Transparency group
      {
        groupId: 'transparenta',
        groupHref: '/transparenta',
        groupIcon: Eye,
        items: [
          { id: 'anunturi', href: '/transparenta/anunturi', icon: Megaphone },
          { id: 'dezbateriPublice', href: '/transparenta/dezbateri-publice', icon: Speech },
          { id: 'buletinInformativ', href: '/transparenta/buletin-informativ', icon: Info },
          { id: 'generale', href: '/transparenta/generale', icon: FileText },
        ],
      },
      // Reports & Studies group
      {
        groupId: 'rapoarteStudii',
        groupHref: '/rapoarte-studii',
        groupIcon: FileSearch,
        items: [
          { id: 'rapoarteAudit', href: '/rapoarte-studii/rapoarte', icon: ShieldCheck },
          { id: 'studii', href: '/rapoarte-studii/studii', icon: FileSearch },
        ],
      },
    ],
    standaloneItems: [],
  },
  // 4. TOURIST IN SALONTA - Attractions, culture, history
  {
    id: 'turistSalonta',
    href: '/localitatea',
    icon: MapPin,
    groups: [
      // Locality group
      {
        groupId: 'localitatea',
        groupHref: '/localitatea',
        groupIcon: MapPin,
        items: [
          { id: 'localizare', href: '/localitatea/localizare', icon: MapPin },
          { id: 'istoric', href: '/localitatea/istoric', icon: Clock },
          { id: 'cultura', href: '/localitatea/cultura', icon: Palette },
          { id: 'galerie', href: '/localitatea/galerie', icon: Image },
          { id: 'excursieVirtuala', href: '/localitatea/excursie-virtuala', icon: Eye },
          { id: 'hartaDigitala', href: '/localitatea/harta-digitala', icon: Map },
          { id: 'oraseInfratite', href: '/localitatea/orase-infratite', icon: Globe },
          { id: 'cetateniOnoare', href: '/localitatea/cetateni-de-onoare', icon: Award },
          { id: 'economie', href: '/localitatea/economie', icon: TrendingUp },
        ],
      },
      // Cultural Institutions group - items loaded dynamically
      {
        groupId: 'institutii',
        groupHref: '/institutii',
        groupIcon: Building,
        items: [], // Populated dynamically from database
        isDynamic: true, // Flag for dynamic loading
        dynamicType: 'institutions-cultural',
      },
    ],
    standaloneItems: [
      { id: 'sport', href: '/sport', icon: Dumbbell },
      { id: 'evenimente', href: '/evenimente', icon: Calendar },
      { id: 'voluntariat', href: '/voluntariat', icon: Heart },
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

// Legacy flat navigation for compatibility (mobile menu, etc.)
export const FLAT_NAVIGATION: NavItem[] = MAIN_NAVIGATION.map((section) => ({
  id: section.id,
  href: section.href,
  icon: section.icon,
  children: [
    // Add group items
    ...(section.groups?.flatMap((group) => group.items) || []),
    // Add standalone items
    ...(section.standaloneItems || []),
  ],
}));

// Full navigation (for mobile menu - includes all items with proper structure)
export const FULL_NAVIGATION: NavItem[] = [...FLAT_NAVIGATION, ...SECONDARY_NAVIGATION];

// Quick access links for homepage
export const QUICK_LINKS = [
  { id: 'platiOnline', href: '/servicii-online/plati', icon: CreditCard },
  { id: 'petitiiOnline', href: '/servicii-online/petitii', icon: Send },
  { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
  { id: 'anunturi', href: '/transparenta/anunturi', icon: Bell },
  { id: 'carieraConcursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
  { id: 'program', href: '/primaria/program', icon: Calendar },
];

// Icon mapping for dynamic institutions
export const INSTITUTION_ICONS: Record<string, LucideIcon> = {
  building: Building,
  bookOpen: BookOpen,
  landmark: Landmark,
  heart: Heart,
  utensils: Utensils,
  users: Users,
  bird: Bird,
  leaf: Bird,
  waves: Waves,
};

// Interface for dynamic institution nav items
export interface DynamicInstitution {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
  showInCitizens: boolean;
  showInTourists: boolean;
}

// Helper to get navigation with dynamic institutions merged in
export function getNavigationWithInstitutions(
  dynamicInstitutions: DynamicInstitution[]
): NavSection[] {
  return MAIN_NAVIGATION.map(section => ({
    ...section,
    groups: section.groups?.map(group => {
      if (!group.isDynamic) return group;
      
      // Filter institutions based on the dynamic type (which section they belong to)
      const filteredInstitutions = dynamicInstitutions.filter(inst => {
        if (group.dynamicType === 'institutions-social') {
          // Social institutions for "Pentru Cetățeni" section
          return inst.showInCitizens;
        }
        if (group.dynamicType === 'institutions-cultural') {
          // Cultural institutions for "Turist în Salonta" section
          return inst.showInTourists;
        }
        return false;
      });
      
      // Map filtered institutions to nav items
      const dynamicItems: NavItem[] = filteredInstitutions.map(inst => ({
        id: inst.slug, // Use slug as id for translation fallback
        href: `/institutii/${inst.slug}`,
        icon: INSTITUTION_ICONS[inst.icon] || Building,
        label: inst.name, // Direct label for dynamic items
      }));
      
      return {
        ...group,
        items: dynamicItems,
      };
    }),
  }));
}
