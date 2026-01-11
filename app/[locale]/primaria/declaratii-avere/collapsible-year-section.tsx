'use client';

import { useState } from 'react';
import { Download, ChevronDown, ChevronRight } from 'lucide-react';

interface DeclarationEntry {
  id: string;
  person_name: string;
  avere_file_url: string | null;
  interese_file_url: string | null;
}

interface YearData {
  year: number;
  declarations: DeclarationEntry[];
}

interface CollapsibleYearSectionProps {
  yearData: YearData[];
  yearLabel: string;
}

export function CollapsibleYearSection({ yearData, yearLabel }: CollapsibleYearSectionProps) {
  // Primul an (cel mai recent) e deschis by default
  const [openYears, setOpenYears] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (yearData.length > 0) {
      initial.add(yearData[0].year);
    }
    return initial;
  });

  const toggleYear = (year: number) => {
    setOpenYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {yearData.map(({ year, declarations }) => {
        const isOpen = openYears.has(year);
        
        return (
          <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header - clickable */}
            <button
              onClick={() => toggleYear(year)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="font-semibold text-gray-700">
                  {yearLabel} {year}
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                {declarations.length} {declarations.length === 1 ? 'persoană' : 'persoane'}
              </span>
            </button>

            {/* Content - collapsible */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="divide-y divide-gray-100">
                {declarations.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900 text-sm">{entry.person_name}</span>
                    <div className="flex gap-2">
                      {entry.avere_file_url ? (
                        <a
                          href={entry.avere_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-3 h-3" />
                          av
                        </a>
                      ) : (
                        <span className="px-2 py-1 text-xs text-gray-400">-</span>
                      )}
                      {entry.interese_file_url ? (
                        <a
                          href={entry.interese_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-3 h-3" />
                          int
                        </a>
                      ) : (
                        <span className="px-2 py-1 text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
