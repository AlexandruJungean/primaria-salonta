'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils/cn';
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
  Home,
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
  Mail,
  HelpCircle,
  FileStack,
  type LucideIcon,
} from 'lucide-react';

// Icon mapping for Server Component compatibility
const ICON_MAP: Record<string, LucideIcon> = {
  mapPin: MapPin,
  clock: Clock,
  palette: Palette,
  map: Map,
  image: Image,
  eye: Eye,
  globe: Globe,
  award: Award,
  trendingUp: TrendingUp,
  building: Building,
  bookOpen: BookOpen,
  landmark: Landmark,
  heart: Heart,
  utensils: Utensils,
  users: Users,
  bird: Bird,
  waves: Waves,
  scale: Scale,
  userCircle: UserCircle,
  fileText: FileText,
  layoutGrid: LayoutGrid,
  calendar: Calendar,
  mic: Mic,
  fileCheck: FileCheck,
  megaphone: Megaphone,
  messageSquare: MessageSquare,
  newspaper: Newspaper,
  shoppingCart: ShoppingCart,
  clipboardList: ClipboardList,
  home: Home,
  hammer: Hammer,
  receipt: Receipt,
  briefcase: Briefcase,
  fileSearch: FileSearch,
  building2: Building2,
  treePine: TreePine,
  fileSpreadsheet: FileSpreadsheet,
  bell: Bell,
  badgeCheck: BadgeCheck,
  wallet: Wallet,
  gavel: Gavel,
  scrollText: ScrollText,
  barChart3: BarChart3,
  target: Target,
  euro: Euro,
  leaf: Leaf,
  shieldCheck: ShieldCheck,
  siren: Siren,
  video: Video,
  phone: Phone,
  creditCard: CreditCard,
  send: Send,
  mail: Mail,
  helpCircle: HelpCircle,
  fileStack: FileStack,
};

export interface PageHeaderProps {
  titleKey: string;
  descriptionKey?: string;
  subtitle?: string; // Direct text subtitle (not a translation key)
  icon?: string;
  namespace?: string;
  className?: string;
}

export function PageHeader({
  titleKey,
  descriptionKey,
  subtitle,
  icon,
  namespace = 'navigation',
  className,
}: PageHeaderProps) {
  const t = useTranslations(namespace);
  const Icon = icon ? ICON_MAP[icon] : undefined;

  return (
    <div className={cn('bg-gradient-to-br from-primary-900 to-primary-800 text-white py-12 md:py-16', className)}>
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            {Icon && (
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className="w-7 h-7" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t(titleKey)}</h1>
              {subtitle && (
                <p className="text-lg text-primary-200 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {descriptionKey && (
            <p className="text-lg text-primary-100">{t(descriptionKey)}</p>
          )}
        </div>
      </Container>
    </div>
  );
}

