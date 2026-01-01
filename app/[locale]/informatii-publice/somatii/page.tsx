import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { SomatiiCollapsibleYears } from './collapsible-years';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('somatii') };
}

export default function SomatiiPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('somatiiPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('somatii') }
      ]} />
      <PageHeader titleKey="somatii" icon="alertCircle" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{tPage('infoTitle')}</h2>
                    <p className="text-gray-700 text-sm">{tPage('infoText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Years */}
            <SomatiiCollapsibleYears />

            {/* Footer Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 text-sm">{tPage('footerText')}</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
