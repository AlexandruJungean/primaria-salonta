import { getTranslations } from 'next-intl/server';
import { Gavel, Calendar, Download, FileText } from 'lucide-react';
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
    pageKey: 'licitatii',
    locale: locale as Locale,
    path: '/informatii-publice/licitatii',
  });
}

// Types
interface Auction {
  id: number;
  title: string;
  date: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const AUCTIONS: Auction[] = [
  { 
    id: 1, 
    title: 'Anunt de atribuire a contractului de concesiune 8033 mp', 
    date: '02.12.2024', 
    pdfUrl: '#' 
  },
  { 
    id: 2, 
    title: 'Anunț licitație publică concesionare teren 8033 mp situat în Mun. Salonta, str. Ghestului (licitația a 2-a)', 
    date: '22.10.2024', 
    pdfUrl: '#' 
  },
  { 
    id: 3, 
    title: 'Anunț licitație publică concesionare teren 8033 mp situat în Mun. Salonta, str. Ghestului', 
    date: '27.09.2024', 
    pdfUrl: '#' 
  },
  { 
    id: 4, 
    title: 'Anunt atribuire contract concesiune teren 47618 mp', 
    date: '27.08.2024', 
    pdfUrl: '#' 
  },
  { 
    id: 5, 
    title: 'Anunt licitatie publica concesionare teren 47618 mp, str. Ghestului 4', 
    date: '29.07.2024', 
    pdfUrl: '#' 
  },
  { 
    id: 6, 
    title: 'Municipiul Salonta organizează licitație publică', 
    date: '02.07.2024', 
    pdfUrl: '#' 
  },
];

export default async function LicitatiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'licitatiiPage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('licitatii') }
      ]} />
      <PageHeader titleKey="licitatii" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Gavel className="w-8 h-8 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-amber-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auctions List */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('auctionsTitle')}</h2>
              </div>

              <div className="space-y-3">
                {AUCTIONS.map((auction) => (
                  <Card key={auction.id} hover>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <Gavel className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{auction.title}</h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {auction.date}
                          </span>
                        </div>
                      </div>
                      <a
                        href={auction.pdfUrl}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-amber-300 transition-colors shrink-0 ml-4"
                      >
                        <Download className="w-4 h-4 text-amber-600" />
                        PDF
                      </a>
                    </CardContent>
                  </Card>
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
