/**
 * API Route pentru ștergerea fișierelor din R2
 * 
 * DELETE /api/upload/delete
 * Body: { fileKey }
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteFile } from '@/lib/cloudflare/r2-client';

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Verifică autentificarea și permisiunile
    
    const body = await request.json();
    const { fileKey } = body;
    
    if (!fileKey) {
      return NextResponse.json(
        { error: 'Lipsește fileKey' },
        { status: 400 }
      );
    }
    
    // Validare de bază - previne ștergerea fișierelor din afara bucket-ului
    if (fileKey.includes('..') || fileKey.startsWith('/')) {
      return NextResponse.json(
        { error: 'fileKey invalid' },
        { status: 400 }
      );
    }
    
    const result = await deleteFile(fileKey);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Fișier șters cu succes',
    });
    
  } catch (error) {
    console.error('Delete API Error:', error);
    return NextResponse.json(
      { error: 'Eroare internă server' },
      { status: 500 }
    );
  }
}

