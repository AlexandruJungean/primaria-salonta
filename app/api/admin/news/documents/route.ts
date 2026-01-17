import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadFile, deleteFile } from '@/lib/cloudflare/r2-client';
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

// POST - Upload document
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const newsId = formData.get('news_id') as string;
    const title = formData.get('title') as string || file.name.replace(/\.[^/.]+$/, '');

    if (!file || !newsId) {
      return NextResponse.json({ error: 'File and news_id are required' }, { status: 400 });
    }

    // Upload to R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const year = new Date().getFullYear();

    const result = await uploadFile(buffer, file.name, 'stiri', file.type, year);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Insert into news_documents
    const { data, error } = await supabaseAdmin
      .from('news_documents')
      .insert([{
        news_id: newsId,
        file_url: result.url,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        title: title,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading news document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get document info first
    const { data: doc } = await supabaseAdmin
      .from('news_documents')
      .select('file_url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabaseAdmin
      .from('news_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Try to delete from R2
    if (doc?.file_url) {
      const key = doc.file_url.split('/').slice(-3).join('/');
      await deleteFile(key);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
