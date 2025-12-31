import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Bird, MapPin, Phone, Clock, Leaf } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('cuibulDropiei') };
}

export default function CuibulDropieiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('cuibulDropiei') }
      ]} />
      <PageHeader titleKey="cuibulDropiei" icon="bird" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">Salonta, Bihor</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">0259 373 XXX</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Leaf className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">Arie protejată</span>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg">
              <h2>Despre Cuibul Dropiei</h2>
              <p>
                „Cuibul Dropiei" este un centru de conservare și educație dedicat 
                protejării dropiei mari (Otis tarda), una dintre cele mai mari 
                păsări zburătoare din lume, prezentă în zona Salonta.
              </p>

              <h2>Dropia Mare</h2>
              <p>
                Dropia mare este o specie protejată la nivel internațional. 
                Zona Salonta găzduiește una dintre cele mai importante populații 
                de dropie din România, ceea ce face din acest centru un punct 
                important pentru conservarea speciei.
              </p>

              <h2>Activități</h2>
              <ul>
                <li>Monitorizare și protecție a populației de dropie</li>
                <li>Educație ecologică pentru elevi și tineri</li>
                <li>Tururi de observare a păsărilor</li>
                <li>Cercetare științifică</li>
                <li>Colaborare cu organizații internaționale de conservare</li>
              </ul>

              <h2>Vizitare</h2>
              <p>
                Vizitele sunt posibile doar cu programare prealabilă, pentru a 
                nu deranja fauna protejată. Contactați centrul pentru detalii.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

