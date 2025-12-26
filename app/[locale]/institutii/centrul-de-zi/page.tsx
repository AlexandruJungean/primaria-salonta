import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Users, MapPin, Phone, Clock, Heart } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('centrulZi') };
}

export default function CentrulZiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('centrulZi') }
      ]} />
      <PageHeader titleKey="centrulZi" icon="users" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
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
                  <span className="text-sm">Luni - Vineri: 8:00 - 16:00</span>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg">
              <h2>Despre Centrul de Zi</h2>
              <p>
                Centrul de Zi &quot;Bunicii Comunității&quot; este un spațiu dedicat 
                persoanelor vârstnice din municipiul Salonta, oferind activități 
                de socializare, recreere și îngrijire pe timpul zilei.
              </p>

              <h2>Servicii oferite</h2>
              <ul>
                <li>Activități de socializare și recreere</li>
                <li>Terapie ocupațională</li>
                <li>Activități culturale și artistice</li>
                <li>Consiliere psihologică</li>
                <li>Masă caldă la prânz</li>
                <li>Monitorizare medicală de bază</li>
              </ul>

              <h2>Beneficiari</h2>
              <p>
                Centrul se adresează persoanelor vârstnice (65+ ani) din municipiul 
                Salonta care sunt singure sau necesită sprijin în timpul zilei.
              </p>

              <h2>Înscriere</h2>
              <p>
                Înscrierea se face la sediul centrului sau la Primăria Municipiului 
                Salonta, pe baza unei evaluări sociale.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

