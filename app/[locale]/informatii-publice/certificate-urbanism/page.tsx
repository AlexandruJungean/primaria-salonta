'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Home, Download, FileText, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';

interface CertificateDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  year: number;
}

interface YearData {
  year: number;
  documents: CertificateDocument[];
}

function DocumentGrid({ documents }: { documents: CertificateDocument[] }) {
  if (documents.length === 0) return null;

  return (
    <div className="grid gap-2">
      {documents.map((doc) => (
        <a
          key={doc.id}
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-teal-700" />
          </div>
          <span className="flex-1 text-gray-700 text-sm">{doc.title}</span>
          <Download className="w-4 h-4 text-teal-600 shrink-0" />
        </a>
      ))}
    </div>
  );
}

export default function CertificateUrbanismPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('certificateUrbanismPage');
  const [documents, setDocuments] = useState<CertificateDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?category=certificate_urbanism');
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
  const groupedData: YearData[] = [];
  const yearMap = new Map<number, CertificateDocument[]>();

  documents.forEach((doc) => {
    const year = doc.year || 2020;
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(doc);
  });

  // Convert to array and sort
  yearMap.forEach((docs, year) => {
    groupedData.push({ year, documents: docs });
  });

  groupedData.sort((a, b) => b.year - a.year);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('certificateUrbanism') }
      ]} />
      <PageHeader titleKey="certificateUrbanism" icon="home" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-teal-50 border-teal-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Home className="w-8 h-8 text-teal-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-teal-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-teal-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Se încarcă...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{tPage('noDocuments')}</p>
              </div>
            ) : (
              <CollapsibleGroup>
                {groupedData.map((yearData, index) => (
                  <Collapsible
                    key={yearData.year}
                    title={
                      <span className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-teal-600" />
                        <span className="text-lg font-bold">{yearData.year}</span>
                        <span className="text-sm text-gray-500 font-normal">
                          ({yearData.documents.length} {tPage('documents')})
                        </span>
                      </span>
                    }
                    defaultOpen={index < 2}
                  >
                    <DocumentGrid documents={yearData.documents} />
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
