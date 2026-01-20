import { NextResponse } from 'next/server';
import { createAnonServerClient } from '@/lib/supabase/server';

// Allow caching - revalidate every 60 seconds
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '4', 10);
  
  try {
    const supabase = createAnonServerClient();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('events')
      .select('id, slug, title, description, location, event_type, start_date, start_time')
      .eq('published', true)
      .gte('start_date', today)
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching events:', error);
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
    console.error('Error in events API:', error);
    return NextResponse.json({ data: [] });
  }
}
