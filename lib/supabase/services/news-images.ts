import { createAnonServerClient } from '../server';

export interface NewsImage {
  id: string;
  news_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  is_featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get all images for a news article
 */
export async function getNewsImages(newsId: string): Promise<NewsImage[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news_images')
    .select('*')
    .eq('news_id', newsId)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching news images:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured image for a news article
 */
export async function getNewsFeaturedImage(newsId: string): Promise<NewsImage | null> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news_images')
    .select('*')
    .eq('news_id', newsId)
    .eq('is_featured', true)
    .eq('published', true)
    .single();

  if (error) {
    // No featured image found, get first image
    const { data: firstImage } = await supabase
      .from('news_images')
      .select('*')
      .eq('news_id', newsId)
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single();
    
    return firstImage || null;
  }

  return data;
}

/**
 * Get images for multiple news articles (for list views)
 */
export async function getNewsImagesForList(newsIds: string[]): Promise<Record<string, NewsImage[]>> {
  if (newsIds.length === 0) return {};
  
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news_images')
    .select('*')
    .in('news_id', newsIds)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching news images for list:', error);
    return {};
  }

  // Group by news_id
  const grouped: Record<string, NewsImage[]> = {};
  (data || []).forEach(img => {
    if (!grouped[img.news_id]) {
      grouped[img.news_id] = [];
    }
    grouped[img.news_id].push(img);
  });

  return grouped;
}
