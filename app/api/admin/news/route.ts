import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  logAuditAction, 
  logServerError, 
  extractErrorDetails, 
  determineSeverity, 
  getRequestInfo 
} from '@/lib/audit/logger';
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

const ENDPOINT = '/api/admin/news';

// GET - Fetch news with images and documents
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { ipAddress, userAgent } = getRequestInfo(request);
  
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get news
    const { data: news, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get images
    const { data: images } = await supabaseAdmin
      .from('news_images')
      .select('*')
      .eq('news_id', id)
      .order('sort_order');

    // Get documents
    const { data: documents } = await supabaseAdmin
      .from('news_documents')
      .select('*')
      .eq('news_id', id)
      .order('created_at');

    return NextResponse.json({
      ...news,
      images: images || [],
      documents: documents || [],
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    
    const errorDetails = extractErrorDetails(error);
    await logServerError({
      endpoint: ENDPOINT,
      method: 'GET',
      errorMessage: errorDetails.message,
      errorStack: errorDetails.stack,
      errorCode: errorDetails.code,
      severity: determineSeverity(error, ENDPOINT),
      ipAddress,
      userAgent,
    });
    
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// POST - Create news
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { ipAddress, userAgent } = getRequestInfo(request);
  let requestBody: Record<string, unknown> | undefined;
  
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    requestBody = body;

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'news',
      resourceId: data.id,
      resourceTitle: data.title,
      details: { slug: data.slug },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating news:', error);
    
    const errorDetails = extractErrorDetails(error);
    await logServerError({
      endpoint: ENDPOINT,
      method: 'POST',
      errorMessage: errorDetails.message,
      errorStack: errorDetails.stack,
      errorCode: errorDetails.code,
      severity: determineSeverity(error, ENDPOINT),
      requestBody,
      ipAddress,
      userAgent,
    });
    
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

// PATCH - Update news
export async function PATCH(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { ipAddress, userAgent } = getRequestInfo(request);
  let requestBody: Record<string, unknown> | undefined;
  
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();
    requestBody = body;

    // Get current data for logging
    const { data: existingNews } = await supabaseAdmin
      .from('news')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('news')
      .update(body)
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'news',
      resourceId: id,
      resourceTitle: body.title || existingNews?.title,
      details: { updatedFields: Object.keys(body) },
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating news:', error);
    
    const errorDetails = extractErrorDetails(error);
    await logServerError({
      endpoint: ENDPOINT,
      method: 'PATCH',
      errorMessage: errorDetails.message,
      errorStack: errorDetails.stack,
      errorCode: errorDetails.code,
      severity: determineSeverity(error, ENDPOINT),
      requestBody,
      ipAddress,
      userAgent,
    });
    
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE - Delete news
export async function DELETE(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { ipAddress, userAgent } = getRequestInfo(request);
  
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get news data before deletion for logging
    const { data: news } = await supabaseAdmin
      .from('news')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'news',
      resourceId: id,
      resourceTitle: news?.title,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    
    const errorDetails = extractErrorDetails(error);
    await logServerError({
      endpoint: ENDPOINT,
      method: 'DELETE',
      errorMessage: errorDetails.message,
      errorStack: errorDetails.stack,
      errorCode: errorDetails.code,
      severity: determineSeverity(error, ENDPOINT),
      ipAddress,
      userAgent,
    });
    
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
