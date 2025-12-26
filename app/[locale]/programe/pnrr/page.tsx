import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Euro } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('pnrr') };
}

export default function PnrrPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('pnrr') }
      ]} />
      <PageHeader titleKey="pnrr" icon="euro" />
      <ComingSoon pageName="PNRR - Plan Național de Redresare și Reziliență" />
    </>
  );
}

