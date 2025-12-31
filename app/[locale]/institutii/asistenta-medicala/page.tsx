import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Heart, MapPin, Phone, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('asistentaMedicala') };
}

export default function AsistentaMedicalaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('asistentaMedicala') }
      ]} />
      <PageHeader titleKey="asistentaMedicala" icon="heart" />

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
                  <span className="text-sm">Non-stop</span>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg">
              <h2>Despre instituție</h2>
              <p>
                Unitatea de Asistență Medico-Socială din Salonta oferă servicii 
                de îngrijire medicală și asistență socială pentru persoane vârstnice 
                și persoane cu dizabilități.
              </p>

              <h2>Servicii oferite</h2>
              <ul>
                <li>Îngrijire medicală permanentă</li>
                <li>Asistență socială</li>
                <li>Cazare și masă</li>
                <li>Activități de recuperare și socializare</li>
                <li>Consiliere psihologică</li>
              </ul>

              <h2>Criterii de admitere</h2>
              <p>
                Admiterea se face în baza unei evaluări sociale și medicale, 
                conform legislației în vigoare. Pentru informații suplimentare, 
                vă rugăm să contactați instituția.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

