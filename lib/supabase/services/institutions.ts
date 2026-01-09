import { createAnonServerClient } from '../server';

export interface ContentSection {
  id: string;
  title?: string;
  content?: string;
  type: 'text' | 'list' | 'cards';
  items?: Array<{ text?: string }>;
}

export interface ContactPerson {
  name: string;
  phone?: string;
  email?: string;
  role?: string;
}

export interface InfoCard {
  icon: string;
  label?: string;
  value: string;
}

export interface Institution {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  director_name?: string;
  director_title?: string;
  working_hours?: string;
  icon: string;
  image_url?: string;
  content: ContentSection[];
  contacts: ContactPerson[];
  info_cards: InfoCard[];
  fiscal_code?: string;
  capacity?: string;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Get institution by slug
export async function getInstitutionBySlug(slug: string): Promise<Institution | null> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (error) {
    console.error('Error fetching institution:', error);
    return null;
  }
  
  return data as Institution;
}

// Get all published institutions
export async function getAllInstitutions(): Promise<Institution[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching institutions:', error);
    return [];
  }
  
  return (data || []) as Institution[];
}

// Get all institution slugs (for static generation)
export async function getAllInstitutionSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('slug')
    .eq('published', true);
  
  if (error) {
    console.error('Error fetching institution slugs:', error);
    return [];
  }
  
  return (data || []).map(d => d.slug);
}
