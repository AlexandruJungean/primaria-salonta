import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Wallet, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('buget') };
}

const BUDGET_DOCS = [
  { year: 2025, title: 'Buget local 2025', type: 'buget' },
  { year: 2025, title: 'Execuție bugetară T3 2025', type: 'executie' },
  { year: 2024, title: 'Buget local 2024', type: 'buget' },
  { year: 2024, title: 'Cont de execuție 2024', type: 'executie' },
  { year: 2023, title: 'Buget local 2023', type: 'buget' },
];

export default function BugetPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('buget') }
      ]} />
      <PageHeader titleKey="buget" icon="wallet" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Bugetul local al Municipiului Salonta și rapoartele de execuție bugetară.
            </p>

            <div className="space-y-3">
              {BUDGET_DOCS.map((doc, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                        <p className="text-sm text-gray-500">Anul {doc.year}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800">
                      <Download className="w-4 h-4" />
                      Descarcă
                    </button>
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

