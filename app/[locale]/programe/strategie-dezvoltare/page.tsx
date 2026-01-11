import { getTranslations } from 'next-intl/server';
import { FileText, Download } from 'lucide-react';
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
    pageKey: 'strategieDezvoltare',
    locale: locale as Locale,
    path: '/programe/strategie-dezvoltare',
  });
}

export default async function StrategieDezvoltarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'strategieDezvoltarePage' });

  // Fetch strategy documents from database
  // Documents are stored with source_folder from migration
  const strategyDocs = await documents.getDocumentsBySourceFolder('strategia-de-dezvoltare-a-municipiului-salonta');

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

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('strategieDezvoltare') }
      ]} />
      <PageHeader titleKey="strategieDezvoltare" icon="trendingUp" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {strategyDocs.length > 0 ? (
              <div className="space-y-4">
                {strategyDocs.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-primary-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 leading-tight">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
                        >
                          <Download className="w-4 h-4" />
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
