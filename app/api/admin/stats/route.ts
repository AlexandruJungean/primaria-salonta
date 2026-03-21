import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/verify-admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - Get statistics for dashboard
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'main';

  const supabase = createAdminClient();

  try {
    if (type === 'main') {
      const [
        newsCount,
        eventsCount,
        hotarariCount,
        sedinteCount,
        docsCount,
        newsDocsCount,
        decisionDocsCount,
        sessionDocsCount,
        reportsCount,
        jobDocsCount,
        programDocsCount,
        councilMembersCount,
        unreadPetitionsCount,
        unreadContactsCount,
      ] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('council_sessions').select('*', { count: 'exact', head: true }).eq('source', 'hotarari'),
        supabase.from('council_sessions').select('*', { count: 'exact', head: true }).eq('source', 'sedinte'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('news_documents').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('council_decision_documents').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('council_session_documents').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('reports').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('job_vacancy_documents').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('program_documents').select('*', { count: 'exact', head: true }).not('file_url', 'is', null),
        supabase.from('council_members').select('*', { count: 'exact', head: true }),
        supabase.from('petitions').select('*', { count: 'exact', head: true }).in('status', ['inregistrata', 'in_lucru']),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ]);

      const totalDocuments = (docsCount.count || 0)
        + (newsDocsCount.count || 0)
        + (decisionDocsCount.count || 0)
        + (sessionDocsCount.count || 0)
        + (reportsCount.count || 0)
        + (jobDocsCount.count || 0)
        + (programDocsCount.count || 0);

      return NextResponse.json({
        news: newsCount.count || 0,
        events: eventsCount.count || 0,
        decisions: hotarariCount.count || 0,
        sessions: sedinteCount.count || 0,
        documents: totalDocuments,
        councilMembers: councilMembersCount.count || 0,
        unreadPetitions: unreadPetitionsCount.count || 0,
        unreadContacts: unreadContactsCount.count || 0,
      });
    }

    if (type === 'primaria') {
      // Primaria stats
      const [staffCount, officeHoursCount] = await Promise.all([
        supabase.from('staff_members').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('office_hours').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      return NextResponse.json({
        staff: staffCount.count || 0,
        officeHours: officeHoursCount.count || 0,
      });
    }

    if (type === 'consiliul-local') {
      // Council stats
      const [decisionsCount, sessionsCount, membersCount, commissionsCount] = await Promise.all([
        supabase.from('council_decisions').select('*', { count: 'exact', head: true }),
        supabase.from('council_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('council_members').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('council_commissions').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      return NextResponse.json({
        decisions: decisionsCount.count || 0,
        sessions: sessionsCount.count || 0,
        members: membersCount.count || 0,
        commissions: commissionsCount.count || 0,
      });
    }

    return NextResponse.json({ error: 'Unknown stats type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
