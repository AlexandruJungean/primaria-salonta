import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { 
  ExternalLink,
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Euro,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as programs from '@/lib/supabase/services/programs';
import Image from 'next/image';

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ locale: string; projectId: string }> }) {
  const { locale, projectId } = await params;
  const program = await programs.getProgramBySlug(projectId);
  
  if (!program) {
    return generatePageMetadata({
      pageKey: 'programRegionalNordVest',
      locale: locale as Locale,
      path: `/programe/program-regional-nord-vest/${projectId}`,
    });
  }

  return generatePageMetadata({
    pageKey: 'programRegionalNordVest',
    locale: locale as Locale,
    path: `/programe/program-regional-nord-vest/${projectId}`,
    customTitle: program.title,
    customDescription: program.description?.substring(0, 160) || undefined,
  });
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  const slugs = await programs.getAllProgramSlugs();
  return slugs.map(slug => ({ projectId: slug }));
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatCurrency(value: number | null): string {
  if (!value) return '-';
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ============================================
// COMPONENT
// ============================================

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; projectId: string }> 
}) {
  const { locale, projectId } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'programRegionalNordVestPage' });

  const program = await programs.getProgramBySlug(projectId);

  if (!program) {
    return (
      <>
        <Breadcrumbs items={[
          { label: t('programe'), href: '/programe' },
          { label: t('programRegionalNordVest'), href: '/programe/program-regional-nord-vest' },
          { label: 'Proiect' }
        ]} />
        <Section background="white">
          <Container>
            <div className="text-center py-12">
              <p className="text-gray-500">Proiectul nu a fost găsit.</p>
              <Link href="/programe/program-regional-nord-vest" className="text-primary-600 hover:underline mt-4 inline-block">
                {tp('backToProjects')}
              </Link>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const pageLabels = {
    ro: {
      backToProjects: 'Înapoi la proiecte',
      projectValue: 'Valoare proiect',
      documents: 'Documente',
      description: 'Descriere',
      status: 'Status',
      progress: 'Progres',
      fundingSource: 'Sursa de finanțare',
      startDate: 'Data început',
      endDate: 'Data finalizare',
      planned: 'Planificat',
      inProgress: 'În desfășurare',
      completed: 'Finalizat',
      cancelled: 'Anulat',
    },
    hu: {
      backToProjects: 'Vissza a projektekhez',
      projectValue: 'Projekt értéke',
      documents: 'Dokumentumok',
      description: 'Leírás',
      status: 'Státusz',
      progress: 'Előrehaladás',
      fundingSource: 'Finanszírozási forrás',
      startDate: 'Kezdési dátum',
      endDate: 'Befejezési dátum',
      planned: 'Tervezett',
      inProgress: 'Folyamatban',
      completed: 'Befejezett',
      cancelled: 'Törölve',
    },
    en: {
      backToProjects: 'Back to projects',
      projectValue: 'Project value',
      documents: 'Documents',
      description: 'Description',
      status: 'Status',
      progress: 'Progress',
      fundingSource: 'Funding source',
      startDate: 'Start date',
      endDate: 'End date',
      planned: 'Planned',
      inProgress: 'In progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const statusLabels: Record<string, string> = {
    planificat: labels.planned,
    in_desfasurare: labels.inProgress,
    finalizat: labels.completed,
    anulat: labels.cancelled,
  };

  const statusColors: Record<string, string> = {
    planificat: 'bg-blue-100 text-blue-800',
    in_desfasurare: 'bg-amber-100 text-amber-800',
    finalizat: 'bg-green-100 text-green-800',
    anulat: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('programRegionalNordVest'), href: '/programe/program-regional-nord-vest' },
        { label: program.title }
      ]} />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link 
              href="/programe/program-regional-nord-vest"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {labels.backToProjects}
            </Link>

            {/* Project Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {program.featured_image ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={program.featured_image}
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <Euro className="w-7 h-7 text-primary-700" />
                    </div>
                  )}
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded ${statusColors[program.status] || statusColors.planificat} mb-2`}>
                      {statusLabels[program.status] || labels.planned}
                    </span>
                    <CardTitle className="text-xl font-bold text-gray-900 leading-snug">
                      {program.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Project Values */}
            {program.budget && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Euro className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">{labels.projectValue}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{labels.projectValue}</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(program.budget)}</p>
                    </div>
                    {program.funding_source && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 uppercase tracking-wide">{labels.fundingSource}</p>
                        <p className="text-lg font-semibold text-blue-900">{program.funding_source}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Info */}
            {(program.start_date || program.end_date || program.progress_percentage !== null) && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    {program.start_date && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{labels.startDate}</p>
                        <p className="font-semibold text-gray-900">{formatDate(program.start_date)}</p>
                      </div>
                    )}
                    {program.end_date && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{labels.endDate}</p>
                        <p className="font-semibold text-gray-900">{formatDate(program.end_date)}</p>
                      </div>
                    )}
                    {program.progress_percentage !== null && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{labels.progress}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${program.progress_percentage}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900">{program.progress_percentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {(program.description || program.content) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{labels.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: program.content || program.description || '' }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {program.documents && program.documents.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{labels.documents}</h3>
                  </div>
                  <div className="space-y-2">
                    {program.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-500" />
                        <span className="flex-1 text-gray-700">{doc.title}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Funding Notice */}
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800 mb-4">
                {tp('fundedBy')}
              </p>
              
              <p className="text-sm text-blue-800 mb-4">
                {tp('moreInfo')}{' '}
                <a 
                  href="https://www.oportunitati-ue.gov.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  www.oportunitati-ue.gov.ro
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              
              <p className="text-lg font-semibold text-blue-900 mb-4">
                {tp('investInFuture')}
              </p>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.regionordvest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  www.regionordvest.ro
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.nord-vest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  www.nord-vest.ro
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
