import { getTranslations } from 'next-intl/server';
import { Map, Download } from 'lucide-react';
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
    pageKey: 'pmud',
    locale: locale as Locale,
    path: '/programe/pmud',
  });
}

export default async function PmudPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'pmudPage' });

  // Fetch PMUD documents from database
  // Documents are stored with source_folder from migration (altele/pmud)
  const pmudDocs = await documents.getDocumentsBySourceFolder('pmud');

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente disponibile.',
      download: 'Descarcă PMUD',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      download: 'PMUD letöltése',
    },
    en: {
      noDocuments: 'No documents available.',
      download: 'Download PMUD',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('pmud') }
      ]} />
      <PageHeader titleKey="pmud" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {pmudDocs.length > 0 ? (
              <div className="space-y-4">
                {pmudDocs.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <Map className="w-7 h-7 text-blue-700" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                        >
                          <Download className="w-5 h-5" />
                          {labels.download}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noDocuments}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
