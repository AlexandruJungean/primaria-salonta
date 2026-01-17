import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, requireRole } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List documents for a program or get single document
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const programId = searchParams.get('program_id');

  const supabase = createAdminClient();

  try {
    if (id) {
      const { data, error } = await supabase
        .from('program_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (programId) {
      const { data, error } = await supabase
        .from('program_documents')
        .select('*')
        .eq('program_id', programId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'program_id is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching program documents:', error);
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
      .from('program_documents')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAuditAction({
      action: 'create',
      resourceType: 'program_document',
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
    console.error('Error creating program document:', error);
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
      .from('program_documents')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAuditAction({
      action: 'update',
      resourceType: 'program_document',
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
    console.error('Error updating program document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest) {
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
    // Get document title for audit log
    const { data: doc } = await supabase
      .from('program_documents')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('program_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log audit
    await logAuditAction({
      action: 'delete',
      resourceType: 'program_document',
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
    console.error('Error deleting program document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
