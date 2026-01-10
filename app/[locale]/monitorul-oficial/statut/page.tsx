import { getTranslations } from 'next-intl/server';
import { FileText, Download, Calendar, FileWarning } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolder } from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'statut',
    locale: locale as Locale,
    path: '/monitorul-oficial/statut',
  });
}

/**
 * Extract year from document title
 * e.g. "Statutul Municipiului Salonta – 2021" => 2021
 */
function extractYearFromTitle(title: string): number | null {
  const match = title.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

export default async function StatutPage() {
  const t = await getTranslations('navigation');
  const ts = await getTranslations('statutPage');
  
  // Fetch statute documents from database
  const documents = await getDocumentsBySourceFolder('statutul-unitatii-administrativ-teritoriale');
  
  // Sort by year descending (newest first)
  const sortedDocuments = [...documents].sort((a, b) => {
    const yearA = a.year || extractYearFromTitle(a.title) || 0;
    const yearB = b.year || extractYearFromTitle(b.title) || 0;
    return yearB - yearA;
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('statutUat') }
      ]} />
      <PageHeader titleKey="statutUat" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {sortedDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileWarning className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">{ts('noDocuments')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedDocuments.map((doc) => {
                  const year = doc.year || extractYearFromTitle(doc.title);
                  
                  return (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6 text-primary-700" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {doc.title}
                              </h3>
                              {year && (
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <Calendar className="w-4 h-4" />
                                  {year}
                                </p>
                              )}
                            </div>
                          </div>
                          <Link
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            {ts('download')}
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
