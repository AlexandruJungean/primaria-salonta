import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/verify-admin';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const maxSortOrder = searchParams.get('max_sort_order');

  const supabase = createAdminClient();

  try {
    if (id) {
      const { data, error } = await supabase
        .from('legislation_links')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (maxSortOrder === 'true') {
      const { data, error } = await supabase
        .from('legislation_links')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('legislation_links')
      .select('*')
      .order('is_primary', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching legislation links:', error);
    return NextResponse.json({ error: 'Failed to fetch legislation links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createAdminClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('legislation_links')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating legislation link:', error);
    return NextResponse.json({ error: 'Failed to create legislation link' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const unsetPrimaryExcept = searchParams.get('unset_primary_except');

  const supabase = createAdminClient();

  try {
    if (unsetPrimaryExcept) {
      const { error } = await supabase
        .from('legislation_links')
        .update({ is_primary: false })
        .neq('id', unsetPrimaryExcept)
        .eq('is_primary', true);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { error } = await supabase
      .from('legislation_links')
      .update(body)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating legislation link:', error);
    return NextResponse.json({ error: 'Failed to update legislation link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('legislation_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting legislation link:', error);
    return NextResponse.json({ error: 'Failed to delete legislation link' }, { status: 500 });
  }
}
