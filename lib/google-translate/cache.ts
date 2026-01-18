/**
 * Translation Cache Service
 * 
 * Caches translations in Supabase to avoid repeated API calls.
 * Uses a hash of the original text as the cache key.
 */

import { createServerClient } from '@/lib/supabase/server';
import { translateText, translateTexts, type SupportedLocale } from './index';

// Simple hash function for cache keys
function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get a cached translation or translate and cache it
 */
export async function getCachedTranslation(
  text: string,
  targetLanguage: SupportedLocale
): Promise<string> {
  // Don't translate Romanian to Romanian
  if (targetLanguage === 'ro' || !text || text.trim() === '') {
    return text;
  }

  const supabase = createServerClient();
  const textHash = hashText(text);

  // Try to get from cache
  const { data: cached } = await supabase
    .from('translation_cache')
    .select('translated_text')
    .eq('source_text_hash', textHash)
    .eq('target_language', targetLanguage)
    .single();

  if (cached) {
    return cached.translated_text;
  }

  // Not in cache, translate it
  const result = await translateText(text, targetLanguage);
  
  // Store in cache (fire and forget, don't wait)
  void supabase
    .from('translation_cache')
    .insert({
      source_text_hash: textHash,
      source_text: text.substring(0, 5000), // Limit stored text
      target_language: targetLanguage,
      translated_text: result.translatedText,
    })
    .then(() => {}, (err: Error) => console.error('Failed to cache translation:', err));

  return result.translatedText;
}

/**
 * Get multiple cached translations or translate and cache them
 */
export async function getCachedTranslations(
  texts: string[],
  targetLanguage: SupportedLocale
): Promise<string[]> {
  // Don't translate Romanian to Romanian
  if (targetLanguage === 'ro' || texts.length === 0) {
    return texts;
  }

  const supabase = createServerClient();
  
  // Create hash map
  const textHashes = texts.map(text => ({
    text,
    hash: text && text.trim() !== '' ? hashText(text) : null,
  }));

  const validHashes = textHashes
    .filter(t => t.hash !== null)
    .map(t => t.hash as string);

  if (validHashes.length === 0) {
    return texts;
  }

  // Get all cached translations
  const { data: cached } = await supabase
    .from('translation_cache')
    .select('source_text_hash, translated_text')
    .in('source_text_hash', validHashes)
    .eq('target_language', targetLanguage);

  // Create a map of cached translations
  const cacheMap = new Map<string, string>();
  cached?.forEach((c: { source_text_hash: string; translated_text: string }) => 
    cacheMap.set(c.source_text_hash, c.translated_text)
  );

  // Find texts that need translation
  const textsToTranslate: { text: string; index: number; hash: string }[] = [];
  
  textHashes.forEach((t, index) => {
    if (t.hash && !cacheMap.has(t.hash)) {
      textsToTranslate.push({ text: t.text, index, hash: t.hash });
    }
  });

  // Translate missing texts
  if (textsToTranslate.length > 0) {
    const translations = await translateTexts(
      textsToTranslate.map(t => t.text),
      targetLanguage
    );

    // Cache new translations (fire and forget)
    const cacheInserts = textsToTranslate.map((t, i) => ({
      source_text_hash: t.hash,
      source_text: t.text.substring(0, 5000),
      target_language: targetLanguage,
      translated_text: translations[i].translatedText,
    }));

    void supabase
      .from('translation_cache')
      .upsert(cacheInserts, { onConflict: 'source_text_hash,target_language' })
      .then(() => {}, (err: Error) => console.error('Failed to cache translations:', err));

    // Add to cache map
    textsToTranslate.forEach((t, i) => {
      cacheMap.set(t.hash, translations[i].translatedText);
    });
  }

  // Build result array
  return textHashes.map(t => {
    if (!t.hash) return t.text;
    return cacheMap.get(t.hash) || t.text;
  });
}

// Helper to safely get string value from object
function getStringValue(obj: object, key: string): string | null {
  const value = (obj as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : null;
}

// Helper to set value on object
function setStringValue(obj: object, key: string, value: string): void {
  (obj as Record<string, unknown>)[key] = value;
}

/**
 * Translate content fields with caching
 * Works with any object type
 */
export async function translateContentFields<T extends object>(
  item: T,
  fields: string[],
  targetLanguage: SupportedLocale
): Promise<T> {
  if (targetLanguage === 'ro') {
    return item;
  }

  const textsToTranslate: string[] = [];
  const fieldMap: { field: string; index: number }[] = [];

  fields.forEach(field => {
    const value = getStringValue(item, field);
    if (value && value.trim() !== '') {
      fieldMap.push({ field, index: textsToTranslate.length });
      textsToTranslate.push(value);
    }
  });

  if (textsToTranslate.length === 0) {
    return item;
  }

  const translations = await getCachedTranslations(textsToTranslate, targetLanguage);

  const result = { ...item };
  fieldMap.forEach(({ field, index }) => {
    setStringValue(result, field, translations[index]);
  });

  return result;
}

/**
 * Translate a content map (Record<string, string>) with caching
 * Used for page_content from database
 */
export async function translateContentMap(
  contentMap: Record<string, string>,
  targetLanguage: SupportedLocale
): Promise<Record<string, string>> {
  if (targetLanguage === 'ro' || Object.keys(contentMap).length === 0) {
    return contentMap;
  }

  const keys = Object.keys(contentMap);
  const values = keys.map(key => contentMap[key]);
  
  const translations = await getCachedTranslations(values, targetLanguage);
  
  const result: Record<string, string> = {};
  keys.forEach((key, index) => {
    result[key] = translations[index];
  });
  
  return result;
}

/**
 * Translate an array of items with caching
 * Works with any object type
 */
export async function translateContentArray<T extends object>(
  items: T[],
  fields: string[],
  targetLanguage: SupportedLocale
): Promise<T[]> {
  if (targetLanguage === 'ro' || items.length === 0) {
    return items;
  }

  // Collect all texts from all items
  const allTexts: string[] = [];
  const itemFieldMap: { itemIndex: number; field: string; textIndex: number }[] = [];

  items.forEach((item, itemIndex) => {
    fields.forEach(field => {
      const value = getStringValue(item, field);
      if (value && value.trim() !== '') {
        itemFieldMap.push({ itemIndex, field, textIndex: allTexts.length });
        allTexts.push(value);
      }
    });
  });

  if (allTexts.length === 0) {
    return items;
  }

  // Translate all at once
  const translations = await getCachedTranslations(allTexts, targetLanguage);

  // Build result array
  const results = items.map(item => ({ ...item }));
  
  itemFieldMap.forEach(({ itemIndex, field, textIndex }) => {
    setStringValue(results[itemIndex], field, translations[textIndex]);
  });

  return results;
}
