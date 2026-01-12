import { NextRequest, NextResponse } from 'next/server';
import { getCachedTranslation, getCachedTranslations } from '@/lib/google-translate/cache';
import type { SupportedLocale } from '@/lib/google-translate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, targetLanguage } = body as {
      text?: string;
      texts?: string[];
      targetLanguage: SupportedLocale;
    };

    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'targetLanguage is required' },
        { status: 400 }
      );
    }

    // Single text translation
    if (text !== undefined) {
      const translated = await getCachedTranslation(text, targetLanguage);
      return NextResponse.json({ translated });
    }

    // Multiple texts translation
    if (texts !== undefined && Array.isArray(texts)) {
      const translated = await getCachedTranslations(texts, targetLanguage);
      return NextResponse.json({ translated });
    }

    return NextResponse.json(
      { error: 'Either text or texts is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
