import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ro, hu, enUS } from 'date-fns/locale';

const locales = {
  ro: ro,
  hu: hu,
  en: enUS,
};

type Locale = keyof typeof locales;

/**
 * Format a date string to a localized format
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'dd MMMM yyyy',
  locale: Locale = 'ro'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return format(dateObj, formatStr, { locale: locales[locale] });
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: Locale = 'ro'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: locales[locale] 
  });
}

/**
 * Format date for display in articles/news
 */
export function formatArticleDate(
  date: string | Date,
  locale: Locale = 'ro'
): string {
  return formatDate(date, 'd MMMM yyyy', locale);
}

/**
 * Check if a week number is odd or even
 */
export function isOddWeek(date: Date = new Date()): boolean {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return weekNumber % 2 !== 0;
}

