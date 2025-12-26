import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Palette, Building, BookOpen, Landmark, Music } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('cultura') };
}

const CULTURAL_PLACES = [
  {
    id: 'casaCultura',
    image: '/images/casa-de-cultura-salonta-1.jpg',
    href: '/institutii/casa-cultura',
  },
  {
    id: 'biblioteca',
    image: '/images/colegiul-national-teodor-nes-salonta-1.jpg',
    href: '/institutii/biblioteca',
  },
  {
    id: 'muzeu',
    image: '/images/muzeu-salonta.jpg',
    href: '/institutii/muzeu',
  },
];

export default function CulturaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('cultura') }
      ]} />
      <PageHeader titleKey="cultura" icon="palette" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg mb-12">
            <p className="lead text-xl text-gray-600">
              Salonta este un oraș cu o bogată moștenire culturală, fiind cunoscut în special 
              pentru legătura sa cu poetul Arany János și pentru tradițiile sale multiculturale.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Instituții culturale
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {CULTURAL_PLACES.map((place) => (
              <Link key={place.id} href={place.href}>
                <Card hover className="overflow-hidden h-full">
                  <CardImage>
                    <Image
                      src={place.image}
                      alt={t(place.id)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </CardImage>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {t(place.id)}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Evenimente culturale</h2>
            <p>
              Municipiul Salonta găzduiește anual numeroase evenimente culturale care 
              celebrează diversitatea și moștenirea culturală a orașului:
            </p>
            <ul>
              <li><strong>Zilele Orașului Salonta</strong> - festival anual cu concerte, spectacole și activități culturale</li>
              <li><strong>Festivalul Arany János</strong> - eveniment dedicat poetului Arany János</li>
              <li><strong>Sărbători tradiționale</strong> - evenimente care celebrează tradițiile române și maghiare</li>
              <li><strong>Expoziții de artă</strong> - expuneri ale artiștilor locali și naționali</li>
            </ul>

            <h2>Patrimoniu cultural</h2>
            <p>
              Orașul deține numeroase monumente și clădiri de patrimoniu, printre care:
            </p>
            <ul>
              <li>Complexul Muzeal &quot;Arany János&quot;</li>
              <li>Casa Memorială &quot;Arany János&quot;</li>
              <li>Biserica Reformată</li>
              <li>Biserica Romano-Catolică</li>
              <li>Biserica Ortodoxă</li>
              <li>Primăria Veche (clădire monument)</li>
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}

