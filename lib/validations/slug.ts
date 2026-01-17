import { z } from 'zod';

/**
 * Constante pentru validare slug
 */
export const SLUG_MAX_LENGTH = 100;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Caractere permise în slug: a-z, 0-9, - (nu la început sau sfârșit)
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug-ul este obligatoriu')
  .max(SLUG_MAX_LENGTH, `Slug-ul nu poate depăși ${SLUG_MAX_LENGTH} caractere`)
  .regex(
    SLUG_PATTERN,
    'Slug-ul poate conține doar litere mici, cifre și cratime (nu la început/sfârșit)'
  );

/**
 * Generează un slug valid din text
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimină diacritice
    .replace(/[^a-z0-9]+/g, '-')     // Înlocuiește non-alfanumerice cu -
    .replace(/(^-|-$)+/g, '')        // Elimină - de la început/sfârșit
    .replace(/-+/g, '-')             // Elimină - duplicate
    .substring(0, SLUG_MAX_LENGTH);   // Limitează lungimea
}

/**
 * Validează un slug
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  const result = slugSchema.safeParse(slug);
  
  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      valid: false,
      error: firstError?.message || 'Slug invalid',
    };
  }
  
  return { valid: true };
}

/**
 * Verifică unicitatea unui slug în baza de date
 */
export async function isSlugUnique(
  tableName: string,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase credentials not available for slug uniqueness check');
    return true; // Asumă că e unic dacă nu putem verifica
  }
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  let query = supabase
    .from(tableName)
    .select('id')
    .eq('slug', slug);
  
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query.limit(1);
  
  if (error) {
    console.error('Error checking slug uniqueness:', error);
    return true; // Asumă că e unic în caz de eroare
  }
  
  return !data || data.length === 0;
}

/**
 * Generează un slug unic (adaugă suffix numeric dacă există deja)
 */
export async function generateUniqueSlug(
  tableName: string,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = generateSlug(baseSlug);
  let counter = 1;
  
  while (!(await isSlugUnique(tableName, slug, excludeId))) {
    // Adaugă suffix numeric
    const suffix = `-${counter}`;
    const maxBase = SLUG_MAX_LENGTH - suffix.length;
    slug = `${generateSlug(baseSlug).substring(0, maxBase)}${suffix}`;
    counter++;
    
    // Previne bucle infinite
    if (counter > 100) {
      slug = `${slug.substring(0, SLUG_MAX_LENGTH - 14)}-${Date.now()}`;
      break;
    }
  }
  
  return slug;
}

/**
 * Tabele care folosesc slug-uri
 */
export type SlugTable = 
  | 'news'
  | 'events'
  | 'programs'
  | 'council_sessions'
  | 'job_vacancies'
  | 'institutions'
  | 'pages'
  | 'regional_projects'
  | 'european_projects';

/**
 * Validare completă slug (format + unicitate)
 */
export async function validateSlugComplete(
  tableName: SlugTable,
  slug: string,
  excludeId?: string
): Promise<{ valid: boolean; error?: string }> {
  // Validare format
  const formatCheck = validateSlug(slug);
  if (!formatCheck.valid) {
    return formatCheck;
  }
  
  // Verificare unicitate
  const isUnique = await isSlugUnique(tableName, slug, excludeId);
  if (!isUnique) {
    return {
      valid: false,
      error: 'Acest slug există deja. Alege unul diferit.',
    };
  }
  
  return { valid: true };
}
