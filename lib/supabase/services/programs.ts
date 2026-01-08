import { createAnonServerClient } from '../server';

export interface Program {
  id: string;
  slug: string;
  program_type: 'pnrr' | 'pndl' | 'poim' | 'por' | 'local' | 'national' | 'european' | 'altele';
  title: string;
  description: string | null;
  content: string | null;
  featured_image: string | null;
  budget: number | null;
  funding_source: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'planificat' | 'in_desfasurare' | 'finalizat' | 'anulat';
  progress_percentage: number | null;
  published: boolean;
  featured: boolean;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  documents?: ProgramDocument[];
}

export interface ProgramDocument {
  id: string;
  program_id: string;
  document_type: 'prezentare' | 'raport' | 'studiu' | 'achizitie' | 'contract' | 'altele';
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string;
  title: string;
  sort_order: number;
  created_at: string;
}

interface ProgramsFilter {
  page?: number;
  limit?: number;
  programType?: Program['program_type'];
  status?: Program['status'];
  featured?: boolean;
}

/**
 * Get paginated programs
 */
export async function getPrograms(filter: ProgramsFilter = {}): Promise<{
  data: Program[];
  count: number;
}> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = 20, programType, status, featured } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('programs')
    .select('*', { count: 'exact' })
    .eq('published', true)
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

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching programs:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

/**
 * Get program by slug with documents
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
  const { data: documents } = await supabase
    .from('program_documents')
    .select('*')
    .eq('program_id', program.id)
    .order('sort_order');

  return {
    ...program,
    documents: documents || [],
  };
}

/**
 * Get programs by type
 */
export async function getProgramsByType(programType: Program['program_type']): Promise<Program[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .eq('program_type', programType)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs by type:', error);
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
