import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'excursieVirtuala',
    locale: locale as Locale,
    path: '/localitatea/excursie-virtuala',
  });
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

