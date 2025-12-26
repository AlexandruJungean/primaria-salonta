import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BarChart3 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('rapoarteActivitate') };
}

export default function RapoarteActivitatePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('rapoarteActivitate') }
      ]} />
      <PageHeader titleKey="rapoarteActivitate" icon="barChart3" />
      <ComingSoon pageName="Rapoarte de activitate" />
    </>
  );
}

