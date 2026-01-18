import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, requireRole } from '@/lib/auth/verify-admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List external links by page_key
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
        .from('external_links')
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
      .from('external_links')
      .select('*')
      .eq('page_key', pageKey)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching external links:', error);
    return NextResponse.json({ error: 'Failed to fetch external links' }, { status: 500 });
  }
}

// POST - Create new external link
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createAdminClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('external_links')
      .insert([{
        page_key: body.page_key,
        title: body.title,
        url: body.url,
        description: body.description || null,
        link_type: body.link_type || 'website',
        icon: body.icon || 'external',
        section: body.section || null,
        sort_order: body.sort_order || 0,
        is_active: body.is_active ?? true,
        open_in_new_tab: body.open_in_new_tab ?? true,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating external link:', error);
    return NextResponse.json({ error: 'Failed to create external link' }, { status: 500 });
  }
}

// PATCH - Update external link
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
      .from('external_links')
      .update({
        title: body.title,
        url: body.url,
        description: body.description,
        link_type: body.link_type,
        icon: body.icon,
        section: body.section,
        is_active: body.is_active,
        open_in_new_tab: body.open_in_new_tab,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating external link:', error);
    return NextResponse.json({ error: 'Failed to update external link' }, { status: 500 });
  }
}

// DELETE - Delete external link
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
      .from('external_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting external link:', error);
    return NextResponse.json({ error: 'Failed to delete external link' }, { status: 500 });
  }
}
