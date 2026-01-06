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
    pageKey: 'cultura',
    locale: locale as Locale,
    path: '/localitatea/cultura',
  });
}

const PERSONALITIES = [
  { id: 'aranyJanos', image: '/images/personalitati/aranyjanos.webp', name: 'Arany János' },
  { id: 'aranyLaszlo', image: '/images/personalitati/aranylaszlo.webp', name: 'Arany László' },
  { id: 'kulinGyorgy', image: '/images/personalitati/kulingyorgy.webp', name: 'Kulin György' },
  { id: 'sinkaIstvan', image: '/images/personalitati/sinkaistvan.webp', name: 'Sinka István' },
  { id: 'zilahyLajos', image: '/images/personalitati/zilahylajos.webp', name: 'Zilahy Lajos' },
  { id: 'foldiJanos', image: '/images/personalitati/foldijanos.webp', name: 'Földi János' },
  { id: 'szekelyLaszlo', image: '/images/personalitati/szekelylaszlo.webp', name: 'Székely László' },
  { id: 'erdelyiJozsef', image: '/images/personalitati/erdelyijozsef.webp', name: 'Erdélyi József' },
  { id: 'kissIstvan', image: '/images/personalitati/kissistvan.webp', name: 'Kiss István' },
];

export default function CulturaPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('culturaPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('cultura') }
      ]} />
      <PageHeader titleKey="cultura" icon="palette" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto mb-12">
            <p className="lead text-xl text-gray-600 mb-6">
              {tPage('intro')}
            </p>

            <ul className="space-y-1">
              <li>– {tPage('personalities.aranyJanos')}</li>
              <li>– {tPage('personalities.foldiJanos')}</li>
              <li>– {tPage('personalities.lovassyLaszlo')}</li>
              <li>– {tPage('personalities.sinkaIstvan')}</li>
              <li>– {tPage('personalities.zilahyLajos')}</li>
              <li>– {tPage('personalities.kissFerenc')}</li>
              <li>– {tPage('personalities.erdelyiJozsef')}</li>
              <li>– {tPage('personalities.teodorNes')}</li>
            </ul>

            <p className="mt-6">{tPage('museumIntro')}</p>
          </div>

          {/* Personalities Grid */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {tPage('personalitiesTitle')}
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-16 max-w-5xl mx-auto">
            {PERSONALITIES.map((person) => (
              <div key={person.id} className="text-center group">
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md mb-2 bg-gray-100 group-hover:shadow-lg transition-shadow">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 11vw"
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">{person.name}</p>
              </div>
            ))}
          </div>

          {/* Arany János Biography */}
          <div className="bg-primary-50 rounded-2xl p-8 max-w-5xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/personalitati/aranyjanos.webp"
                    alt="Arany János"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-primary-900 mb-1">
                  {tPage('aranyJanosTitle')}
                </h2>
                <p className="text-lg text-primary-700 italic mb-6">
                  {tPage('aranyJanosSubtitle')}
                </p>
                <div className="prose prose-gray">
                  <p>{tPage('aranyJanosBio1')}</p>
                  <p>{tPage('aranyJanosBio2')}</p>
                  <p>{tPage('aranyJanosBio3')}</p>
                  <p>{tPage('aranyJanosBio4')}</p>
                  <p>{tPage('aranyJanosBio5')}</p>
                  <p>{tPage('aranyJanosBio6')}</p>
                  <p>{tPage('aranyJanosBio7')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cultural Events */}
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto">
            <h2>{tPage('culturalEventsTitle')}</h2>
            <p>{tPage('culturalEventsIntro')}</p>
            <ul>
              <li><strong>{tPage('event1').split(' - ')[0]}</strong> - {tPage('event1').split(' - ')[1]}</li>
              <li><strong>{tPage('event2').split(' - ')[0]}</strong> - {tPage('event2').split(' - ')[1]}</li>
              <li><strong>{tPage('event3').split(' - ')[0]}</strong> - {tPage('event3').split(' - ')[1]}</li>
              <li><strong>{tPage('event4').split(' - ')[0]}</strong> - {tPage('event4').split(' - ')[1]}</li>
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
