import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('statutUat') };
}

export default function StatutPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('statutUat') }
      ]} />
      <PageHeader titleKey="statutUat" icon="fileText" />
      <ComingSoon pageName="Statutul UAT" />
    </>
  );
}

