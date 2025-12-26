import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileSpreadsheet } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('documenteFinanciare') };
}

export default function DocumenteFinanciarePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('documenteFinanciare') }
      ]} />
      <PageHeader titleKey="documenteFinanciare" icon="fileSpreadsheet" />
      <ComingSoon pageName="Documente financiare" />
    </>
  );
}

