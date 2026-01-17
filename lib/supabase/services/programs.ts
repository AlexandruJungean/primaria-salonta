import { createAnonServerClient } from '../server';

// ============================================
// TYPES
// ============================================

export interface Program {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  program_type: string;
  parent_id: string | null;
  status: 'planificat' | 'in_desfasurare' | 'finalizat' | 'anulat';
  progress_percentage: number | null;
  smis_code: string | null;
  project_code: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  program_url: string | null;
  budget_total: number | null;
  budget_eligible: number | null;
  budget_eu: number | null;
  budget_national: number | null;
  budget_local: number | null;
  currency: string | null;
  start_date: string | null;
  end_date: string | null;
  icon: string | null;
  color_scheme: string | null;
  featured_image: string | null;
  funding_notice: string | null;
  funding_logo_type: string | null;
  document_grouping: 'none' | 'year' | 'category' | 'custom' | 'project' | 'period' | 'year_category';
  sort_order: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  documents?: ProgramDocument[];
  images?: ProgramImage[];
  updates?: ProgramUpdate[];
  children?: Program[];
}

export interface ProgramDocument {
  id: string;
  program_id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  group_name: string | null;
  group_type: string | null;
  year: number | null;
  category: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProgramImage {
  id: string;
  program_id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  image_type: 'gallery' | 'logo' | 'sponsor' | 'featured';
  sort_order: number;
  created_at: string;
}

export interface ProgramUpdate {
  id: string;
  program_id: string;
  title: string;
  content: string | null;
  update_date: string;
  sort_order: number;
  created_at: string;
  images?: ProgramUpdateImage[];
}

export interface ProgramUpdateImage {
  id: string;
  update_id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
}

interface ProgramsFilter {
  page?: number;
  limit?: number;
  programType?: Program['program_type'];
  status?: Program['status'];
  featured?: boolean;
  parentId?: string | null;
}

// ============================================
// FUNCTIONS
// ============================================

/**
 * Get paginated programs
 */
export async function getPrograms(filter: ProgramsFilter = {}): Promise<{
  data: Program[];
  count: number;
}> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = 50, programType, status, featured, parentId } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('programs')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (programType) {
    query = query.eq('program_type', programType);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }

  if (parentId !== undefined) {
    if (parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', parentId);
    }
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching programs:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

/**
 * Get programs by type (simple list without relations)
 */
export async function getProgramsByType(programType: Program['program_type']): Promise<Program[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .eq('program_type', programType)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs by type:', error);
    return [];
  }

  return data || [];
}

/**
 * Get top-level programs (for main programs page)
 */
export async function getTopLevelPrograms(): Promise<Program[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .is('parent_id', null)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching top-level programs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get program by slug with all relations (documents, images, updates)
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const supabase = createAnonServerClient();

  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (programError || !program) {
    console.error('Error fetching program:', programError);
    return null;
  }

  // Get documents
  const { data: documents, error: docsError } = await supabase
    .from('program_documents')
    .select('*')
    .eq('program_id', program.id)
    .order('year', { ascending: false, nullsFirst: false })
    .order('group_name', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true });

  if (docsError) {
    console.error(`Error fetching documents for ${slug}:`, docsError);
  }

  // Get images
  const { data: images } = await supabase
    .from('program_images')
    .select('*')
    .eq('program_id', program.id)
    .order('image_type', { ascending: true })
    .order('sort_order', { ascending: true });

  // Get updates with their images
  const { data: updates } = await supabase
    .from('program_updates')
    .select('*')
    .eq('program_id', program.id)
    .order('update_date', { ascending: false })
    .order('sort_order', { ascending: true });

  // Get update images
  let updatesWithImages: ProgramUpdate[] = [];
  if (updates && updates.length > 0) {
    const updateIds = updates.map(u => u.id);
    const { data: updateImages } = await supabase
      .from('program_update_images')
      .select('*')
      .in('update_id', updateIds)
      .order('sort_order', { ascending: true });

    updatesWithImages = updates.map(update => ({
      ...update,
      images: updateImages?.filter(img => img.update_id === update.id) || [],
    }));
  }

  // Get children (sub-programs)
  const { data: children } = await supabase
    .from('programs')
    .select('*')
    .eq('parent_id', program.id)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  return {
    ...program,
    documents: documents || [],
    images: images || [],
    updates: updatesWithImages,
    children: children || [],
  };
}

/**
 * Get program with documents grouped by category/year
 */
export async function getProgramWithGroupedDocuments(slug: string): Promise<{
  program: Program | null;
  documentGroups: Map<string, ProgramDocument[]>;
}> {
  const program = await getProgramBySlug(slug);
  
  if (!program) {
    return { program: null, documentGroups: new Map() };
  }

  const documentGroups = new Map<string, ProgramDocument[]>();
  
  if (program.documents) {
    program.documents.forEach(doc => {
      let groupKey: string;
      
      if (program.document_grouping === 'year' && doc.year) {
        groupKey = doc.year.toString();
      } else if (program.document_grouping === 'category' && (doc.category || doc.group_name)) {
        groupKey = doc.category || doc.group_name || 'default';
      } else if ((program.document_grouping === 'project' || program.document_grouping === 'period' || program.document_grouping === 'custom') && doc.group_name) {
        groupKey = doc.group_name;
      } else {
        groupKey = 'default';
      }
      
      if (!documentGroups.has(groupKey)) {
        documentGroups.set(groupKey, []);
      }
      documentGroups.get(groupKey)!.push(doc);
    });
  }

  return { program, documentGroups };
}

/**
 * Get children programs by parent slug
 */
export async function getChildProgramsByParentSlug(parentSlug: string): Promise<Program[]> {
  const supabase = createAnonServerClient();

  // First get parent ID
  const { data: parent } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', parentSlug)
    .eq('published', true)
    .single();

  if (!parent) {
    return [];
  }

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('parent_id', parent.id)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching child programs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured programs
 */
export async function getFeaturedPrograms(limit: number = 4): Promise<Program[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured programs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all program slugs for static generation
 */
export async function getAllProgramSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('programs')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching program slugs:', error);
    return [];
  }

  return data?.map(p => p.slug) || [];
}

/**
 * Get programs by status
 */
export async function getProgramsByStatus(status: Program['status']): Promise<Program[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .eq('status', status)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching programs by status:', error);
    return [];
  }

  return data || [];
}

/**
 * Get program images by type
 */
export async function getProgramImagesByType(
  programId: string,
  imageType: ProgramImage['image_type']
): Promise<ProgramImage[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('program_images')
    .select('*')
    .eq('program_id', programId)
    .eq('image_type', imageType)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching program images:', error);
    return [];
  }

  return data || [];
}

/**
 * Get documents for a program
 */
export async function getProgramDocuments(programId: string): Promise<ProgramDocument[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('program_documents')
    .select('*')
    .eq('program_id', programId)
    .order('year', { ascending: false, nullsFirst: false })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching program documents:', error);
    return [];
  }

  return data || [];
}

/**
 * Helper: Group documents by year, category, project, or custom group
 */
export function groupDocuments(
  documents: ProgramDocument[],
  grouping: Program['document_grouping']
): Map<string, ProgramDocument[]> {
  const groups = new Map<string, ProgramDocument[]>();

  documents.forEach(doc => {
    let groupKey: string;

    switch (grouping) {
      case 'year':
        groupKey = doc.year?.toString() || 'Alte documente';
        break;
      case 'category':
        groupKey = doc.category || doc.group_name || 'Alte documente';
        break;
      case 'year_category':
        // Compound key format: "year|category" for hierarchical grouping
        const year = doc.year?.toString() || 'Alți ani';
        const category = doc.category || 'Alte categorii';
        groupKey = `${year}|${category}`;
        break;
      case 'project':
      case 'period':
      case 'custom':
        groupKey = doc.group_name || 'Alte documente';
        break;
      case 'none':
      default:
        groupKey = 'default';
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(doc);
  });

  return groups;
}

/**
 * Category display names in Romanian
 */
const CATEGORY_LABELS: Record<string, string> = {
  'rezultate': 'Rezultate',
  'cultura': 'Cultură',
  'sport': 'Sport',
  'mediu': 'Mediu',
  'social': 'Social',
  'educatie': 'Educație',
  'sanatate': 'Sănătate',
  'tineret': 'Tineret',
  'Alte categorii': 'Alte categorii',
};

/**
 * Get display name for category
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// Helper functions parseSponsorLogos and parseExternalLinks removed
// Sponsor logos are now stored in program_images with image_type = 'sponsor'
// External links are stored as separate URL fields (website_url, program_url, facebook_url, instagram_url)
