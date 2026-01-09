import { getTranslations } from 'next-intl/server';
import { HardHat, FileText, MapPin, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

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
  const tPage = await getTranslations({ locale, namespace: 'receptieLucrariPage' });

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
            {/* Info Banner */}
            <Card className="mb-8 bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <HardHat className="w-8 h-8 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-amber-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Initial Documents Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tPage('initialDocsTitle')}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{tPage('initialDocsDesc')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">{tPage('doc1Title')}</h4>
                      <p className="text-sm text-gray-600 mt-1">{tPage('doc1Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">{tPage('doc2')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* On-Site Documents Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tPage('onSiteDocsTitle')}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{tPage('onSiteDocsDesc')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    tPage('siteDoc1'),
                    tPage('siteDoc2'),
                    tPage('siteDoc3'),
                    tPage('siteDoc4'),
                    tPage('siteDoc5'),
                    tPage('siteDoc6'),
                  ].map((doc, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-gray-700">{doc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Note */}
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
