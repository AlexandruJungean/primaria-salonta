import { getTranslations } from 'next-intl/server';
import { ExternalLink, Map } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import { getIcon } from '@/lib/constants/icon-map';
import type { Locale } from '@/lib/seo/config';

interface HartaData {
  externalUrl: string;
  features: { icon: string; titleKey: string; descKey: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'hartaDigitala',
    locale: locale as Locale,
    path: '/localitatea/harta-digitala',
  });
}

export default async function HartaDigitalaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'hartaDigitalaPage' });
  const page = await getPageWithData<HartaData>('localitatea-harta-digitala');
  const externalUrl = page?.structured_data?.externalUrl || 'https://salonta-city.map2web.eu/';
  const features = page?.structured_data?.features || [];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('hartaDigitala') }
      ]} />
      <PageHeader titleKey="hartaDigitala" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
              <div className="relative h-[400px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
                <div className="absolute inset-0 opacity-10 decorative-cross-pattern" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <Map className="w-20 h-20 mb-6 opacity-90" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{tPage('title')}</h2>
                  <p className="text-xl text-white/80 mb-8 text-center max-w-2xl">{tPage('subtitle')}</p>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg"
                  >
                    <ExternalLink className="w-6 h-6" />
                    {tPage('openMap')}
                  </a>
                </div>
              </div>
            </div>

            {features.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{tPage('featuresTitle')}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {features.map((feature, index) => {
                    const Icon = getIcon(feature.icon);
                    return (
                      <div key={index} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{tPage(`features.${feature.titleKey}`)}</h4>
                          <p className="text-sm text-gray-600">{tPage(`features.${feature.descKey}`)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="bg-primary-50 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4">{tPage('infoText')}</p>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium"
              >
                {new URL(externalUrl).hostname}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/localitatea/harta-digitala" />
    </>
  );
}
