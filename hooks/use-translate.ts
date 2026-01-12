'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';

type SupportedLocale = 'ro' | 'hu' | 'en';

// In-memory cache for client-side
const clientCache = new Map<string, string>();

function getCacheKey(text: string, locale: string): string {
  return `${locale}:${text}`;
}

/**
 * Hook for translating a single text
 */
export function useTranslateText(text: string | null | undefined): {
  translated: string;
  isLoading: boolean;
} {
  const locale = useLocale() as SupportedLocale;
  const [translated, setTranslated] = useState(text || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text || locale === 'ro') {
      setTranslated(text || '');
      return;
    }

    const cacheKey = getCacheKey(text, locale);
    const cached = clientCache.get(cacheKey);
    
    if (cached) {
      setTranslated(cached);
      return;
    }

    setIsLoading(true);
    
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage: locale }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.translated) {
          clientCache.set(cacheKey, data.translated);
          setTranslated(data.translated);
        }
      })
      .catch(err => {
        console.error('Translation error:', err);
        setTranslated(text);
      })
      .finally(() => setIsLoading(false));
  }, [text, locale]);

  return { translated, isLoading };
}

/**
 * Hook for translating multiple texts at once
 */
export function useTranslateTexts(texts: (string | null | undefined)[]): {
  translated: string[];
  isLoading: boolean;
} {
  const locale = useLocale() as SupportedLocale;
  const [translated, setTranslated] = useState<string[]>(texts.map(t => t || ''));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validTexts = texts.map(t => t || '');
    
    if (locale === 'ro') {
      setTranslated(validTexts);
      return;
    }

    // Check cache first
    const results: string[] = [];
    const uncachedIndices: number[] = [];
    const uncachedTexts: string[] = [];

    validTexts.forEach((text, index) => {
      if (!text) {
        results[index] = '';
        return;
      }
      
      const cacheKey = getCacheKey(text, locale);
      const cached = clientCache.get(cacheKey);
      
      if (cached) {
        results[index] = cached;
      } else {
        uncachedIndices.push(index);
        uncachedTexts.push(text);
      }
    });

    if (uncachedTexts.length === 0) {
      setTranslated(results);
      return;
    }

    setIsLoading(true);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncachedTexts, targetLanguage: locale }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.translated && Array.isArray(data.translated)) {
          uncachedIndices.forEach((originalIndex, i) => {
            const translatedText = data.translated[i];
            const originalText = uncachedTexts[i];
            
            clientCache.set(getCacheKey(originalText, locale), translatedText);
            results[originalIndex] = translatedText;
          });
          setTranslated(results);
        }
      })
      .catch(err => {
        console.error('Translation error:', err);
        setTranslated(validTexts);
      })
      .finally(() => setIsLoading(false));
  }, [texts.join('|'), locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return { translated, isLoading };
}

/**
 * Hook for translating content on demand
 */
export function useTranslate() {
  const locale = useLocale() as SupportedLocale;

  const translate = useCallback(async (text: string): Promise<string> => {
    if (!text || locale === 'ro') {
      return text;
    }

    const cacheKey = getCacheKey(text, locale);
    const cached = clientCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: locale }),
      });
      
      const data = await res.json();
      
      if (data.translated) {
        clientCache.set(cacheKey, data.translated);
        return data.translated;
      }
    } catch (err) {
      console.error('Translation error:', err);
    }

    return text;
  }, [locale]);

  const translateMany = useCallback(async (texts: string[]): Promise<string[]> => {
    if (locale === 'ro' || texts.length === 0) {
      return texts;
    }

    // Check cache
    const uncached: { text: string; index: number }[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, index) => {
      if (!text) return;
      
      const cached = clientCache.get(getCacheKey(text, locale));
      if (cached) {
        results[index] = cached;
      } else {
        uncached.push({ text, index });
      }
    });

    if (uncached.length === 0) {
      return results;
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          texts: uncached.map(u => u.text), 
          targetLanguage: locale 
        }),
      });
      
      const data = await res.json();
      
      if (data.translated && Array.isArray(data.translated)) {
        uncached.forEach((u, i) => {
          clientCache.set(getCacheKey(u.text, locale), data.translated[i]);
          results[u.index] = data.translated[i];
        });
      }
    } catch (err) {
      console.error('Translation error:', err);
    }

    return results;
  }, [locale]);

  return { translate, translateMany, locale };
}
