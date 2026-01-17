import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadFile, deleteFile } from '@/lib/cloudflare/r2-client';
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

// Helper to extract file key from URL
function extractFileKeyFromUrl(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);
    return url.pathname.replace(/^\//, '');
  } catch {
    return fileUrl;
  }
}

// GET - Fetch documents for a session
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('council_session_documents')
      .select('*')
      .eq('session_id', sessionId)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching session documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST - Upload a new document
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const formData = await request.formData();
    
    const file = formData.get('file') as File | null;
    const sessionId = formData.get('session_id') as string;
    const documentType = formData.get('document_type') as string || 'ordine_de_zi';
    const title = formData.get('title') as string;
    const year = formData.get('year') as string || new Date().getFullYear().toString();

    if (!file || !sessionId) {
      return NextResponse.json(
        { error: 'File and session_id are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadResult = await uploadFile(
      buffer,
      file.name,
      'sedinte',
      file.type || 'application/pdf',
      parseInt(year)
    );

    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Get current max sort_order
    const { data: existingDocs } = await supabaseAdmin
      .from('council_session_documents')
      .select('sort_order')
      .eq('session_id', sessionId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingDocs && existingDocs.length > 0 
      ? (existingDocs[0].sort_order || 0) + 1 
      : 0;

    // Insert document record
    const { data: newDocument, error: dbError } = await supabaseAdmin
      .from('council_session_documents')
      .insert({
        session_id: sessionId,
        document_type: documentType,
        file_url: uploadResult.url,
        file_name: file.name,
        file_size: file.size,
        title: title || file.name.replace(/\.[^/.]+$/, ''),
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      if (uploadResult.key) {
        await deleteFile(uploadResult.key);
      }
      throw dbError;
    }

    return NextResponse.json(newDocument);
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a document
export async function DELETE(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const fileUrl = searchParams.get('fileUrl');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('council_session_documents')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // Delete from R2 storage
    if (fileUrl) {
      const fileKey = extractFileKeyFromUrl(fileUrl);
      if (fileKey) {
        await deleteFile(fileKey);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
