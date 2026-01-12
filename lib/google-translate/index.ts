/**
 * Google Cloud Translation API v2 Service
 * 
 * Used for translating dynamic database content (news, events, documents, etc.)
 * that is primarily in Romanian but needs to be displayed in Hungarian or English.
 */

const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export type SupportedLocale = 'ro' | 'hu' | 'en';

interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

/**
 * Translate a single text string
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLocale,
  sourceLanguage?: SupportedLocale
): Promise<TranslationResult> {
  // Don't translate if target is Romanian (source language) or text is empty
  if (targetLanguage === 'ro' || !text || text.trim() === '') {
    return { translatedText: text };
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey) {
    console.warn('GOOGLE_TRANSLATE_API_KEY not configured, returning original text');
    return { translatedText: text };
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: text,
      target: targetLanguage,
      format: 'text',
    });

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Translate API error:', error);
      return { translatedText: text };
    }

    const data: GoogleTranslateResponse = await response.json();
    
    return {
      translatedText: data.data.translations[0].translatedText,
      detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { translatedText: text };
  }
}

/**
 * Translate multiple texts in a single API call (more efficient)
 */
export async function translateTexts(
  texts: string[],
  targetLanguage: SupportedLocale,
  sourceLanguage?: SupportedLocale
): Promise<TranslationResult[]> {
  // Don't translate if target is Romanian or no texts
  if (targetLanguage === 'ro' || texts.length === 0) {
    return texts.map(text => ({ translatedText: text }));
  }

  // Filter out empty texts but keep track of indices
  const textsWithIndices = texts.map((text, index) => ({ text, index }));
  const nonEmptyTexts = textsWithIndices.filter(t => t.text && t.text.trim() !== '');
  
  if (nonEmptyTexts.length === 0) {
    return texts.map(text => ({ translatedText: text }));
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey) {
    console.warn('GOOGLE_TRANSLATE_API_KEY not configured, returning original texts');
    return texts.map(text => ({ translatedText: text }));
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      target: targetLanguage,
      format: 'text',
    });

    // Add each text as a separate 'q' parameter
    nonEmptyTexts.forEach(t => params.append('q', t.text));

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Translate API error:', error);
      return texts.map(text => ({ translatedText: text }));
    }

    const data: GoogleTranslateResponse = await response.json();
    
    // Map translations back to original indices
    const results: TranslationResult[] = texts.map(text => ({ translatedText: text }));
    
    nonEmptyTexts.forEach((t, i) => {
      results[t.index] = {
        translatedText: data.data.translations[i].translatedText,
        detectedSourceLanguage: data.data.translations[i].detectedSourceLanguage,
      };
    });

    return results;
  } catch (error) {
    console.error('Translation error:', error);
    return texts.map(text => ({ translatedText: text }));
  }
}

/**
 * Translate an object's string properties
 */
export async function translateObject<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[],
  targetLanguage: SupportedLocale,
  sourceLanguage?: SupportedLocale
): Promise<T> {
  if (targetLanguage === 'ro') {
    return obj;
  }

  const textsToTranslate: string[] = [];
  const fieldOrder: (keyof T)[] = [];
  
  for (const field of fields) {
    const value = obj[field];
    if (typeof value === 'string') {
      textsToTranslate.push(value);
      fieldOrder.push(field);
    }
  }

  if (textsToTranslate.length === 0) {
    return obj;
  }

  const translations = await translateTexts(textsToTranslate, targetLanguage, sourceLanguage);
  
  const result = { ...obj };
  
  fieldOrder.forEach((field, index) => {
    (result as Record<string, unknown>)[field as string] = translations[index].translatedText;
  });

  return result;
}
