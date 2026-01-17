import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, validateFile, DocumentCategory } from '@/lib/cloudflare/r2-client';
import { checkRateLimit } from '@/lib/rate-limit';
import { compressImage, isImageFile, formatFileSize, getCompressionRatio } from '@/lib/image-compression';
import { requireAdmin } from '@/lib/auth/verify-admin';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as DocumentCategory || 'altele';
    const subcategory = formData.get('subcategory') as string || '';
    const year = formData.get('year') ? parseInt(formData.get('year') as string) : new Date().getFullYear();
    const skipCompression = formData.get('skipCompression') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(
      { size: file.size, type: file.type },
      'all'
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let finalMimeType = file.type;
    let finalFilename = file.name;
    let compressionInfo: { originalSize: number; compressedSize: number; ratio: number } | null = null;

    // Comprimă imaginea automat dacă e imagine și nu e skip
    if (isImageFile(file.type) && !skipCompression) {
      try {
        const compressed = await compressImage(buffer, {
          maxWidth: 1920,
          maxHeight: 1440,
          quality: 85,
          format: 'webp',
        });

        buffer = Buffer.from(compressed.buffer);
        finalMimeType = compressed.mimeType;
        
        // Schimbă extensia la .webp
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        finalFilename = `${baseName}.webp`;

        compressionInfo = {
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          ratio: getCompressionRatio(compressed.originalSize, compressed.compressedSize),
        };

        console.log(`Image compressed: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)} (${compressionInfo.ratio}% reduction)`);
      } catch (compressionError) {
        // Dacă compresia eșuează, continuă cu fișierul original
        console.warn('Image compression failed, using original:', compressionError);
      }
    }

    // Generate filename with subcategory if provided
    if (subcategory) {
      const ext = finalFilename.split('.').pop();
      const baseName = finalFilename.replace(`.${ext}`, '');
      finalFilename = `${baseName}-${subcategory}.${ext}`;
    }

    // Upload to R2
    const result = await uploadFile(
      buffer,
      finalFilename,
      category,
      finalMimeType,
      year
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      filename: finalFilename,
      originalFilename: file.name,
      size: buffer.length,
      originalSize: file.size,
      mimeType: finalMimeType,
      compressed: compressionInfo !== null,
      compression: compressionInfo,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
