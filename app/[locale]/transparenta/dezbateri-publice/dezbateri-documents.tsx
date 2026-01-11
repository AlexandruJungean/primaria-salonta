'use client';

import { Calendar, Download, Users, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import type { Document } from '@/lib/types/database';

interface DezbateriDocumentsProps {
  documentsByYear: Record<number, Document[]>;
  recentYears: number[];
  archiveYears: number[];
  translations: {
    archive: string;
    archiveTitle: string;
    debates: string;
  };
}

// Extract date from document title
function extractDateFromTitle(title: string): string | null {
  const datePattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  const match = title.match(datePattern);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  return null;
}

function DebateCard({ doc }: { doc: Document }) {
  const date = extractDateFromTitle(doc.title);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1 min-w-0">
            {date && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
            )}
            <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1">
              {doc.title}
            </h3>
            {doc.description && (
              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
            )}
            {doc.file_url && (
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Descarcă document
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DezbateriDocuments({ 
  documentsByYear, 
  recentYears, 
  archiveYears, 
  translations 
}: DezbateriDocumentsProps) {
  return (
    <div className="space-y-6">
      {/* Recent Years - Collapsible */}
      {recentYears.map((year, index) => (
        <Collapsible
          key={year}
          title={
            <div className="flex items-center gap-3">
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                {year}
              </span>
              <span className="text-gray-500 text-sm">
                {documentsByYear[year].length} {translations.debates}
              </span>
            </div>
          }
          defaultOpen={index === 0}
        >
          <div className="space-y-3">
            {documentsByYear[year].map((doc) => (
              <DebateCard key={doc.id} doc={doc} />
            ))}
          </div>
        </Collapsible>
      ))}

      {/* Archive Section */}
      {archiveYears.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-500" />
            {translations.archiveTitle}
          </h2>
          
          <div className="space-y-6">
            {archiveYears.map((year) => (
              <Collapsible
                key={year}
                title={
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                      {translations.archive} {year}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {documentsByYear[year].length} {translations.debates}
                    </span>
                  </div>
                }
                defaultOpen={false}
              >
                <div className="space-y-3">
                  {documentsByYear[year].map((doc) => (
                    <DebateCard key={doc.id} doc={doc} />
                  ))}
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
