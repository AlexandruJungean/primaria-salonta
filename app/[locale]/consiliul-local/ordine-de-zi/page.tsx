import { getTranslations } from 'next-intl/server';
import { Calendar, Download, Video, ExternalLink, Clock, Key } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as council from '@/lib/supabase/services/council';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'ordineDeZi',
    locale: locale as Locale,
    path: '/consiliul-local/ordine-de-zi',
  });
}

export default async function OrdineDeZiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch sessions with their documents from database
  const sessionsResponse = await council.getCouncilSessions({ limit: 50 });
  const sessions = sessionsResponse.data;

  const pageLabels = {
    ro: {
      description: 'Ordinele de zi pentru ședințele Consiliului Local al Municipiului Salonta. Ședințele sunt transmise live pe Zoom.',
      noSessions: 'Nu există ședințe disponibile.',
      downloadConvocation: 'Dispoziție convocare',
      joinZoom: 'Participă pe Zoom',
      meetingId: 'Meeting ID',
      passcode: 'Cod acces',
      viewDetails: 'Vezi detalii ședință',
    },
    hu: {
      description: 'Nagyszalonta Helyi Tanácsa üléseinek napirendjei. Az ülések élő közvetítése Zoomon történik.',
      noSessions: 'Nincsenek elérhető ülések.',
      downloadConvocation: 'Összehívási rendelkezés',
      joinZoom: 'Csatlakozás Zoomon',
      meetingId: 'Meeting ID',
      passcode: 'Hozzáférési kód',
      viewDetails: 'Ülés részletei',
    },
    en: {
      description: 'Agendas for the sessions of the Local Council of Salonta Municipality. Sessions are broadcast live on Zoom.',
      noSessions: 'No sessions available.',
      downloadConvocation: 'Convocation order',
      joinZoom: 'Join on Zoom',
      meetingId: 'Meeting ID',
      passcode: 'Passcode',
      viewDetails: 'View session details',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  // Zoom meeting details (these are static for now)
  const zoomDetails = {
    url: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('ordineDezi') }
      ]} />
      <PageHeader titleKey="ordineDezi" icon="calendar" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {/* Zoom Info Card */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">{labels.joinZoom}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-blue-700 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {labels.meetingId}: {zoomDetails.meetingId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" />
                          {labels.passcode}: {zoomDetails.passcode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={zoomDetails.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Zoom
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Sessions List */}
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-primary-700" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {session.title || formatDate(session.session_date)}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(session.session_date)}
                              </span>
                              {session.start_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {formatTime(session.start_time)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/consiliul-local/sedinte/${session.slug}`}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            {labels.viewDetails}
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noSessions}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
