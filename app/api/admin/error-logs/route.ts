import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/verify-admin';

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    const endpoint = searchParams.get('endpoint');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const resolved = searchParams.get('resolved');

    let query = supabaseAdmin
      .from('error_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (severity) {
      query = query.eq('severity', severity);
    }

    if (endpoint) {
      query = query.ilike('endpoint', `%${endpoint}%`);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo + 'T23:59:59');
    }

    if (search) {
      query = query.or(`error_message.ilike.%${search}%,endpoint.ilike.%${search}%`);
    }

    if (resolved === 'true') {
      query = query.eq('resolved', true);
    } else if (resolved === 'false') {
      query = query.eq('resolved', false);
    }

    // Pagination
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
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error logs' },
      { status: 500 }
    );
  }
}

// PATCH - Mark error as resolved
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('error_logs')
      .update({ 
        resolved: body.resolved,
        resolved_at: body.resolved ? new Date().toISOString() : null,
        resolved_by: body.resolved_by || null,
        resolution_notes: body.resolution_notes || null,
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating error log:', error);
    return NextResponse.json(
      { error: 'Failed to update error log' },
      { status: 500 }
    );
  }
}

// DELETE - Delete old error logs (cleanup)
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const olderThan = searchParams.get('olderThan'); // Days

    if (!olderThan) {
      return NextResponse.json({ error: 'olderThan parameter required' }, { status: 400 });
    }

    const days = parseInt(olderThan);
    if (isNaN(days) || days < 7) {
      return NextResponse.json({ error: 'olderThan must be at least 7 days' }, { status: 400 });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // First count how many will be deleted
    const { count } = await supabaseAdmin
      .from('error_logs')
      .select('*', { count: 'exact', head: true })
      .eq('resolved', true)
      .lt('created_at', cutoffDate.toISOString());

    // Then delete them
    const { error } = await supabaseAdmin
      .from('error_logs')
      .delete()
      .eq('resolved', true)
      .lt('created_at', cutoffDate.toISOString());

    if (error) throw error;

    return NextResponse.json({ success: true, deletedCount: count || 0 });
  } catch (error) {
    console.error('Error deleting error logs:', error);
    return NextResponse.json(
      { error: 'Failed to delete error logs' },
      { status: 500 }
    );
  }
}
