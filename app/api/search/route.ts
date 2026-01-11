import { NextRequest, NextResponse } from 'next/server';
import { createAnonServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const locale = searchParams.get('locale') || 'ro';

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createAnonServerClient();
  const results: Array<{
    type: 'news' | 'event';
    id: string;
    title: string;
    description?: string;
    href: string;
    date?: string;
  }> = [];

  try {
    // Search news
    const { data: news } = await supabase
      .from('news')
      .select('id, slug, title, excerpt, published_at')
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(10);

    if (news) {
      news.forEach(item => {
        results.push({
          type: 'news',
          id: item.id,
          title: item.title,
          description: item.excerpt || undefined,
          href: `/stiri/${item.slug}`,
          date: item.published_at 
            ? new Date(item.published_at).toLocaleDateString(
                locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US'
              )
            : undefined,
        });
      });
    }

    // Search events
    const { data: events } = await supabase
      .from('events')
      .select('id, slug, title, description, start_date')
      .eq('published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('start_date', { ascending: false })
      .limit(10);

    if (events) {
      events.forEach(item => {
        results.push({
          type: 'event',
          id: item.id,
          title: item.title,
          description: item.description || undefined,
          href: `/evenimente/${item.slug}`,
          date: item.start_date 
            ? new Date(item.start_date).toLocaleDateString(
                locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US'
              )
            : undefined,
        });
      });
    }

    // Sort by date (newest first)
    results.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
