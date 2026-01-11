import { createAnonServerClient } from '../server';

export interface PageImage {
  id: string;
  page_slug: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

/**
 * Get images for a specific page
 */
export async function getPageImages(pageSlug: string): Promise<PageImage[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('page_images')
    .select('*')
    .eq('published', true)
    .eq('page_slug', pageSlug)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching page images:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all images grouped by page slug
 */
export async function getAllPageImages(): Promise<Record<string, PageImage[]>> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('page_images')
    .select('*')
    .eq('published', true)
    .order('page_slug')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all page images:', error);
    return {};
  }

  // Group by page_slug
  const grouped: Record<string, PageImage[]> = {};
  (data || []).forEach(img => {
    if (!grouped[img.page_slug]) {
      grouped[img.page_slug] = [];
    }
    grouped[img.page_slug].push(img);
  });

  return grouped;
}
