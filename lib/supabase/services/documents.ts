import { createAnonServerClient } from '../server';
import type { Document, DocumentWithAnnexes, AssetDeclaration, PaginatedResponse, DocumentsFilter } from '@/lib/types/database';

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
  limit: number = 500
): Promise<Document[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('year', { ascending: false })
    .order('document_date', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching documents by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Get documents by category with annexes grouped
 * Returns parent documents with their annexes nested
 */
export async function getDocumentsByCategoryWithAnnexes(
  category: string,
  limit: number = 500
): Promise<DocumentWithAnnexes[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('year', { ascending: false })
    .order('document_date', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching documents by category:', error);
    return [];
  }

  const docs = data || [];
  
  // Separate parent documents and annexes
  const parentDocs: DocumentWithAnnexes[] = [];
  const annexesByParentId = new Map<string, Document[]>();

  docs.forEach(doc => {
    if (doc.parent_id) {
      // This is an annex
      const annexes = annexesByParentId.get(doc.parent_id) || [];
      annexes.push(doc);
      annexesByParentId.set(doc.parent_id, annexes);
    } else {
      // This is a parent document
      parentDocs.push({ ...doc, annexes: [] });
    }
  });

  // Attach annexes to their parent documents
  parentDocs.forEach(doc => {
    const annexes = annexesByParentId.get(doc.id);
    if (annexes) {
      doc.annexes = annexes;
    }
  });

  return parentDocs;
}

/**
 * Get documents by source folder (used for pages that need specific migrated content)
 */
export async function getDocumentsBySourceFolder(
  sourceFolder: string,
  limit: number = 100
): Promise<Document[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .eq('source_folder', sourceFolder)
    .order('title', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching documents by source folder:', error);
    return [];
  }

  return data || [];
}

/**
 * Get documents by source folder with annexes grouped
 * Returns parent documents with their annexes nested
 */
export async function getDocumentsBySourceFolderWithAnnexes(
  sourceFolder: string,
  limit: number = 500
): Promise<DocumentWithAnnexes[]> {
  const supabase = createAnonServerClient();

  // First, get all parent documents (without parent_id) from this source folder
  const { data: parentData, error: parentError } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .eq('source_folder', sourceFolder)
    .is('parent_id', null)
    .order('year', { ascending: false })
    .order('document_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (parentError) {
    console.error('Error fetching documents by source folder:', parentError);
    return [];
  }

  const parentDocs = parentData || [];
  
  if (parentDocs.length === 0) {
    return [];
  }

  // Get all parent IDs
  const parentIds = parentDocs.map(doc => doc.id);

  // Fetch all annexes for these parent documents
  const { data: annexData, error: annexError } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .in('parent_id', parentIds)
    .order('created_at', { ascending: true });

  if (annexError) {
    console.error('Error fetching annexes:', annexError);
  }

  // Group annexes by parent_id
  const annexesByParentId = new Map<string, Document[]>();
  (annexData || []).forEach(annex => {
    const annexes = annexesByParentId.get(annex.parent_id!) || [];
    annexes.push(annex);
    annexesByParentId.set(annex.parent_id!, annexes);
  });

  // Attach annexes to their parent documents
  const docsWithAnnexes: DocumentWithAnnexes[] = parentDocs.map(doc => ({
    ...doc,
    annexes: annexesByParentId.get(doc.id) || [],
  }));

  return docsWithAnnexes;
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
    .order('declaration_year', { ascending: false })
    .order('person_name', { ascending: true })
    .limit(2000); // Increased limit to ensure all declarations are fetched

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

// ============================================
// ANNOUNCEMENTS (ANUNTURI)
// ============================================

export interface Announcement {
  id: string;
  date: string;
  title: string;
  category: string;
  attachments: {
    id: string;
    title: string;
    url: string;
    fileType: string;
  }[];
}

/**
 * Get announcements with grouped attachments
 * Documents are grouped by description (announcement title) + document_date
 */
export async function getAnnouncements(limit: number = 500): Promise<Announcement[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .eq('category', 'anunturi')
    .order('document_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  const docs = data || [];
  
  // Group documents by description + date to form announcements
  const announcementMap = new Map<string, Announcement>();
  
  docs.forEach(doc => {
    const key = `${doc.description || doc.title}_${doc.document_date || ''}`;
    
    if (!announcementMap.has(key)) {
      announcementMap.set(key, {
        id: doc.id,
        date: doc.document_date || doc.created_at.split('T')[0],
        title: doc.description || doc.title,
        category: doc.subcategory || 'general',
        attachments: []
      });
    }
    
    const announcement = announcementMap.get(key)!;
    const fileExt = doc.file_name.split('.').pop()?.toLowerCase() || 'pdf';
    
    announcement.attachments.push({
      id: doc.id,
      title: doc.title,
      url: doc.file_url,
      fileType: fileExt === 'docx' || fileExt === 'doc' ? 'DOC' : 'PDF'
    });
  });

  return Array.from(announcementMap.values());
}

