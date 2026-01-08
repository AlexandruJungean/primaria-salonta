import { createAnonServerClient } from '../server';
import type { Document, AssetDeclaration, PaginatedResponse, DocumentsFilter } from '@/lib/types/database';

const DEFAULT_LIMIT = 20;

// ============================================
// GENERAL DOCUMENTS
// ============================================

/**
 * Get paginated documents
 */
export async function getDocuments(
  filter: DocumentsFilter = {}
): Promise<PaginatedResponse<Document>> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = DEFAULT_LIMIT, category, subcategory, year } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('documents')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('document_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (subcategory) {
    query = query.eq('subcategory', subcategory);
  }

  if (year) {
    query = query.eq('year', year);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching documents:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const totalCount = count || 0;

  return {
    data: data || [],
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(
  category: string,
  limit: number = 50
): Promise<Document[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('document_date', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching documents by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Get available document categories
 */
export async function getDocumentCategories(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('category')
    .eq('published', true);

  if (error) {
    console.error('Error fetching document categories:', error);
    return [];
  }

  const categories = new Set<string>();
  data?.forEach(d => categories.add(d.category));

  return Array.from(categories).sort();
}

/**
 * Get available years for documents
 */
export async function getDocumentYears(category?: string): Promise<number[]> {
  const supabase = createAnonServerClient();

  let query = supabase
    .from('documents')
    .select('year')
    .eq('published', true)
    .not('year', 'is', null);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching document years:', error);
    return [];
  }

  const years = new Set<number>();
  data?.forEach(d => {
    if (d.year) years.add(d.year);
  });

  return Array.from(years).sort((a, b) => b - a);
}

// ============================================
// ASSET DECLARATIONS
// ============================================

interface AssetDeclarationsFilter {
  page?: number;
  limit?: number;
  year?: number;
  department?: AssetDeclaration['department'];
}

/**
 * Get paginated asset declarations
 */
export async function getAssetDeclarations(
  filter: AssetDeclarationsFilter = {}
): Promise<PaginatedResponse<AssetDeclaration>> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = DEFAULT_LIMIT, year, department } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('asset_declarations')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('declaration_year', { ascending: false })
    .order('person_name', { ascending: true });

  if (year) {
    query = query.eq('declaration_year', year);
  }

  if (department) {
    query = query.eq('department', department);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching asset declarations:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const totalCount = count || 0;

  return {
    data: data || [],
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get available years for asset declarations
 */
export async function getAssetDeclarationYears(): Promise<number[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('asset_declarations')
    .select('declaration_year')
    .eq('published', true);

  if (error) {
    console.error('Error fetching asset declaration years:', error);
    return [];
  }

  const years = new Set<number>();
  data?.forEach(d => years.add(d.declaration_year));

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Get asset declarations grouped by department
 */
export async function getAssetDeclarationsByDepartment(
  year?: number
): Promise<Record<string, AssetDeclaration[]>> {
  const supabase = createAnonServerClient();

  let query = supabase
    .from('asset_declarations')
    .select('*')
    .eq('published', true)
    .order('person_name', { ascending: true });

  if (year) {
    query = query.eq('declaration_year', year);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching asset declarations:', error);
    return {};
  }

  // Group by department
  const grouped: Record<string, AssetDeclaration[]> = {};
  (data || []).forEach(declaration => {
    const dept = declaration.department;
    if (!grouped[dept]) {
      grouped[dept] = [];
    }
    grouped[dept].push(declaration);
  });

  return grouped;
}

// ============================================
// TRANSPARENCY DOCUMENTS
// ============================================

interface TransparencyDocument {
  id: string;
  category: string;
  subcategory: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string;
  title: string;
  description: string | null;
  document_date: string | null;
  year: number | null;
  published: boolean;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get transparency documents by category
 */
export async function getTransparencyDocuments(
  category: string,
  year?: number
): Promise<TransparencyDocument[]> {
  const supabase = createAnonServerClient();

  let query = supabase
    .from('transparency_documents')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('document_date', { ascending: false, nullsFirst: false });

  if (year) {
    query = query.eq('year', year);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching transparency documents:', error);
    return [];
  }

  return data || [];
}

/**
 * Get available years for transparency documents
 */
export async function getTransparencyYears(category?: string): Promise<number[]> {
  const supabase = createAnonServerClient();

  let query = supabase
    .from('transparency_documents')
    .select('year')
    .eq('published', true)
    .not('year', 'is', null);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching transparency years:', error);
    return [];
  }

  const years = new Set<number>();
  data?.forEach(d => {
    if (d.year) years.add(d.year);
  });

  return Array.from(years).sort((a, b) => b - a);
}
