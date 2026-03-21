import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import type { Locale } from '@/lib/seo/config';

interface OraseData {
  twinCities: { id: string; image: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'oraseInfratite',
    locale: locale as Locale,
    path: '/localitatea/orase-infratite',
  });
}

export default async function OraseInfratitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'oraseInfratitePage' });
  const page = await getPageWithData<OraseData>('localitatea-orase-infratite');
  const twinCities = page?.structured_data?.twinCities || [];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('oraseInfratite') }
      ]} />
      <PageHeader titleKey="oraseInfratite" icon="globe" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-10 text-center">{tPage('intro')}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {twinCities.map((city) => (
                <div key={city.id} className="text-center group">
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow mb-4 bg-white">
                    <Image
                      src={city.image}
                      alt={tPage(`cities.${city.id}.name`)}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{tPage(`cities.${city.id}.name`)}</h3>
                  <p className="text-sm text-primary-600">{tPage(`cities.${city.id}.country`)}</p>
                  <p className="text-sm text-gray-600 mt-2">{tPage(`cities.${city.id}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/localitatea/orase-infratite" />
    </>
  );
}
