import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'oraseInfratite',
    locale: locale as Locale,
    path: '/localitatea/orase-infratite',
  });
}

const TWIN_CITIES = [
  { id: 'sarkad', image: '/images/orase-infratite/sarkad.jpg' },
  { id: 'csepel', image: '/images/orase-infratite/csepel.jpg' },
  { id: 'turkeve', image: '/images/orase-infratite/turkeve.jpg' },
  { id: 'rimaszombat', image: '/images/orase-infratite/rimaszombat.jpg' },
  { id: 'nagykoros', image: '/images/orase-infratite/nagykoros.jpg' },
  { id: 'hajduboszormeny', image: '/images/orase-infratite/hajduboszormeny.jpg' },
];

export default function OraseInfratitePage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('oraseInfratitePage');

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
            <p className="text-xl text-gray-600 mb-8 text-center">
              {tPage('intro')}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TWIN_CITIES.map((city) => (
                <Card key={city.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-24 flex-shrink-0">
                        <Image
                          src={city.image}
                          alt={tPage(`cities.${city.id}.name`)}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {tPage(`cities.${city.id}.name`)}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                          <MapPin className="w-4 h-4" />
                          {tPage(`cities.${city.id}.country`)}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {tPage(`cities.${city.id}.description`)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tPage('aboutTitle')}
              </h2>
              <p className="text-gray-600">
                {tPage('aboutText')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
