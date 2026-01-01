import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Info, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { FormulareCollapsibleCategories } from './collapsible-categories';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('formulare') };
}

export default function FormularePage() {
  const t = useTranslations('navigation');
  const tf = useTranslations('formularePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('formulare') }
      ]} />
      <PageHeader titleKey="formulare" icon="clipboardList" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Info card */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">{tf('intro')}</p>
                    <Link 
                      href="#" 
                      target="_blank"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {tf('metodologie')}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Categories */}
            <FormulareCollapsibleCategories />

          </div>
        </Container>
      </Section>
    </>
  );
}
