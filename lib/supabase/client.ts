import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for client-side operations
 * Use this in Client Components
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a Supabase client for a specific user session
 */
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

