import { createAnonServerClient } from '../server';

export interface RegionalProjectUpdate {
  id: string;
  project_id: string;
  update_date: string;
  month_label: string;
  content: string | null;
  progress_percentage: number | null;
  sort_order: number;
  images?: RegionalProjectUpdateImage[];
}

export interface RegionalProjectUpdateImage {
  id: string;
  update_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface RegionalProject {
  id: string;
  slug: string;
  smis_code: string | null;
  title: string;
  short_description: string | null;
  full_description: string | null;
  budget_total: number | null;
  budget_eligible: number | null;
  budget_fedr: number | null;
  budget_national: number | null;
  budget_local: number | null;
  start_date: string | null;
  end_date: string | null;
  progress_percentage: number;
  status: 'planificat' | 'in_desfasurare' | 'finalizat' | 'anulat';
  program_name: string;
  objective: string | null;
  specific_objective: string | null;
  call_title: string | null;
  authority: string;
  beneficiary: string;
  contact_email: string | null;
  contact_phone: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  updates?: RegionalProjectUpdate[];
  documents?: Array<{
    id: string;
    title: string;
    file_url: string;
  }>;
}

/**
 * Get all published regional projects
 */
export async function getProjects(): Promise<RegionalProject[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('regional_projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching regional projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single regional project by slug with updates and documents
 */
export async function getProjectBySlug(slug: string): Promise<RegionalProject | null> {
  const supabase = createAnonServerClient();

  // Fetch project
  const { data: project, error: projectError } = await supabase
    .from('regional_projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (projectError || !project) {
    console.error('Error fetching regional project:', projectError);
    return null;
  }

  // Fetch updates with images
  const { data: updates, error: updatesError } = await supabase
    .from('regional_project_updates')
    .select(`
      *,
      images:regional_project_update_images(*)
    `)
    .eq('project_id', project.id)
    .order('sort_order', { ascending: false });

  if (updatesError) {
    console.error('Error fetching project updates:', updatesError);
  }

  // Fetch related documents
  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select('id, title, file_url')
    .eq('description', slug)
    .eq('published', true);

  if (docsError) {
    console.error('Error fetching project documents:', docsError);
  }

  return {
    ...project,
    updates: updates || [],
    documents: documents || [],
  };
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('regional_projects')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching project slugs:', error);
    return [];
  }

  return data?.map(p => p.slug) || [];
}
