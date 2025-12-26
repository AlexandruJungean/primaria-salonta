import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('generale') };
}

export default function GeneralePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('generale') }
      ]} />
      <PageHeader titleKey="generale" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Transparență decizională</h2>
            <p>
              În conformitate cu Legea nr. 52/2003 privind transparența decizională 
              în administrația publică, Primăria Municipiului Salonta asigură 
              accesul cetățenilor la procesul de elaborare a actelor normative.
            </p>

            <h2>Acces la informații de interes public</h2>
            <p>
              Legea nr. 544/2001 garantează accesul liber și neîngrădit la 
              informațiile de interes public. Puteți solicita informații prin:
            </p>
            <ul>
              <li>Solicitare scrisă depusă la registratura primăriei</li>
              <li>Solicitare electronică la adresa: primsal3@gmail.com</li>
              <li>Verbal, în timpul programului de lucru</li>
            </ul>

            <h2>Rapoarte anuale</h2>
            <p>
              Primăria Municipiului Salonta publică anual rapoarte privind:
            </p>
            <ul>
              <li>Aplicarea Legii 52/2003 - transparență decizională</li>
              <li>Aplicarea Legii 544/2001 - acces la informații publice</li>
              <li>Activitatea de soluționare a petițiilor</li>
            </ul>

            <h2>Persoane responsabile</h2>
            <p>
              Pentru solicitări de informații de interes public sau participare 
              la procesul decizional, vă rugăm să contactați Biroul de Relații 
              cu Publicul - Camera 11, Parter.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

