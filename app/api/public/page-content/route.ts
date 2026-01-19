import { NextRequest, NextResponse } from 'next/server';
import { createAnonServerClient } from '@/lib/supabase/server';

// GET - Get public page content by page_key
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get('page_key');

  if (!pageKey) {
    return NextResponse.json({ error: 'page_key is required' }, { status: 400 });
  }

  try {
    const supabase = await createAnonServerClient();

    const { data, error } = await supabase
      .from('page_content')
      .select('id, page_key, content_key, content, content_type, sort_order')
      .eq('page_key', pageKey)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}
