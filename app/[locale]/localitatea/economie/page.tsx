import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { TrendingUp, Factory, Wheat, ShoppingBag, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('economie') };
}

const ECONOMIC_SECTORS = [
  {
    icon: Wheat,
    title: 'Agricultură',
    description: 'Sectorul agricol reprezintă o componentă importantă a economiei locale, cu producție de cereale, legume și creșterea animalelor.',
  },
  {
    icon: Factory,
    title: 'Industrie',
    description: 'Industria prelucrătoare, în special în domeniul alimentar și al construcțiilor, contribuie la dezvoltarea economică.',
  },
  {
    icon: ShoppingBag,
    title: 'Comerț și Servicii',
    description: 'Sectorul comercial și de servicii s-a dezvoltat semnificativ, oferind diverse oportunități pentru afaceri și angajare.',
  },
  {
    icon: Users,
    title: 'Turism',
    description: 'Turismul cultural, bazat pe moștenirea lui Arany János și tradițiile locale, atrage vizitatori din România și Ungaria.',
  },
];

export default function EconomiePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('economie') }
      ]} />
      <PageHeader titleKey="economie" icon="trendingUp" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-8 text-center">
              Economia municipiului Salonta se bazează pe un mix echilibrat de 
              agricultură, industrie, comerț și servicii, valorificând poziția 
              geografică strategică la granița cu Ungaria.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {ECONOMIC_SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Card key={sector.title}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {sector.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{sector.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="prose prose-lg">
              <h2>Oportunități de dezvoltare</h2>
              <p>
                Municipiul Salonta oferă multiple oportunități pentru investitori și antreprenori:
              </p>
              <ul>
                <li>Poziție strategică la granița cu Ungaria</li>
                <li>Acces la piețele din Europa Centrală</li>
                <li>Forță de muncă calificată</li>
                <li>Infrastructură în dezvoltare</li>
                <li>Sprijin din partea administrației locale pentru investiții</li>
              </ul>

              <h2>Colaborări transfrontaliere</h2>
              <p>
                Poziția geografică a Salontei facilitează colaborări economice 
                transfrontaliere, proiecte comune cu parteneri din Ungaria și 
                accesul la programe de finanțare europeană.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

