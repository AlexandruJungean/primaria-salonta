/**
 * Database Types for Supabase
 * Auto-generated types based on database schema
 */

// ============================================
// COUNCIL SESSIONS & DECISIONS
// ============================================

export interface CouncilSession {
  id: string;
  slug: string;
  session_date: string;
  session_type: 'ordinara' | 'extraordinara' | 'de_indata';
  title: string;
  description: string | null;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  attendance_count: number | null;
  source_url: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouncilSessionDocument {
  id: string;
  session_id: string;
  document_type: 'proces_verbal' | 'ordine_zi' | 'materiale' | 'prezenta' | 'proiect_hotarare' | 'minuta' | 'anexa' | 'altele';
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface CouncilDecision {
  id: string;
  slug: string;
  decision_number: number;
  decision_date: string;
  year: number;
  session_id: string | null;
  session_date: string | null;
  title: string;
  summary: string | null;
  category: 'buget' | 'urbanism' | 'patrimoniu' | 'taxe' | 'servicii_publice' | 'administrativ' | 'social' | 'cultura' | 'mediu' | 'altele' | null;
  status: 'in_vigoare' | 'abrogata' | 'modificata';
  published: boolean;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouncilDecisionDocument {
  id: string;
  decision_id: string;
  document_type: 'hotarare' | 'anexa' | 'studiu' | 'raport' | 'regulament' | 'plan' | 'altele';
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string;
  title: string;
  sort_order: number;
  created_at: string;
}

// Extended types with relations
export interface CouncilSessionWithDecisions extends CouncilSession {
  decisions_count: number;
  decisions?: CouncilDecision[];
  documents?: CouncilSessionDocument[];
}

export interface CouncilDecisionWithDocuments extends CouncilDecision {
  documents: CouncilDecisionDocument[];
}

export interface CouncilSessionWithDetails extends CouncilSession {
  documents: CouncilSessionDocument[];
  decisions: CouncilDecisionWithDocuments[];
}

// ============================================
// NEWS
// ============================================

export interface News {
  id: string;
  slug: string;
  category: 'anunturi' | 'stiri' | 'comunicate' | 'proiecte' | 'consiliu';
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  published: boolean;
  published_at: string | null;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  source_url: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface NewsDocument {
  id: string;
  news_id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  title: string | null;
  sort_order: number;
  created_at: string;
}

export interface NewsImage {
  id: string;
  news_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  is_featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsWithDocuments extends News {
  documents: NewsDocument[];
  images?: NewsImage[];
}

// ============================================
// EVENTS
// ============================================

export interface Event {
  id: string;
  slug: string;
  event_type: 'cultural' | 'sportiv' | 'civic' | 'educational' | 'administrativ' | 'festival' | 'altele';
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  location: string | null;
  location_address: string | null;
  title: string;
  description: string | null;
  program: string | null;
  featured_image: string | null;
  poster_image: string | null;
  published: boolean;
  featured: boolean;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventImage {
  id: string;
  event_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface EventWithImages extends Event {
  images: EventImage[];
}

// ============================================
// DOCUMENTS (Generic)
// ============================================

export interface Document {
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
  month: number | null;
  published: boolean;
  source_url: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentWithAnnexes extends Document {
  annexes: Document[];
}

// ============================================
// ASSET DECLARATIONS
// ============================================

export interface AssetDeclaration {
  id: string;
  person_name: string;
  position: string;
  department: 'primaria' | 'consiliul_local';
  declaration_year: number;
  
  // Declarație de avere
  avere_file_url: string | null;
  avere_file_name: string | null;
  
  // Declarație de interese
  interese_file_url: string | null;
  interese_file_name: string | null;
  
  published: boolean;
  created_at: string;
}

// ============================================
// STAFF & COUNCIL MEMBERS
// ============================================

export interface StaffMember {
  id: string;
  position_type: 'primar' | 'viceprimar' | 'secretar' | 'administrator' | 'director' | 'sef_serviciu' | 'altele';
  name: string;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  reception_hours: string | null;
  responsibilities: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouncilMember {
  id: string;
  name: string;
  party: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  mandate_start: string | null;
  mandate_end: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CouncilCommission {
  id: string;
  name: string;
  description: string | null;
  commission_number: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// ============================================
// PAGINATION & FILTERS
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CouncilSessionsFilter extends PaginationParams {
  year?: number;
  status?: CouncilSession['status'];
}

export interface NewsFilter extends PaginationParams {
  category?: News['category'];
  featured?: boolean;
}

export interface DocumentsFilter extends PaginationParams {
  category?: string;
  subcategory?: string;
  year?: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

