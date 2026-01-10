import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Users,
  ListOrdered,
} from 'lucide-react';

// ============================================
// TYPES & CONSTANTS
// ============================================

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

const STATUS_LABELS: Record<SessionStatus, { ro: string; hu: string; en: string }> = {
  scheduled: { ro: 'Programată', hu: 'Ütemezett', en: 'Scheduled' },
  in_progress: { ro: 'În desfășurare', hu: 'Folyamatban', en: 'In Progress' },
  completed: { ro: 'Finalizată', hu: 'Befejezett', en: 'Completed' },
  cancelled: { ro: 'Anulată', hu: 'Törölve', en: 'Cancelled' },
};

const DOCUMENT_TYPE_LABELS: Record<string, { ro: string; hu: string; en: string }> = {
  proces_verbal: { ro: 'Proces verbal', hu: 'Jegyzőkönyv', en: 'Minutes' },
  ordine_zi: { ro: 'Ordine de zi', hu: 'Napirend', en: 'Agenda' },
  materiale: { ro: 'Materiale de ședință', hu: 'Ülési anyagok', en: 'Session Materials' },
  prezenta: { ro: 'Lista de prezență', hu: 'Jelenléti ív', en: 'Attendance List' },
  proiect_hotarare: { ro: 'Proiect de hotărâre', hu: 'Határozattervezet', en: 'Draft Decision' },
  minuta: { ro: 'Minută', hu: 'Feljegyzés', en: 'Note' },
  anexa: { ro: 'Anexă', hu: 'Melléklet', en: 'Annex' },
  altele: { ro: 'Alte documente', hu: 'Egyéb dokumentumok', en: 'Other Documents' },
};

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

  const session = await council.getCouncilSessionBySlug(slug);

  if (!session) {
    notFound();
  }

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
      attendance: 'Prezență',
      decisions: 'Hotărâri adoptate',
      documents: 'Documente',
      noDecisions: 'Nu există hotărâri înregistrate pentru această ședință.',
      noDocuments: 'Nu există documente disponibile.',
      decisionNo: 'Hotărârea nr.',
    },
    hu: {
      backToList: 'Vissza a napirendekhez',
      date: 'Dátum',
      time: 'Időpont',
      location: 'Helyszín',
      attendance: 'Jelenlét',
      decisions: 'Elfogadott határozatok',
      documents: 'Dokumentumok',
      noDecisions: 'Nincsenek bejegyzett határozatok erre az ülésre.',
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      decisionNo: 'Határozat sz.',
    },
    en: {
      backToList: 'Back to agendas',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      attendance: 'Attendance',
      decisions: 'Adopted decisions',
      documents: 'Documents',
      noDecisions: 'No decisions recorded for this session.',
      noDocuments: 'No documents available.',
      decisionNo: 'Decision no.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;
  const sessionTypeLabel = SESSION_TYPE_LABELS[session.session_type as SessionType] || SESSION_TYPE_LABELS.ordinara;
  const statusLabel = STATUS_LABELS[session.status as SessionStatus] || STATUS_LABELS.scheduled;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('ordineDezi') || 'Ordine de zi', href: '/consiliul-local/ordine-de-zi' },
        { label: formatShortDate(session.session_date) },
      ]} />

      <PageHeader 
        titleKey="ordineDezi" 
        icon="users"
        subtitle={session.title || formatDate(session.session_date)}
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/consiliul-local/ordine-de-zi"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {labels.backToList}
            </Link>

            {/* Header Card */}
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={sessionTypeLabel.color}>
                    {sessionTypeLabel[locale as keyof typeof sessionTypeLabel] || sessionTypeLabel.ro}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`bg-white/20 border-white/30 ${
                      session.status === 'completed' ? 'text-green-200' : 
                      session.status === 'cancelled' ? 'text-red-200' : 'text-white'
                    }`}
                  >
                    {statusLabel[locale as keyof typeof statusLabel] || statusLabel.ro}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {session.title || `${sessionTypeLabel[locale as keyof typeof sessionTypeLabel] || sessionTypeLabel.ro} - ${formatDate(session.session_date)}`}
                </h1>

                {session.description && (
                  <p className="text-gray-600 mb-4">{session.description}</p>
                )}

                {/* Session Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
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

                  {session.attendance_count && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.attendance}</p>
                        <p className="font-semibold text-gray-900">{session.attendance_count}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content - Decisions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-primary-600" />
                      {labels.decisions}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {session.decisions && session.decisions.length > 0 ? (
                      <div className="space-y-4">
                        {session.decisions.map((decision) => (
                          <div 
                            key={decision.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 font-bold text-primary-700 text-sm">
                                {decision.decision_number}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {decision.title}
                                </h4>
                                
                                {decision.summary && (
                                  <p className="text-sm text-gray-600 mb-2">{decision.summary}</p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-sm text-primary-600 font-medium">
                                    {labels.decisionNo} {decision.decision_number}/{decision.year}
                                  </span>
                                  
                                  {/* Decision documents */}
                                  {decision.documents && decision.documents.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {decision.documents.map((doc) => (
                                        <a
                                          key={doc.id}
                                          href={doc.file_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                                        >
                                          <FileText className="w-3 h-3" />
                                          {doc.title || 'PDF'}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">{labels.noDecisions}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Documents */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600" />
                      {labels.documents}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {session.documents && session.documents.length > 0 ? (
                      <div className="space-y-2">
                        {session.documents.map((doc) => {
                          const docTypeLabel = DOCUMENT_TYPE_LABELS[doc.document_type] || DOCUMENT_TYPE_LABELS.altele;
                          return (
                            <a
                              key={doc.id}
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 group-hover:text-primary-700 text-sm truncate">
                                    {doc.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {docTypeLabel[locale as keyof typeof docTypeLabel] || docTypeLabel.ro}
                                  </p>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0 ml-2" />
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">{labels.noDocuments}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
