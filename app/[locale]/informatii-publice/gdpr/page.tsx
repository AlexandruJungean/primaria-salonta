import { getTranslations } from 'next-intl/server';
import { ShieldCheck, FileText, Download, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'gdpr',
    locale: locale as Locale,
    path: '/informatii-publice/gdpr',
  });
}

export default async function GdprPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'gdprPage' });

  // Fetch GDPR documents from database
  const gdprDocs = await documents.getDocumentsByCategory('gdpr');

  // Separate documents into official documents and forms based on title
  // Forms are identified by "cerere" in the title (Romanian for "request")
  const officialDocuments = gdprDocs.filter(
    doc => !doc.title.toLowerCase().includes('cerere')
  );
  const gdprForms = gdprDocs.filter(
    doc => doc.title.toLowerCase().includes('cerere')
  );

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente disponibile.',
      noForms: 'Nu există formulare disponibile.',
      download: 'PDF',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      noForms: 'Nincsenek elérhető űrlapok.',
      download: 'PDF',
    },
    en: {
      noDocuments: 'No documents available.',
      noForms: 'No forms available.',
      download: 'PDF',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('gdpr') }
      ]} />
      <PageHeader titleKey="gdpr" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-emerald-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('documentsTitle')}</h2>
              </div>

              {officialDocuments.length > 0 ? (
                <div className="space-y-3">
                  {officialDocuments.map((doc) => (
                    <Card key={doc.id} hover>
                      <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors shrink-0 ml-4"
                        >
                          <Download className="w-4 h-4 text-emerald-600" />
                          {labels.download}
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {labels.noDocuments}
                </div>
              )}
            </div>

            {/* Forms Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  {tPage('formsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gdprForms.length > 0 ? (
                  <div className="space-y-2">
                    {gdprForms.map((form) => (
                      <div 
                        key={form.id}
                        className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700">{form.title}</span>
                        </div>
                        <a
                          href={form.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded text-xs font-medium shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          {labels.download}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {labels.noForms}
                  </div>
                )}
              </CardContent>
            </Card>

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
