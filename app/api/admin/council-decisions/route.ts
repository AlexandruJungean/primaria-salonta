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

// GET - Fetch all council decisions or single by id
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const year = searchParams.get('year');

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('council_decisions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      let query = supabaseAdmin
        .from('council_decisions')
        .select('*')
        .order('decision_number', { ascending: false });

      if (year) {
        query = query.eq('year', parseInt(year));
      }

      const { data, error } = await query;

      if (error) throw error;
      return NextResponse.json(data || []);
    }
  } catch (error) {
    console.error('Error fetching council decisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch council decisions' },
      { status: 500 }
    );
  }
}

// POST - Create new council decision
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    // Generate slug if not provided
    if (!body.slug && body.decision_number && body.decision_date) {
      const date = new Date(body.decision_date);
      const year = date.getFullYear();
      body.slug = `hclms-${body.decision_number}-${year}`;
    }

    // Remove year from body as it's a generated column
    const { year, ...decisionData } = body;

    const { data, error } = await supabaseAdmin
      .from('council_decisions')
      .insert([decisionData])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'council_decision',
      resourceId: data.id,
      resourceTitle: data.title,
      details: { decision_number: data.decision_number },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating council decision:', error);
    return NextResponse.json(
      { error: 'Failed to create council decision' },
      { status: 500 }
    );
  }
}

// PATCH - Update council decision
export async function PATCH(request: NextRequest) {
  // Verifică autentificarea
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

    // Get existing decision for logging
    const { data: existingDecision } = await supabaseAdmin
      .from('council_decisions')
      .select('title')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('council_decisions')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'council_decision',
      resourceId: id,
      resourceTitle: body.title || existingDecision?.title,
      details: { updatedFields: Object.keys(body) },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating council decision:', error);
    return NextResponse.json(
      { error: 'Failed to update council decision' },
      { status: 500 }
    );
  }
}

// DELETE - Delete council decision
export async function DELETE(request: NextRequest) {
  // Verifică autentificarea
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

    // Get decision data for logging before deletion
    const { data: decision } = await supabaseAdmin
      .from('council_decisions')
      .select('title, decision_number')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('council_decisions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'council_decision',
      resourceId: id,
      resourceTitle: decision?.title,
      details: { decision_number: decision?.decision_number },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting council decision:', error);
    return NextResponse.json(
      { error: 'Failed to delete council decision' },
      { status: 500 }
    );
  }
}
