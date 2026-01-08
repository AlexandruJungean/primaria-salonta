import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as council from '@/lib/supabase/services/council';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'consiliulLocal',
    locale: locale as Locale,
    path: '/consiliul-local/sedinte',
    customTitle: locale === 'ro' ? 'Ședințe Consiliul Local' : 
                 locale === 'hu' ? 'Helyi Tanács ülései' : 'Local Council Sessions',
  });
}

// Types
type SessionType = 'ordinara' | 'extraordinara' | 'de_indata';
type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

const SESSION_TYPE_LABELS: Record<SessionType, { ro: string; hu: string; en: string; color: string }> = {
  ordinara: { 
    ro: 'Ședință Ordinară', 
    hu: 'Rendes ülés', 
    en: 'Regular Session',
    color: 'bg-blue-100 text-blue-800',
  },
  extraordinara: { 
    ro: 'Ședință Extraordinară', 
    hu: 'Rendkívüli ülés', 
    en: 'Extraordinary Session',
    color: 'bg-amber-100 text-amber-800',
  },
  de_indata: { 
    ro: 'Ședință de Îndată', 
    hu: 'Sürgősségi ülés', 
    en: 'Emergency Session',
    color: 'bg-red-100 text-red-800',
  },
};

const STATUS_COLORS: Record<SessionStatus, string> = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function SedinteConsilPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch sessions from database
  const sessionsResponse = await council.getCouncilSessions({ limit: 100 });
  const sessions = sessionsResponse.data;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    // Handle both HH:MM:SS and HH:MM formats
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const pageLabels = {
    ro: {
      title: 'Ședințe Consiliul Local',
      description: 'Calendarul ședințelor Consiliului Local al Municipiului Salonta, inclusiv ordine de zi și procese verbale.',
      scheduled: 'Programată',
      in_progress: 'În desfășurare',
      completed: 'Finalizată',
      cancelled: 'Anulată',
      agendaItems: 'hotărâri',
      viewDetails: 'Vezi detalii',
      upcomingSessions: 'Ședințe Programate',
      pastSessions: 'Ședințe Anterioare',
      noSessions: 'Nu există ședințe înregistrate.',
    },
    hu: {
      title: 'Helyi Tanács ülései',
      description: 'Nagyszalonta Helyi Tanácsának ülésrendje, beleértve a napirendet és a jegyzőkönyveket.',
      scheduled: 'Ütemezett',
      in_progress: 'Folyamatban',
      completed: 'Befejezett',
      cancelled: 'Törölve',
      agendaItems: 'határozat',
      viewDetails: 'Részletek',
      upcomingSessions: 'Ütemezett ülések',
      pastSessions: 'Korábbi ülések',
      noSessions: 'Nincsenek bejegyzett ülések.',
    },
    en: {
      title: 'Local Council Sessions',
      description: 'Calendar of Local Council sessions of Salonta Municipality, including agendas and minutes.',
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      agendaItems: 'decisions',
      viewDetails: 'View details',
      upcomingSessions: 'Upcoming Sessions',
      pastSessions: 'Past Sessions',
      noSessions: 'No sessions recorded.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Separate upcoming and past sessions
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' || s.status === 'in_progress');
  const pastSessions = sessions.filter(s => s.status === 'completed' || s.status === 'cancelled');

  const statusLabels: Record<SessionStatus, string> = {
    scheduled: labels.scheduled,
    in_progress: labels.in_progress,
    completed: labels.completed,
    cancelled: labels.cancelled,
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: labels.title },
      ]} />
      
      <PageHeader 
        titleKey="consiliulLocal" 
        icon="users"
        subtitle={labels.title}
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {labels.noSessions}
              </div>
            ) : (
              <>
                {/* Upcoming Sessions */}
                {upcomingSessions.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      {labels.upcomingSessions}
                    </h2>
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => {
                        const sessionTypeLabel = SESSION_TYPE_LABELS[session.session_type as SessionType] || SESSION_TYPE_LABELS.ordinara;
                        return (
                          <Link key={session.id} href={`/consiliul-local/sedinte/${session.slug}`}>
                            <Card hover className="border-primary-200 bg-primary-50">
                              <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                                      <Calendar className="w-7 h-7 text-primary-700" />
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <Badge className={sessionTypeLabel.color}>
                                          {sessionTypeLabel[locale as keyof typeof sessionTypeLabel] || sessionTypeLabel.ro}
                                        </Badge>
                                        <Badge className={STATUS_COLORS[session.status as SessionStatus] || STATUS_COLORS.scheduled}>
                                          {statusLabels[session.status as SessionStatus] || labels.scheduled}
                                        </Badge>
                                      </div>
                                      <h3 className="font-semibold text-gray-900 mb-1">
                                        {session.title || formatDate(session.session_date)}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        {session.start_time && (
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatTime(session.start_time)}
                                          </span>
                                        )}
                                        {session.location && (
                                          <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {session.location}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-primary-700 font-medium">
                                    {labels.viewDetails}
                                    <ChevronRight className="w-5 h-5" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Past Sessions */}
                {pastSessions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      {labels.pastSessions}
                    </h2>
                    <div className="space-y-3">
                      {pastSessions.map((session) => {
                        const sessionTypeLabel = SESSION_TYPE_LABELS[session.session_type as SessionType] || SESSION_TYPE_LABELS.ordinara;
                        return (
                          <Link key={session.id} href={`/consiliul-local/sedinte/${session.slug}`}>
                            <Card hover>
                              <CardContent className="py-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                      <Calendar className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <Badge className={sessionTypeLabel.color}>
                                          {sessionTypeLabel[locale as keyof typeof sessionTypeLabel] || sessionTypeLabel.ro}
                                        </Badge>
                                      </div>
                                      <h3 className="font-medium text-gray-900">
                                        {session.title || formatDate(session.session_date)}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
