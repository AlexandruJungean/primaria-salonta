import { NextResponse } from 'next/server';
import { createAnonServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '3', 10);
  
  try {
    const supabase = createAnonServerClient();

    const { data, error } = await supabase
      .from('news')
      .select('id, slug, title, excerpt, featured_image, published_at, created_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ 
      data: data || [] 
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json({ data: [] });
  }
}
