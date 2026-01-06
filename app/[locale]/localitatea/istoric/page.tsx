import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'istoric',
    locale: locale as Locale,
    path: '/localitatea/istoric',
  });
}

export default function IstoricPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('istoricPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('istoric') }
      ]} />
      <PageHeader titleKey="istoric" icon="clock" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto">
            <p className="lead text-xl text-gray-600 mb-8">
              {tPage('intro')}
            </p>

            <p>{tPage('firstAttestation')}</p>

            <p>{tPage('toldiPeriod')}</p>

            {/* First image - Bocskai István */}
            <figure className="my-8 float-right ml-8 mb-4 w-64">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/istoric-1.webp"
                  alt={tPage('bocskaiCaption')}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
              <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {tPage('bocskaiCaption')}
              </figcaption>
            </figure>

            <p>{tPage('turkishDestruction')}</p>

            <p>{tPage('watchtower')}</p>

            <p>{tPage('privileges')}</p>

            <div className="clear-both"></div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              {tPage('economicDevelopmentTitle')}
            </h2>

            <p>{tPage('tradeGrowth')}</p>

            <p>{tPage('tradeFairs')}</p>

            <p>{tPage('rakoczi')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              {tPage('austrianRuleTitle')}
            </h2>

            <p>{tPage('leopoldPrivileges')}</p>

            <p>{tPage('revolution1848')}</p>

            <p>{tPage('guilds')}</p>

            {/* Second image - Historical Salonta */}
            <figure className="my-10">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/istoric-2.webp"
                  alt={tPage('historicalImageCaption')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
              <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
                {tPage('historicalImageCaption')}
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              {tPage('modernizationTitle')}
            </h2>

            <p>{tPage('modernization')}</p>

            <p>{tPage('borderCity')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              {tPage('industrialDevelopmentTitle')}
            </h2>

            <p>{tPage('industrialGrowth')}</p>

            <p>{tPage('industries')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              {tPage('touristAttractionsTitle')}
            </h2>

            <p>{tPage('touristAttractions')}</p>

            <p>{tPage('opportunities')}</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
