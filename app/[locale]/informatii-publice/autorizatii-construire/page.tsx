import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Hammer } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('autorizatiiConstruire') };
}

export default function AutorizatiiConstruirePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('autorizatiiConstruire') }
      ]} />
      <PageHeader titleKey="autorizatiiConstruire" icon="hammer" />
      <ComingSoon pageName="Autorizații de construire" />
    </>
  );
}

