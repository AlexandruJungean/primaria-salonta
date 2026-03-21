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
    const sectionSlug = searchParams.get('section');
    const id = searchParams.get('id');
    const pageId = searchParams.get('page_id');

    if (pageId) {
      const { data, error } = await supabase
        .from('nav_pages')
        .select('*, nav_sections(slug, title)')
        .eq('page_id', pageId)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (id) {
      const { data, error } = await supabase
        .from('nav_pages')
        .select('*, nav_sections(slug, title)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (sectionSlug) {
      const { data: section, error: secError } = await supabase
        .from('nav_sections')
        .select('*')
        .eq('slug', sectionSlug)
        .single();
      if (secError) throw secError;

      const { data: pages, error: pgError } = await supabase
        .from('nav_pages')
        .select('*')
        .eq('section_id', section.id)
        .order('sort_order', { ascending: true });
      if (pgError) throw pgError;

      return NextResponse.json({ section, pages });
    }

    const { data: sections, error } = await supabase
      .from('nav_sections')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;

    return NextResponse.json(sections);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching navigation:', error);
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

    if (body.is_custom) {
      const slug = body.slug || `pagina-${Date.now()}`;

      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert([{
          slug,
          page_type: 'custom',
          title: body.title || 'Pagină nouă',
          content: '',
          structured_data: { blocks: [] },
          published: true,
          created_by: adminUser.id,
        }])
        .select()
        .single();

      if (pageError) throw pageError;

      const { data, error } = await supabase
        .from('nav_pages')
        .insert([{
          section_id: body.section_id,
          slug,
          title: body.title || 'Pagină nouă',
          description: body.description || '',
          icon: body.icon || 'fileText',
          public_path: `/pagini/${slug}`,
          admin_path: `/admin/pagini-custom/${pageData.id}`,
          sort_order: body.sort_order || 999,
          is_active: true,
          is_custom: true,
          page_id: pageData.id,
          show_in_cetateni: false,
          show_in_firme: false,
          show_in_primarie: false,
          show_in_turist: false,
        }])
        .select()
        .single();

      if (error) {
        await supabase.from('pages').delete().eq('id', pageData.id);
        throw error;
      }

      await logAuditAction({
        action: 'create',
        resourceType: 'custom_page',
        resourceId: data.id,
        resourceTitle: data.title,
        details: { pageId: pageData.id, slug },
        userId: adminUser.id,
        userEmail: adminUser.email,
        userName: adminUser.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json({ success: true, data, page: pageData });
    }

    const { data, error } = await supabase
      .from('nav_pages')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'create',
      resourceType: 'nav_page',
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
    console.error('Error creating nav page:', error);
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
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data: existing } = await supabase
      .from('nav_pages')
      .select('title')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('nav_pages')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'update',
      resourceType: 'nav_page',
      resourceId: id,
      resourceTitle: body.title || existing?.title,
      details: { updatedFields: Object.keys(body) },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating nav page:', error);
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
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data: navPage } = await supabase
      .from('nav_pages')
      .select('title, is_custom, page_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('nav_pages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (navPage?.is_custom && navPage?.page_id) {
      await supabase.from('pages').delete().eq('id', navPage.page_id);
    }

    await logAuditAction({
      action: 'delete',
      resourceType: navPage?.is_custom ? 'custom_page' : 'nav_page',
      resourceId: id,
      resourceTitle: navPage?.title,
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting nav page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
