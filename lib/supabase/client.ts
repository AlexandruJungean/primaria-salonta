import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Type for admin profile from database
export interface AdminProfile {
  id: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Client-side Supabase client (uses anon key) - for use in browser/client components
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
