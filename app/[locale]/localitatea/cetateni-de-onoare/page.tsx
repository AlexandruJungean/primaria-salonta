import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Award, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('cetateniOnoare') };
}

const HONORARY_CITIZENS = [
  {
    name: 'Arany János',
    year: null,
    description: 'Poet maghiar, unul dintre cei mai mari poeți ai literaturii maghiare, născut în Salonta (1817-1882).',
  },
];

export default function CetateniOnoarePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('cetateniOnoare') }
      ]} />
      <PageHeader titleKey="cetateniOnoare" icon="award" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-8 text-center">
              Titlul de Cetățean de Onoare este cea mai înaltă distincție acordată 
              de Consiliul Local al Municipiului Salonta persoanelor care au adus 
              contribuții deosebite la dezvoltarea și prestigiul orașului.
            </p>

            <div className="space-y-4">
              {HONORARY_CITIZENS.map((citizen) => (
                <Card key={citizen.name}>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <User className="w-8 h-8 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{citizen.name}</h3>
                      {citizen.year && (
                        <p className="text-sm text-primary-600 font-medium">
                          Acordat în {citizen.year}
                        </p>
                      )}
                      <p className="text-gray-600 mt-2">{citizen.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">
                Procedura de acordare
              </h2>
              <p className="text-amber-800">
                Titlul de Cetățean de Onoare se acordă prin hotărâre a Consiliului 
                Local al Municipiului Salonta, la propunerea primarului, a consilierilor 
                locali sau a cetățenilor, în condițiile stabilite prin regulament.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

