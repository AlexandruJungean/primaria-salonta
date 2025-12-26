import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Newspaper } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('buletinInformativ') };
}

export default function BuletinInformativPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('buletinInformativ') }
      ]} />
      <PageHeader titleKey="buletinInformativ" icon="newspaper" />
      <ComingSoon pageName="Buletin informativ" />
    </>
  );
}

