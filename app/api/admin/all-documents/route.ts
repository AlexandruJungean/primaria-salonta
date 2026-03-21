import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/verify-admin';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface UnifiedDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
  source_table: string;
  source_label: string;
  parent_info: string | null;
  admin_edit_url: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAllRows(supabase: ReturnType<typeof createAdminClient>, table: string, columns: string): Promise<any[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .not('file_url', 'is', null)
      .range(from, from + PAGE_SIZE - 1);

    if (error) { console.error(`Error fetching ${table}:`, error); break; }
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows;
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const source = searchParams.get('source') || '';
  const sortBy = searchParams.get('sort') || 'created_at';
  const sortDir = searchParams.get('dir') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '30');

  const supabase = createAdminClient();
  const allDocs: UnifiedDocument[] = [];

  // Only fetch the tables we need (skip unnecessary queries when filtering by source)
  const shouldFetch = (table: string) => !source || source === table;

  const [docs, newsDocs, decisionDocs, sessionDocs, reports, jobDocs, progDocs] = await Promise.all([
    shouldFetch('documents') ? fetchAllRows(supabase, 'documents', 'id, title, file_url, file_name, file_size, created_at, category, source_folder, parent_id') : [],
    shouldFetch('news_documents') ? fetchAllRows(supabase, 'news_documents', 'id, title, file_url, file_name, file_size, created_at, news_id') : [],
    shouldFetch('council_decision_documents') ? fetchAllRows(supabase, 'council_decision_documents', 'id, title, file_url, file_name, file_size, created_at, decision_id') : [],
    shouldFetch('council_session_documents') ? fetchAllRows(supabase, 'council_session_documents', 'id, title, file_url, file_name, file_size, created_at, session_id') : [],
    shouldFetch('reports') ? fetchAllRows(supabase, 'reports', 'id, title, file_url, file_name, file_size, created_at, report_type') : [],
    shouldFetch('job_vacancy_documents') ? fetchAllRows(supabase, 'job_vacancy_documents', 'id, title, file_url, file_name, created_at, vacancy_id') : [],
    shouldFetch('program_documents') ? fetchAllRows(supabase, 'program_documents', 'id, title, file_url, file_name, file_size, created_at, program_id') : [],
  ]);

  docs.forEach((d: { id: string; title: string; file_url: string; file_name: string; file_size: number | null; created_at: string; category: string; source_folder: string; parent_id: string | null }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name,
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'documents',
      source_label: d.parent_id ? 'Anexă document' : (d.source_folder || d.category || 'Document'),
      parent_info: d.source_folder || d.category,
      admin_edit_url: d.parent_id ? null : `/admin/informatii-publice/achizitii/${d.id}`,
    });
  });

  newsDocs.forEach((d: { id: string; title: string; file_url: string; file_name: string; file_size: number | null; created_at: string; news_id: string }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name,
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'news_documents',
      source_label: 'Știri',
      parent_info: `Știre: ${d.news_id}`,
      admin_edit_url: `/admin/stiri/${d.news_id}`,
    });
  });

  decisionDocs.forEach((d: { id: string; title: string; file_url: string; file_name: string; file_size: number | null; created_at: string; decision_id: string }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name,
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'council_decision_documents',
      source_label: 'Hotărâri CL',
      parent_info: null,
      admin_edit_url: null,
    });
  });

  sessionDocs.forEach((d: { id: string; title: string; file_url: string; file_name: string; file_size: number | null; created_at: string; session_id: string }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name,
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'council_session_documents',
      source_label: 'Ordine de Zi',
      parent_info: null,
      admin_edit_url: null,
    });
  });

  reports.forEach((d: { id: string; title: string; file_url: string; file_name: string; file_size: number | null; created_at: string; report_type: string }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name || '',
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'reports',
      source_label: 'Rapoarte',
      parent_info: d.report_type,
      admin_edit_url: `/admin/rapoarte-studii/rapoarte/${d.id}`,
    });
  });

  jobDocs.forEach((d: { id: string; title: string; file_url: string; file_name: string; created_at: string; vacancy_id: string }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name || '',
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: null,
      created_at: d.created_at,
      source_table: 'job_vacancy_documents',
      source_label: 'Carieră',
      parent_info: null,
      admin_edit_url: `/admin/informatii-publice/cariera/${d.vacancy_id}`,
    });
  });

  progDocs.forEach((d: { id: string; title: string; file_url: string; file_name: string; file_size: number | null; created_at: string; program_id: string }) => {
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name || '',
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'program_documents',
      source_label: 'Programe',
      parent_info: null,
      admin_edit_url: `/admin/programe/${d.program_id}`,
    });
  });

  // Filter by search
  let filtered = allDocs;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.file_name.toLowerCase().includes(q) ||
      d.source_label.toLowerCase().includes(q)
    );
  }

  // Sort
  const dir = sortDir === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    if (sortBy === 'title') return dir * a.title.localeCompare(b.title);
    if (sortBy === 'file_name') return dir * a.file_name.localeCompare(b.file_name);
    if (sortBy === 'source_label') return dir * a.source_label.localeCompare(b.source_label);
    return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  });

  const total = filtered.length;
  const fromIdx = (page - 1) * limit;
  const paginated = filtered.slice(fromIdx, fromIdx + limit);

  return NextResponse.json({ data: paginated, count: total });
}
