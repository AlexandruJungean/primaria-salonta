import { getTranslations } from 'next-intl/server';
import { 
  ExternalLink,
  ArrowRight,
  Euro,
  Building2,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as regionalProjects from '@/lib/supabase/services/regional-projects';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'programRegionalNordVest',
    locale: locale as Locale,
    path: '/programe/program-regional-nord-vest',
  });
}

export default async function ProgramRegionalNordVestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'programRegionalNordVestPage' });

  // Fetch regional projects from database
  const projectsList = await regionalProjects.getProjects();

  const pageLabels = {
    ro: {
      viewDetails: 'Vezi detalii',
      noProjects: 'Nu există proiecte disponibile.',
      projectsInProgress: 'Proiecte în implementare',
    },
    hu: {
      viewDetails: 'Részletek',
      noProjects: 'Nincsenek elérhető projektek.',
      projectsInProgress: 'Folyamatban lévő projektek',
    },
    en: {
      viewDetails: 'View details',
      noProjects: 'No projects available.',
      projectsInProgress: 'Projects in progress',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

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
            {/* Program Logos */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-ue-cofinantat.webp"
                alt="Cofinanțat de Uniunea Europeană"
                width={266}
                height={56}
                className="h-14 w-auto"
              />
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-guvern.webp"
                alt="Guvernul României"
                width={85}
                height={85}
                className="h-20 w-auto"
              />
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-regio-2021-2027.webp"
                alt="Logo Regio Nord-Vest 2021-2027"
                width={85}
                height={85}
                className="h-20 w-auto"
              />
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-pfp.webp"
                alt="Planul Financiar Plurianual"
                width={199}
                height={112}
                className="h-24 w-auto"
              />
            </div>

            {/* Intro Section */}
            <div className="mb-8">
              <p className="text-gray-600 mb-4 text-center">
                {tp('description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
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

            {/* Projects Section */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              {labels.projectsInProgress}
            </h2>

            {/* Projects List */}
            {projectsList.length > 0 ? (
              <div className="space-y-4">
                {projectsList.map((project) => (
                    <Link key={project.id} href={`/programe/program-regional-nord-vest/${project.slug}`}>
                      <Card className="hover:shadow-lg transition-all hover:border-primary-200 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                              <Euro className="w-6 h-6 text-primary-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {project.smis_code && (
                                <span className="text-xs font-mono text-gray-500 mb-1 block">
                                  SMIS {project.smis_code}
                                </span>
                              )}
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {project.title}
                              </h3>
                              {project.short_description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {project.short_description}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
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
            <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <p className="text-sm text-blue-800 mb-4">
                {tp('fundedBy')}
              </p>
              <p className="text-lg font-semibold text-blue-900 mb-4">
                {tp('investInFuture')}
              </p>
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/judete-nord-vest.jpg"
                alt="Județele Nord-Vest"
                width={300}
                height={19}
                className="mx-auto mb-4"
              />
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://www.regionordvest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  www.regionordvest.ro
                </a>
                <a 
                  href="https://www.nord-vest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  www.nord-vest.ro
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
