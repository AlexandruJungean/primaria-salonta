import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, requireRole } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List offices and documents
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'offices' or 'documents'
  const officeId = searchParams.get('office_id');
  const id = searchParams.get('id');

  const supabase = createAdminClient();

  try {
    // Get single office
    if (type === 'offices' && id) {
      const { data, error } = await supabase
        .from('required_documents_offices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Get single document
    if (type === 'documents' && id) {
      const { data, error } = await supabase
        .from('required_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // List all offices
    if (type === 'offices') {
      const { data, error } = await supabase
        .from('required_documents_offices')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // List documents for an office
    if (type === 'documents' && officeId) {
      const { data, error } = await supabase
        .from('required_documents')
        .select('*')
        .eq('office_id', officeId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // List all documents
    if (type === 'documents') {
      const { data, error } = await supabase
        .from('required_documents')
        .select('*, required_documents_offices(name)')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST - Create office or document
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();

    if (type === 'offices') {
      const { data, error } = await supabase
        .from('required_documents_offices')
        .insert([body])
        .select()
        .single();

      if (error) throw error;

      await logAuditAction({
        action: 'create',
        resourceType: 'required_documents_office',
        resourceId: data.id,
        resourceTitle: data.name,
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(data, { status: 201 });
    }

    if (type === 'documents') {
      const { data, error } = await supabase
        .from('required_documents')
        .insert([body])
        .select()
        .single();

      if (error) throw error;

      await logAuditAction({
        action: 'create',
        resourceType: 'required_document',
        resourceId: data.id,
        resourceTitle: data.title,
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error creating:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

// PATCH - Update office or document
export async function PATCH(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();

    if (type === 'offices') {
      const { data, error } = await supabase
        .from('required_documents_offices')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await logAuditAction({
        action: 'update',
        resourceType: 'required_documents_office',
        resourceId: data.id,
        resourceTitle: data.name,
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(data);
    }

    if (type === 'documents') {
      const { data, error } = await supabase
        .from('required_documents')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await logAuditAction({
        action: 'update',
        resourceType: 'required_document',
        resourceId: data.id,
        resourceTitle: data.title,
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error updating:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE - Delete office or document
export async function DELETE(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    if (type === 'offices') {
      const { data: office } = await supabase
        .from('required_documents_offices')
        .select('name')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('required_documents_offices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logAuditAction({
        action: 'delete',
        resourceType: 'required_documents_office',
        resourceId: id,
        resourceTitle: office?.name,
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json({ success: true });
    }

    if (type === 'documents') {
      const { data: doc } = await supabase
        .from('required_documents')
        .select('title')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('required_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logAuditAction({
        action: 'delete',
        resourceType: 'required_document',
        resourceId: id,
        resourceTitle: doc?.title,
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        ipAddress,
        userAgent,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
