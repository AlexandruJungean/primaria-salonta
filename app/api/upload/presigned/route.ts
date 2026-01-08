/**
 * API Route pentru generarea URL-urilor pre-signed
 * Permite upload direct din browser în R2 fără a trece prin server
 * 
 * POST /api/upload/presigned
 * Body: { filename, category, contentType, year? }
 * Returns: { uploadUrl, fileKey, publicUrl }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUploadPresignedUrl, validateFile, type DocumentCategory } from '@/lib/cloudflare/r2-client';

const VALID_CATEGORIES: DocumentCategory[] = [
  'hotarari', 'sedinte', 'stiri', 'buget', 'declaratii',
  'programe', 'formulare', 'autorizatii', 'certificate',
  'dispozitii', 'licitatii', 'transparenta', 'altele'
];

export async function POST(request: NextRequest) {
  try {
    // TODO: Verifică autentificarea
    
    const body = await request.json();
    const { filename, category, contentType, year, fileSize } = body;
    
    // Validări
    if (!filename || !category || !contentType) {
      return NextResponse.json(
        { error: 'Lipsesc parametri: filename, category, contentType' },
        { status: 400 }
      );
    }
    
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Categorie invalidă` },
        { status: 400 }
      );
    }
    
    // Validare tip fișier
    if (fileSize) {
      const validation = validateFile(
        { size: fileSize, type: contentType },
        category === 'stiri' ? 'all' : 'documents'
      );
      
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }
    
    // Generează URL pre-signed
    const result = await getUploadPresignedUrl(
      filename,
      category,
      contentType,
      year
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      uploadUrl: result.uploadUrl,
      fileKey: result.fileKey,
      publicUrl: result.publicUrl,
    });
    
  } catch (error) {
    console.error('Presigned URL API Error:', error);
    return NextResponse.json(
      { error: 'Eroare internă server' },
      { status: 500 }
    );
  }
}

