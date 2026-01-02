import { getTranslations } from 'next-intl/server';
import { Radio, Download, FileText } from 'lucide-react';
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
    pageKey: 'reteleTelecom',
    locale: locale as Locale,
    path: '/informatii-publice/retele-telecom',
  });
}

// Types
interface Document {
  id: number;
  title: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const DOCUMENTS: Document[] = [
  { 
    id: 1, 
    title: 'Regulamentul privind conditiile in care se realizeaza accesul pe proprietatea publica sau privata a Mun. Salonta, respectiv masurile privind construirea de retele de telecomunicatii electronice potrivit Legii 159/2016', 
    pdfUrl: '#' 
  },
  { 
    id: 2, 
    title: 'Cererea societatii RCS&RDS S.A.', 
    pdfUrl: '#' 
  },
  { 
    id: 3, 
    title: 'Hotararea nr. 69/2019, privind solutionarea cererii RCS&RDS S.A.', 
    pdfUrl: '#' 
  },
];

export default async function ReteleTelecomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'reteleTelecomPage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('reteleTelecom') }
      ]} />
      <PageHeader titleKey="reteleTelecom" icon="radio" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-indigo-50 border-indigo-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Radio className="w-8 h-8 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-indigo-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-indigo-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <div className="space-y-3">
              {DOCUMENTS.map((doc) => (
                <Card key={doc.id} hover>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      </div>
                    </div>
                    <a
                      href={doc.pdfUrl}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors shrink-0 ml-4"
                    >
                      <Download className="w-4 h-4 text-indigo-600" />
                      PDF
                    </a>
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
