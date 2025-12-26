import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('excursieVirtuala') };
}

export default function ExcursieVirtualaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('excursieVirtuala') }
      ]} />
      <PageHeader titleKey="excursieVirtuala" icon="eye" />
      <ComingSoon pageName="Excursie virtuală" />
    </>
  );
}

