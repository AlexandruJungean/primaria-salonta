import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BarChart3, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'rapoarteAnuale',
    locale: locale as Locale,
    path: '/primaria/rapoarte-anuale',
  });
}

// Mock data - will be replaced with database content
const REPORTS = [
  { year: 2022, url: '#' },
  { year: 2021, url: '#' },
  { year: 2019, url: '#' },
  { year: 2018, url: '#' },
  { year: 2017, url: '#' },
  { year: 2016, url: '#' },
];

export default function RapoarteAnualePage() {
  const t = useTranslations('navigation');
  const tr = useTranslations('rapoarteAnualePage');

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
            
            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{tr('subtitle')}</h2>
                    <p className="text-sm text-gray-500">{tr('description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-3">
              {REPORTS.map((report) => (
                <Card key={report.year} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {tr('reportTitle')} – {report.year}
                        </span>
                      </div>
                      <a
                        href={report.url}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
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
