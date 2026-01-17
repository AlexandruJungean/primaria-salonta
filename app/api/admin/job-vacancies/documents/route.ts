import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';
import { requireAdmin } from '@/lib/auth/verify-admin';

// Helper to create admin client inside functions
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase credentials for admin client');
    throw new Error('Supabase credentials not configured for admin client.');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

// POST - Upload document for job vacancy
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const formData = await request.formData();
    const { ipAddress, userAgent } = getRequestInfo(request);
    
    const file = formData.get('file') as File;
    const vacancyId = formData.get('vacancy_id') as string;
    const documentType = formData.get('document_type') as string;
    const title = formData.get('title') as string;
    const sortOrder = parseInt(formData.get('sort_order') as string || '0');

    if (!file || !vacancyId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, vacancy_id, document_type' },
        { status: 400 }
      );
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `cariera/${vacancyId}/${fileName}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from('photos')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('photos')
      .getPublicUrl(filePath);

    // Insert into database
    const { data: newDoc, error: dbError } = await supabaseAdmin
      .from('job_vacancy_documents')
      .insert({
        vacancy_id: vacancyId,
        document_type: documentType,
        file_url: urlData.publicUrl,
        file_name: file.name,
        title: title || file.name.replace(/\.[^/.]+$/, ''),
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to delete the uploaded file
      await supabaseAdmin.storage.from('photos').remove([filePath]);
      return NextResponse.json(
        { error: 'Failed to save document to database' },
        { status: 500 }
      );
    }

    // Log the action
    await logAuditAction({
      action: 'upload',
      resourceType: 'job_vacancy',
      resourceId: vacancyId,
      resourceTitle: title || file.name,
      details: { document_type: documentType },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    console.error('Error in job vacancy document upload:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE - Remove document
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const fileUrl = searchParams.get('file_url');
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      );
    }

    // Get document data for logging before deletion
    const { data: document } = await supabaseAdmin
      .from('job_vacancy_documents')
      .select('title, vacancy_id')
      .eq('id', id)
      .single();

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('job_vacancy_documents')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return NextResponse.json(
        { error: 'Failed to delete document from database' },
        { status: 500 }
      );
    }

    // Delete from storage if fileUrl is provided
    if (fileUrl) {
      try {
        const urlParts = fileUrl.split('/photos/');
        if (urlParts.length > 1) {
          const storagePath = urlParts[1];
          await supabaseAdmin.storage.from('photos').remove([storagePath]);
        }
      } catch (storageError) {
        console.warn('Error deleting from storage:', storageError);
        // Don't fail the request if storage deletion fails
      }
    }

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'job_vacancy',
      resourceId: document?.vacancy_id || id,
      resourceTitle: document?.title || 'Document concurs',
      details: { deleted_document_id: id },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job vacancy document:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
