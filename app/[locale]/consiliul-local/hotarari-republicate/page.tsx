import { getTranslations } from 'next-intl/server';
import { FileText, Calendar, Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolderWithAnnexes } from '@/lib/supabase/services/documents';
import type { DocumentWithAnnexes } from '@/lib/types/database';
import { HotarariByYear } from './hotarari-by-year';

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

  // Fetch republished decisions from database by source folder (with annexes)
  const allDecisions = await getDocumentsBySourceFolderWithAnnexes('hotarari-republicate', 200);
  
  // Sort by year descending (use doc.year from database)
  const republishedDecisions = [...allDecisions].sort((a, b) => {
    const yearA = a.year || 2020;
    const yearB = b.year || 2020;
    return yearB - yearA;
  });
  
  // Group by year for display
  const groupedByYear = republishedDecisions.reduce((acc, doc) => {
    const year = doc.year || 2020;
    if (!acc[year]) acc[year] = [];
    acc[year].push(doc);
    return acc;
  }, {} as Record<number, DocumentWithAnnexes[]>);
  
  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  const pageLabels = {
    ro: {
      description: 'Hotărârile Consiliului Local al Municipiului Salonta care au fost republicate sau rectificate.',
      noDecisions: 'Nu există hotărâri republicate disponibile.',
      download: 'Descarcă',
      decision: 'Hotărârea nr.',
      yearLabel: 'Anul',
      totalDocuments: 'hotărâri republicate',
      years: 'ani',
      document: 'hotărâre',
      documents: 'hotărâri',
      annexes: 'Anexe',
    },
    hu: {
      description: 'Nagyszalonta Helyi Tanácsának újra közzétett vagy helyesbített határozatai.',
      noDecisions: 'Nincsenek elérhető újra közzétett határozatok.',
      download: 'Letöltés',
      decision: 'Határozat sz.',
      yearLabel: 'Év',
      totalDocuments: 'újra közzétett határozat',
      years: 'év',
      document: 'határozat',
      documents: 'határozat',
      annexes: 'Mellékletek',
    },
    en: {
      description: 'Decisions of the Local Council of Salonta Municipality that have been republished or rectified.',
      noDecisions: 'No republished decisions available.',
      download: 'Download',
      decision: 'Decision no.',
      yearLabel: 'Year',
      totalDocuments: 'republished decisions',
      years: 'years',
      document: 'decision',
      documents: 'decisions',
      annexes: 'Annexes',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

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

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <span className="text-gray-600">{republishedDecisions.length} {labels.totalDocuments}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="text-gray-600">{sortedYears.length} {labels.years}</span>
              </div>
            </div>

            {republishedDecisions.length > 0 ? (
              <HotarariByYear
                groupedByYear={groupedByYear}
                sortedYears={sortedYears}
                labels={{
                  yearLabel: labels.yearLabel,
                  document: labels.document,
                  documents: labels.documents,
                  annexes: labels.annexes,
                }}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                {labels.noDecisions}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
