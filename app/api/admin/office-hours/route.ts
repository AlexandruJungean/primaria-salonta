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

// GET - Fetch all office hours or single by id
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('office_hours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const { data, error } = await supabaseAdmin
        .from('office_hours')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }
  } catch (error) {
    console.error('Error fetching office hours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch office hours' },
      { status: 500 }
    );
  }
}

// POST - Create new office hour
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data, error } = await supabaseAdmin
      .from('office_hours')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'office_hours',
      resourceId: data.id,
      resourceTitle: data.department_name,
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating office hour:', error);
    return NextResponse.json(
      { error: 'Failed to create office hour' },
      { status: 500 }
    );
  }
}

// PATCH - Update office hour
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Get existing office hours for logging
    const { data: existingData } = await supabaseAdmin
      .from('office_hours')
      .select('department_name')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('office_hours')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'office_hours',
      resourceId: id,
      resourceTitle: body.department_name || existingData?.department_name,
      details: { updatedFields: Object.keys(body) },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating office hour:', error);
    return NextResponse.json(
      { error: 'Failed to update office hour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete office hour
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get data for logging before deletion
    const { data: officeHour } = await supabaseAdmin
      .from('office_hours')
      .select('department_name')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('office_hours')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'office_hours',
      resourceId: id,
      resourceTitle: officeHour?.department_name,
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting office hour:', error);
    return NextResponse.json(
      { error: 'Failed to delete office hour' },
      { status: 500 }
    );
  }
}
