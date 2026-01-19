import { getTranslations } from 'next-intl/server';
import { HardHat, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getPageContentArray } from '@/lib/supabase/services/page-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'receptieLucrari',
    locale: locale as Locale,
    path: '/informatii-publice/receptie-lucrari',
  });
}

export default async function ReceptieLucrariPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch content from database
  const allContent = await getPageContentArray('receptie-lucrari');
  
  // Group content by content_key prefix
  const section1Title = allContent.find(c => c.content_key === 'section1_title')?.content || 'Documentație necesară pentru realizarea recepției la terminarea lucrărilor';
  const section1Items = allContent
    .filter(c => c.content_key.startsWith('section1_item_') && c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  
  const section2Intro = allContent.find(c => c.content_key === 'section2_intro')?.content || '';
  const section2Items = allContent
    .filter(c => c.content_key.startsWith('section2_item_') && c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('receptieLucrari') }
      ]} />
      <PageHeader titleKey="receptieLucrari" icon="hardHat" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Section 1 - Initial Documents */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">{section1Title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {section1Items.length > 0 ? (
                  <div className="space-y-3">
                    {section1Items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-gray-700">{item.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nu există documente configurate.</p>
                )}
              </CardContent>
            </Card>

            {/* Section 2 - On-Site Documents */}
            {(section2Intro || section2Items.length > 0) && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Documente pentru teren</CardTitle>
                      {section2Intro && (
                        <p className="text-sm text-gray-600 mt-2">{section2Intro}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {section2Items.length > 0 ? (
                    <div className="space-y-3">
                      {section2Items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-gray-700">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Nu există documente configurate.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Empty state when no content */}
            {section1Items.length === 0 && section2Items.length === 0 && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">Conținut în curs de actualizare</h3>
                      <p className="text-amber-800 text-sm">
                        Informațiile pentru această pagină sunt în curs de configurare.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
