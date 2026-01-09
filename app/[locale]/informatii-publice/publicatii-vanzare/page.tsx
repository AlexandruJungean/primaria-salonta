import { getTranslations } from 'next-intl/server';
import { Tag, Calendar, Download, FileText } from 'lucide-react';
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
    pageKey: 'publicatiiVanzare',
    locale: locale as Locale,
    path: '/informatii-publice/publicatii-vanzare',
  });
}

export default async function PublicatiiVanzarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'publicatiiVanzarePage' });

  // Fetch documents from database
  const allDocs = await documents.getDocumentsByCategory('publicatii_vanzare');

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

  // Helper to get file extension label
  const getDownloadLabel = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    return 'PDF';
  };

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
        { label: t('publicatiiVanzare') }
      ]} />
      <PageHeader titleKey="publicatiiVanzare" icon="tag" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Tag className="w-8 h-8 text-slate-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-slate-700 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publications by Year */}
            {years.length > 0 ? (
              years.map((year) => {
                const yearDocs = docsByYear.get(year) || [];
                return (
                  <div key={year} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{year}</h2>
                      <span className="text-sm text-gray-500">({yearDocs.length} {tPage('publications')})</span>
                    </div>

                    <div className="space-y-3">
                      {yearDocs.map((pub) => (
                        <Card key={pub.id} hover>
                          <CardContent className="flex items-center justify-between pt-6">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{pub.title}</h3>
                                {pub.document_date && (
                                  <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(pub.document_date).toLocaleDateString(locale)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={pub.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-slate-400 transition-colors shrink-0 ml-4"
                            >
                              <Download className="w-4 h-4 text-slate-600" />
                              {getDownloadLabel(pub.file_name)}
                            </a>
                          </CardContent>
                        </Card>
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
