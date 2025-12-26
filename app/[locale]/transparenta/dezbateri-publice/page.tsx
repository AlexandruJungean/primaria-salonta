import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { MessageSquare } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('dezbateriPublice') };
}

export default function DezbateriPublicePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('dezbateriPublice') }
      ]} />
      <PageHeader titleKey="dezbateriPublice" icon="messageSquare" />
      <ComingSoon pageName="Dezbateri publice" />
    </>
  );
}

