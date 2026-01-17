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

// GET - Fetch sessions (filtered by source) or single session
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const source = searchParams.get('source'); // 'sedinte' or 'hotarari'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const search = searchParams.get('search') || '';

    // Single session with details
    if (id) {
      const { data: session, error } = await supabaseAdmin
        .from('council_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Get session documents
      const { data: documents } = await supabaseAdmin
        .from('council_session_documents')
        .select('*')
        .eq('session_id', id)
        .order('sort_order');

      // Get decisions for this session (only for hotarari source)
      let decisions = [];
      if (session.source === 'hotarari') {
        const { data: decisionsData } = await supabaseAdmin
          .from('council_decisions')
          .select('*, council_decision_documents(*)')
          .eq('session_id', id)
          .order('decision_number', { ascending: false });
        decisions = decisionsData || [];
      }

      return NextResponse.json({
        ...session,
        documents: documents || [],
        decisions,
      });
    }

    // List sessions with filters
    let query = supabaseAdmin
      .from('council_sessions')
      .select('*', { count: 'exact' })
      .order('session_date', { ascending: false });

    if (source) {
      query = query.eq('source', source);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    // For hotarari source, get decisions count
    if (source === 'hotarari' && data && data.length > 0) {
      const sessionIds = data.map(s => s.id);
      const { data: decisionCounts } = await supabaseAdmin
        .from('council_decisions')
        .select('session_id')
        .in('session_id', sessionIds);

      const countsMap = new Map<string, number>();
      decisionCounts?.forEach(d => {
        const current = countsMap.get(d.session_id) || 0;
        countsMap.set(d.session_id, current + 1);
      });

      const sessionsWithCount = data.map(session => ({
        ...session,
        decisions_count: countsMap.get(session.id) || 0,
      }));

      return NextResponse.json({
        data: sessionsWithCount,
        count: count || 0,
        page,
        limit,
      });
    }

    // For sedinte source, get documents count
    if (source === 'sedinte' && data && data.length > 0) {
      const sessionIds = data.map(s => s.id);
      const { data: docCounts } = await supabaseAdmin
        .from('council_session_documents')
        .select('session_id')
        .in('session_id', sessionIds);

      const countsMap = new Map<string, number>();
      docCounts?.forEach(d => {
        const current = countsMap.get(d.session_id) || 0;
        countsMap.set(d.session_id, current + 1);
      });

      const sessionsWithCount = data.map(session => ({
        ...session,
        documents_count: countsMap.get(session.id) || 0,
      }));

      return NextResponse.json({
        data: sessionsWithCount,
        count: count || 0,
        page,
        limit,
      });
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching council sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST - Create new session
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    const { data, error } = await supabaseAdmin
      .from('council_sessions')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'council_session',
      resourceId: data.id,
      resourceTitle: data.title,
      details: { source: data.source, session_date: data.session_date },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating council session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// PATCH - Update session
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

    // Get current data for logging
    const { data: existingSession } = await supabaseAdmin
      .from('council_sessions')
      .select('title, source')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('council_sessions')
      .update(body)
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'council_session',
      resourceId: id,
      resourceTitle: body.title || existingSession?.title,
      details: { source: existingSession?.source, updatedFields: Object.keys(body) },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating council session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE - Delete session
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

    // Get session data for logging before deletion
    const { data: session } = await supabaseAdmin
      .from('council_sessions')
      .select('title, source')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('council_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'council_session',
      resourceId: id,
      resourceTitle: session?.title,
      details: { source: session?.source },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting council session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
