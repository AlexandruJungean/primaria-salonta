import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, requireRole } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List all FAQs or get single FAQ
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const supabase = createAdminClient();

  try {
    if (id) {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin', 'editor']);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('faq')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'create',
      resourceType: 'faq',
      resourceId: data.id,
      resourceTitle: data.question?.substring(0, 50),
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

// PATCH - Update FAQ
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
      .from('faq')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'update',
      resourceType: 'faq',
      resourceId: data.id,
      resourceTitle: data.question?.substring(0, 50),
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

// DELETE - Delete FAQ
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
    const { data: faq } = await supabase
      .from('faq')
      .select('question')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('faq')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logAuditAction({
      action: 'delete',
      resourceType: 'faq',
      resourceId: id,
      resourceTitle: faq?.question?.substring(0, 50),
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
