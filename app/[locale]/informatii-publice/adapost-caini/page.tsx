import { getTranslations } from 'next-intl/server';
import { FileText, Download, Calendar, Dog } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsByCategory } from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'adapostCaini',
    locale: locale as Locale,
    path: '/informatii-publice/adapost-caini',
  });
}

export default async function AdapostCainiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'adapostCainiPage' });

  // Fetch documents from database
  const documents = await getDocumentsByCategory('adapost_caini');

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(
      locale === 'hu' ? 'hu-HU' : locale === 'en' ? 'en-GB' : 'ro-RO',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('adapostCaini') }
      ]} />
      <PageHeader titleKey="adapostCaini" icon="dog" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Description */}
            <p className="text-gray-600 mb-8">{tp('description')}</p>

            {/* Documents Section */}
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <Dog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{tp('noDocuments')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Card key={doc.id} hover>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{doc.title}</h3>
                          {doc.document_date && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(doc.document_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
