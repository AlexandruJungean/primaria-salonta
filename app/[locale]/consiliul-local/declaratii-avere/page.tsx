import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileCheck, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('declaratiiAvereConsiliu') };
}

const COUNCILORS = [
  'Consilier 1', 'Consilier 2', 'Consilier 3', 'Consilier 4', 'Consilier 5',
  'Consilier 6', 'Consilier 7', 'Consilier 8', 'Consilier 9',
];

export default function DeclaratiiAvereConsiliuPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('declaratiiAvereConsiliu') }
      ]} />
      <PageHeader titleKey="declaratiiAvereConsiliu" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Declarațiile de avere și de interese ale consilierilor locali.
            </p>

            <div className="space-y-3">
              {COUNCILORS.map((name, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <span className="font-medium text-gray-900">{name}</span>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Avere
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Interese
                      </button>
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

