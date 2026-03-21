import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';
import { requireAdmin } from '@/lib/auth/verify-admin';

const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    if (slug) {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (id) {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data, error } = await supabase
      .from('pages')
      .insert([{
        slug: body.slug,
        page_type: body.page_type || 'custom',
        title: body.title,
        content: body.content || '',
        structured_data: body.structured_data || { blocks: [] },
        meta_title: body.meta_title || body.title,
        meta_description: body.meta_description || '',
        published: body.published !== undefined ? body.published : true,
        created_by: adminUser.id,
      }])
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'create',
      resourceType: 'custom_page',
      resourceId: data.id,
      resourceTitle: data.title,
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    if (!slug && !id) {
      return NextResponse.json({ error: 'slug or id required' }, { status: 400 });
    }

    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    let query = supabase.from('pages').update(body).select().single();
    if (slug) query = supabase.from('pages').update(body).eq('slug', slug).select().single();
    else query = supabase.from('pages').update(body).eq('id', id).select().single();

    const { data, error } = await query;
    if (error) throw error;

    await logAuditAction({
      action: 'update',
      resourceType: 'custom_page',
      resourceId: data.id,
      resourceTitle: data.title,
      details: { updatedFields: Object.keys(body), pageSlug: data.slug },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data: page } = await supabase
      .from('pages')
      .select('title, slug')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logAuditAction({
      action: 'delete',
      resourceType: 'custom_page',
      resourceId: id,
      resourceTitle: page?.title,
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
