import { getTranslations } from 'next-intl/server';
import { Map, Download, FileText, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('planuriUrbanistice') };
}

// Types
interface Document {
  id: number;
  title: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const PUG_DOCS: Document[] = [
  { id: 1, title: 'Legenda', pdfUrl: '#' },
  { id: 2, title: 'RLU (Regulament Local de Urbanism)', pdfUrl: '#' },
  { id: 3, title: 'UTR-1 - UTR-6', pdfUrl: '#' },
  { id: 4, title: 'UTR-7 - UTR-11', pdfUrl: '#' },
];

export default async function PlanuriUrbanisticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'planuriUrbanisticePage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('planuriUrbanistice') }
      ]} />
      <PageHeader titleKey="planuriUrbanistice" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-indigo-50 border-indigo-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Map className="w-8 h-8 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-indigo-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-indigo-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PUG Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Map className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">PUG Salonta</h2>
                    <p className="text-sm text-gray-500">{tPage('pugDesc')}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  06.03.2017
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {PUG_DOCS.map((doc) => (
                  <Card key={doc.id} hover>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      </div>
                      <a
                        href={doc.pdfUrl}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors shrink-0"
                      >
                        <Download className="w-4 h-4 text-indigo-600" />
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
