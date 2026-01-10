import { getTranslations } from 'next-intl/server';
import { FileText, Download, Building2, FileWarning, ExternalLink, ScrollText } from 'lucide-react';
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
    pageKey: 'regulamente',
    locale: locale as Locale,
    path: '/monitorul-oficial/regulamente',
  });
}

/**
 * Get file extension label for download button
 */
function getDownloadLabel(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'doc' || ext === 'docx') return 'DOC';
  return 'PDF';
}

export default async function RegulamentePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tr = await getTranslations({ locale, namespace: 'regulamentePage' });

  // Fetch main regulations (ROF, etc.) from source folder - only these 3 documents
  const mainRegulations = await getDocumentsBySourceFolder('regulamentele-privind-procedurile-administrative');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('regulamente') }
      ]} />
      <PageHeader titleKey="regulamente" icon="scale" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Link către pagina completă de regulamente - PRIMUL */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-200 flex items-center justify-center shrink-0">
                      <ScrollText className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900">{tr('viewAllTitle')}</h3>
                      <p className="text-sm text-primary-700 mt-1">{tr('viewAllDescription')}</p>
                    </div>
                  </div>
                  <Link
                    href="/informatii-publice/regulamente"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {tr('viewAllButton')}
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Empty state */}
            {mainRegulations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileWarning className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">{tr('noDocuments')}</p>
                </CardContent>
              </Card>
            )}

            {/* Secțiunea principală - ROF-uri */}
            {mainRegulations.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{tr('mainTitle')}</h2>
                    <p className="text-sm text-gray-500">{tr('mainSubtitle')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {mainRegulations.map((doc) => (
                    <Card key={doc.id} className="border-l-4 border-l-primary-600">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-primary-700" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              )}
                            </div>
                          </div>
                          <Link
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shrink-0"
                          >
                            <Download className="w-4 h-4" />
                            {getDownloadLabel(doc.file_name)}
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </Container>
      </Section>
    </>
  );
}
