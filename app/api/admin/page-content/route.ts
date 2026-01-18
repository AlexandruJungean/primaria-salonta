import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, requireRole } from '@/lib/auth/verify-admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List page content by page_key
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get('page_key');
  const id = searchParams.get('id');

  const supabase = createAdminClient();

  try {
    if (id) {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (!pageKey) {
      return NextResponse.json({ error: 'page_key is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', pageKey)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}

// PATCH - Update page content
export async function PATCH(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('page_content')
      .update({
        content: body.content,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
  }
}

// POST - Create new page content
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createAdminClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('page_content')
      .insert([{
        page_key: body.page_key,
        content_key: body.content_key,
        content: body.content,
        content_type: body.content_type || 'text',
        sort_order: body.sort_order || 0,
        is_active: body.is_active ?? true,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating page content:', error);
    return NextResponse.json({ error: 'Failed to create page content' }, { status: 500 });
  }
}

// DELETE - Delete page content
export async function DELETE(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('page_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page content:', error);
    return NextResponse.json({ error: 'Failed to delete page content' }, { status: 500 });
  }
}
