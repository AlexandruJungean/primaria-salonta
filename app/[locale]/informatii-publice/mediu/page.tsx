import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Leaf } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('mediu') };
}

export default function MediuPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('mediu') }
      ]} />
      <PageHeader titleKey="mediu" icon="leaf" />
      <ComingSoon pageName="Mediu" />
    </>
  );
}

