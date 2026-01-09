import { getTranslations } from 'next-intl/server';
import { Users, Download, FileText, Calendar } from 'lucide-react';
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
    pageKey: 'publicatiiCasatorie',
    locale: locale as Locale,
    path: '/informatii-publice/publicatii-casatorie',
  });
}

export default async function PublicatiiCasatoriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'publicatiiCasatoriePage' });

  // Fetch documents from database
  const allDocs = await documents.getDocumentsByCategory('publicatii_casatorie');

  // Group by year
  const docsByYear = new Map<number, typeof allDocs>();
  allDocs.forEach(doc => {
    const year = doc.year || 2025;
    if (!docsByYear.has(year)) {
      docsByYear.set(year, []);
    }
    docsByYear.get(year)!.push(doc);
  });

  // Sort years descending
  const years = Array.from(docsByYear.keys()).sort((a, b) => b - a);

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există publicații disponibile.',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető hirdetmények.',
    },
    en: {
      noDocuments: 'No publications available.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('publicatiiCasatorie') }
      ]} />
      <PageHeader titleKey="publicatiiCasatorie" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-primary-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publications by Year */}
            {years.length > 0 ? (
              years.map(year => {
                const yearDocs = docsByYear.get(year) || [];
                return (
                  <div key={year} className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{year}</h2>
                      <span className="text-sm text-gray-500">({yearDocs.length} {tPage('publications')})</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {yearDocs.map((pub) => (
                        <a
                          key={pub.id}
                          href={pub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors group"
                        >
                          <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{pub.title}</span>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                {labels.noDocuments}
              </div>
            )}

            {/* Info Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('noteTitle')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('noteText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
