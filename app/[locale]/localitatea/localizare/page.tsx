import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import type { Locale } from '@/lib/seo/config';

interface LocalizareData {
  coordinates: { latitude: string; longitude: string; altitude: string; area: string };
  distances: { city: string; km: number }[];
  accessibility: string[];
  mapEmbedUrl: string;
  description: string;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'localizare',
    locale: locale as Locale,
    path: '/localitatea/localizare',
  });
}

export default async function LocalizarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const page = await getPageWithData<LocalizareData>('localitatea-localizare');
  const data = page?.structured_data;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('localizare') }
      ]} />
      <PageHeader titleKey="localizare" icon="mapPin" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto">
            <p className="lead text-xl text-gray-600 mb-8">
              {page?.content}
            </p>

            {data && (
              <>
                <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-3">Poziție geografică</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Latitudine: {data.coordinates.latitude}</li>
                        <li>• Longitudine: {data.coordinates.longitude}</li>
                        <li>• Altitudine: {data.coordinates.altitude}</li>
                        <li>• Suprafață: {data.coordinates.area}</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-3">Distanțe</h3>
                      <ul className="space-y-2 text-gray-600">
                        {data.distances.map((d, i) => (
                          <li key={i}>• {d.city}: {d.km} km</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <h2>Amplasare</h2>
                <p>{data.description}</p>

                <h2>Accesibilitate</h2>
                <p>Municipiul este accesibil prin:</p>
                <ul>
                  {data.accessibility.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Container>
      </Section>

      {data?.mapEmbedUrl && (
        <Section background="gray" className="py-0">
          <div className="h-[400px]">
            <iframe
              src={data.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Locație Salonta"
            />
          </div>
        </Section>
      )}
      <AdminEditButton href="/admin/localitatea/localizare" />
    </>
  );
}
