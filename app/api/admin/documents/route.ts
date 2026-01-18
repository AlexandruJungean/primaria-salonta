import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, requireRole } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List documents or get single document
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const parent_id = searchParams.get('parent_id');

  const supabase = createAdminClient();

  try {
    if (id) {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Fetch annexes (documents with specific parent_id)
    if (parent_id) {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('parent_id', parent_id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Parse pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;
    const source_folder = searchParams.get('source_folder');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const parentsOnly = searchParams.get('parents_only') === 'true';

    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (source_folder) {
      query = query.eq('source_folder', source_folder);
    }

    if (subcategory) {
      query = query.eq('subcategory', subcategory);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (parentsOnly) {
      query = query.is('parent_id', null);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    
    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST - Create new document
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('documents')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'create',
      resourceType: 'document',
      resourceId: data.id,
      resourceTitle: data.title,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

// PATCH - Update document
export async function PATCH(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('documents')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'update',
      resourceType: 'document',
      resourceId: data.id,
      resourceTitle: data.title,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const { data: doc } = await supabase
      .from('documents')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logAuditAction({
      action: 'delete',
      resourceType: 'document',
      resourceId: id,
      resourceTitle: doc?.title,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
