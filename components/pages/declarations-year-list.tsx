'use client';

import { FileText, Scale, User, Calendar } from 'lucide-react';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';
import { useTranslations } from 'next-intl';

interface Declaration {
  id: string;
  person_name: string;
  declaration_year: number;
  avere_file_url: string | null;
  interese_file_url: string | null;
}

interface DeclarationsYearListProps {
  declarations: Declaration[];
}

export function DeclarationsYearList({ declarations }: DeclarationsYearListProps) {
  const td = useTranslations('declaratiiPage');

  // Group declarations by year
  const declarationsByYear = declarations.reduce((acc, decl) => {
    if (!acc[decl.declaration_year]) {
      acc[decl.declaration_year] = [];
    }
    acc[decl.declaration_year].push(decl);
    return acc;
  }, {} as Record<number, Declaration[]>);

  // Get years sorted descending
  const years = Object.keys(declarationsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (years.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{td('noDeclarations')}</p>
      </div>
    );
  }

  return (
    <CollapsibleGroup>
      {years.map((year, index) => {
        const yearDeclarations = declarationsByYear[year] || [];
        // Sort by person name
        yearDeclarations.sort((a, b) =>
          a.person_name.localeCompare(b.person_name, 'ro')
        );

        return (
          <Collapsible
            key={year}
            defaultOpen={index === 0} // First year (most recent) is open by default
            icon={
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-700" />
              </div>
            }
            title={
              <span className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {td('declarationsYear', { year })}
                </span>
                <span className="text-sm text-gray-500 font-normal">
                  ({td('persons', { count: yearDeclarations.length })})
                </span>
              </span>
            }
            className="border-0 shadow-sm"
            titleClassName="px-6 py-4 bg-white hover:bg-gray-50"
            contentClassName="px-6 pb-6 pt-2"
          >
            {yearDeclarations.length === 0 ? (
              <p className="text-gray-500 text-sm">{td('noDeclarationsForYear')}</p>
            ) : (
              <div className="space-y-2">
                {yearDeclarations.map((decl) => (
                  <div
                    key={decl.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">{decl.person_name}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-11 sm:ml-0 flex-shrink-0">
                      {decl.avere_file_url && (
                        <a
                          href={decl.avere_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 hover:border-emerald-300"
                          title={td('wealth')}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {td('wealth')}
                        </a>
                      )}
                      {decl.interese_file_url && (
                        <a
                          href={decl.interese_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 hover:border-blue-300"
                          title={td('interests')}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          {td('interests')}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Collapsible>
        );
      })}
    </CollapsibleGroup>
  );
}
