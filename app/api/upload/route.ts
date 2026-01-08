/**
 * API Route pentru upload documente în Cloudflare R2
 * 
 * POST /api/upload
 * - Acceptă multipart/form-data
 * - Returnează URL-ul public al fișierului
 * 
 * Exemple:
 * - Upload PDF: category=hotarari, year=2025
 * - Upload imagine: category=stiri
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, validateFile, type DocumentCategory } from '@/lib/cloudflare/r2-client';

// Categorii valide
const VALID_CATEGORIES: DocumentCategory[] = [
  'hotarari', 'sedinte', 'stiri', 'buget', 'declaratii',
  'programe', 'formulare', 'autorizatii', 'certificate',
  'dispozitii', 'licitatii', 'transparenta', 'altele'
];

export async function POST(request: NextRequest) {
  try {
    // Verifică autentificarea (TODO: implementare cu Supabase Auth)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const formData = await request.formData();
    
    // Extrage datele
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as DocumentCategory | null;
    const yearStr = formData.get('year') as string | null;
    
    // Validări
    if (!file) {
      return NextResponse.json(
        { error: 'Niciun fișier trimis' },
        { status: 400 }
      );
    }
    
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Categorie invalidă. Categorii valide: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validare fișier
    const validation = validateFile(
      { size: file.size, type: file.type },
      category === 'stiri' ? 'all' : 'documents'
    );
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Convertește File la Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Anul (opțional)
    const year = yearStr ? parseInt(yearStr, 10) : undefined;
    
    // Upload în R2
    const result = await uploadFile(
      buffer,
      file.name,
      category,
      file.type,
      year
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload eșuat' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });
    
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: 'Eroare internă server' },
      { status: 500 }
    );
  }
}

// Route segment config pentru fișiere mari
export const runtime = 'nodejs';
export const maxDuration = 60; // Timp maxim de procesare (secunde)
