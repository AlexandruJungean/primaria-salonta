import { getTranslations } from 'next-intl/server';
import { Wallet, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { BudgetContent } from './budget-content';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'buget',
    locale: locale as Locale,
    path: '/informatii-publice/buget',
  });
}

export default async function BugetPage() {
  const t = await getTranslations('navigation');
  const tPage = await getTranslations('bugetPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('buget') }
      ]} />
      <PageHeader titleKey="buget" icon="wallet" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Wallet className="w-8 h-8 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-primary-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Content (Client Component) */}
            <BudgetContent />

            {/* Info Note */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
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
