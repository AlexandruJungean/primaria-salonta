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

// GET - Fetch all council members or single by id
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('council_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const { data, error } = await supabaseAdmin
        .from('council_members')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }
  } catch (error) {
    console.error('Error fetching council members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch council members' },
      { status: 500 }
    );
  }
}

// POST - Create new council member
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data, error } = await supabaseAdmin
      .from('council_members')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'council_member',
      resourceId: data.id,
      resourceTitle: data.name,
      details: { party: data.party },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating council member:', error);
    return NextResponse.json(
      { error: 'Failed to create council member' },
      { status: 500 }
    );
  }
}

// PATCH - Update council member
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

    // Get existing member for logging
    const { data: existingMember } = await supabaseAdmin
      .from('council_members')
      .select('name')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('council_members')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'council_member',
      resourceId: id,
      resourceTitle: body.name || existingMember?.name,
      details: { updatedFields: Object.keys(body) },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating council member:', error);
    return NextResponse.json(
      { error: 'Failed to update council member' },
      { status: 500 }
    );
  }
}

// DELETE - Delete council member
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

    // Get member data for logging before deletion
    const { data: member } = await supabaseAdmin
      .from('council_members')
      .select('name')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('council_members')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'council_member',
      resourceId: id,
      resourceTitle: member?.name,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting council member:', error);
    return NextResponse.json(
      { error: 'Failed to delete council member' },
      { status: 500 }
    );
  }
}
