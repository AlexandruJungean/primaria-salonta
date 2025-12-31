import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('oraseInfratite') };
}

const TWIN_CITIES = [
  {
    name: 'Méhkerék',
    country: 'Ungaria',
    flag: '🇭🇺',
    description: 'Comună în județul Békés, la granița cu România.',
  },
  {
    name: 'Gyula',
    country: 'Ungaria',
    flag: '🇭🇺',
    description: 'Oraș în sud-estul Ungariei, cunoscut pentru Castelul Gyula.',
  },
];

export default function OraseInfratitePage() {
  const t = useTranslations('navigation');

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
              Municipiul Salonta menține relații de înfrățire și cooperare cu 
              orașe din țări vecine, promovând schimburi culturale și economice.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {TWIN_CITIES.map((city) => (
                <Card key={city.name} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{city.flag}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                          <MapPin className="w-4 h-4" />
                          {city.country}
                        </div>
                        <p className="text-gray-600">{city.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Despre înfrățiri
              </h2>
              <p className="text-gray-600">
                Înfrățirile dintre orașe reprezintă o formă de cooperare care 
                promovează schimburi culturale, economice și sociale între comunități. 
                Aceste parteneriate facilitează proiecte comune, schimburi de experiență 
                și consolidează legăturile între popoare.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

