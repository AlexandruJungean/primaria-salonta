import { getTranslations } from 'next-intl/server';
import { Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { SomatiiCollapsibleYears } from './collapsible-years';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'somatii',
    locale: locale as Locale,
    path: '/informatii-publice/somatii',
  });
}

export default async function SomatiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'somatiiPage' });

  // Fetch documents from database
  const allDocs = await documents.getDocumentsByCategory('somatii');

  // Group by year
  const docsByYear = new Map<number, typeof allDocs>();
  allDocs.forEach(doc => {
    const year = doc.year || 2025;
    if (!docsByYear.has(year)) {
      docsByYear.set(year, []);
    }
    docsByYear.get(year)!.push(doc);
  });

  // Sort years descending and prepare data for client component
  const years = Array.from(docsByYear.keys()).sort((a, b) => b - a);
  const yearSections = years.map(year => ({
    year: year.toString(),
    announcements: (docsByYear.get(year) || []).map(doc => ({
      id: doc.id,
      title: doc.title,
      date: doc.document_date 
        ? new Date(doc.document_date).toLocaleDateString(locale)
        : '',
      pdfUrl: doc.file_url,
    })),
  }));

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există somații sau anunțuri disponibile.',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető felszólítások vagy hirdetmények.',
    },
    en: {
      noDocuments: 'No summons or announcements available.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('somatii') }
      ]} />
      <PageHeader titleKey="somatii" icon="alertCircle" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{tPage('infoTitle')}</h2>
                    <p className="text-gray-700 text-sm">{tPage('infoText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Years */}
            {yearSections.length > 0 ? (
              <SomatiiCollapsibleYears yearSections={yearSections} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {labels.noDocuments}
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 text-sm">{tPage('footerText')}</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
