import { createAnonServerClient } from '../server';

export interface JobVacancy {
  id: string;
  slug: string;
  position: string;  // Changed from title
  department: string | null;
  description: string | null;
  requirements: string | null;
  application_deadline: string | null;
  exam_date: string | null;  // Changed from contest_date
  status: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  published_at: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobVacancyDocument {
  id: string;
  vacancy_id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  title: string | null;
  sort_order: number;
  created_at: string;
}

export interface JobVacancyWithDocuments extends JobVacancy {
  job_vacancy_documents: JobVacancyDocument[];
}

/**
 * Get all job vacancies with their documents
 */
export async function getJobVacancies(): Promise<JobVacancyWithDocuments[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('job_vacancies')
    .select(`
      *,
      job_vacancy_documents (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job vacancies:', error);
    return [];
  }

  return data || [];
}

/**
 * Get active job vacancies only
 */
export async function getActiveJobVacancies(): Promise<JobVacancyWithDocuments[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('job_vacancies')
    .select(`
      *,
      job_vacancy_documents (*)
    `)
    .in('status', ['activ', 'in_desfasurare'])
    .order('application_deadline', { ascending: true });

  if (error) {
    console.error('Error fetching active job vacancies:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single job vacancy by slug
 */
export async function getJobVacancyBySlug(slug: string): Promise<JobVacancyWithDocuments | null> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('job_vacancies')
    .select(`
      *,
      job_vacancy_documents (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching job vacancy:', error);
    return null;
  }

  return data;
}

// Document type labels (matching DB constraint)
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  anunt: 'Anunț',
  bibliografie: 'Bibliografie',
  formular: 'Formular înscriere',
  calendar: 'Calendar concurs',
  rezultate_selectie: 'Rezultate selecție dosare',
  rezultate_proba: 'Rezultate probă',
  rezultate_finale: 'Rezultate finale',
  contestatii: 'Contestații',
  altele: 'Alte documente',
};

// Status labels
export const STATUS_LABELS: Record<string, string> = {
  activ: 'Activ',
  in_desfasurare: 'În desfășurare',
  finalizat: 'Finalizat',
  anulat: 'Anulat',
};
