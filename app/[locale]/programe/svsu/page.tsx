import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Siren } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('svsu') };
}

export default function SvsuPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('svsu') }
      ]} />
      <PageHeader titleKey="svsu" icon="siren" />
      <ComingSoon pageName="SVSU - Serviciul Voluntar pentru Situații de Urgență" />
    </>
  );
}

