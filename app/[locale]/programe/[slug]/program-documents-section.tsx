'use client';

import { useState, useMemo } from 'react';
import { Download, FileText, FolderOpen, ChevronDown, Calendar, Tag, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ProgramDocument, Program } from '@/lib/supabase/services/programs';
import { getCategoryLabel } from '@/lib/supabase/services/programs';

interface ProgramDocumentsSectionProps {
  documentGroups: Map<string, ProgramDocument[]>;
  grouping: Program['document_grouping'];
  labels: {
    documents: string;
    download: string;
    otherDocuments: string;
  };
}

export function ProgramDocumentsSection({ 
  documentGroups, 
  grouping,
  labels 
}: ProgramDocumentsSectionProps) {
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    if (ext === 'xls' || ext === 'xlsx') return 'XLS';
    if (ext === 'ppt' || ext === 'pptx') return 'PPT';
    return 'PDF';
  };

  // For year_category grouping, build hierarchical structure
  const hierarchicalData = useMemo(() => {
    if (grouping !== 'year_category') return null;

    const yearMap = new Map<string, Map<string, ProgramDocument[]>>();
    
    documentGroups.forEach((docs, key) => {
      const [year, category] = key.split('|');
      
      if (!yearMap.has(year)) {
        yearMap.set(year, new Map());
      }
      yearMap.get(year)!.set(category, docs);
    });

    // Sort years descending
    const sortedYears = Array.from(yearMap.entries()).sort((a, b) => {
      const aYear = parseInt(a[0]);
      const bYear = parseInt(b[0]);
      if (!isNaN(aYear) && !isNaN(bYear)) return bYear - aYear;
      if (a[0] === 'Alte ani') return 1;
      if (b[0] === 'Alte ani') return -1;
      return a[0].localeCompare(b[0]);
    });

    return sortedYears;
  }, [documentGroups, grouping]);

  // Sort groups for non-hierarchical groupings
  const sortedGroups = useMemo(() => {
    if (grouping === 'year_category') return [];
    
    return Array.from(documentGroups.entries()).sort((a, b) => {
      const aYear = parseInt(a[0]);
      const bYear = parseInt(b[0]);
      
      if (!isNaN(aYear) && !isNaN(bYear)) return bYear - aYear;
      if (a[0] === 'default' || a[0] === labels.otherDocuments) return 1;
      if (b[0] === 'default' || b[0] === labels.otherDocuments) return -1;
      
      const extractLastYear = (str: string) => {
        const matches = str.match(/(\d{4})/g);
        return matches ? parseInt(matches[matches.length - 1]) : 0;
      };
      
      const aLastYear = extractLastYear(a[0]);
      const bLastYear = extractLastYear(b[0]);
      
      if (aLastYear && bLastYear) return bLastYear - aLastYear;
      
      return a[0].localeCompare(b[0], 'ro');
    });
  }, [documentGroups, grouping, labels.otherDocuments]);

  // State for open groups
  const [openYears, setOpenYears] = useState<Set<string>>(() => {
    if (hierarchicalData && hierarchicalData.length > 0) {
      return new Set([hierarchicalData[0][0]]);
    }
    if (sortedGroups.length > 0) {
      return new Set([sortedGroups[0][0]]);
    }
    return new Set();
  });

  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    // Open 'rezultate' category in the first year by default, or all if no rezultate
    if (hierarchicalData && hierarchicalData.length > 0) {
      const firstYear = hierarchicalData[0][0];
      const categories = hierarchicalData[0][1];
      const hasRezultate = categories.has('rezultate');
      
      if (hasRezultate) {
        // Only open 'rezultate' by default
        return new Set([`${firstYear}|rezultate`]);
      } else {
        // Open all categories if no rezultate
        return new Set(Array.from(categories.keys()).map(cat => `${firstYear}|${cat}`));
      }
    }
    return new Set();
  });

  const toggleYear = (year: string) => {
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

  const toggleCategory = (yearCatKey: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(yearCatKey)) {
        next.delete(yearCatKey);
      } else {
        next.add(yearCatKey);
      }
      return next;
    });
  };

  const toggleGroup = (groupName: string) => {
    setOpenYears(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  // Year + Category hierarchical view
  if (grouping === 'year_category' && hierarchicalData) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          {labels.documents}
        </h2>

        <div className="space-y-4">
          {hierarchicalData.map(([year, categories]) => {
            const isYearOpen = openYears.has(year);
            const totalDocs = Array.from(categories.values()).reduce((sum, docs) => sum + docs.length, 0);
            
            // Sort categories: 'rezultate' first, then alphabetically, 'Alte categorii' last
            const sortedCategories = Array.from(categories.entries()).sort((a, b) => {
              // 'rezultate' always first
              if (a[0] === 'rezultate') return -1;
              if (b[0] === 'rezultate') return 1;
              // 'Alte categorii' always last
              if (a[0] === 'Alte categorii') return 1;
              if (b[0] === 'Alte categorii') return -1;
              return a[0].localeCompare(b[0], 'ro');
            });

            return (
              <Card key={year} className="overflow-hidden">
                {/* Year Header */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary-700" />
                    <h3 className="text-lg font-bold text-primary-900">
                      {year}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary-700 bg-primary-200 px-3 py-1 rounded-full font-medium">
                      {totalDocs} documente
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-primary-600 transition-transform duration-200 ${
                        isYearOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>

                {/* Categories under this year */}
                {isYearOpen && (
                  <div className="border-t divide-y">
                    {sortedCategories.map(([category, docs]) => {
                      const catKey = `${year}|${category}`;
                      const isCatOpen = openCategories.has(catKey);

                      const isRezultate = category === 'rezultate';
                      
                      return (
                        <div key={catKey}>
                          {/* Category Header */}
                          <button
                            onClick={() => toggleCategory(catKey)}
                            className={`w-full flex items-center justify-between p-3 pl-6 transition-colors text-left ${
                              isRezultate 
                                ? 'bg-emerald-50 hover:bg-emerald-100 border-l-4 border-emerald-500' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isRezultate ? (
                                <Trophy className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Tag className="w-4 h-4 text-gray-600" />
                              )}
                              <h4 className={`font-semibold ${isRezultate ? 'text-emerald-800 text-base' : 'text-gray-800'}`}>
                                {getCategoryLabel(category)}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                isRezultate 
                                  ? 'text-emerald-700 bg-emerald-200 font-medium' 
                                  : 'text-gray-500 bg-gray-200'
                              }`}>
                                {docs.length}
                              </span>
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isRezultate ? 'text-emerald-500' : 'text-gray-400'
                                } ${isCatOpen ? 'rotate-180' : ''}`} 
                              />
                            </div>
                          </button>

                          {/* Documents in this category */}
                          {isCatOpen && (
                            <div className="divide-y bg-white">
                              {docs.map((doc) => (
                                <DocumentRow 
                                  key={doc.id} 
                                  doc={doc} 
                                  getFileType={getFileType}
                                  indented 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Simple list without grouping
  const showSimpleList = sortedGroups.length === 1 && sortedGroups[0][0] === 'default';

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary-600" />
        {labels.documents}
      </h2>

      {showSimpleList ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {sortedGroups[0][1].map((doc) => (
                <DocumentRow key={doc.id} doc={doc} getFileType={getFileType} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedGroups.map(([groupName, docs]) => {
            const isOpen = openYears.has(groupName);
            const displayName = groupName === 'default' ? labels.otherDocuments : groupName;
            
            return (
              <Card key={groupName} className="overflow-hidden">
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FolderOpen className="w-5 h-5 text-primary-600 shrink-0" />
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {displayName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {docs.length}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                {isOpen && (
                  <CardContent className="p-0 border-t">
                    <div className="divide-y">
                      {docs.map((doc) => (
                        <DocumentRow key={doc.id} doc={doc} getFileType={getFileType} />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentRow({ 
  doc, 
  getFileType,
  indented = false
}: { 
  doc: ProgramDocument; 
  getFileType: (fileName: string) => string;
  indented?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors ${indented ? 'pl-10' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-primary-700" />
        </div>
        <span className="text-sm text-gray-700">
          {doc.title}
        </span>
      </div>
      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-xs font-medium shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        {getFileType(doc.file_name)}
      </a>
    </div>
  );
}
