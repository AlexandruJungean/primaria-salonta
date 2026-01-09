'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Hammer, Calendar, Download, FileText, Archive, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  year: number;
  document_date: string | null;
}

function PermitCard({ doc }: { doc: Document }) {
  return (
    <Card hover className="border-0 shadow-sm">
      <CardContent className="flex items-center justify-between py-3 px-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-primary-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm">{doc.title}</h3>
        </div>
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-primary-600" />
          PDF
        </a>
      </CardContent>
    </Card>
  );
}

export default function AutorizatiiConstruirePage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('autorizatiiConstruirePage');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?category=autorizatii_construire');
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Group documents by year
  const documentsByYear = documents.reduce((acc, doc) => {
    const year = doc.year || 2020;
    if (!acc[year]) acc[year] = [];
    acc[year].push(doc);
    return acc;
  }, {} as Record<number, Document[]>);

  const years = Object.keys(documentsByYear).map(Number).sort((a, b) => b - a);
  const recentYears = years.filter(y => y >= 2018);
  const archiveYears = years.filter(y => y < 2018);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('autorizatiiConstruire') }
      ]} />
      <PageHeader titleKey="autorizatiiConstruire" icon="hammer" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Hammer className="w-8 h-8 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-primary-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Se încarcă...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{tPage('noDocuments')}</p>
              </div>
            ) : (
              <>
                {/* Recent Permits Section */}
                {recentYears.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-primary-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{tPage('currentTitle')}</h2>
                    </div>

                    <CollapsibleGroup>
                      {recentYears.map((year, index) => (
                        <Collapsible 
                          key={year} 
                          title={
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {year}
                              <span className="text-sm text-gray-500 font-normal">
                                ({documentsByYear[year].length} {tPage('documents')})
                              </span>
                            </span>
                          }
                          defaultOpen={index === 0}
                        >
                          <div className="space-y-2">
                            {documentsByYear[year].map((doc) => (
                              <PermitCard key={doc.id} doc={doc} />
                            ))}
                          </div>
                        </Collapsible>
                      ))}
                    </CollapsibleGroup>
                  </div>
                )}

                {/* Archive Section */}
                {archiveYears.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Archive className="w-5 h-5 text-amber-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{tPage('archiveTitle')}</h2>
                    </div>

                    <CollapsibleGroup>
                      {archiveYears.map((year) => (
                        <Collapsible 
                          key={year} 
                          title={
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {year}
                              <span className="text-sm text-gray-500 font-normal">
                                ({documentsByYear[year].length} {tPage('documents')})
                              </span>
                            </span>
                          }
                          defaultOpen={false}
                        >
                          <div className="space-y-2">
                            {documentsByYear[year].map((doc) => (
                              <PermitCard key={doc.id} doc={doc} />
                            ))}
                          </div>
                        </Collapsible>
                      ))}
                    </CollapsibleGroup>
                  </div>
                )}
              </>
            )}

            {/* Info Note */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
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
