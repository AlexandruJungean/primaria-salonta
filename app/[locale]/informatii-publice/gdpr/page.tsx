import { getTranslations } from 'next-intl/server';
import { ShieldCheck, FileText, Download, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'gdpr',
    locale: locale as Locale,
    path: '/informatii-publice/gdpr',
  });
}

// Documents
const DOCUMENTS = [
  { 
    id: 1, 
    title: 'Dispoziția nr. 208/2018 privind desemnarea responsabilului cu protecția datelor cu caracter personal în cadrul Primăriei Salonta', 
    pdfUrl: '#' 
  },
  { 
    id: 2, 
    title: 'Notificare privind prelucrarea datelor cu caracter personal', 
    pdfUrl: '#' 
  },
];

// Forms for exercising rights
const GDPR_FORMS = [
  { id: 1, title: 'Cerere pentru exercitarea dreptului la acces', pdfUrl: '#' },
  { id: 2, title: 'Cerere pentru exercitarea dreptului la opoziție', pdfUrl: '#' },
  { id: 3, title: 'Cerere pentru exercitarea dreptului la portabilitate', pdfUrl: '#' },
  { id: 4, title: 'Cerere pentru exercitarea dreptului la restricționare', pdfUrl: '#' },
  { id: 5, title: 'Cerere pentru exercitarea dreptului la ștergere', pdfUrl: '#' },
];

export default async function GdprPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'gdprPage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('gdpr') }
      ]} />
      <PageHeader titleKey="gdpr" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-emerald-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('documentsTitle')}</h2>
              </div>

              <div className="space-y-3">
                {DOCUMENTS.map((doc) => (
                  <Card key={doc.id} hover>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                        </div>
                      </div>
                      <a
                        href={doc.pdfUrl}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors shrink-0 ml-4"
                      >
                        <Download className="w-4 h-4 text-emerald-600" />
                        PDF
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Forms Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  {tPage('formsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {GDPR_FORMS.map((form) => (
                    <div 
                      key={form.id}
                      className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700">{form.title}</span>
                      </div>
                      <a
                        href={form.pdfUrl}
                        className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded text-xs font-medium shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
