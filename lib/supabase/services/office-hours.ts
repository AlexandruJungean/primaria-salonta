import { createAnonServerClient } from '../server';

export interface OfficeHourEntry {
  days: string;
  from: string;
  to: string;
}

export interface OfficeHours {
  id: string;
  office_id: string;
  name: string;
  room: string | null;
  floor: string | null;
  hours: OfficeHourEntry[];
  sort_order: number;
}

export interface PageSettings {
  id: string;
  page_key: string;
  content: Record<string, string>;
}

/**
 * Get all active office hours
 */
export async function getOfficeHours(): Promise<OfficeHours[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('office_hours')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching office hours:', error);
    return [];
  }

  return data || [];
}

/**
 * Get page settings by page key
 */
export async function getPageSettings(pageKey: string): Promise<PageSettings | null> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('page_settings')
    .select('*')
    .eq('page_key', pageKey)
    .single();

  if (error) {
    console.error(`Error fetching page settings for ${pageKey}:`, error);
    return null;
  }

  return data;
}
