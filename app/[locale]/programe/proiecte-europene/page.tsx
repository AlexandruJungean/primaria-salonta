import { getTranslations } from 'next-intl/server';
import { Globe, Download, ExternalLink, Euro, CheckCircle2, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as programs from '@/lib/supabase/services/programs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'proiecteEuropene',
    locale: locale as Locale,
    path: '/programe/proiecte-europene',
  });
}

export default async function ProiecteEuropenePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'proiecteEuropenePage' });

  // Fetch European projects from database
  const { data: allProjects } = await programs.getPrograms({ programType: 'european', limit: 100 });
  
  // Separate active and completed projects
  const activeProjects = allProjects.filter(p => p.status === 'in_desfasurare' || p.status === 'planificat');
  const completedProjects = allProjects.filter(p => p.status === 'finalizat');

  const pageLabels = {
    ro: {
      activeTitle: 'Proiecte în derulare',
      completedTitle: 'Proiecte finalizate',
      noProjects: 'Nu există proiecte disponibile.',
      active: 'În desfășurare',
      completed: 'Finalizat',
      planned: 'Planificat',
      download: 'Descarcă',
    },
    hu: {
      activeTitle: 'Folyamatban lévő projektek',
      completedTitle: 'Befejezett projektek',
      noProjects: 'Nincsenek elérhető projektek.',
      active: 'Folyamatban',
      completed: 'Befejezett',
      planned: 'Tervezett',
      download: 'Letöltés',
    },
    en: {
      activeTitle: 'Active projects',
      completedTitle: 'Completed projects',
      noProjects: 'No projects available.',
      active: 'In progress',
      completed: 'Completed',
      planned: 'Planned',
      download: 'Download',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const statusColors: Record<string, string> = {
    planificat: 'bg-blue-100 text-blue-700',
    in_desfasurare: 'bg-amber-100 text-amber-700',
    finalizat: 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    planificat: labels.planned,
    in_desfasurare: labels.active,
    finalizat: labels.completed,
  };

  const ProjectCard = ({ project }: { project: typeof allProjects[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
            <Euro className="w-6 h-6 text-primary-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColors[project.status] || statusColors.planificat}`}>
                {statusLabels[project.status] || labels.planned}
              </span>
            </div>
            <CardTitle className="text-base font-semibold text-gray-900 leading-snug">
              {project.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {project.description && (
          <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        )}
        {project.documents && project.documents.length > 0 && (
          <div className="space-y-2">
            {project.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800"
              >
                <Download className="w-4 h-4" />
                {doc.title}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('proiecteEuropene') }
      ]} />
      <PageHeader titleKey="proiecteEuropene" icon="globe" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-4">
                {tp('description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://www.oportunitati-ue.gov.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  www.oportunitati-ue.gov.ro
                </a>
              </div>
            </div>

            {/* Active Projects */}
            {activeProjects.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  {labels.activeTitle}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {activeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  {labels.completedTitle}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {completedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {allProjects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {labels.noProjects}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
