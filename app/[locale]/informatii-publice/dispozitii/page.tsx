'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { FileSignature, Calendar, Download, Search, FileText } from 'lucide-react';
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
  year: number | null;
  document_date: string | null;
}

export default function DispozitiiPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('dispozitiiPage');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?category=dispozitii');
        if (response.ok) {
          const result = await response.json();
          setDocuments(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Filter documents by search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.file_name.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  // Group documents by year
  const groupedByYear = useMemo(() => {
    const groups = new Map<number, Document[]>();
    filteredDocuments.forEach((doc) => {
      const year = doc.year || 2020; // default year if not set
      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year)!.push(doc);
    });
    // Sort by year descending
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [filteredDocuments]);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('dispozitii') }
      ]} />
      <PageHeader titleKey="dispozitii" icon="fileSignature" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-violet-50 border-violet-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileSignature className="w-8 h-8 text-violet-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-violet-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-violet-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search box */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tPage('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2">
                  {filteredDocuments.length} {tPage('resultsFound')}
                </p>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Se încarcă...</p>
              </div>
            ) : groupedByYear.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{tPage('noDocuments')}</p>
              </div>
            ) : (
              <CollapsibleGroup>
                {groupedByYear.map(([year, docs], index) => (
                  <Collapsible
                    key={year}
                    title={
                      <span className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-violet-600" />
                        <span className="font-semibold">Anul {year}</span>
                        <span className="text-sm text-gray-500 font-normal">
                          ({docs.length} {docs.length === 1 ? 'dispoziție' : 'dispoziții'})
                        </span>
                      </span>
                    }
                    defaultOpen={index < 2}
                  >
                    <div className="space-y-2">
                      {docs.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-4 p-3 border border-gray-200 rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-colors group"
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                              <FileSignature className="w-4 h-4 text-violet-600" />
                            </div>
                            <span className="text-gray-700 text-sm group-hover:text-violet-700">
                              {doc.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-violet-100 shrink-0 group-hover:border-violet-300">
                            <Download className="w-3 h-3 text-violet-600" />
                            <span className="text-gray-600">PDF</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Collapsible>
                ))}
              </CollapsibleGroup>
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
