import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Map } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('planuriUrbanistice') };
}

export default function PlanuriUrbanisticePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('planuriUrbanistice') }
      ]} />
      <PageHeader titleKey="planuriUrbanistice" icon="map" />
      <ComingSoon pageName="Planuri urbanistice" />
    </>
  );
}

