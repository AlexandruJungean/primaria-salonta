import { getTranslations } from 'next-intl/server';
import { 
  ExternalLink,
  ArrowRight,
  Euro
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as programs from '@/lib/supabase/services/programs';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'programRegionalNordVest',
    locale: locale as Locale,
    path: '/programe/program-regional-nord-vest',
  });
}

// Status colors
const statusColors: Record<string, string> = {
  planificat: 'bg-blue-100 text-blue-700',
  in_desfasurare: 'bg-amber-100 text-amber-700',
  finalizat: 'bg-green-100 text-green-700',
  anulat: 'bg-red-100 text-red-700',
};

export default async function ProgramRegionalNordVestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'programRegionalNordVestPage' });

  // Fetch Nord-Vest regional projects from database
  const { data: projectsList } = await programs.getPrograms({ programType: 'por', limit: 50 });

  const pageLabels = {
    ro: {
      viewDetails: 'Vezi detalii',
      noProjects: 'Nu există proiecte disponibile.',
      planned: 'Planificat',
      inProgress: 'În desfășurare',
      completed: 'Finalizat',
      cancelled: 'Anulat',
    },
    hu: {
      viewDetails: 'Részletek',
      noProjects: 'Nincsenek elérhető projektek.',
      planned: 'Tervezett',
      inProgress: 'Folyamatban',
      completed: 'Befejezett',
      cancelled: 'Törölve',
    },
    en: {
      viewDetails: 'View details',
      noProjects: 'No projects available.',
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

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('programRegionalNordVest') }
      ]} />
      <PageHeader titleKey="programRegionalNordVest" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Intro Section */}
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                {tp('description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.nord-vest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  www.nord-vest.ro
                </a>
                <a 
                  href="https://www.regionordvest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  www.regionordvest.ro
                </a>
              </div>
            </div>

            {/* Projects List */}
            {projectsList.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsList.map((project) => (
                  <Link key={project.id} href={`/programe/program-regional-nord-vest/${project.slug}`}>
                    <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          {project.featured_image ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={project.featured_image}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                              <Euro className="w-6 h-6 text-primary-700" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColors[project.status] || statusColors.planificat}`}>
                                {statusLabels[project.status] || labels.planned}
                              </span>
                            </div>
                            <CardTitle className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                              {project.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {project.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex items-center justify-end text-primary-600 text-sm font-medium">
                          <span>{labels.viewDetails}</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noProjects}
              </div>
            )}

            {/* Funding Notice */}
            <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800 mb-4">
                {tp('fundedBy')}
              </p>
              <p className="text-lg font-semibold text-blue-900">
                {tp('investInFuture')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
