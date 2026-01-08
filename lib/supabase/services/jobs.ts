import { createAnonServerClient } from '../server';

export interface JobVacancy {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  position_type: 'functionar_public' | 'personal_contractual' | 'conducere' | 'temporar';
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  application_deadline: string | null;
  exam_date: string | null;
  exam_location: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: 'activ' | 'incheiat' | 'anulat' | 'suspendat';
  published: boolean;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  documents?: JobVacancyDocument[];
}

export interface JobVacancyDocument {
  id: string;
  vacancy_id: string;
  document_type: 'anunt' | 'bibliografie' | 'formular' | 'rezultate' | 'contestatie' | 'final' | 'altele';
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string;
  title: string;
  sort_order: number;
  created_at: string;
}

interface JobsFilter {
  page?: number;
  limit?: number;
  status?: JobVacancy['status'];
  positionType?: JobVacancy['position_type'];
}

/**
 * Get paginated job vacancies
 */
export async function getJobVacancies(filter: JobsFilter = {}): Promise<{
  data: JobVacancy[];
  count: number;
}> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = 20, status, positionType } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('job_vacancies')
    .select('*', { count: 'exact' })
    .not('published_at', 'is', null)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (positionType) {
    query = query.eq('position_type', positionType);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching job vacancies:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

/**
 * Get active job vacancies
 */
export async function getActiveJobs(): Promise<JobVacancy[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('job_vacancies')
    .select('*')
    .not('published_at', 'is', null)
    .eq('status', 'activ')
    .order('application_deadline', { ascending: true });

  if (error) {
    console.error('Error fetching active jobs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get job vacancy by slug with documents
 */
export async function getJobVacancyBySlug(slug: string): Promise<JobVacancy | null> {
  const supabase = createAnonServerClient();

  const { data: job, error: jobError } = await supabase
    .from('job_vacancies')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();

  if (jobError || !job) {
    console.error('Error fetching job vacancy:', jobError);
    return null;
  }

  // Get documents
  const { data: documents } = await supabase
    .from('job_vacancy_documents')
    .select('*')
    .eq('vacancy_id', job.id)
    .order('sort_order');

  return {
    ...job,
    documents: documents || [],
  };
}

/**
 * Get all job vacancy slugs for static generation
 */
export async function getAllJobSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('job_vacancies')
    .select('slug')
    .not('published_at', 'is', null);

  if (error) {
    console.error('Error fetching job slugs:', error);
    return [];
  }

  return data?.map(j => j.slug) || [];
}
