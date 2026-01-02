import { getTranslations } from 'next-intl/server';
import { Wheat, Download, FileText, Calendar } from 'lucide-react';
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
    pageKey: 'oferteTerenuri',
    locale: locale as Locale,
    path: '/informatii-publice/oferte-terenuri',
  });
}

// Types
interface Document {
  id: number;
  title: string;
  period: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const REGISTRU_DOCS: Document[] = [
  { 
    id: 1, 
    title: 'Registrul de evidență a ofertelor de vânzare a terenurilor agricole situate în extravilan', 
    period: '25.04.2025 - 17.12.2025',
    pdfUrl: '#' 
  },
  { 
    id: 2, 
    title: 'Registrul de evidență a ofertelor de vânzare a terenurilor agricole situate în extravilan', 
    period: '01.01.2022 - 25.04.2025',
    pdfUrl: '#' 
  },
];

export default async function OferteTerenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'oferteTerenPage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('oferteTerenuri') }
      ]} />
      <PageHeader titleKey="oferteTerenuri" icon="wheat" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Wheat className="w-8 h-8 text-green-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-green-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('registryTitle')}</h2>
              </div>

              <div className="space-y-3">
                {REGISTRU_DOCS.map((doc) => (
                  <Card key={doc.id} hover>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {tPage('period')}: {doc.period}
                          </span>
                        </div>
                      </div>
                      <a
                        href={doc.pdfUrl}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors shrink-0 ml-4"
                      >
                        <Download className="w-4 h-4 text-green-600" />
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
