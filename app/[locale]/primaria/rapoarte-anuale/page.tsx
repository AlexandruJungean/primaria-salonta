import { getTranslations } from 'next-intl/server';
import { BarChart3, Download, FileText, AlertCircle } from 'lucide-react';
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
    pageKey: 'rapoarteAnuale',
    locale: locale as Locale,
    path: '/primaria/rapoarte-anuale',
  });
}

export default async function RapoarteAnualePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tr = await getTranslations({ locale, namespace: 'rapoarteAnualePage' });

  // Fetch reports from database - documents from altele/rapoarte-anuale-ale-primarului
  const reports = await documents.getDocumentsBySourceFolder('rapoarte-anuale-ale-primarului');

  // Sort by year descending
  const sortedReports = [...reports].sort((a, b) => (b.year || 0) - (a.year || 0));

  const pageLabels = {
    ro: {
      noReports: 'Nu există rapoarte anuale disponibile.',
      download: 'Descarcă',
    },
    hu: {
      noReports: 'Nincsenek elérhető éves jelentések.',
      download: 'Letöltés',
    },
    en: {
      noReports: 'No annual reports available.',
      download: 'Download',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('rapoarteAnuale') }
      ]} />
      <PageHeader titleKey="rapoarteAnuale" icon="barChart3" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            
            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{tr('subtitle')}</h2>
                    <p className="text-sm text-gray-500">{tr('description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            {sortedReports.length > 0 ? (
              <div className="space-y-3">
                {sortedReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {report.title}
                          </span>
                        </div>
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                    <p className="text-gray-700">{labels.noReports}</p>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </Container>
      </Section>
    </>
  );
}
