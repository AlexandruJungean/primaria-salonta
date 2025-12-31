import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Briefcase, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('comisii') };
}

const COMMISSIONS = [
  {
    name: 'Comisia de studii, prognoze economico-sociale, buget-finanțe',
    members: ['Președinte: -', 'Membri: -'],
  },
  {
    name: 'Comisia pentru administrație publică locală, juridică',
    members: ['Președinte: -', 'Membri: -'],
  },
  {
    name: 'Comisia pentru urbanism, amenajarea teritoriului',
    members: ['Președinte: -', 'Membri: -'],
  },
  {
    name: 'Comisia pentru învățământ, sănătate, cultură, sport',
    members: ['Președinte: -', 'Membri: -'],
  },
  {
    name: 'Comisia pentru protecție socială',
    members: ['Președinte: -', 'Membri: -'],
  },
];

export default function ComisiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('comisii') }
      ]} />
      <PageHeader titleKey="comisii" icon="briefcase" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Comisiile de specialitate ale Consiliului Local analizează și 
              avizează proiectele de hotărâri înainte de a fi supuse votului.
            </p>

            <div className="space-y-4">
              {COMMISSIONS.map((commission, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3 text-lg">
                      <Briefcase className="w-5 h-5 text-primary-600 mt-1 shrink-0" />
                      {commission.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{commission.members.join(' | ')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

