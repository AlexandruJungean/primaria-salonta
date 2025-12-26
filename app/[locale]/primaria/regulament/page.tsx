import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ComingSoon } from '@/components/pages/coming-soon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('regulament') };
}

export default function RegulamentPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('regulament') }
      ]} />
      <PageHeader titleKey="regulament" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Regulament de Organizare și Funcționare</h2>
            <p>
              Regulamentul de Organizare și Funcționare (ROF) al Primăriei 
              Municipiului Salonta stabilește structura organizatorică, 
              atribuțiile compartimentelor și relațiile dintre acestea.
            </p>

            <h3>Conținut</h3>
            <ul>
              <li>Dispoziții generale</li>
              <li>Structura organizatorică</li>
              <li>Atribuțiile primarului și viceprimarului</li>
              <li>Atribuțiile secretarului general</li>
              <li>Atribuțiile compartimentelor funcționale</li>
              <li>Relații și circuitul documentelor</li>
              <li>Dispoziții finale</li>
            </ul>

            <div className="not-prose mt-8">
              <Card className="bg-gray-50">
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <h4 className="font-semibold text-gray-900">ROF Primăria Salonta</h4>
                    <p className="text-sm text-gray-500">Document PDF</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
                    <Download className="w-4 h-4" />
                    Descarcă
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

