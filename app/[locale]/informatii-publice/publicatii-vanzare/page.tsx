import { getTranslations } from 'next-intl/server';
import { Tag, Calendar, Download, FileText } from 'lucide-react';
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
    pageKey: 'publicatiiVanzare',
    locale: locale as Locale,
    path: '/informatii-publice/publicatii-vanzare',
  });
}

// Types
interface Publication {
  id: number;
  title: string;
  date: string;
  pdfUrl: string;
}

interface YearGroup {
  year: number;
  publications: Publication[];
}

// Mock data - will be replaced with database fetch
const PUBLICATIONS_BY_YEAR: YearGroup[] = [
  {
    year: 2025,
    publications: [
      { id: 1, title: 'Anunț de vânzare teren 7848 mp, str. Iosif Vulcan', date: '17.11.2025', pdfUrl: '#' },
      { id: 2, title: 'Anunț de vânzare teren 6348 mp, str. Iosif Vulcan', date: '17.11.2025', pdfUrl: '#' },
    ]
  },
  {
    year: 2023,
    publications: [
      { id: 3, title: 'Anunț de vânzare imobil', date: '08.03.2023', pdfUrl: '#' },
    ]
  },
  {
    year: 2022,
    publications: [
      { id: 4, title: 'Anunț de licitație pentru vânzare imobil', date: '14.11.2022', pdfUrl: '#' },
    ]
  },
  {
    year: 2021,
    publications: [
      { id: 5, title: 'Publicatie de vanzare nr. 15/13.01.2021', date: '13.01.2021', pdfUrl: '#' },
      { id: 6, title: 'Publicatie de vanzare nr. 30/12.01.2021', date: '12.01.2021', pdfUrl: '#' },
    ]
  },
  {
    year: 2020,
    publications: [
      { id: 7, title: 'Publicatie de vanzare nr. 6/11.11.2020', date: '11.11.2020', pdfUrl: '#' },
      { id: 8, title: 'Publicatie de vanzare nr. 24/10.11.2020', date: '10.11.2020', pdfUrl: '#' },
      { id: 9, title: 'Publicatie de vanzare nr. 2/05.11.2020', date: '05.11.2020', pdfUrl: '#' },
    ]
  },
];

export default async function PublicatiiVanzarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'publicatiiVanzarePage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('publicatiiVanzare') }
      ]} />
      <PageHeader titleKey="publicatiiVanzare" icon="tag" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Tag className="w-8 h-8 text-slate-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-slate-700 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publications by Year */}
            {PUBLICATIONS_BY_YEAR.map((yearGroup) => (
              <div key={yearGroup.year} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{yearGroup.year}</h2>
                  <span className="text-sm text-gray-500">({yearGroup.publications.length} {tPage('publications')})</span>
                </div>

                <div className="space-y-3">
                  {yearGroup.publications.map((pub) => (
                    <Card key={pub.id} hover>
                      <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{pub.title}</h3>
                            <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="w-4 h-4" />
                              {pub.date}
                            </span>
                          </div>
                        </div>
                        <a
                          href={pub.pdfUrl}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-slate-400 transition-colors shrink-0 ml-4"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                          PDF
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

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
