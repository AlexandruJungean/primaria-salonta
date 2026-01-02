import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Info, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'solicitareInformatii',
    locale: locale as Locale,
    path: '/informatii-publice/solicitare-informatii',
  });
}

export default function SolicitareInformatiiPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('solicitareInformatiiPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('solicitareInformatii') }
      ]} />
      <PageHeader titleKey="solicitareInformatii" icon="fileQuestion" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{tPage('infoTitle')}</h2>
                    <p className="text-gray-700 text-sm">{tPage('infoText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Document */}
            <Card hover>
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tPage('formTitle')}</h3>
                    <p className="text-sm text-gray-500">{tPage('formDescription')}</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors shrink-0 ml-4"
                >
                  <Download className="w-4 h-4 text-primary-600" />
                  PDF
                </a>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
