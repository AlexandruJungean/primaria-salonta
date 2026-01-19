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
      q: text,
      target: targetLanguage,
      format: 'text',
    });

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    const body = params.toString();
    
    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body).toString(),
      },
      body,
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

// Google Translate API limit
const MAX_TEXTS_PER_REQUEST = 128;

/**
 * Translate a batch of texts (internal helper, respects API limit)
 */
async function translateBatch(
  textsWithIndices: { text: string; index: number }[],
  targetLanguage: SupportedLocale,
  apiKey: string,
  sourceLanguage?: SupportedLocale
): Promise<Map<number, TranslationResult>> {
  const resultMap = new Map<number, TranslationResult>();

  if (textsWithIndices.length === 0) {
    return resultMap;
  }

  try {
    const params = new URLSearchParams({
      target: targetLanguage,
      format: 'text',
    });

    // Add each text as a separate 'q' parameter
    textsWithIndices.forEach(t => params.append('q', t.text));

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    const body = params.toString();

    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body).toString(),
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Translate API error:', error);
      return resultMap;
    }

    const data: GoogleTranslateResponse = await response.json();

    textsWithIndices.forEach((t, i) => {
      resultMap.set(t.index, {
        translatedText: data.data.translations[i].translatedText,
        detectedSourceLanguage: data.data.translations[i].detectedSourceLanguage,
      });
    });

    return resultMap;
  } catch (error) {
    console.error('Translation batch error:', error);
    return resultMap;
  }
}

/**
 * Translate multiple texts with automatic batching (respects 128 text limit)
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

  // Split into batches of MAX_TEXTS_PER_REQUEST
  const batches: { text: string; index: number }[][] = [];
  for (let i = 0; i < nonEmptyTexts.length; i += MAX_TEXTS_PER_REQUEST) {
    batches.push(nonEmptyTexts.slice(i, i + MAX_TEXTS_PER_REQUEST));
  }

  // Process all batches in parallel
  const batchResults = await Promise.all(
    batches.map(batch => translateBatch(batch, targetLanguage, apiKey, sourceLanguage))
  );

  // Merge all batch results
  const allTranslations = new Map<number, TranslationResult>();
  batchResults.forEach(batchMap => {
    batchMap.forEach((value, key) => allTranslations.set(key, value));
  });

  // Build final results array
  return texts.map((text, index) => {
    const translation = allTranslations.get(index);
    return translation || { translatedText: text };
  });
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
