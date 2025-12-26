import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('dispozitii') };
}

export default function DispozitiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('dispozitii') }
      ]} />
      <PageHeader titleKey="dispozitii" icon="fileCheck" />
      <ComingSoon pageName="Dispoziții" />
    </>
  );
}

