import { createAnonServerClient } from '../server';
import type { News, NewsWithDocuments, PaginatedResponse, NewsFilter } from '@/lib/types/database';

const DEFAULT_LIMIT = 12;

/**
 * Get paginated news list
 */
export async function getNews(filter: NewsFilter = {}): Promise<PaginatedResponse<News>> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = DEFAULT_LIMIT, category, featured } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('news')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching news:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const totalCount = count || 0;

  return {
    data: data || [],
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get latest news for homepage
 */
export async function getLatestNews(count: number = 3): Promise<News[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured news for homepage
 */
export async function getFeaturedNews(count: number = 3): Promise<News[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }

  return data || [];
}

/**
 * Get single news by slug with documents
 */
export async function getNewsBySlug(slug: string): Promise<NewsWithDocuments | null> {
  const supabase = createAnonServerClient();

  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (newsError || !news) {
    console.error('Error fetching news by slug:', newsError);
    return null;
  }

  // Get documents for this news
  const { data: documents } = await supabase
    .from('news_documents')
    .select('*')
    .eq('news_id', news.id)
    .order('sort_order');

  // Increment view count (fire and forget)
  supabase
    .from('news')
    .update({ view_count: news.view_count + 1 })
    .eq('id', news.id)
    .then();

  return {
    ...news,
    documents: documents || [],
  };
}

/**
 * Get news by category
 */
export async function getNewsByCategory(
  category: News['category'],
  limit: number = 10
): Promise<News[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all news slugs for static generation
 */
export async function getAllNewsSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('news')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching news slugs:', error);
    return [];
  }

  return data?.map(n => n.slug) || [];
}
