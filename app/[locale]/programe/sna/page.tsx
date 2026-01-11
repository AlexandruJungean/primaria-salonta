import { getTranslations } from 'next-intl/server';
import { Shield, Download, FileText } from 'lucide-react';
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
    pageKey: 'sna',
    locale: locale as Locale,
    path: '/programe/sna',
  });
}

export default async function SnaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'snaPage' });

  // Fetch SNA documents from database
  // Documents are stored with source_folder from migration (altele/planul-sectorial-sna)
  const snaDocs = await documents.getDocumentsBySourceFolder('planul-sectorial-sna');

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente disponibile.',
      download: 'Descarcă',
      description: 'Documente și rapoarte aferente implementării Strategiei Naționale Anticorupție la nivelul Primăriei Municipiului Salonta.',
      otherDocs: 'Alte documente',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      download: 'Letöltés',
      description: 'A Nemzeti Antikorrupciós Stratégia végrehajtásával kapcsolatos dokumentumok és jelentések Nagyszalonta Polgármesteri Hivatalánál.',
      otherDocs: 'Egyéb dokumentumok',
    },
    en: {
      noDocuments: 'No documents available.',
      download: 'Download',
      description: 'Documents and reports related to the implementation of the National Anti-Corruption Strategy at Salonta City Hall.',
      otherDocs: 'Other documents',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Group documents by period (description field)
  const periodsMap = new Map<string, typeof snaDocs>();
  snaDocs.forEach(doc => {
    const period = doc.description || labels.otherDocs;
    if (!periodsMap.has(period)) {
      periodsMap.set(period, []);
    }
    periodsMap.get(period)!.push(doc);
  });

  // Convert to array and sort (2021-2025 first, then 2016-2020, then others)
  const periods = Array.from(periodsMap.entries()).sort((a, b) => {
    // Extract years from period names for sorting
    const getYear = (str: string) => {
      const match = str.match(/202\d/);
      return match ? parseInt(match[0]) : 0;
    };
    return getYear(b[0]) - getYear(a[0]);
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('sna') }
      ]} />
      <PageHeader titleKey="sna" icon="shield" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {/* Periods List */}
            {periods.length > 0 ? (
              <div className="space-y-6">
                {periods.map(([periodName, docs]) => (
                  <Card key={periodName} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Period Header */}
                      <div className="p-4 bg-red-50 border-b border-red-100">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-red-700 shrink-0" />
                          <h3 className="font-semibold text-gray-900">
                            {periodName}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Period Documents */}
                      <div className="divide-y">
                        {docs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {doc.title}
                              </span>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              PDF
                            </a>
                          </div>
                        ))}
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
