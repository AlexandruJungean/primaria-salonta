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

// GET - Fetch commission with members
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get commission
      const { data: commission, error: commissionError } = await supabaseAdmin
        .from('council_commissions')
        .select('*')
        .eq('id', id)
        .single();

      if (commissionError) throw commissionError;

      // Get commission members
      const { data: memberRelations, error: relationsError } = await supabaseAdmin
        .from('council_member_commissions')
        .select('member_id')
        .eq('commission_id', id);

      if (relationsError) throw relationsError;

      return NextResponse.json({
        ...commission,
        members: memberRelations || [],
      });
    } else {
      // Get all commissions
      const { data: commissions, error } = await supabaseAdmin
        .from('council_commissions')
        .select('*')
        .order('commission_number', { ascending: true });

      if (error) throw error;

      // Get member counts for each commission
      const { data: memberCounts } = await supabaseAdmin
        .from('council_member_commissions')
        .select('commission_id');

      // Count members per commission
      const countMap: Record<string, number> = {};
      memberCounts?.forEach((mc) => {
        countMap[mc.commission_id] = (countMap[mc.commission_id] || 0) + 1;
      });

      // Add member counts to commissions
      const commissionsWithCounts = (commissions || []).map((c) => ({
        ...c,
        member_count: countMap[c.id] || 0,
      }));

      return NextResponse.json(commissionsWithCounts);
    }
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    );
  }
}

// POST - Create new commission
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { member_ids, ...commissionData } = body;
    const { ipAddress, userAgent } = getRequestInfo(request);

    // Create commission
    const { data: commission, error: commissionError } = await supabaseAdmin
      .from('council_commissions')
      .insert([commissionData])
      .select()
      .single();

    if (commissionError) throw commissionError;

    // Add members if provided
    if (member_ids && member_ids.length > 0) {
      const memberInserts = member_ids.map((member_id: string) => ({
        commission_id: commission.id,
        member_id: member_id,
        role: 'member',
      }));

      const { error: membersError } = await supabaseAdmin
        .from('council_member_commissions')
        .insert(memberInserts);

      if (membersError) throw membersError;
    }

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'council_session', // Using council_session as a generic for commissions
      resourceId: commission.id,
      resourceTitle: commission.name,
      details: { type: 'commission', member_count: member_ids?.length || 0 },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(commission);
  } catch (error) {
    console.error('Error creating commission:', error);
    return NextResponse.json(
      { error: 'Failed to create commission' },
      { status: 500 }
    );
  }
}

// PATCH - Update commission and its members
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
    const { member_ids, ...commissionData } = body;

    // Get existing commission for logging
    const { data: existingCommission } = await supabaseAdmin
      .from('council_commissions')
      .select('name')
      .eq('id', id)
      .single();

    // Update commission
    const { data: commission, error: commissionError } = await supabaseAdmin
      .from('council_commissions')
      .update(commissionData)
      .eq('id', id)
      .select()
      .single();

    if (commissionError) throw commissionError;

    // Update members if provided
    if (member_ids !== undefined) {
      // Delete existing relationships
      const { error: deleteError } = await supabaseAdmin
        .from('council_member_commissions')
        .delete()
        .eq('commission_id', id);

      if (deleteError) throw deleteError;

      // Insert new relationships
      if (member_ids.length > 0) {
        const memberInserts = member_ids.map((member_id: string) => ({
          commission_id: id,
          member_id: member_id,
          role: 'member',
        }));

        const { error: insertError } = await supabaseAdmin
          .from('council_member_commissions')
          .insert(memberInserts);

        if (insertError) throw insertError;
      }
    }

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'council_session', // Using council_session as a generic for commissions
      resourceId: id,
      resourceTitle: commissionData.name || existingCommission?.name,
      details: { type: 'commission', updatedFields: Object.keys(commissionData) },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(commission);
  } catch (error) {
    console.error('Error updating commission:', error);
    return NextResponse.json(
      { error: 'Failed to update commission' },
      { status: 500 }
    );
  }
}

// DELETE - Delete commission
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

    // Get commission data for logging before deletion
    const { data: commission } = await supabaseAdmin
      .from('council_commissions')
      .select('name')
      .eq('id', id)
      .single();

    // Note: council_member_commissions will be deleted automatically via ON DELETE CASCADE
    const { error } = await supabaseAdmin
      .from('council_commissions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'council_session', // Using council_session as a generic for commissions
      resourceId: id,
      resourceTitle: commission?.name,
      details: { type: 'commission' },
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting commission:', error);
    return NextResponse.json(
      { error: 'Failed to delete commission' },
      { status: 500 }
    );
  }
}
