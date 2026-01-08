import { createAnonServerClient } from '../server';

export interface Page {
  id: string;
  slug: string;
  parent_slug: string | null;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  template: string | null;
  published: boolean;
  sort_order: number;
  show_in_menu: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  category: string | null;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  return data;
}

/**
 * Get page by full path (e.g., "informatii-publice/buget")
 */
export async function getPageByPath(path: string): Promise<Page | null> {
  const supabase = createAnonServerClient();
  
  // Try to find by exact slug first
  let { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', path)
    .eq('published', true)
    .single();

  if (!data) {
    // Try just the last part of the path
    const slug = path.split('/').pop() || path;
    const result = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Error fetching page by path:', error);
    return null;
  }

  return data;
}

/**
 * Get all published pages
 */
export async function getPages(): Promise<Page[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching pages:', error);
    return [];
  }

  return data || [];
}

/**
 * Get child pages of a parent
 */
export async function getChildPages(parentSlug: string): Promise<Page[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('parent_slug', parentSlug)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching child pages:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all FAQ items
 */
export async function getFAQs(): Promise<FAQ[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get FAQs by category
 */
export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Get FAQ categories
 */
export async function getFAQCategories(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('faq')
    .select('category')
    .eq('published', true);

  if (error) {
    console.error('Error fetching FAQ categories:', error);
    return [];
  }

  const categories = new Set<string>();
  data?.forEach(f => {
    if (f.category) categories.add(f.category);
  });

  return Array.from(categories).sort();
}

/**
 * Get all page slugs for static generation
 */
export async function getAllPageSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('pages')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching page slugs:', error);
    return [];
  }

  return data?.map(p => p.slug) || [];
}
