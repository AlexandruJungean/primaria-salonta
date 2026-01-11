'use client';

import { useState } from 'react';
import { FileText, Download, FileCheck, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils/cn';
import type { DocumentWithAnnexes } from '@/lib/types/database';

interface GeneraleDocumentsProps {
  dispozitii: DocumentWithAnnexes[];
  rapoarteByYear: Record<number, DocumentWithAnnexes[]>;
  sortedYears: number[];
  labels: {
    dispozitiiTitle: string;
    rapoarteTitle: string;
    rapoarteAnuale: string;
  };
}

export function GeneraleDocuments({ 
  dispozitii, 
  rapoarteByYear, 
  sortedYears,
  labels 
}: GeneraleDocumentsProps) {
  const [dispozitiiOpen, setDispozitiiOpen] = useState(false);

  return (
    <>
      {/* Dispoziții Section - Collapsible as a whole */}
      {dispozitii.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-2xl border border-primary-200 overflow-hidden">
          <button
            onClick={() => setDispozitiiOpen(!dispozitiiOpen)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-primary-100/50 transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileCheck className="w-7 h-7 text-primary-600" />
              {labels.dispozitiiTitle}
              <span className="text-sm font-normal text-gray-500">({dispozitii.length})</span>
            </h2>
            <ChevronDown 
              className={cn(
                "w-6 h-6 text-primary-600 transition-transform duration-200",
                dispozitiiOpen && "rotate-180"
              )} 
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              dispozitiiOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-6">
                <ul className="space-y-2 bg-white rounded-xl p-4 border border-primary-100">
                  {dispozitii.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors py-2 px-3 rounded-lg hover:bg-primary-50"
                      >
                        <FileText className="w-4 h-4 text-primary-500 group-hover:text-primary-600 shrink-0" />
                        <span className="text-sm flex-1">{doc.title}</span>
                        <Download className="w-4 h-4 text-gray-300 group-hover:text-primary-600 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rapoarte Section - Collapsible by Year */}
      {sortedYears.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FileText className="w-7 h-7 text-orange-600" />
            {labels.rapoarteTitle}
          </h2>
          <CollapsibleGroup>
            {sortedYears.map((year, index) => (
              <Collapsible
                key={year}
                title={`${year} - ${labels.rapoarteAnuale}`}
                defaultOpen={index === 0} // First year open by default
                className="bg-white"
              >
                <ul className="space-y-3">
                  {rapoarteByYear[year].map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors py-1"
                      >
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                        <span className="text-sm font-medium">{doc.title}</span>
                        <Download className="w-3 h-3 text-gray-300 group-hover:text-primary-600 ml-auto shrink-0" />
                      </a>
                      {/* Anexe */}
                      {doc.annexes && doc.annexes.length > 0 && (
                        <ul className="ml-7 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                          {doc.annexes.map((annex) => (
                            <li key={annex.id}>
                              <a
                                href={annex.file_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors py-0.5"
                              >
                                <FileText className="w-3 h-3 text-gray-300 group-hover:text-primary-600 shrink-0" />
                                <span className="text-xs">{annex.title}</span>
                                <Download className="w-2.5 h-2.5 text-gray-200 group-hover:text-primary-600 ml-auto shrink-0" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </Collapsible>
            ))}
          </CollapsibleGroup>
        </div>
      )}
    </>
  );
}
