import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ExternalLink, Map, Search, Route, Ruler, Printer, Globe } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'hartaDigitala',
    locale: locale as Locale,
    path: '/localitatea/harta-digitala',
  });
}

const FEATURE_ICONS = [Search, Route, Ruler, Printer, Globe, Map];

export default function HartaDigitalaPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('hartaDigitalaPage');

  const features = [
    { icon: Search, titleKey: 'searchTitle', descKey: 'searchDesc' },
    { icon: Route, titleKey: 'routeTitle', descKey: 'routeDesc' },
    { icon: Ruler, titleKey: 'measureTitle', descKey: 'measureDesc' },
    { icon: Printer, titleKey: 'printTitle', descKey: 'printDesc' },
    { icon: Globe, titleKey: 'langTitle', descKey: 'langDesc' },
    { icon: Map, titleKey: 'layersTitle', descKey: 'layersDesc' },
  ];

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
            {/* Hero Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
              {/* Map Preview - using gradient pattern instead of heavy background image for performance */}
              <div className="relative h-[400px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
                {/* Decorative pattern overlay for visual interest */}
                <div className="absolute inset-0 opacity-10 decorative-cross-pattern" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <Map className="w-20 h-20 mb-6 opacity-90" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    {tPage('title')}
                  </h2>
                  <p className="text-xl text-white/80 mb-8 text-center max-w-2xl">
                    {tPage('subtitle')}
                  </p>
                  <a 
                    href="https://salonta-city.map2web.eu/"
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

            {/* Features Grid */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {tPage('featuresTitle')}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {tPage(`features.${feature.titleKey}`)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {tPage(`features.${feature.descKey}`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="bg-primary-50 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4">
                {tPage('infoText')}
              </p>
              <a 
                href="https://salonta-city.map2web.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium"
              >
                salonta-city.map2web.eu
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
