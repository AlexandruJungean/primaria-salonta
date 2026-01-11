import { getTranslations } from 'next-intl/server';
import { Download, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ImageGallery } from '@/components/ui/image-gallery';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as europeanProjects from '@/lib/supabase/services/european-projects';
import * as pageImages from '@/lib/supabase/services/page-images';
import * as documents from '@/lib/supabase/services/documents';
import { ProjectAccordion } from './project-accordion';

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
  const allProjects = await europeanProjects.getProjects();
  
  // Fetch images for the page
  const images = await pageImages.getPageImages('proiecte-europene');
  
  // Fetch documents from source folder (migrated documents)
  const migratedDocs = await documents.getDocumentsBySourceFolder('proiecte-realizate-si-in-derulare');
  
  // Group documents by project slug (stored in description field)
  const documentsByProject = migratedDocs.reduce((acc, doc) => {
    const projectSlug = doc.description || 'other';
    if (!acc[projectSlug]) {
      acc[projectSlug] = [];
    }
    acc[projectSlug].push(doc);
    return acc;
  }, {} as Record<string, typeof migratedDocs>);
  
  // Separate active and completed projects
  const activeProjects = allProjects.filter(p => p.status === 'in_desfasurare' || p.status === 'planificat');
  const completedProjects = allProjects.filter(p => p.status === 'finalizat');
  
  // Get uncategorized documents
  const uncategorizedDocs = documentsByProject['other'] || [];

  const pageLabels = {
    ro: {
      activeTitle: 'Proiecte în derulare',
      completedTitle: 'Proiecte finalizate',
      noProjects: 'Nu există proiecte disponibile.',
      active: 'În desfășurare',
      completed: 'Finalizat',
      planned: 'Planificat',
      download: 'Descarcă',
      gallery: 'Galerie foto',
      documents: 'Documente',
      otherDocs: 'Alte documente',
      showDocs: 'Vezi documente',
    },
    hu: {
      activeTitle: 'Folyamatban lévő projektek',
      completedTitle: 'Befejezett projektek',
      noProjects: 'Nincsenek elérhető projektek.',
      active: 'Folyamatban',
      completed: 'Befejezett',
      planned: 'Tervezett',
      download: 'Letöltés',
      gallery: 'Fotógaléria',
      documents: 'Dokumentumok',
      otherDocs: 'Egyéb dokumentumok',
      showDocs: 'Dokumentumok megtekintése',
    },
    en: {
      activeTitle: 'Active projects',
      completedTitle: 'Completed projects',
      noProjects: 'No projects available.',
      active: 'In progress',
      completed: 'Completed',
      planned: 'Planned',
      download: 'Download',
      gallery: 'Photo gallery',
      documents: 'Documents',
      otherDocs: 'Other documents',
      showDocs: 'View documents',
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

  // Prepare project data with documents for accordion
  const projectsWithDocs = allProjects.map(project => ({
    ...project,
    documents: documentsByProject[project.slug] || [],
    statusColor: statusColors[project.status] || statusColors.planificat,
    statusLabel: statusLabels[project.status] || labels.planned,
  }));

  const activeProjectsWithDocs = projectsWithDocs.filter(p => p.status === 'in_desfasurare' || p.status === 'planificat');
  const completedProjectsWithDocs = projectsWithDocs.filter(p => p.status === 'finalizat');

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
              <p className="text-gray-600">
                {tp('description')}
              </p>
            </div>

            {/* Active Projects with Accordion */}
            {activeProjectsWithDocs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  {labels.activeTitle}
                </h2>
                <ProjectAccordion 
                  projects={activeProjectsWithDocs} 
                  showDocsLabel={labels.showDocs}
                />
              </div>
            )}

            {/* Completed Projects with Accordion */}
            {completedProjectsWithDocs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  {labels.completedTitle}
                </h2>
                <ProjectAccordion 
                  projects={completedProjectsWithDocs}
                  showDocsLabel={labels.showDocs}
                />
              </div>
            )}

            {/* Empty state */}
            {allProjects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {labels.noProjects}
              </div>
            )}

            {/* Uncategorized Documents */}
            {uncategorizedDocs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  {labels.otherDocs}
                </h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {uncategorizedDocs.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4 text-primary-600 shrink-0" />
                          <span className="text-sm text-gray-700 hover:text-primary-600">
                            {doc.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Photo Gallery */}
            {images.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {labels.gallery}
                </h2>
                <ImageGallery images={images} columns={4} />
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
