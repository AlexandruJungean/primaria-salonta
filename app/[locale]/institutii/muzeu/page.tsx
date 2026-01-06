import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Landmark, MapPin, Phone, Clock, Ticket } from 'lucide-react';
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
    pageKey: 'muzeu',
    locale: locale as Locale,
    path: '/institutii/muzeu',
  });
}

export default function MuzeuPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('muzeu') }
      ]} />
      <PageHeader titleKey="muzeu" icon="landmark" />

      <Section background="white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <Image
                  src="/images/muzeu-salonta.webp"
                  alt="Complexul Muzeal Arany János"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Str. Republicii, Salonta</span>
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
                    <span className="text-sm">Marți - Duminică: 10:00 - 18:00</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <Ticket className="w-5 h-5 text-primary-600" />
                    <span className="text-sm">Adulți: 10 lei</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="prose prose-lg">
              <h2>Despre Muzeu</h2>
              <p>
                Complexul Muzeal &quot;Arany János&quot; este principala atracție turistică 
                a municipiului Salonta, dedicat vieții și operei marelui poet maghiar 
                Arany János (1817-1882), născut în acest oraș.
              </p>

              <h2>Expoziții permanente</h2>
              <ul>
                <li><strong>Casa Memorială Arany János</strong> - casa natală a poetului, restaurată și amenajată cu obiecte de epocă</li>
                <li><strong>Expoziția biografică</strong> - documente, manuscrise și obiecte personale</li>
                <li><strong>Turnul Ciunt (Csonka-torony)</strong> - simbol al orașului, parte din vechea fortificație</li>
                <li><strong>Colecția etnografică</strong> - obiecte tradiționale din zonă</li>
              </ul>

              <h2>Arany János</h2>
              <p>
                Arany János este unul dintre cei mai mari poeți ai literaturii maghiare. 
                Opera sa, incluzând epopei precum &quot;Toldi&quot;, balade și poezii lirice, 
                l-au consacrat ca un clasic al literaturii universale.
              </p>

              <h2>Vizitare</h2>
              <p>
                Muzeul poate fi vizitat individual sau în grupuri organizate. 
                Sunt disponibile tururi ghidate în română, maghiară și engleză.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

