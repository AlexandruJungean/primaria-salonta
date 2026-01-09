import { getTranslations } from 'next-intl/server';
import { ShoppingCart, ExternalLink, Calendar, Download, FileText, FolderOpen, Archive, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';
import { generatePageMetadata } from '@/lib/seo';
import { getDocumentsByCategory, getDocumentYears } from '@/lib/supabase/services/documents';
import type { Locale } from '@/lib/seo/config';
import type { Document } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'achizitii',
    locale: locale as Locale,
    path: '/informatii-publice/achizitii',
  });
}

// Group documents by year
function groupDocumentsByYear(documents: Document[]): Record<number, Document[]> {
  const grouped: Record<number, Document[]> = {};
  
  documents.forEach(doc => {
    const year = doc.year || new Date(doc.document_date || doc.created_at).getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(doc);
  });
  
  return grouped;
}

// Format date for display
function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(
    locale === 'hu' ? 'hu-HU' : locale === 'en' ? 'en-GB' : 'ro-RO',
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  );
}

// Document card component
function DocumentCard({ doc, locale }: { doc: Document; locale: string }) {
  const formattedDate = formatDate(doc.document_date, locale);
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-primary-700" />
      </div>
      <div className="flex-1 min-w-0">
        {formattedDate && (
          <div className="flex items-center gap-1.5 mb-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        )}
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 text-gray-700 hover:text-primary-700 transition-colors"
        >
          <span className="flex-1 text-sm">{doc.title}</span>
          <Download className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-primary-600" />
        </a>
        {doc.description && (
          <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
        )}
      </div>
    </div>
  );
}

// Year section component with collapsible
function YearSection({ 
  year, 
  documents, 
  locale,
  defaultOpen = false
}: { 
  year: number; 
  documents: Document[]; 
  locale: string;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible
      title={`${year} (${documents.length} documente)`}
      icon={<Archive className="w-5 h-5 text-amber-600" />}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-1">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} locale={locale} />
        ))}
      </div>
    </Collapsible>
  );
}

export default async function AchizitiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'achizitiiPage' });

  // Fetch documents from database
  const documents = await getDocumentsByCategory('achizitii', 500);
  const years = await getDocumentYears('achizitii');
  
  // Group by year
  const documentsByYear = groupDocumentsByYear(documents);
  
  // Sort years descending
  const sortedYears = years.length > 0 
    ? years 
    : Object.keys(documentsByYear).map(Number).sort((a, b) => b - a);

  // Separate current year and archives
  const currentYear = new Date().getFullYear();
  const recentYears = sortedYears.filter(y => y >= currentYear - 1);
  const archiveYears = sortedYears.filter(y => y < currentYear - 1);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('achizitiiPublice') }
      ]} />
      <PageHeader titleKey="achizitiiPublice" icon="shoppingCart" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* SEAP Link */}
            <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-primary-50 rounded-xl">
              <span className="text-gray-700">{tPage('seapNote')}</span>
              <a
                href="https://www.e-licitatie.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-700 hover:underline inline-flex items-center gap-1"
              >
                SEAP (e-licitatie.ro) <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Required Forms Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary-600" />
                  {tPage('requiredForms')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a
                    href="https://pub-c6874596c76543a2ac314657c3d9fff8.r2.dev/documente/2026/achizitii-publice-directe.doc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4 text-primary-500" />
                    <span>Achiziții publice directe (formulare)</span>
                  </a>
                  <a
                    href="https://pub-c6874596c76543a2ac314657c3d9fff8.r2.dev/documente/2026/achizitii-publice-cerere-de-oferte.doc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4 text-primary-500" />
                    <span>Achiziții publice – cerere de oferte (formulare)</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Documents from Database */}
            {documents.length > 0 ? (
              <>
                {/* Recent Years (Current + Previous) - Open by default */}
                {recentYears.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-primary-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{tPage('currentDocuments')}</h2>
                    </div>
                    <CollapsibleGroup>
                      {recentYears.map((year) => (
                        documentsByYear[year] && (
                          <YearSection
                            key={year}
                            year={year}
                            documents={documentsByYear[year]}
                            locale={locale}
                            defaultOpen={year === currentYear}
                          />
                        )
                      ))}
                    </CollapsibleGroup>
                  </div>
                )}

                {/* Archive Years */}
                {archiveYears.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Archive className="w-5 h-5 text-amber-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{tPage('archiveTitle')}</h2>
                    </div>
                    <CollapsibleGroup>
                      {archiveYears.map((year) => (
                        documentsByYear[year] && (
                          <YearSection
                            key={year}
                            year={year}
                            documents={documentsByYear[year]}
                            locale={locale}
                            defaultOpen={false}
                          />
                        )
                      ))}
                    </CollapsibleGroup>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{tPage('noDocuments')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
