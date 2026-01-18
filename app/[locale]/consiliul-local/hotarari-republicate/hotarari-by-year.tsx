'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Paperclip, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import type { DocumentWithAnnexes } from '@/lib/types/database';

interface HotarariByYearProps {
  groupedByYear: Record<number, DocumentWithAnnexes[]>;
  sortedYears: number[];
  labels: {
    yearLabel: string;
    document: string;
    documents: string;
    annexes: string;
  };
}

export function HotarariByYear({ groupedByYear, sortedYears, labels }: HotarariByYearProps) {
  const [openYears, setOpenYears] = useState<Record<number, boolean>>({});

  const toggleYear = (year: number) => {
    setOpenYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  return (
    <div className="space-y-4">
      {sortedYears.map((year) => {
        const isOpen = openYears[year] ?? false;
        const decisions = groupedByYear[year];
        
        return (
          <div key={year} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleYear(year)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {labels.yearLabel} {year}
                </h2>
                <span className="text-sm text-gray-500">
                  ({decisions.length} {decisions.length === 1 ? labels.document : labels.documents})
                </span>
              </div>
              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-gray-500 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} 
              />
            </button>
            
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0 space-y-3">
                  {decisions.map((decision) => (
                    <Card key={decision.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm">
                                {decision.title}
                              </h3>
                              {decision.description && (
                                <p className="text-sm text-gray-500 mt-1">{decision.description}</p>
                              )}
                            </div>
                          </div>
                          <a
                            href={decision.file_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </a>
                        </div>
                      </CardContent>
                      
                      {/* Annexes section */}
                      {decision.annexes && decision.annexes.length > 0 && (
                        <div className="border-t border-gray-100 bg-amber-50/50 px-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Paperclip className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-medium text-amber-700">
                              {labels.annexes} ({decision.annexes.length})
                            </span>
                          </div>
                          <div className="space-y-1.5 ml-6">
                            {decision.annexes.map((annex) => (
                              <a
                                key={annex.id}
                                href={annex.file_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors group"
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-600" />
                                <span className="flex-1 truncate">{annex.title}</span>
                                <Download className="w-3 h-3 text-gray-400 group-hover:text-amber-600" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
