'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Download, FileText, FolderOpen, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';

interface BudgetDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  year: number;
  subcategory: string;
}

interface BudgetSection {
  id: string;
  title: string;
  documents: BudgetDocument[];
}

interface YearData {
  year: number;
  sections: BudgetSection[];
}

function DocumentGrid({ documents }: { documents: BudgetDocument[] }) {
  if (documents.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {documents.map((doc) => (
        <a
          key={doc.id}
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
        >
          <Download className="w-4 h-4 text-primary-600" />
          <span className="text-gray-700">{doc.title}</span>
        </a>
      ))}
    </div>
  );
}

function BudgetSectionCard({ section }: { section: BudgetSection }) {
  return (
    <Card hover className="border-0 shadow-sm">
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-3">{section.title}</h3>
            <DocumentGrid documents={section.documents} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetContent() {
  const tPage = useTranslations('bugetPage');
  const [documents, setDocuments] = useState<BudgetDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?category=buget');
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

  // Group documents by year and subcategory
  const groupedData: YearData[] = [];
  const yearMap = new Map<number, Map<string, BudgetDocument[]>>();

  documents.forEach((doc) => {
    const year = doc.year || 2025;
    const subcategory = doc.subcategory || 'Altele';

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map());
    }
    const sectionMap = yearMap.get(year)!;
    if (!sectionMap.has(subcategory)) {
      sectionMap.set(subcategory, []);
    }
    sectionMap.get(subcategory)!.push(doc);
  });

  // Convert to array and sort
  yearMap.forEach((sectionMap, year) => {
    const sections: BudgetSection[] = [];
    sectionMap.forEach((docs, subcategory) => {
      sections.push({
        id: subcategory,
        title: subcategory || 'Fără titlu',
        documents: docs,
      });
    });
    groupedData.push({ year, sections });
  });

  groupedData.sort((a, b) => b.year - a.year);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
        <p className="text-gray-500 mt-4">Se încarcă...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{tPage('noDocuments')}</p>
      </div>
    );
  }

  return (
    <CollapsibleGroup>
      {groupedData.map((yearData, index) => (
        <Collapsible
          key={yearData.year}
          title={
            <span className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              <span className="text-lg font-bold">{yearData.year}</span>
              <span className="text-sm text-gray-500 font-normal">
                ({yearData.sections.length} {tPage('sections')})
              </span>
            </span>
          }
          defaultOpen={index === 0}
        >
          <div className="space-y-3">
            {yearData.sections.map((section) => (
              <BudgetSectionCard key={section.id} section={section} />
            ))}
          </div>
        </Collapsible>
      ))}
    </CollapsibleGroup>
  );
}
