import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Waves, MapPin, Phone, Clock, Ticket } from 'lucide-react';
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
    pageKey: 'bazinInot',
    locale: locale as Locale,
    path: '/institutii/bazin-inot',
  });
}

export default function BazinInotPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('bazinInot') }
      ]} />
      <PageHeader titleKey="bazinInot" icon="waves" />

      <Section background="white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <Image
                  src="/images/bazin-de-inot-salonta-1.jpeg"
                  alt="Bazinul de Înot Salonta"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="/images/bazin-de-inot-salonta-2.jpeg"
                  alt="Bazinul de Înot Salonta"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Salonta</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">0259 373 XXX</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Zilnic: 10:00 - 20:00</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <Ticket className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Adulți: 25 lei</span>
                  </CardContent>
                </Card>
              </div>

              <div className="prose prose-lg">
                <h2>Despre Bazin</h2>
                <p>
                  Bazinul de Înot din Salonta este o facilitate modernă care 
                  oferă condiții optime pentru înot recreativ și sportiv.
                </p>

                <h2>Facilități</h2>
                <ul>
                  <li>Bazin olimpic acoperit (25m)</li>
                  <li>Bazin pentru copii</li>
                  <li>Vestiare și dușuri</li>
                  <li>Saună</li>
                  <li>Zonă de relaxare</li>
                </ul>

                <h2>Activități</h2>
                <ul>
                  <li>Înot liber</li>
                  <li>Cursuri de înot pentru copii și adulți</li>
                  <li>Aqua aerobic</li>
                  <li>Antrenamente pentru sportivi</li>
                </ul>

                <h2>Prețuri</h2>
                <ul>
                  <li>Adulți: 25 lei / oră</li>
                  <li>Copii: 15 lei / oră</li>
                  <li>Abonament lunar: 200 lei</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

