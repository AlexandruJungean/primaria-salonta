import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Utensils, MapPin, Phone, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('cantinaSociala') };
}

export default function CantinaSocialaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('cantinaSociala') }
      ]} />
      <PageHeader titleKey="cantinaSociala" icon="utensils" />

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
                  <Clock className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">Luni - Vineri: 11:00 - 14:00</span>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg">
              <h2>Despre Cantina Socială</h2>
              <p>
                Cantina Socială din Salonta oferă mese gratuite sau la prețuri 
                reduse pentru persoanele aflate în situații de dificultate socială.
              </p>

              <h2>Beneficiari</h2>
              <ul>
                <li>Persoane fără venituri sau cu venituri reduse</li>
                <li>Persoane fără adăpost</li>
                <li>Persoane vârstnice singure</li>
                <li>Familii cu mulți copii aflate în dificultate</li>
                <li>Persoane cu dizabilități</li>
              </ul>

              <h2>Servicii oferite</h2>
              <ul>
                <li>Masă caldă zilnic (prânz)</li>
                <li>Distribuire alimente</li>
                <li>Consiliere socială</li>
              </ul>

              <h2>Înscriere</h2>
              <p>
                Pentru a beneficia de serviciile Cantinei Sociale, este necesară 
                o evaluare socială realizată de Direcția de Asistență Socială. 
                Actele necesare pot fi depuse la sediul Primăriei.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

