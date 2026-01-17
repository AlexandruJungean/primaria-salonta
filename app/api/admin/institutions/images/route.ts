import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadFile, deleteFile } from '@/lib/cloudflare/r2-client';
import { checkRateLimit } from '@/lib/rate-limit';
import { compressImage, isImageFile, formatFileSize, getCompressionRatio } from '@/lib/image-compression';
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

// POST - Upload image for institution
export async function POST(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    // Rate limiting: 30 fișiere / minut
    const rateLimitResponse = await checkRateLimit(request, 'upload');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const supabaseAdmin = createAdminClient();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const institutionId = formData.get('institution_id') as string;
    const isPrimary = formData.get('is_primary') === 'true';
    const caption = formData.get('caption') as string || '';

    if (!file || !institutionId) {
      return NextResponse.json({ error: 'File and institution_id are required' }, { status: 400 });
    }

    // Upload to R2 with compression
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let finalMimeType = file.type;
    let finalFilename = file.name;
    let compressionInfo = null;
    const year = new Date().getFullYear();

    // Comprimă imaginea automat
    if (isImageFile(file.type)) {
      try {
        const compressed = await compressImage(buffer, {
          maxWidth: isPrimary ? 1200 : 1920,
          maxHeight: isPrimary ? 800 : 1440,
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

        console.log(`Institution image compressed: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)} (${compressionInfo.ratio}% reduction)`);
      } catch (compressionError) {
        console.warn('Image compression failed, using original:', compressionError);
      }
    }

    const result = await uploadFile(buffer, finalFilename, 'institutii', finalMimeType, year);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // If this is primary image, update the institution record
    if (isPrimary) {
      await supabaseAdmin
        .from('institutions')
        .update({ image_url: result.url })
        .eq('id', institutionId);

      return NextResponse.json({ 
        success: true, 
        url: result.url,
        isPrimary: true,
        compressed: compressionInfo !== null,
        compression: compressionInfo,
      });
    }

    // For gallery images, we return the URL to be stored in content sections
    return NextResponse.json({
      success: true,
      url: result.url,
      caption: caption || null,
      compressed: compressionInfo !== null,
      compression: compressionInfo,
    });
  } catch (error) {
    console.error('Error uploading institution image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

// DELETE - Delete image
export async function DELETE(request: NextRequest) {
  // Verifică autentificarea
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');
    const isPrimary = searchParams.get('isPrimary') === 'true';
    const institutionId = searchParams.get('institutionId');

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    // If this is primary image, clear it from institution record
    if (isPrimary && institutionId) {
      await supabaseAdmin
        .from('institutions')
        .update({ image_url: null })
        .eq('id', institutionId);
    }

    // Try to delete from R2
    try {
      const key = imageUrl.split('/').slice(-3).join('/');
      await deleteFile(key);
    } catch (r2Error) {
      console.warn('Failed to delete from R2:', r2Error);
      // Continue even if R2 delete fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting institution image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
