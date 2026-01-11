import { createAnonServerClient } from '../server';

export interface EuropeanProject {
  id: string;
  slug: string;
  project_code: string | null;
  title: string;
  description: string | null;
  status: 'planificat' | 'in_desfasurare' | 'finalizat';
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  program_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EuropeanProjectDocument {
  id: string;
  project_id: string;
  file_url: string;
  file_name: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface EuropeanProjectWithDocs extends EuropeanProject {
  documents: EuropeanProjectDocument[];
}

/**
 * Fetch all published European projects
 */
export async function getProjects(): Promise<EuropeanProject[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('european_projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching European projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch projects by status
 */
export async function getProjectsByStatus(status: 'planificat' | 'in_desfasurare' | 'finalizat'): Promise<EuropeanProject[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('european_projects')
    .select('*')
    .eq('published', true)
    .eq('status', status)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching European projects by status:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single project by slug with its documents
 */
export async function getProjectBySlug(slug: string): Promise<EuropeanProjectWithDocs | null> {
  const supabase = createAnonServerClient();

  const { data: project, error: projectError } = await supabase
    .from('european_projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (projectError || !project) {
    console.error('Error fetching European project:', projectError);
    return null;
  }

  const { data: documents, error: docsError } = await supabase
    .from('european_project_documents')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true });

  if (docsError) {
    console.error('Error fetching project documents:', docsError);
  }

  return {
    ...project,
    documents: documents || [],
  };
}

/**
 * Fetch project documents by project ID
 */
export async function getProjectDocuments(projectId: string): Promise<EuropeanProjectDocument[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('european_project_documents')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching project documents:', error);
    return [];
  }

  return data || [];
}
