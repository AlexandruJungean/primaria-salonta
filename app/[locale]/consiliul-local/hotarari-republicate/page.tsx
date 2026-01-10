import { getTranslations } from 'next-intl/server';
import { FileText, Download, Calendar, Search, Paperclip } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolderWithAnnexes } from '@/lib/supabase/services/documents';
import type { DocumentWithAnnexes } from '@/lib/types/database';

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
              <div className="space-y-8">
                {sortedYears.map((year) => (
                  <div key={year}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {labels.yearLabel} {year}
                      </h2>
                      <span className="text-sm text-gray-500">
                        ({groupedByYear[year].length} {groupedByYear[year].length === 1 ? labels.document : labels.documents})
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {groupedByYear[year].map((decision) => (
                        <Card key={decision.id} className="hover:shadow-md transition-shadow overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-amber-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm">
                                    {decision.title}
                                  </h3>
                                  {decision.description && (
                                    <p className="text-sm text-gray-500 mt-1">{decision.description}</p>
                                  )}
                                </div>
                              </div>
                              <a
                                href={decision.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                              </a>
                            </div>
                          </CardContent>
                          
                          {/* Annexes section */}
                          {decision.annexes && decision.annexes.length > 0 && (
                            <div className="border-t border-gray-100 bg-amber-50/50 px-4 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Paperclip className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-medium text-amber-700">
                                  {labels.annexes} ({decision.annexes.length})
                                </span>
                              </div>
                              <div className="space-y-1.5 ml-6">
                                {decision.annexes.map((annex) => (
                                  <a
                                    key={annex.id}
                                    href={annex.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors group"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-600" />
                                    <span className="flex-1 truncate">{annex.title}</span>
                                    <Download className="w-3 h-3 text-gray-400 group-hover:text-amber-600" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
