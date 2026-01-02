import { getTranslations } from 'next-intl/server';
import { Receipt, Download, CreditCard, FileText, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'taxeImpozite',
    locale: locale as Locale,
    path: '/informatii-publice/taxe-impozite',
  });
}

// Types
interface TaxDocument {
  id: number;
  title: string;
  year: number;
  pdfUrl: string;
  extra?: string;
}

// Mock data - will be replaced with database fetch
const TAX_DOCUMENTS: TaxDocument[] = [
  { id: 1, title: 'Impozite si taxele locale pentru anul 2021', year: 2021, pdfUrl: '#' },
  { id: 2, title: 'Impozite si taxele locale pentru anul 2020', year: 2020, pdfUrl: '#' },
  { id: 3, title: 'Codurile IBAN pentru impozite si taxe locale', year: 2020, pdfUrl: '#' },
  { id: 4, title: 'Impozitele și taxele locale pt. anul 2019', year: 2019, pdfUrl: '#' },
  { id: 5, title: 'Facilitati fiscale', year: 2019, pdfUrl: '#', extra: 'Facilități fiscale' },
  { id: 6, title: 'Impozitele și taxele locale pt. anul 2018', year: 2018, pdfUrl: '#' },
  { id: 7, title: 'Impozitele și taxele locale pt. anul 2017', year: 2017, pdfUrl: '#' },
  { id: 8, title: 'Impozitele și taxele locale pt. anul 2016', year: 2016, pdfUrl: '#' },
];

export default async function TaxeImpozitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'taxeImpozitePage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('taxeImpozite') }
      ]} />
      <PageHeader titleKey="taxeImpozite" icon="receipt" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Receipt className="w-8 h-8 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-amber-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick access to online payment */}
            <Card className="bg-primary-50 border-primary-200 mb-8">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-10 h-10 text-primary-700" />
                  <div>
                    <h3 className="font-semibold text-primary-900">{tPage('payOnline')}</h3>
                    <p className="text-sm text-primary-700">{tPage('payOnlineDesc')}</p>
                  </div>
                </div>
                <Link 
                  href="/servicii-online/plati"
                  className="px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800"
                >
                  {tPage('payOnlineButton')}
                </Link>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('documentsTitle')}</h2>
              </div>

              <div className="space-y-3">
                {TAX_DOCUMENTS.map((doc) => (
                  <Card key={doc.id} hover>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {doc.year}
                          </span>
                        </div>
                      </div>
                      <a
                        href={doc.pdfUrl}
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
