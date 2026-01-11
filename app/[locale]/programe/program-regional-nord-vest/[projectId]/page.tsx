import { getTranslations } from 'next-intl/server';
import { 
  ExternalLink,
  ArrowLeft,
  Download,
  FileText,
  Euro,
  Target,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as regionalProjects from '@/lib/supabase/services/regional-projects';
import { ProjectUpdatesAccordion } from './project-updates-accordion';
import Image from 'next/image';

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ locale: string; projectId: string }> }) {
  const { locale, projectId } = await params;
  const project = await regionalProjects.getProjectBySlug(projectId);
  
  if (!project) {
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
    customTitle: project.title,
    customDescription: project.short_description || undefined,
  });
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  const slugs = await regionalProjects.getAllProjectSlugs();
  return slugs.map(slug => ({ projectId: slug }));
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

  const project = await regionalProjects.getProjectBySlug(projectId);

  if (!project) {
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
                Înapoi la proiecte
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
      documents: 'Documente proiect',
      description: 'Descriere',
      projectUpdates: 'Stadiul proiectului',
    },
    hu: {
      backToProjects: 'Vissza a projektekhez',
      documents: 'Projekt dokumentumok',
      description: 'Leírás',
      projectUpdates: 'Projekt állapota',
    },
    en: {
      backToProjects: 'Back to projects',
      documents: 'Project documents',
      description: 'Description',
      projectUpdates: 'Project status',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('programRegionalNordVest'), href: '/programe/program-regional-nord-vest' },
        { label: project.title }
      ]} />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Program Logos */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-ue-cofinantat.webp"
                alt="Cofinanțat de Uniunea Europeană"
                width={200}
                height={42}
                className="h-10 w-auto"
              />
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-guvern.webp"
                alt="Guvernul României"
                width={64}
                height={64}
                className="h-14 w-auto"
              />
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-regio-2021-2027.webp"
                alt="Logo Regio Nord-Vest 2021-2027"
                width={64}
                height={64}
                className="h-14 w-auto"
              />
              <Image
                src="https://klvtfdutlbdawsltraee.supabase.co/storage/v1/object/public/photos/programe/program-regional/logo-pfp.webp"
                alt="Planul Financiar Plurianual"
                width={150}
                height={84}
                className="h-16 w-auto"
              />
            </div>

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
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <Euro className="w-7 h-7 text-primary-700" />
                  </div>
                  <div>
                    {project.smis_code && (
                      <span className="text-xs font-mono text-gray-500 mb-2 block">
                        SMIS {project.smis_code}
                      </span>
                    )}
                    <CardTitle className="text-xl font-bold text-gray-900 leading-snug">
                      {project.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            {project.full_description && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-600" />
                    {labels.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{project.full_description}</p>
                  
                  {(project.objective || project.specific_objective) && (
                    <div className="mt-4 space-y-2">
                      {project.objective && (
                        <p className="text-sm text-gray-600">
                          <strong>Obiectiv:</strong> {project.objective}
                        </p>
                      )}
                      {project.specific_objective && (
                        <p className="text-sm text-gray-600">
                          <strong>Obiectiv specific:</strong> {project.specific_objective}
                        </p>
                      )}
                      {project.call_title && (
                        <p className="text-sm text-gray-600">
                          <strong>Apel:</strong> {project.call_title}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{labels.documents}</h3>
                  </div>
                  <div className="space-y-2">
                    {project.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-primary-600" />
                        <span className="flex-1 text-gray-700">{doc.title}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Updates (Monthly Status) - Collapsible with Images */}
            {project.updates && project.updates.length > 0 && (
              <ProjectUpdatesAccordion 
                updates={project.updates} 
                title={labels.projectUpdates}
              />
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
