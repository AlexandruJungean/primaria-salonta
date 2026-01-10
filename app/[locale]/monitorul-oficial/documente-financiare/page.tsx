import { getTranslations } from 'next-intl/server';
import { FileText, Download, DollarSign, TrendingUp, RefreshCw, Info, FileWarning, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolder } from '@/lib/supabase/services/documents';
import type { Document } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'documenteFinanciare',
    locale: locale as Locale,
    path: '/monitorul-oficial/documente-financiare',
  });
}

interface YearData {
  year: number;
  execution: Document[];
  budget: Document[];
  rectifications: Document[];
  other: Document[];
}

/**
 * Extract year from document title - prioritize title over database year
 * because financial docs should be grouped by the year they reference, not upload year
 */
function extractYear(doc: Document): number {
  // First try to extract year from title (e.g., "Buget 2023", "Rectificare buget – august 2021")
  const titleMatch = doc.title.match(/\b(20\d{2})\b/);
  if (titleMatch) {
    return parseInt(titleMatch[1], 10);
  }
  
  // Fallback to database year field
  if (doc.year) return doc.year;
  
  // Default fallback
  return 2020;
}

/**
 * Determine document subcategory based on title content
 */
function getDocumentType(title: string): 'executie' | 'buget' | 'rectificare' | 'altele' {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('execuț') || lowerTitle.includes('executie') || lowerTitle.includes('execut')) {
    return 'executie';
  }
  if (lowerTitle.includes('rectifica')) {
    return 'rectificare';
  }
  if (lowerTitle.includes('buget') && (lowerTitle.includes('inițial') || lowerTitle.includes('initial') || lowerTitle.includes('aproba'))) {
    return 'buget';
  }
  return 'altele';
}

/**
 * Group documents by year and type
 */
function groupDocumentsByYear(documents: Document[]): YearData[] {
  const yearMap = new Map<number, YearData>();
  
  documents.forEach(doc => {
    const year = extractYear(doc);
    const type = doc.subcategory as 'executie' | 'buget' | 'rectificare' | 'altele' || getDocumentType(doc.title);
    
    if (!yearMap.has(year)) {
      yearMap.set(year, {
        year,
        execution: [],
        budget: [],
        rectifications: [],
        other: [],
      });
    }
    
    const yearData = yearMap.get(year)!;
    
    switch (type) {
      case 'executie':
        yearData.execution.push(doc);
        break;
      case 'buget':
        yearData.budget.push(doc);
        break;
      case 'rectificare':
        yearData.rectifications.push(doc);
        break;
      default:
        yearData.other.push(doc);
    }
  });
  
  // Sort by year descending
  return Array.from(yearMap.values()).sort((a, b) => b.year - a.year);
}

function DocumentItem({ doc }: { doc: Document }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="text-sm text-gray-700 truncate" title={doc.title}>{doc.title}</span>
      </div>
      <Link
        href={doc.file_url}
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

export default async function DocumenteFinanciarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tf = await getTranslations({ locale, namespace: 'financiarePage' });

  // Fetch all financial documents from database
  const allDocuments = await getDocumentsBySourceFolder('documente-si-informatii-financiare');
  
  // Group by year and type
  const yearlyData = groupDocumentsByYear(allDocuments);

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

            {/* Empty state */}
            {yearlyData.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileWarning className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">{tf('noDocuments')}</p>
                </CardContent>
              </Card>
            )}

            {/* Documente pe ani - Collapsible */}
            {yearlyData.length > 0 && (
              <CollapsibleGroup>
                {yearlyData.map((yearData, index) => {
                  const totalDocs = yearData.execution.length + yearData.budget.length + 
                                   yearData.rectifications.length + yearData.other.length;
                  
                  return (
                    <Collapsible
                      key={yearData.year}
                      title={
                        <span className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary-600" />
                          <span className="font-bold text-xl">{yearData.year}</span>
                          <span className="text-sm text-gray-500 font-normal">
                            ({totalDocs} {totalDocs === 1 ? 'document' : 'documente'})
                          </span>
                        </span>
                      }
                      defaultOpen={index < 2}
                    >
                      <div className="space-y-6 pt-2">

                        {/* Cont de execuție */}
                        {yearData.execution.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                              <h3 className="font-semibold text-gray-900">{tf('executionTitle')}</h3>
                              <span className="text-xs text-gray-500">({yearData.execution.length})</span>
                            </div>
                            <div className="space-y-2">
                              {yearData.execution.map((doc) => (
                                <div key={doc.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                                    <Link
                                      href={doc.file_url}
                                      target="_blank"
                                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                      PDF
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Buget general */}
                        {yearData.budget.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="w-5 h-5 text-primary-600" />
                              <h3 className="font-semibold text-gray-900">{tf('budgetGeneralTitle')}</h3>
                              <span className="text-xs text-gray-500">({yearData.budget.length})</span>
                            </div>
                            <div className="space-y-2">
                              {yearData.budget.map((doc) => (
                                <div key={doc.id} className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                                    <Link
                                      href={doc.file_url}
                                      target="_blank"
                                      className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-xs font-medium shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                      PDF
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documente extra / Alte documente */}
                        {yearData.other.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-5 h-5 text-amber-600" />
                              <h3 className="font-semibold text-gray-900">{tf('otherDocsTitle')}</h3>
                              <span className="text-xs text-gray-500">({yearData.other.length})</span>
                            </div>
                            <div className="space-y-2">
                              {yearData.other.map((doc) => (
                                <DocumentItem key={doc.id} doc={doc} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Rectificări bugetare */}
                        {yearData.rectifications.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <RefreshCw className="w-5 h-5 text-orange-600" />
                              <h3 className="font-semibold text-gray-900">{tf('rectificationsTitle')}</h3>
                              <span className="text-xs text-gray-500">({yearData.rectifications.length})</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {yearData.rectifications.map((doc) => (
                                <DocumentItem key={doc.id} doc={doc} />
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </Collapsible>
                  );
                })}
              </CollapsibleGroup>
            )}

          </div>
        </Container>
      </Section>
    </>
  );
}
