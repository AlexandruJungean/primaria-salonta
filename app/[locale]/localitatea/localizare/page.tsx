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
  return { title: t('localizare') };
}

export default function LocalizarePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('localizare') }
      ]} />
      <PageHeader titleKey="localizare" icon="mapPin" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="lead text-xl text-gray-600 mb-8">
              Municipiul Salonta este situat în vestul României, în județul Bihor, la aproximativ 35 km sud-vest de Oradea.
            </p>

            <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Poziție geografică</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Latitudine: 46°48′ N</li>
                    <li>• Longitudine: 21°39′ E</li>
                    <li>• Altitudine: 95-100 m</li>
                    <li>• Suprafață: 148,24 km²</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Distanțe</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Oradea: 35 km</li>
                    <li>• București: 600 km</li>
                    <li>• Granița Ungaria: 15 km</li>
                    <li>• Arad: 80 km</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2>Amplasare</h2>
            <p>
              Salonta se află în Câmpia de Vest, la intersecția drumurilor naționale DN79 și DN79A. 
              Orașul este situat la granița cu Ungaria, ceea ce îi conferă o poziție strategică 
              importantă pentru comerțul și turismul transfrontalier.
            </p>

            <h2>Accesibilitate</h2>
            <p>
              Municipiul este accesibil prin:
            </p>
            <ul>
              <li>Drumul Național DN79 (Oradea - Salonta - Arad)</li>
              <li>Drumul Național DN79A (Salonta - Chișineu-Criș)</li>
              <li>Calea ferată Oradea - Arad</li>
              <li>Punct de trecere a frontierei Salonta - Méhkerék</li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* Map Section */}
      <Section background="gray" className="py-0">
        <div className="h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43682.91!2d21.6!3d46.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4747f4e8b2f14f87%3A0x400d4d3e1f4c4e0!2sSalonta!5e0!3m2!1sen!2sro!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Locație Salonta"
          />
        </div>
      </Section>
    </>
  );
}

