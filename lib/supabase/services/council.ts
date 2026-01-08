import { createAnonServerClient } from '../server';
import type {
  CouncilSession,
  CouncilSessionWithDetails,
  CouncilDecision,
  CouncilDecisionWithDocuments,
  PaginatedResponse,
  CouncilSessionsFilter,
} from '@/lib/types/database';

const DEFAULT_LIMIT = 12;

// ============================================
// COUNCIL SESSIONS
// ============================================

/**
 * Get paginated council sessions
 */
export async function getCouncilSessions(
  filter: CouncilSessionsFilter = {}
): Promise<PaginatedResponse<CouncilSession>> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = DEFAULT_LIMIT, year, status } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('council_sessions')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('session_date', { ascending: false });

  if (year) {
    query = query
      .gte('session_date', `${year}-01-01`)
      .lte('session_date', `${year}-12-31`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching council sessions:', error);
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
 * Get council session by slug with full details
 */
export async function getCouncilSessionBySlug(
  slug: string
): Promise<CouncilSessionWithDetails | null> {
  const supabase = createAnonServerClient();

  const { data: session, error: sessionError } = await supabase
    .from('council_sessions')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (sessionError || !session) {
    console.error('Error fetching council session:', sessionError);
    return null;
  }

  // Get session documents
  const { data: sessionDocuments } = await supabase
    .from('council_session_documents')
    .select('*')
    .eq('session_id', session.id)
    .order('sort_order');

  // Get decisions for this session with their documents
  const { data: decisions } = await supabase
    .from('council_decisions')
    .select('*')
    .eq('session_id', session.id)
    .eq('published', true)
    .order('decision_number', { ascending: false });

  // Get documents for each decision
  const decisionsWithDocs: CouncilDecisionWithDocuments[] = [];
  for (const decision of decisions || []) {
    const { data: decisionDocs } = await supabase
      .from('council_decision_documents')
      .select('*')
      .eq('decision_id', decision.id)
      .order('sort_order');

    decisionsWithDocs.push({
      ...decision,
      documents: decisionDocs || [],
    });
  }

  return {
    ...session,
    documents: sessionDocuments || [],
    decisions: decisionsWithDocs,
  };
}

/**
 * Get available years for council sessions
 */
export async function getCouncilSessionYears(): Promise<number[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('council_sessions')
    .select('session_date')
    .eq('published', true)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error fetching council session years:', error);
    return [];
  }

  const years = new Set<number>();
  data?.forEach(s => {
    const year = new Date(s.session_date).getFullYear();
    years.add(year);
  });

  return Array.from(years).sort((a, b) => b - a);
}

// ============================================
// COUNCIL DECISIONS (HOTĂRÂRI)
// ============================================

interface DecisionsFilter {
  page?: number;
  limit?: number;
  year?: number;
  category?: CouncilDecision['category'];
  sessionId?: string;
}

/**
 * Get paginated council decisions
 */
export async function getCouncilDecisions(
  filter: DecisionsFilter = {}
): Promise<PaginatedResponse<CouncilDecision>> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = DEFAULT_LIMIT, year, category, sessionId } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('council_decisions')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('decision_date', { ascending: false })
    .order('decision_number', { ascending: false });

  if (year) {
    query = query.eq('year', year);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching council decisions:', error);
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
 * Get council decision by slug with documents
 */
export async function getCouncilDecisionBySlug(
  slug: string
): Promise<CouncilDecisionWithDocuments | null> {
  const supabase = createAnonServerClient();

  const { data: decision, error: decisionError } = await supabase
    .from('council_decisions')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (decisionError || !decision) {
    console.error('Error fetching council decision:', decisionError);
    return null;
  }

  // Get documents for this decision
  const { data: documents } = await supabase
    .from('council_decision_documents')
    .select('*')
    .eq('decision_id', decision.id)
    .order('sort_order');

  return {
    ...decision,
    documents: documents || [],
  };
}

/**
 * Get available years for council decisions
 */
export async function getCouncilDecisionYears(): Promise<number[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('council_decisions')
    .select('year')
    .eq('published', true);

  if (error) {
    console.error('Error fetching council decision years:', error);
    return [];
  }

  const years = new Set<number>();
  data?.forEach(d => years.add(d.year));

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Get sessions with their decisions count for hotarari page - PAGINATED
 */
export async function getSessionsWithDecisionsCount(options: {
  page?: number;
  perPage?: number;
} = {}): Promise<{
  sessions: Array<CouncilSession & { decisions_count: number }>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const { page = 1, perPage = 20 } = options;
  const supabase = createAnonServerClient();
  const offset = (page - 1) * perPage;

  // Get total count first
  const { count: totalCount, error: countError } = await supabase
    .from('council_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  if (countError) {
    console.error('Error fetching total count:', countError);
    return { sessions: [], totalCount: 0, totalPages: 0, currentPage: page };
  }

  // Get paginated sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from('council_sessions')
    .select('*')
    .eq('published', true)
    .order('session_date', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (sessionsError || !sessions) {
    console.error('Error fetching sessions:', sessionsError);
    return { sessions: [], totalCount: totalCount || 0, totalPages: 0, currentPage: page };
  }

  if (sessions.length === 0) {
    return { 
      sessions: [], 
      totalCount: totalCount || 0, 
      totalPages: Math.ceil((totalCount || 0) / perPage), 
      currentPage: page 
    };
  }

  // Get all decisions counts for these sessions in a single query
  const sessionIds = sessions.map(s => s.id);
  const { data: decisionCounts, error: decisionsCountError } = await supabase
    .from('council_decisions')
    .select('session_id')
    .eq('published', true)
    .in('session_id', sessionIds);

  if (decisionsCountError) {
    console.error('Error fetching decision counts:', decisionsCountError);
    return { 
      sessions: sessions.map(s => ({ ...s, decisions_count: 0 })), 
      totalCount: totalCount || 0, 
      totalPages: Math.ceil((totalCount || 0) / perPage), 
      currentPage: page 
    };
  }

  // Count decisions per session
  const countsMap = new Map<string, number>();
  decisionCounts?.forEach(d => {
    const current = countsMap.get(d.session_id) || 0;
    countsMap.set(d.session_id, current + 1);
  });

  // Merge counts with sessions
  const sessionsWithCount = sessions.map(session => ({
    ...session,
    decisions_count: countsMap.get(session.id) || 0,
  }));

  return {
    sessions: sessionsWithCount,
    totalCount: totalCount || 0,
    totalPages: Math.ceil((totalCount || 0) / perPage),
    currentPage: page,
  };
}

/**
 * Get all council session slugs for static generation
 */
export async function getAllSessionSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('council_sessions')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching session slugs:', error);
    return [];
  }

  return data?.map(s => s.slug) || [];
}

/**
 * Get all council decision slugs for static generation
 */
export async function getAllDecisionSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('council_decisions')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching decision slugs:', error);
    return [];
  }

  return data?.map(d => d.slug) || [];
}
