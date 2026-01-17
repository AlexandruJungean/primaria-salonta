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

// POST - Upload image
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
    const newsId = formData.get('news_id') as string;
    const isFeatured = formData.get('is_featured') === 'true';
    const caption = formData.get('caption') as string || '';

    if (!file || !newsId) {
      return NextResponse.json({ error: 'File and news_id are required' }, { status: 400 });
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
          maxWidth: isFeatured ? 1200 : 1920,
          maxHeight: isFeatured ? 800 : 1440,
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

        console.log(`News image compressed: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)} (${compressionInfo.ratio}% reduction)`);
      } catch (compressionError) {
        console.warn('Image compression failed, using original:', compressionError);
      }
    }

    const result = await uploadFile(buffer, finalFilename, 'stiri', finalMimeType, year);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // If this is featured image, update the news record
    if (isFeatured) {
      await supabaseAdmin
        .from('news')
        .update({ featured_image: result.url })
        .eq('id', newsId);

      return NextResponse.json({ 
        success: true, 
        url: result.url,
        isFeatured: true,
        compressed: compressionInfo !== null,
        compression: compressionInfo,
      });
    }

    // Get current max sort_order
    const { data: existing } = await supabaseAdmin
      .from('news_images')
      .select('sort_order')
      .eq('news_id', newsId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const sortOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    // Insert into news_images
    const { data, error } = await supabaseAdmin
      .from('news_images')
      .insert([{
        news_id: newsId,
        image_url: result.url,
        caption: caption || null,
        sort_order: sortOrder,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...data,
      compressed: compressionInfo !== null,
      compression: compressionInfo,
    });
  } catch (error) {
    console.error('Error uploading news image:', error);
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
    const id = searchParams.get('id');
    const imageUrl = searchParams.get('imageUrl');
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const newsId = searchParams.get('newsId');

    if (isFeatured && newsId) {
      // Clear featured image from news record
      await supabaseAdmin
        .from('news')
        .update({ featured_image: null })
        .eq('id', newsId);

      // Try to delete from R2
      if (imageUrl) {
        const key = imageUrl.split('/').slice(-3).join('/');
        await deleteFile(key);
      }

      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get image info first
    const { data: image } = await supabaseAdmin
      .from('news_images')
      .select('image_url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabaseAdmin
      .from('news_images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Try to delete from R2
    if (image?.image_url) {
      const key = image.image_url.split('/').slice(-3).join('/');
      await deleteFile(key);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
