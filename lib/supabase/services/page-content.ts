import { createAnonServerClient } from '../server';
import type { PageContent, ExternalLink } from '@/lib/types/database';

/**
 * Get all content blocks for a specific page
 */
export async function getPageContent(pageKey: string): Promise<Record<string, string>> {
  const supabase = await createAnonServerClient();
  
  const { data, error } = await supabase
    .from('page_content')
    .select('content_key, content')
    .eq('page_key', pageKey)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching page content:', error);
    return {};
  }

  // Convert array to key-value object for easy access
  const contentMap: Record<string, string> = {};
  data?.forEach(item => {
    contentMap[item.content_key] = item.content;
  });

  return contentMap;
}

/**
 * Get all content blocks for a page as array (for admin)
 */
export async function getPageContentArray(pageKey: string): Promise<PageContent[]> {
  const supabase = await createAnonServerClient();
  
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching page content array:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single content block
 */
export async function getContentBlock(pageKey: string, contentKey: string): Promise<string | null> {
  const supabase = await createAnonServerClient();
  
  const { data, error } = await supabase
    .from('page_content')
    .select('content')
    .eq('page_key', pageKey)
    .eq('content_key', contentKey)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching content block:', error);
    return null;
  }

  return data?.content || null;
}

/**
 * Get all external links for a specific page
 */
export async function getExternalLinks(pageKey: string): Promise<ExternalLink[]> {
  const supabase = await createAnonServerClient();
  
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching external links:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single external link by ID
 */
export async function getExternalLinkById(id: string): Promise<ExternalLink | null> {
  const supabase = await createAnonServerClient();
  
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching external link:', error);
    return null;
  }

  return data;
}

/**
 * Get a single page content by ID
 */
export async function getPageContentById(id: string): Promise<PageContent | null> {
  const supabase = await createAnonServerClient();
  
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching page content by id:', error);
    return null;
  }

  return data;
}
