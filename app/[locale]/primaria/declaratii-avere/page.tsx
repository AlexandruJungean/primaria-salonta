import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileCheck, Download, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('declaratiiAvere') };
}

// Mock data
const DECLARATIONS = [
  { name: 'Török László', position: 'Primar', year: 2025 },
  { name: 'Horváth János', position: 'Viceprimar', year: 2025 },
  { name: 'Secretar General', position: 'Secretar', year: 2025 },
];

export default function DeclaratiiAverePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('declaratiiAvere') }
      ]} />
      <PageHeader titleKey="declaratiiAvere" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Declarațiile de avere și de interese ale funcționarilor publici, 
              conform Legii nr. 176/2010.
            </p>

            <div className="mb-6 flex items-center gap-2 justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span className="font-medium">Anul 2025</span>
            </div>

            <div className="space-y-3">
              {DECLARATIONS.map((decl, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">{decl.name}</h3>
                      <p className="text-sm text-gray-500">{decl.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Avere
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Interese
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Informații</h3>
              <p className="text-gray-600 text-sm">
                Declarațiile de avere și de interese sunt publicate conform 
                prevederilor Legii nr. 176/2010 privind integritatea în exercitarea 
                funcțiilor și demnităților publice. Documentele sunt disponibile 
                și pe site-ul Agenției Naționale de Integritate.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

