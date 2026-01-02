import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Download, DollarSign, TrendingUp, RefreshCw, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'documenteFinanciare',
    locale: locale as Locale,
    path: '/monitorul-oficial/documente-financiare',
  });
}

// Documente financiare pe ani - doar datele, fără traduceri pentru nume de fișiere
const FINANCIAL_DATA = [
  {
    year: 2025,
    budget: { doc: 'HCLMS nr. 57/31.03.2025', url: '#' },
    rectifications: [
      { doc: 'HCLMS nr. 134/02.07.2025', num: 3, url: '#' },
      { doc: 'HCLMS nr. 120/26.06.2025', num: 2, url: '#' },
      { doc: 'HCLMS nr. 92/29.05.2025', num: 1, url: '#' },
    ],
  },
  {
    year: 2024,
    execution: { doc: 'HCLMS nr. 93/29.05.2025', url: '#' },
    budget: { doc: 'HCLMS nr. 38/29.02.2024', url: '#' },
    rectifications: [
      { doc: 'HCLMS nr. 242/05.12.2024', num: 5, url: '#' },
      { doc: 'HCLMS nr. 188/17.10.2024', num: 4, url: '#' },
      { doc: 'HCLMS nr. 172/26.09.2024', num: 3, url: '#' },
      { doc: 'HCLMS nr. 149/31.07.2024', num: 2, url: '#' },
      { doc: 'HCLMS nr. 83/05.04.2024', num: 1, url: '#' },
    ],
  },
  {
    year: 2023,
    execution: { doc: 'HCLMS nr. 56/28.03.2024', url: '#' },
    budget: { doc: 'HCL 5/31.01.2023', url: '#', attachments: ['Anexa 1', 'Anexa 2', 'Formular 14'] },
    extra: [{ doc: 'HCLMS nr. 139/2023 – OUG 24/2023', url: '#' }],
    rectifications: [
      { doc: 'HCLMS nr. 271/21.12.2023', num: 9, url: '#' },
      { doc: 'HCLMS nr. 262/13.12.2023', num: 8, url: '#' },
      { doc: 'HCLMS nr. 231/14.11.2023', num: 7, url: '#' },
      { doc: 'HCLMS nr. 229/03.11.2023', num: 6, url: '#' },
      { doc: 'HCLMS nr. 189/28.09.2023', num: 5, url: '#' },
      { doc: 'HCLMS nr. 152/18.07.2023', num: 4, url: '#' },
      { doc: 'HCLMS 109/10.05.2023', num: 3, url: '#' },
      { doc: 'HCLMS 85/27.04.2023', num: 2, url: '#' },
      { doc: 'HCL 40/23.02.2023', num: 1, url: '#' },
    ],
  },
  {
    year: 2022,
    execution: { doc: 'HCLMS nr. 64/2023', url: '#', attachments: ['Anexele 1-12', 'Anexele 13-26'] },
    budget: { doc: 'HCL 63/31.03.2022 + HCL 23/24.02.2022', url: '#' },
    rectifications: [
      { doc: 'HCL 277/21.12.2022', num: 9, url: '#' },
      { doc: 'HCL 256/29.11.2022', num: 8, url: '#' },
      { doc: 'HCL 242/14.11.2022', num: 7, url: '#' },
      { doc: 'HCLMS nr. 225/27.10.2022', num: 6, url: '#' },
      { doc: 'HCL 215/29.09.2022', num: 5, url: '#' },
      { doc: 'HCL 199/29.09.2022', num: 4, url: '#' },
      { doc: 'HCL 150/08.07.2022', num: 3, url: '#' },
      { doc: 'HCL 130/31.05.2022', num: 2, url: '#' },
      { doc: 'HCL 82/12.04.2022', num: 1, url: '#' },
    ],
  },
  {
    year: 2021,
    budget: { doc: 'Buget inițial 2021', url: '#' },
    rectifications: [
      { doc: 'Decembrie 2021', url: '#' },
      { doc: 'Decembrie 2021 (validare)', url: '#' },
      { doc: 'Noiembrie 2021', url: '#' },
      { doc: 'Octombrie 2021', url: '#' },
      { doc: 'Septembrie 2021', url: '#' },
      { doc: 'August 2021', url: '#' },
      { doc: '22 Iunie 2021', url: '#' },
      { doc: '10 Iunie 2021', url: '#' },
    ],
  },
  {
    year: 2020,
    budget: { doc: 'Buget inițial 2020', url: '#' },
    extra: [
      { doc: 'Notă proiect buget 2020', url: '#' },
      { doc: 'Notă Nr. 2 proiect buget 2020', url: '#' },
    ],
    rectifications: [
      { doc: 'Decembrie 2020', url: '#' },
      { doc: 'Noiembrie 2020', url: '#' },
      { doc: 'Septembrie 2020', url: '#' },
      { doc: 'August 2020', url: '#' },
      { doc: 'Iulie 2020 (validare)', url: '#' },
      { doc: 'Iulie 2020', url: '#' },
      { doc: 'Mai 2020', url: '#' },
      { doc: 'Aprilie 2020', url: '#' },
      { doc: 'Martie 2020', url: '#' },
    ],
  },
  {
    year: 2019,
    budget: { doc: 'Buget 2019 (rectificat 19.12.2019)', url: '#' },
    extra: [
      { doc: 'Funcționare', url: '#' },
      { doc: 'Dezvoltare', url: '#' },
      { doc: 'Buget individual', url: '#' },
    ],
  },
];

function DocumentItem({ title, url }: { title: string; url: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="text-sm text-gray-700 truncate">{title}</span>
      </div>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-xs font-medium shrink-0"
      >
        <Download className="w-3 h-3" />
        PDF
      </Link>
    </div>
  );
}

export default function DocumenteFinanciarePage() {
  const t = useTranslations('navigation');
  const tf = useTranslations('financiarePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('documenteFinanciare') }
      ]} />
      <PageHeader titleKey="documenteFinanciare" icon="fileSpreadsheet" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* Info despre buget */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 mb-2">{tf('budgetTitle')}</h2>
                    <p className="text-sm text-gray-700 mb-2">{tf('budgetLegalRef')}</p>
                    <p className="text-xs text-gray-600 italic">{tf('budgetLegalText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documente pe ani */}
            <div className="space-y-8">
              {FINANCIAL_DATA.map((yearData) => (
                <Card key={yearData.year} className="overflow-hidden">
                  <div className="bg-primary-900 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold">{yearData.year}</h2>
                  </div>
                  <CardContent className="p-6 space-y-6">

                    {/* Cont de execuție */}
                    {yearData.execution && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">{tf('executionTitle')}</h3>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-gray-900">{yearData.execution.doc}</p>
                              {yearData.execution.attachments && (
                                <div className="flex gap-2 mt-2">
                                  {yearData.execution.attachments.map((att, i) => (
                                    <Link key={i} href="#" className="text-xs text-green-700 hover:underline">
                                      {att}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Link
                              href={yearData.execution.url}
                              target="_blank"
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              PDF
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buget general */}
                    {yearData.budget && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="w-5 h-5 text-primary-600" />
                          <h3 className="font-semibold text-gray-900">{tf('budgetGeneralTitle')}</h3>
                        </div>
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-gray-900">{yearData.budget.doc}</p>
                              {yearData.budget.attachments && (
                                <div className="flex gap-2 mt-2">
                                  {yearData.budget.attachments.map((att, i) => (
                                    <Link key={i} href="#" className="text-xs text-primary-700 hover:underline">
                                      {att}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Link
                              href={yearData.budget.url}
                              target="_blank"
                              className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              PDF
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documente extra */}
                    {yearData.extra && yearData.extra.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-5 h-5 text-amber-600" />
                          <h3 className="font-semibold text-gray-900">{tf('otherDocsTitle')}</h3>
                        </div>
                        <div className="space-y-2">
                          {yearData.extra.map((doc, i) => (
                            <DocumentItem key={i} title={doc.doc} url={doc.url} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rectificări bugetare */}
                    {yearData.rectifications && yearData.rectifications.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <RefreshCw className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-gray-900">{tf('rectificationsTitle')}</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {yearData.rectifications.map((rect, i) => (
                            <DocumentItem 
                              key={i} 
                              title={'num' in rect ? `${tf('rectification')} ${rect.num}: ${rect.doc}` : rect.doc} 
                              url={rect.url} 
                            />
                          ))}
                        </div>
                      </div>
                    )}

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
