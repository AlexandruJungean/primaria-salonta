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
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { getIcon } from './icon-map';

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
  groupLabel?: string; // Direct label (bypasses translation)
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
      // Social Institutions group - items loaded dynamically
      {
        groupId: 'institutii',
        groupHref: '/institutii',
        groupIcon: Building,
        items: [], // Populated dynamically from database
        isDynamic: true, // Flag for dynamic loading
        dynamicType: 'institutions-social',
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
        ],
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
      // Programs for citizens
      {
        groupId: 'programe',
        groupHref: '/programe',
        groupIcon: Target,
        isDynamic: true,
        dynamicType: 'programs-cetateni',
        items: [],
      },
    ],
    standaloneItems: [
      { id: 'raporteazaProblema', href: '/raporteaza-problema', icon: AlertTriangle },
      { id: 'evenimente', href: '/evenimente', icon: Calendar },
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
      // Programs for businesses
      {
        groupId: 'programe',
        groupHref: '/programe',
        groupIcon: Target,
        isDynamic: true,
        dynamicType: 'programs-firme',
        items: [],
      },
      // Institutions for businesses
      {
        groupId: 'institutii',
        groupHref: '/institutii',
        groupIcon: Building,
        items: [],
        isDynamic: true,
        dynamicType: 'institutions-firme',
      },
    ],
    standaloneItems: [],
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
      // Programs & Strategies group - dynamic from database
      {
        groupId: 'programe',
        groupHref: '/programe',
        groupIcon: Target,
        isDynamic: true,
        dynamicType: 'programs-primarie',
        items: [],
      },
      // Local Council group
      {
        groupId: 'consiliulLocal',
        groupHref: '/consiliul-local',
        groupIcon: Users,
        items: [
          { id: 'consilieriLocali', href: '/consiliul-local/consilieri', icon: Users },
          { id: 'comisii', href: '/consiliul-local/comisii', icon: Briefcase },
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
      // Institutions for city hall
      {
        groupId: 'institutii',
        groupHref: '/institutii',
        groupIcon: Building,
        items: [],
        isDynamic: true,
        dynamicType: 'institutions-primarie',
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
        items: [],
        isDynamic: true,
        dynamicType: 'institutions-cultural',
      },
      // Programs for tourists
      {
        groupId: 'programe',
        groupHref: '/programe',
        groupIcon: Target,
        isDynamic: true,
        dynamicType: 'programs-turist',
        items: [],
      },
    ],
    standaloneItems: [
      { id: 'evenimente', href: '/evenimente', icon: Calendar },
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

// Icon mapping for nav_pages (DB-driven items)
export const NAV_PAGE_ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  users: Users,
  briefcase: Briefcase,
  listChecks: ListChecks,
  gavel: Gavel,
  scrollText: ScrollText,
  fileCheck: FileCheck,
  barChart3: BarChart3,
  userCircle: UserCircle,
  layoutGrid: LayoutGrid,
  calendar: Calendar,
  mic: Mic,
  scale: Scale,
  building2: Building2,
  info: Info,
  shoppingCart: ShoppingCart,
  fileText: FileText,
  dog: Dog,
  megaphone: Megaphone,
  hammer: Hammer,
  wallet: Wallet,
  badgeCheck: BadgeCheck,
  home: HomeIcon,
  fileSignature: FileSignature,
  clipboardList: ClipboardList,
  shieldCheck: ShieldCheck,
  receipt: Receipt,
  leaf: Leaf,
  wheat: Wheat,
  map: Map,
  heart: Heart,
  tag: Tag,
  hardHat: HardHat,
  radio: Radio,
  network: Network,
  fileQuestion: FileQuestion,
  alertCircle: AlertCircle,
  landmark: Landmark,
  bookOpen: BookOpen,
  folderOpen: FolderOpen,
  mapPin: MapPin,
  clock: Clock,
  palette: Palette,
  image: Image,
  eye: Eye,
  globe: Globe,
  award: Award,
  trendingUp: TrendingUp,
  building: Building,
  creditCard: CreditCard,
  send: Send,
  target: Target,
  euro: Euro,
  siren: Siren,
  video: Video,
  phone: Phone,
  helpCircle: HelpCircle,
  fileSearch: FileSearch,
  treePine: TreePine,
  fileSpreadsheet: FileSpreadsheet,
  bell: Bell,
  newspaper: Newspaper,
  messageSquare: MessageSquare,
  graduationCap: GraduationCap,
  flag: Flag,
};

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

// Icon mapping for dynamic programs (by slug)
export const PROGRAM_ICONS: Record<string, LucideIcon> = {
  'strategie-dezvoltare': TrendingUp,
  'pmud': Bus,
  'pnrr': Euro,
  'proiecte-europene': Globe,
  'proiecte-locale': MapPin,
  'program-regional-nord-vest': Building2,
  'svsu': Siren,
  'sna': ShieldCheck,
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
  showInFirme: boolean;
  showInPrimarie: boolean;
}

// Interface for dynamic program nav items
export interface DynamicProgram {
  id: string;
  slug: string;
  title: string;
  icon: string | null;
  showInCetateni: boolean;
  showInFirme: boolean;
  showInPrimarie: boolean;
  showInTurist: boolean;
}

// Maps groupId to nav_sections slug for DB-driven groups
const GROUP_TO_SECTION_SLUG: Record<string, string> = {
  informatiiPublice: 'informatii-publice',
  informatiiPubliceContinuare: 'informatii-publice',
  transparenta: 'transparenta',
  primaria: 'primaria',
  consiliulLocal: 'consiliul-local',
  monitorulOficial: 'monitorul-oficial',
  rapoarteStudii: 'rapoarte-studii',
  localitatea: 'localitatea',
  serviciiOnline: 'servicii-online',
  altele: 'altele',
};

// Maps main section id to the menu key used in nav_pages show_in_* columns
const SECTION_TO_MENU_KEY: Record<string, string> = {
  pentruCetateni: 'cetateni',
  pentruFirme: 'firme',
  primpieSalonta: 'primarie',
  turistSalonta: 'turist',
};

export interface NavPageItem {
  id: string;
  title: string;
  icon: string;
  public_path: string | null;
  section_slug: string;
}

export interface NavPagesMenuData {
  cetateni: NavPageItem[];
  firme: NavPageItem[];
  primarie: NavPageItem[];
  turist: NavPageItem[];
}

const SECTION_SLUG_DEFAULTS: Record<string, { groupIcon: LucideIcon; groupHref: string; label: string }> = {
  'informatii-publice': { groupIcon: FileSearch, groupHref: '/informatii-publice', label: 'Informații Publice' },
  'transparenta': { groupIcon: Eye, groupHref: '/transparenta', label: 'Transparență' },
  'primaria': { groupIcon: Building2, groupHref: '/primaria', label: 'Primăria' },
  'consiliul-local': { groupIcon: Users, groupHref: '/consiliul-local', label: 'Consiliul Local' },
  'monitorul-oficial': { groupIcon: BookMarked, groupHref: '/monitorul-oficial', label: 'Monitorul Oficial' },
  'rapoarte-studii': { groupIcon: FileSearch, groupHref: '/rapoarte-studii', label: 'Rapoarte și Studii' },
  'localitatea': { groupIcon: MapPin, groupHref: '/localitatea', label: 'Localitatea' },
  'servicii-online': { groupIcon: CreditCard, groupHref: '/servicii-online', label: 'Servicii Online' },
  'altele': { groupIcon: FileText, groupHref: '#', label: 'Altele' },
  'programe': { groupIcon: Target, groupHref: '/programe', label: 'Programe' },
};

// Helper to get navigation with dynamic data merged in
export function getNavigationWithInstitutions(
  dynamicInstitutions: DynamicInstitution[],
  dynamicPrograms: DynamicProgram[] = [],
  navPagesData?: NavPagesMenuData
): NavSection[] {
  return MAIN_NAVIGATION.map(section => {
    const menuKey = SECTION_TO_MENU_KEY[section.id] as keyof NavPagesMenuData | undefined;
    const navPagesForMenu = navPagesData && menuKey
      ? navPagesData[menuKey] || []
      : [];

    // Group nav pages by their parent section slug
    const navPagesBySection: Record<string, NavPageItem[]> = {};
    for (const page of navPagesForMenu) {
      if (!navPagesBySection[page.section_slug]) {
        navPagesBySection[page.section_slug] = [];
      }
      navPagesBySection[page.section_slug].push(page);
    }

    // Track which section slugs have been rendered (to avoid duplicates for split groups)
    const renderedSections = new Set<string>();

    const processedGroups = section.groups?.map(group => {
      // Handle existing dynamic types (institutions, programs)
      if (group.isDynamic) {
        if (group.dynamicType?.startsWith('programs-')) {
          const filteredPrograms = dynamicPrograms.filter(prog => {
            if (group.dynamicType === 'programs-cetateni') return prog.showInCetateni;
            if (group.dynamicType === 'programs-firme') return prog.showInFirme;
            if (group.dynamicType === 'programs-primarie') return prog.showInPrimarie;
            if (group.dynamicType === 'programs-turist') return prog.showInTurist;
            return false;
          });
          const programItems: NavItem[] = filteredPrograms.map(prog => ({
            id: prog.slug,
            href: `/programe/${prog.slug}`,
            icon: PROGRAM_ICONS[prog.slug] || Target,
            label: prog.title,
          }));
          return { ...group, items: programItems };
        }

        const filteredInstitutions = dynamicInstitutions.filter(inst => {
          if (group.dynamicType === 'institutions-social') return inst.showInCitizens;
          if (group.dynamicType === 'institutions-cultural') return inst.showInTourists;
          if (group.dynamicType === 'institutions-firme') return inst.showInFirme;
          if (group.dynamicType === 'institutions-primarie') return inst.showInPrimarie;
          return false;
        });
        const dynamicItems: NavItem[] = filteredInstitutions.map(inst => ({
          id: inst.slug,
          href: `/institutii/${inst.slug}`,
          icon: INSTITUTION_ICONS[inst.icon] || Building,
          label: inst.name,
        }));
        return { ...group, items: dynamicItems };
      }

      // Handle DB-driven nav_section groups
      const sectionSlug = GROUP_TO_SECTION_SLUG[group.groupId];
      if (sectionSlug && navPagesData && navPagesBySection[sectionSlug]) {
        if (renderedSections.has(sectionSlug)) {
          // This is a continuation group -- take the second half
          const dbPages = navPagesBySection[sectionSlug];
          const mid = Math.ceil(dbPages.length / 2);
          const secondHalf = dbPages.slice(mid);
          const items: NavItem[] = secondHalf.map(page => ({
            id: page.id,
            href: page.public_path || '#',
            icon: getIcon(page.icon),
            label: page.title,
          }));
          return { ...group, items };
        }
        renderedSections.add(sectionSlug);

        const dbPages = navPagesBySection[sectionSlug];
        // Check if there's a continuation group for this section
        const hasContinuation = section.groups?.some(
          g => g !== group && GROUP_TO_SECTION_SLUG[g.groupId] === sectionSlug
        );

        const pagesToShow = hasContinuation ? dbPages.slice(0, Math.ceil(dbPages.length / 2)) : dbPages;
        const items: NavItem[] = pagesToShow.map(page => ({
          id: page.id,
          href: page.public_path || '#',
          icon: getIcon(page.icon),
          label: page.title,
        }));
        return { ...group, items };
      }

      return group;
    });

    // Inject new groups for sections that have pages but no existing group in this menu
    const extraGroups: NavGroup[] = [];
    const extraStandaloneItems: NavItem[] = [];
    for (const [slug, pages] of Object.entries(navPagesBySection)) {
      if (renderedSections.has(slug)) continue;
      const items: NavItem[] = pages.map(page => ({
        id: page.id,
        href: page.public_path || '#',
        icon: getIcon(page.icon),
        label: page.title,
      }));

      if (slug === 'altele') {
        extraStandaloneItems.push(...items);
      } else {
        const defaults = SECTION_SLUG_DEFAULTS[slug];
        extraGroups.push({
          groupId: slug,
          groupHref: defaults?.groupHref || '#',
          groupIcon: defaults?.groupIcon || FileText,
          groupLabel: defaults?.label || slug,
          items,
        });
      }
    }

    const allGroups = [...(processedGroups || []), ...extraGroups];
    const filteredGroups = allGroups.filter(g => g.items.length > 0);
    const existingHrefs = new Set((section.standaloneItems || []).map(i => i.href));
    const dedupedExtra = extraStandaloneItems.filter(i => !existingHrefs.has(i.href));
    const allStandalone = [...(section.standaloneItems || []), ...dedupedExtra];

    return { ...section, groups: filteredGroups, standaloneItems: allStandalone };
  });
}
