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

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'created_at';
  const sortDir = searchParams.get('dir') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '30');

  const supabase = createAdminClient();
  const allDocs: UnifiedDocument[] = [];

  // 1. documents table
  const { data: docs } = await supabase
    .from('documents')
    .select('id, title, file_url, file_name, file_size, created_at, category, source_folder, parent_id');
  
  (docs || []).forEach(d => {
    if (!d.file_url) return;
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

  // 2. news_documents
  const { data: newsDocs } = await supabase
    .from('news_documents')
    .select('id, title, file_url, file_name, file_size, created_at, news_id');
  
  (newsDocs || []).forEach(d => {
    if (!d.file_url) return;
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

  // 3. council_decision_documents
  const { data: decisionDocs } = await supabase
    .from('council_decision_documents')
    .select('id, title, file_url, file_name, file_size, created_at, decision_id');
  
  (decisionDocs || []).forEach(d => {
    if (!d.file_url) return;
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

  // 4. council_session_documents
  const { data: sessionDocs } = await supabase
    .from('council_session_documents')
    .select('id, title, file_url, file_name, file_size, created_at, session_id');
  
  (sessionDocs || []).forEach(d => {
    if (!d.file_url) return;
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

  // 5. reports
  const { data: reports } = await supabase
    .from('reports')
    .select('id, title, file_url, file_name, file_size, created_at, report_type');
  
  (reports || []).forEach(d => {
    if (!d.file_url) return;
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

  // 6. job_vacancy_documents
  const { data: jobDocs } = await supabase
    .from('job_vacancy_documents')
    .select('id, title, file_url, file_name, file_size, created_at, vacancy_id');
  
  (jobDocs || []).forEach(d => {
    if (!d.file_url) return;
    allDocs.push({
      id: d.id,
      title: d.title || d.file_name || '',
      file_url: d.file_url,
      file_name: d.file_name || '',
      file_size: d.file_size,
      created_at: d.created_at,
      source_table: 'job_vacancy_documents',
      source_label: 'Carieră',
      parent_info: null,
      admin_edit_url: `/admin/informatii-publice/cariera/${d.vacancy_id}`,
    });
  });

  // 7. program_documents
  const { data: progDocs } = await supabase
    .from('program_documents')
    .select('id, title, file_url, file_name, file_size, created_at, program_id');
  
  (progDocs || []).forEach(d => {
    if (!d.file_url) return;
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
    filtered = allDocs.filter(d =>
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
  const from = (page - 1) * limit;
  const paginated = filtered.slice(from, from + limit);

  return NextResponse.json({ data: paginated, count: total });
}
