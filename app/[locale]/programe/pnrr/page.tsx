import { getTranslations } from 'next-intl/server';
import { Euro, Download, FileText, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as programs from '@/lib/supabase/services/programs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'pnrr',
    locale: locale as Locale,
    path: '/programe/pnrr',
  });
}

export default async function PnrrPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'pnrrPage' });

  // Fetch PNRR projects from database
  const { data: pnrrProjects } = await programs.getPrograms({ programType: 'pnrr', limit: 100 });

  const pageLabels = {
    ro: {
      noProjects: 'Nu există proiecte PNRR disponibile.',
      download: 'Descarcă',
      fundedBy: 'Finanțat de Uniunea Europeană – Next Generation EU',
      description: 'Proiecte finanțate prin Planul Național de Redresare și Reziliență (PNRR) implementate de Primăria Municipiului Salonta.',
    },
    hu: {
      noProjects: 'Nincsenek elérhető PNRR projektek.',
      download: 'Letöltés',
      fundedBy: 'Az Európai Unió – Next Generation EU finanszírozásával',
      description: 'A Nemzeti Helyreállítási és Reziliencia Terv (PNRR) keretében finanszírozott projektek, amelyeket Nagyszalonta Polgármesteri Hivatala valósít meg.',
    },
    en: {
      noProjects: 'No PNRR projects available.',
      download: 'Download',
      fundedBy: 'Funded by the European Union – Next Generation EU',
      description: 'Projects funded through the National Recovery and Resilience Plan (PNRR) implemented by Salonta City Hall.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('pnrr') }
      ]} />
      <PageHeader titleKey="pnrr" icon="euro" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-4">
                {labels.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://www.pnrr.gov.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  www.pnrr.gov.ro
                </a>
              </div>
            </div>

            {/* EU Funding Notice */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <Euro className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{labels.fundedBy}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Planul Național de Redresare și Reziliență
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects List */}
            {pnrrProjects.length > 0 ? (
              <div className="space-y-4">
                {pnrrProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-primary-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          )}
                          {project.documents && project.documents.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.documents.map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  {doc.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
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
