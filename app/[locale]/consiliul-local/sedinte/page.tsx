import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

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

// Mock data - will be replaced with database
type SessionType = 'ordinara' | 'extraordinara' | 'de_indata';

interface SessionSummary {
  id: string;
  slug: string;
  type: SessionType;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  agendaItemsCount: number;
}

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

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const MOCK_SESSIONS: SessionSummary[] = [
  {
    id: '1',
    slug: '19-decembrie-2025',
    type: 'ordinara',
    date: '2025-12-19',
    time: '14:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'scheduled',
    agendaItemsCount: 5,
  },
  {
    id: '2',
    slug: '27-noiembrie-2025',
    type: 'ordinara',
    date: '2025-11-27',
    time: '14:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'completed',
    agendaItemsCount: 6,
  },
  {
    id: '3',
    slug: '10-noiembrie-2025',
    type: 'extraordinara',
    date: '2025-11-10',
    time: '10:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'completed',
    agendaItemsCount: 2,
  },
  {
    id: '4',
    slug: '30-octombrie-2025',
    type: 'ordinara',
    date: '2025-10-30',
    time: '14:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'completed',
    agendaItemsCount: 8,
  },
  {
    id: '5',
    slug: '25-septembrie-2025',
    type: 'ordinara',
    date: '2025-09-25',
    time: '14:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'completed',
    agendaItemsCount: 10,
  },
];

export default async function SedinteConsilPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const pageLabels = {
    ro: {
      title: 'Ședințe Consiliul Local',
      description: 'Calendarul ședințelor Consiliului Local al Municipiului Salonta, inclusiv ordine de zi și procese verbale.',
      scheduled: 'Programată',
      completed: 'Finalizată',
      cancelled: 'Anulată',
      agendaItems: 'puncte pe ordine de zi',
      viewDetails: 'Vezi detalii',
      upcomingSessions: 'Ședințe Programate',
      pastSessions: 'Ședințe Anterioare',
    },
    hu: {
      title: 'Helyi Tanács ülései',
      description: 'Nagyszalonta Helyi Tanácsának ülésrendje, beleértve a napirendet és a jegyzőkönyveket.',
      scheduled: 'Ütemezett',
      completed: 'Befejezett',
      cancelled: 'Törölve',
      agendaItems: 'napirendi pont',
      viewDetails: 'Részletek',
      upcomingSessions: 'Ütemezett ülések',
      pastSessions: 'Korábbi ülések',
    },
    en: {
      title: 'Local Council Sessions',
      description: 'Calendar of Local Council sessions of Salonta Municipality, including agendas and minutes.',
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      agendaItems: 'agenda items',
      viewDetails: 'View details',
      upcomingSessions: 'Upcoming Sessions',
      pastSessions: 'Past Sessions',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const upcomingSessions = MOCK_SESSIONS.filter(s => s.status === 'scheduled');
  const pastSessions = MOCK_SESSIONS.filter(s => s.status !== 'scheduled');

  const statusLabels: Record<string, string> = {
    scheduled: labels.scheduled,
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

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  {labels.upcomingSessions}
                </h2>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
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
                                  <Badge className={SESSION_TYPE_LABELS[session.type].color}>
                                    {SESSION_TYPE_LABELS[session.type][locale as keyof typeof SESSION_TYPE_LABELS[typeof session.type]]}
                                  </Badge>
                                  <Badge className={STATUS_COLORS[session.status]}>
                                    {statusLabels[session.status]}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {formatDate(session.date)}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {session.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {session.agendaItemsCount} {labels.agendaItems}
                                  </span>
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
                  ))}
                </div>
              </div>
            )}

            {/* Past Sessions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                {labels.pastSessions}
              </h2>
              <div className="space-y-3">
                {pastSessions.map((session) => (
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
                                <Badge className={SESSION_TYPE_LABELS[session.type].color}>
                                  {SESSION_TYPE_LABELS[session.type][locale as keyof typeof SESSION_TYPE_LABELS[typeof session.type]]}
                                </Badge>
                              </div>
                              <h3 className="font-medium text-gray-900">
                                {formatDate(session.date)}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {session.agendaItemsCount} {labels.agendaItems}
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

