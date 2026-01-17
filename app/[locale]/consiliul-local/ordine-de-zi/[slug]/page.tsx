import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as council from '@/lib/supabase/services/council';
import { 
  Calendar, 
  Clock,
  MapPin,
  ArrowLeft, 
  FileText, 
  Download,
  Video,
  ExternalLink,
  Key,
} from 'lucide-react';
import { translateContentFields, translateContentArray } from '@/lib/google-translate/cache';

// ============================================
// CONSTANTS
// ============================================

// Document types relevant for ordine de zi (convocation/agenda only)
const CONVOCATION_TYPES = ['dispozitie_convocare', 'ordine_zi', 'proiect_hotarare', 'materiale', 'altele'];

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const session = await council.getCouncilSessionBySlug(slug);
  
  if (!session) {
    return generatePageMetadata({
      pageKey: 'consiliulLocal',
      locale: locale as Locale,
      path: `/consiliul-local/ordine-de-zi/${slug}`,
    });
  }

  return generatePageMetadata({
    pageKey: 'consiliulLocal',
    locale: locale as Locale,
    path: `/consiliul-local/ordine-de-zi/${slug}`,
    customTitle: session.title,
    customDescription: session.description || undefined,
  });
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  const slugs = await council.getAllSessionSlugs();
  return slugs.map(slug => ({ slug }));
}

// ============================================
// COMPONENT
// ============================================

export default async function SedintaDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const sessionData = await council.getCouncilSessionBySlug(slug);

  if (!sessionData) {
    notFound();
  }

  // Translate session content based on locale
  const sessionTranslated = await translateContentFields(
    sessionData,
    ['title', 'description', 'location'],
    locale as 'ro' | 'hu' | 'en'
  );

  // Translate documents
  const translatedDocuments = sessionData.documents 
    ? await translateContentArray(sessionData.documents, ['title'], locale as 'ro' | 'hu' | 'en')
    : [];

  const session = {
    ...sessionTranslated,
    documents: translatedDocuments,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatShortDate = (dateStr: string) => {
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

  const pageLabels = {
    ro: {
      backToList: 'Înapoi la ordine de zi',
      date: 'Data',
      time: 'Ora',
      location: 'Locație',
      convocationDoc: 'Dispoziție de convocare',
      noDocuments: 'Nu există documente disponibile.',
      joinOnline: 'Participă online',
      meetingId: 'Meeting ID',
      passcode: 'Cod acces',
      viewDecisions: 'Vezi hotărârile adoptate',
    },
    hu: {
      backToList: 'Vissza a napirendekhez',
      date: 'Dátum',
      time: 'Időpont',
      location: 'Helyszín',
      convocationDoc: 'Összehívási rendelkezés',
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      joinOnline: 'Online részvétel',
      meetingId: 'Meeting ID',
      passcode: 'Hozzáférési kód',
      viewDecisions: 'Elfogadott határozatok megtekintése',
    },
    en: {
      backToList: 'Back to agendas',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      convocationDoc: 'Convocation order',
      noDocuments: 'No documents available.',
      joinOnline: 'Join online',
      meetingId: 'Meeting ID',
      passcode: 'Passcode',
      viewDecisions: 'View adopted decisions',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Filter only convocation/agenda documents (not proces verbal or hotarari)
  const convocationDocs = session.documents?.filter(doc => 
    CONVOCATION_TYPES.includes(doc.document_type)
  ) || [];

  // Zoom meeting details (from database or fallback to default)
  const zoomDetails = {
    url: session.meeting_url || 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09',
    meetingId: session.meeting_id || '931 751 3142',
    passcode: session.meeting_passcode || 'r0mb8r',
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('ordineDezi') || 'Ordine de zi', href: '/consiliul-local/ordine-de-zi' },
        { label: formatShortDate(session.session_date) },
      ]} />

      <PageHeader 
        titleKey="ordineDezi" 
        icon="calendar"
        subtitle={session.title || formatDate(session.session_date)}
      />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/consiliul-local/ordine-de-zi"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {labels.backToList}
            </Link>

            {/* Header Card */}
            <Card className="mb-6 overflow-hidden">
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {session.title || formatDate(session.session_date)}
                </h1>

                {session.description && (
                  <p className="text-gray-600 mb-4">{session.description}</p>
                )}

                {/* Session Info Grid */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.date}</p>
                      <p className="font-semibold text-gray-900">{formatShortDate(session.session_date)}</p>
                    </div>
                  </div>

                  {session.start_time && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.time}</p>
                        <p className="font-semibold text-gray-900">{formatTime(session.start_time)}</p>
                      </div>
                    </div>
                  )}

                  {session.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.location}</p>
                        <p className="font-semibold text-gray-900 text-sm">{session.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Zoom Info Card */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">{labels.joinOnline}</p>
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

            {/* Convocation Document */}
            {convocationDocs.length > 0 ? (
              <Card className="mb-6">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary-600" />
                    {labels.convocationDoc}
                  </h3>
                  <div className="space-y-2">
                    {convocationDocs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group border border-gray-200 hover:border-primary-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-primary-700">
                            {doc.title}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="p-5 text-center text-gray-500">
                  {labels.noDocuments}
                </CardContent>
              </Card>
            )}

            {/* Link to decisions if session is completed */}
            {session.status === 'completed' && session.decisions && session.decisions.length > 0 && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-amber-900">{labels.viewDecisions}</p>
                      <p className="text-sm text-amber-700 mt-1">
                        {session.decisions.length} hotărâri adoptate în această ședință
                      </p>
                    </div>
                    <Link
                      href={`/consiliul-local/hotarari/${session.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      {labels.viewDecisions}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
