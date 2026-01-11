import { getTranslations } from 'next-intl/server';
import { FileText, Download, BookOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'regulamentOrganizare',
    locale: locale as Locale,
    path: '/primaria/regulament',
  });
}

export default async function RegulamentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tr = await getTranslations({ locale, namespace: 'regulamentPage' });

  // Fetch documents from database
  const regulamentDocs = await documents.getDocumentsBySourceFolder('regulament-de-organizare-si-functionare', 50);

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente disponibile.',
      download: 'Descarcă',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      download: 'Letöltés',
    },
    en: {
      noDocuments: 'No documents available.',
      download: 'Download',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Get file extension for display
  const getFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    return 'PDF';
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('regulament') }
      ]} />
      <PageHeader titleKey="regulament" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            
            {/* Section Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{tr('title')}</h2>
                    <p className="text-sm text-gray-500">{tr('subtitle')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            {regulamentDocs.length > 0 ? (
              <div className="space-y-3">
                {regulamentDocs.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4 gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900 text-sm leading-snug">{doc.title}</span>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          {getFileType(doc.file_name)}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                {labels.noDocuments}
              </div>
            )}

            {/* Info Note */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                {tr('infoNote')}
              </p>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
