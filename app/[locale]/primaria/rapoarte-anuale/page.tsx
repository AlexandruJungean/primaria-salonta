import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BarChart3, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('rapoarteAnuale') };
}

const REPORTS = [
  { year: 2024, title: 'Raport anual de activitate 2024' },
  { year: 2023, title: 'Raport anual de activitate 2023' },
  { year: 2022, title: 'Raport anual de activitate 2022' },
  { year: 2021, title: 'Raport anual de activitate 2021' },
  { year: 2020, title: 'Raport anual de activitate 2020' },
];

export default function RapoarteAnualePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('rapoarteAnuale') }
      ]} />
      <PageHeader titleKey="rapoarteAnuale" icon="barChart3" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Rapoartele anuale de activitate ale Primarului Municipiului Salonta, 
              prezentate Consiliului Local conform legislației în vigoare.
            </p>

            <div className="space-y-3">
              {REPORTS.map((report) => (
                <Card key={report.year}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-500">Anul {report.year}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
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

