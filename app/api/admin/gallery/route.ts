import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';
import { checkRateLimit } from '@/lib/rate-limit';
import { uploadFile } from '@/lib/cloudflare/r2-client';
import { compressImage, isImageFile, formatFileSize, getCompressionRatio } from '@/lib/image-compression';
import { requireAdmin } from '@/lib/auth/verify-admin';

// Create admin client inside functions to ensure env vars are loaded
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(url, key);
}

// GET - List gallery images
export async function GET(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('page_images')
      .select('*')
      .eq('page_slug', 'galerie')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error loading gallery:', error);
    return NextResponse.json(
      { error: 'Failed to load gallery' },
      { status: 500 }
    );
  }
}

// POST - Add new image (supports both JSON and FormData)
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    // Rate limiting: 30 fișiere / minut
    const rateLimitResponse = await checkRateLimit(request, 'upload');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const contentType = request.headers.get('content-type') || '';

    let image_url: string;
    let alt_text: string = '';
    let sort_order: number = 0;
    let compressionInfo = null;

    // Handle FormData (direct file upload with compression)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      alt_text = (formData.get('alt_text') as string) || '';
      sort_order = parseInt(formData.get('sort_order') as string) || 0;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Convert and compress image
      const bytes = await file.arrayBuffer();
      let buffer = Buffer.from(bytes);
      let finalMimeType = file.type;
      let finalFilename = file.name;

      if (isImageFile(file.type)) {
        try {
          const compressed = await compressImage(buffer, {
            maxWidth: 1920,
            maxHeight: 1440,
            quality: 85,
            format: 'webp',
          });

          buffer = Buffer.from(compressed.buffer);
          finalMimeType = compressed.mimeType;
          
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          finalFilename = `${baseName}.webp`;

          compressionInfo = {
            originalSize: compressed.originalSize,
            compressedSize: compressed.compressedSize,
            ratio: getCompressionRatio(compressed.originalSize, compressed.compressedSize),
          };

          console.log(`Gallery image compressed: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)} (${compressionInfo.ratio}% reduction)`);
        } catch (compressionError) {
          console.warn('Image compression failed, using original:', compressionError);
        }
      }

      // Upload to R2
      const year = new Date().getFullYear();
      const result = await uploadFile(buffer, finalFilename, 'galerie', finalMimeType, year);

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Upload failed' }, { status: 500 });
      }

      image_url = result.url!;
    } else {
      // Handle JSON (URL provided directly - legacy)
      const body = await request.json();
      image_url = body.image_url;
      alt_text = body.alt_text || '';
      sort_order = body.sort_order || 0;

      if (!image_url) {
        return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('page_images')
      .insert({
        page_slug: 'galerie',
        image_url,
        alt_text,
        sort_order,
        published: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // Log the action
    await logAuditAction({
      action: 'create',
      resourceType: 'gallery',
      resourceId: data.id,
      resourceTitle: alt_text || 'Imagine galerie',
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ 
      success: true, 
      data,
      compressed: compressionInfo !== null,
      compression: compressionInfo,
    });
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

// DELETE - Remove image
export async function DELETE(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const imageUrl = searchParams.get('image_url');
    const { ipAddress, userAgent } = getRequestInfo(request);

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID required' },
        { status: 400 }
      );
    }

    // Get image data for logging before deletion
    const { data: image } = await supabaseAdmin
      .from('page_images')
      .select('alt_text')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabaseAdmin
      .from('page_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    // Try to delete from storage too
    if (imageUrl) {
      try {
        const urlParts = imageUrl.split('/photos/');
        if (urlParts.length > 1) {
          const storagePath = urlParts[1];
          await supabaseAdmin.storage.from('photos').remove([storagePath]);
        }
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError);
      }
    }

    // Log the action
    await logAuditAction({
      action: 'delete',
      resourceType: 'gallery',
      resourceId: id,
      resourceTitle: image?.alt_text || 'Imagine galerie',
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
