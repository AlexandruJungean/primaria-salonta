'use client';

import { type ElementType, type ReactNode } from 'react';
import { useTranslateText } from '@/hooks/use-translate';

interface TranslatedTextProps {
  text: string | null | undefined;
  className?: string;
  as?: ElementType;
  showLoading?: boolean;
  children?: ReactNode;
}

/**
 * Component that automatically translates text based on current locale
 * 
 * Usage:
 * <TranslatedText text={news.title} as="h1" className="text-2xl font-bold" />
 */
export function TranslatedText({ 
  text, 
  className, 
  as: Component = 'span',
  showLoading = false 
}: TranslatedTextProps) {
  const { translated, isLoading } = useTranslateText(text);

  if (showLoading && isLoading) {
    return (
      <Component className={className}>
        <span className="animate-pulse bg-gray-200 rounded inline-block w-full h-4" />
      </Component>
    );
  }

  return <Component className={className}>{translated}</Component>;
}

/**
 * Component for translating HTML content (preserves HTML tags)
 */
export function TranslatedHTML({ 
  html, 
  className 
}: { 
  html: string | null | undefined; 
  className?: string;
}) {
  const { translated } = useTranslateText(html);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: translated }} 
    />
  );
}
