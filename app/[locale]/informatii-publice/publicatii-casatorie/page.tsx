import { getTranslations } from 'next-intl/server';
import { Users, Download, FileText, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('publicatiiCasatorie') };
}

// Types
interface Publication {
  id: number;
  date: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const PUBLICATIONS_2025: Publication[] = [
  { id: 1, date: '06.02.2025', pdfUrl: '#' },
  { id: 2, date: '20.02.2025', pdfUrl: '#' },
  { id: 3, date: '03.04.2025', pdfUrl: '#' },
  { id: 4, date: '24.04.2025', pdfUrl: '#' },
  { id: 5, date: '28.04.2025', pdfUrl: '#' },
  { id: 6, date: '22.05.2025', pdfUrl: '#' },
  { id: 7, date: '23.05.2025', pdfUrl: '#' },
  { id: 8, date: '30.05.2025', pdfUrl: '#' },
  { id: 9, date: '05.06.2025', pdfUrl: '#' },
  { id: 10, date: '06.06.2025', pdfUrl: '#' },
  { id: 11, date: '12.06.2025', pdfUrl: '#' },
  { id: 12, date: '13.06.2025', pdfUrl: '#' },
  { id: 13, date: '20.06.2025', pdfUrl: '#' },
  { id: 14, date: '12.07.2025', pdfUrl: '#' },
  { id: 15, date: '17.07.2025', pdfUrl: '#' },
  { id: 16, date: '25.07.2025', pdfUrl: '#' },
  { id: 17, date: '28.07.2025', pdfUrl: '#' },
  { id: 18, date: '31.07.2025', pdfUrl: '#' },
  { id: 19, date: '01.08.2025', pdfUrl: '#' },
  { id: 20, date: '08.08.2025', pdfUrl: '#' },
  { id: 21, date: '15.08.2025', pdfUrl: '#' },
  { id: 22, date: '18.08.2025', pdfUrl: '#' },
  { id: 23, date: '21.08.2025', pdfUrl: '#' },
  { id: 24, date: '25.08.2025', pdfUrl: '#' },
  { id: 25, date: '12.09.2025', pdfUrl: '#' },
  { id: 26, date: '18.09.2025', pdfUrl: '#' },
  { id: 27, date: '19.09.2025', pdfUrl: '#' },
];

export default async function PublicatiiCasatoriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'publicatiiCasatoriePage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('publicatiiCasatorie') }
      ]} />
      <PageHeader titleKey="publicatiiCasatorie" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-primary-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2025 Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2025</h2>
                <span className="text-sm text-gray-500">({PUBLICATIONS_2025.length} {tPage('publications')})</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {PUBLICATIONS_2025.map((pub) => (
                  <a
                    key={pub.id}
                    href={pub.pdfUrl}
                    className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors group"
                  >
                    <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{pub.date}</span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 ml-auto" />
                  </a>
                ))}
              </div>
            </div>

            {/* Info Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('noteTitle')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('noteText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
