import { createAnonServerClient } from '../server';
import { supabase } from '../client';

// ============================================
// TYPES
// ============================================

export interface LegislationLink {
  id: string;
  title: string;
  description: string | null;
  external_url: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_primary: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegislationLinkInput {
  title: string;
  description?: string | null;
  external_url?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  is_primary?: boolean;
  sort_order?: number;
  published?: boolean;
}

// ============================================
// PUBLIC QUERIES (for frontend - Server Components)
// ============================================

/**
 * Get all published legislation links ordered by sort_order
 */
export async function getPublishedLegislationLinks(): Promise<LegislationLink[]> {
  const serverSupabase = createAnonServerClient();
  const { data, error } = await serverSupabase
    .from('legislation_links')
    .select('*')
    .eq('published', true)
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching legislation links:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all primary legislation links (highlighted/featured)
 */
export async function getPrimaryLegislationLinks(): Promise<LegislationLink[]> {
  const serverSupabase = createAnonServerClient();
  const { data, error } = await serverSupabase
    .from('legislation_links')
    .select('*')
    .eq('published', true)
    .eq('is_primary', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching primary legislation links:', error);
    return [];
  }

  return data || [];
}

/**
 * Get secondary (non-primary) legislation links
 */
export async function getSecondaryLegislationLinks(): Promise<LegislationLink[]> {
  const serverSupabase = createAnonServerClient();
  const { data, error } = await serverSupabase
    .from('legislation_links')
    .select('*')
    .eq('published', true)
    .eq('is_primary', false)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching secondary legislation links:', error);
    return [];
  }

  return data || [];
}

// ============================================
// ADMIN QUERIES (Client Components - use client supabase)
// ============================================

/**
 * Get all legislation links (for admin)
 */
export async function getAllLegislationLinks(): Promise<LegislationLink[]> {
  const { data, error } = await supabase
    .from('legislation_links')
    .select('*')
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all legislation links:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single legislation link by ID
 */
export async function getLegislationLinkById(id: string): Promise<LegislationLink | null> {
  const { data, error } = await supabase
    .from('legislation_links')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching legislation link:', error);
    return null;
  }

  return data;
}

/**
 * Create a new legislation link
 */
export async function createLegislationLink(input: LegislationLinkInput): Promise<LegislationLink | null> {
  // If this is set as primary, unset other primary links
  if (input.is_primary) {
    await supabase
      .from('legislation_links')
      .update({ is_primary: false })
      .eq('is_primary', true);
  }

  const { data, error } = await supabase
    .from('legislation_links')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating legislation link:', error);
    return null;
  }

  return data;
}

/**
 * Update a legislation link
 */
export async function updateLegislationLink(id: string, input: Partial<LegislationLinkInput>): Promise<LegislationLink | null> {
  // If this is set as primary, unset other primary links
  if (input.is_primary) {
    await supabase
      .from('legislation_links')
      .update({ is_primary: false })
      .neq('id', id)
      .eq('is_primary', true);
  }

  const { data, error } = await supabase
    .from('legislation_links')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating legislation link:', error);
    return null;
  }

  return data;
}

/**
 * Delete a legislation link
 */
export async function deleteLegislationLink(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('legislation_links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting legislation link:', error);
    return false;
  }

  return true;
}
