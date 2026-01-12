import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { DeclarationsYearList } from '@/components/pages/declarations-year-list';
import { getAssetDeclarations } from '@/lib/supabase/services';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'declaratiiAvere',
    locale: locale as Locale,
    path: '/consiliul-local/declaratii-avere',
  });
}

export default async function DeclaratiiAverePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('navigation');
  const td = await getTranslations('declaratiiPage');

  // Fetch declarations only for council members (consiliul_local department)
  const { data: declarations } = await getAssetDeclarations({ 
    limit: 500,
    department: 'consiliul_local'
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('declaratiiAvere') }
      ]} />
      <PageHeader titleKey="declaratiiAvere" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {td('description')}
            </p>

            <DeclarationsYearList declarations={declarations} />
          </div>
        </Container>
      </Section>
    </>
  );
}
