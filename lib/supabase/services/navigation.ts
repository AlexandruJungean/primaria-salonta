import { createAnonServerClient } from '../server';

export interface NavSection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  is_custom: boolean;
  show_in_cetateni: boolean;
  show_in_firme: boolean;
  show_in_primarie: boolean;
  show_in_turist: boolean;
  public_path: string | null;
  admin_path: string;
  created_at: string;
  updated_at: string;
}

export interface NavPage {
  id: string;
  section_id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  public_path: string | null;
  admin_path: string;
  sort_order: number;
  is_active: boolean;
  is_custom: boolean;
  page_id: string | null;
  show_in_cetateni: boolean;
  show_in_firme: boolean;
  show_in_primarie: boolean;
  show_in_turist: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavPageWithSection extends NavPage {
  nav_sections: Pick<NavSection, 'slug' | 'title' | 'icon' | 'public_path'>;
}

// ─── Public queries (anon client, respects RLS) ─────────────

export async function getNavSections(): Promise<NavSection[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('nav_sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching nav sections:', error);
    return [];
  }

  return (data || []) as NavSection[];
}

export async function getNavPagesBySection(sectionSlug: string): Promise<NavPage[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('nav_pages')
    .select('*, nav_sections!inner(slug)')
    .eq('nav_sections.slug', sectionSlug)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching nav pages for section:', sectionSlug, error);
    return [];
  }

  return (data || []) as NavPage[];
}

type MenuKey = 'cetateni' | 'firme' | 'primarie' | 'turist';

const MENU_COLUMN_MAP: Record<MenuKey, string> = {
  cetateni: 'show_in_cetateni',
  firme: 'show_in_firme',
  primarie: 'show_in_primarie',
  turist: 'show_in_turist',
};

export async function getNavPagesForPublicMenu(menuKey: MenuKey): Promise<NavPageWithSection[]> {
  const supabase = createAnonServerClient();
  const column = MENU_COLUMN_MAP[menuKey];

  const { data, error } = await supabase
    .from('nav_pages')
    .select('*, nav_sections(slug, title, icon, public_path)')
    .eq(column, true)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching nav pages for menu:', menuKey, error);
    return [];
  }

  return (data || []) as NavPageWithSection[];
}

export async function getNavSectionBySlug(slug: string): Promise<NavSection | null> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('nav_sections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching nav section:', slug, error);
    return null;
  }

  return data as NavSection;
}

export async function getNavPageByPageId(pageId: string): Promise<NavPageWithSection | null> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('nav_pages')
    .select('*, nav_sections(slug, title, icon)')
    .eq('page_id', pageId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching nav page by page_id:', pageId, error);
    return null;
  }

  return data as NavPageWithSection;
}

// ─── Navigation data for public menu (all menus at once) ────

export interface PublicMenuData {
  cetateni: NavPageWithSection[];
  firme: NavPageWithSection[];
  primarie: NavPageWithSection[];
  turist: NavPageWithSection[];
}

export async function getPublicMenuData(): Promise<PublicMenuData> {
  const [cetateni, firme, primarie, turist] = await Promise.all([
    getNavPagesForPublicMenu('cetateni'),
    getNavPagesForPublicMenu('firme'),
    getNavPagesForPublicMenu('primarie'),
    getNavPagesForPublicMenu('turist'),
  ]);

  return { cetateni, firme, primarie, turist };
}
