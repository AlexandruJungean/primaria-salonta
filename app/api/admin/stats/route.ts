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
      // Main dashboard stats
      const [
        newsCount,
        eventsCount,
        decisionsCount,
        sessionsCount,
        documentsCount,
        councilMembersCount,
      ] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('council_decisions').select('*', { count: 'exact', head: true }),
        supabase.from('council_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('council_members').select('*', { count: 'exact', head: true }),
      ]);

      return NextResponse.json({
        news: newsCount.count || 0,
        events: eventsCount.count || 0,
        decisions: decisionsCount.count || 0,
        sessions: sessionsCount.count || 0,
        documents: documentsCount.count || 0,
        councilMembers: councilMembersCount.count || 0,
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
