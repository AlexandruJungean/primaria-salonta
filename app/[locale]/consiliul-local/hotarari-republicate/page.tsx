import { getTranslations } from 'next-intl/server';
import { FileText, Download, Calendar } from 'lucide-react';
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
    pageKey: 'hotarariRepublicate',
    locale: locale as Locale,
    path: '/consiliul-local/hotarari-republicate',
  });
}

export default async function HotarariRepublicatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch republished decisions from database
  const republishedDecisions = await documents.getDocumentsByCategory('hotarari_republicate', 100);

  const pageLabels = {
    ro: {
      description: 'Hotărârile Consiliului Local al Municipiului Salonta care au fost republicate sau rectificate.',
      noDecisions: 'Nu există hotărâri republicate disponibile.',
      download: 'Descarcă',
      decision: 'Hotărârea nr.',
    },
    hu: {
      description: 'Nagyszalonta Helyi Tanácsának újra közzétett vagy helyesbített határozatai.',
      noDecisions: 'Nincsenek elérhető újra közzétett határozatok.',
      download: 'Letöltés',
      decision: 'Határozat sz.',
    },
    en: {
      description: 'Decisions of the Local Council of Salonta Municipality that have been republished or rectified.',
      noDecisions: 'No republished decisions available.',
      download: 'Download',
      decision: 'Decision no.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('hotarariRepublicate') }
      ]} />
      <PageHeader titleKey="hotarariRepublicate" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {republishedDecisions.length > 0 ? (
              <div className="space-y-4">
                {republishedDecisions.map((decision) => (
                  <Card key={decision.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-primary-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {decision.title}
                            </h3>
                            {decision.document_date && (
                              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(decision.document_date)}
                              </p>
                            )}
                            {decision.description && (
                              <p className="text-sm text-gray-600 mt-2">{decision.description}</p>
                            )}
                          </div>
                        </div>
                        <a
                          href={decision.file_url}
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
                {labels.noDecisions}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
