import { createAnonServerClient } from '../server';

// Types
export interface RequiredDocumentsOffice {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface RequiredDocument {
  id: string;
  office_id: string;
  title: string;
  items: string[];
  note: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficeWithDocuments extends RequiredDocumentsOffice {
  documents: RequiredDocument[];
}

/**
 * Get all offices with their documents
 */
export async function getOfficesWithDocuments(): Promise<OfficeWithDocuments[]> {
  const supabase = createAnonServerClient();

  // Fetch offices
  const { data: offices, error: officesError } = await supabase
    .from('required_documents_offices')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (officesError) {
    console.error('Error fetching offices:', officesError);
    return [];
  }

  if (!offices || offices.length === 0) {
    return [];
  }

  // Fetch all documents
  const { data: documents, error: docsError } = await supabase
    .from('required_documents')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (docsError) {
    console.error('Error fetching documents:', docsError);
    return offices.map(office => ({ ...office, documents: [] }));
  }

  // Group documents by office
  const documentsByOffice = new Map<string, RequiredDocument[]>();
  (documents || []).forEach(doc => {
    const existing = documentsByOffice.get(doc.office_id) || [];
    existing.push(doc);
    documentsByOffice.set(doc.office_id, existing);
  });

  // Combine offices with their documents
  return offices.map(office => ({
    ...office,
    documents: documentsByOffice.get(office.id) || [],
  }));
}

/**
 * Get a single office by slug with its documents
 */
export async function getOfficeBySlug(slug: string): Promise<OfficeWithDocuments | null> {
  const supabase = createAnonServerClient();

  const { data: office, error: officeError } = await supabase
    .from('required_documents_offices')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (officeError || !office) {
    console.error('Error fetching office:', officeError);
    return null;
  }

  const { data: documents, error: docsError } = await supabase
    .from('required_documents')
    .select('*')
    .eq('office_id', office.id)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (docsError) {
    console.error('Error fetching documents:', docsError);
    return { ...office, documents: [] };
  }

  return {
    ...office,
    documents: documents || [],
  };
}

/**
 * Get all offices (without documents)
 */
export async function getOffices(): Promise<RequiredDocumentsOffice[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('required_documents_offices')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching offices:', error);
    return [];
  }

  return data || [];
}
