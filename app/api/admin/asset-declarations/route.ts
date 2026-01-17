import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';
import { requireAdmin } from '@/lib/auth/verify-admin';

// Create admin client with service role key to bypass RLS
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// GET - Fetch declarations (with optional filters)
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const department = searchParams.get('department');
    const year = searchParams.get('year');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');

    // Single declaration
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('asset_declarations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // List declarations with filters
    let query = supabaseAdmin
      .from('asset_declarations')
      .select('*', { count: 'exact' })
      .order('person_name', { ascending: true });

    if (department) {
      query = query.eq('department', department);
    }

    if (year) {
      query = query.eq('declaration_year', parseInt(year));
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching asset declarations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch declarations' },
      { status: 500 }
    );
  }
}

// POST - Create new declaration
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data, error } = await supabaseAdmin
      .from('asset_declarations')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'declaration',
      resourceId: data.id,
      resourceTitle: `${data.person_name} - ${data.declaration_year}`,
      details: { department: data.department, position: data.position },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating asset declaration:', error);
    return NextResponse.json(
      { error: 'Failed to create declaration' },
      { status: 500 }
    );
  }
}

// PATCH - Update declaration
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Get existing declaration for logging
    const { data: existingDecl } = await supabaseAdmin
      .from('asset_declarations')
      .select('person_name, declaration_year')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('asset_declarations')
      .update(body)
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'declaration',
      resourceId: id,
      resourceTitle: `${body.person_name || existingDecl?.person_name} - ${body.declaration_year || existingDecl?.declaration_year}`,
      details: { updatedFields: Object.keys(body) },
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating asset declaration:', error);
    return NextResponse.json(
      { error: 'Failed to update declaration' },
      { status: 500 }
    );
  }
}

// DELETE - Delete declaration
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get declaration data for logging before deletion
    const { data: declaration } = await supabaseAdmin
      .from('asset_declarations')
      .select('person_name, declaration_year, department')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('asset_declarations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'declaration',
      resourceId: id,
      resourceTitle: `${declaration?.person_name} - ${declaration?.declaration_year}`,
      details: { department: declaration?.department },
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset declaration:', error);
    return NextResponse.json(
      { error: 'Failed to delete declaration' },
      { status: 500 }
    );
  }
}
