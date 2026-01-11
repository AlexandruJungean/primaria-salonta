'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Calendar, Palette, TreePine, Trophy, Users, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  file_url: string;
}

interface YearData {
  year: number;
  results: {
    culture: Document[];
    sport: Document[];
    mediu: Document[];
  };
  guides: {
    culture: Document[];
    mediu: Document[];
    sport: Document[];
    social: Document[];
  };
  extraDocs: Document[];
}

interface Labels {
  culture: string;
  environment: string;
  sport: string;
  social: string;
  results: string;
  guideTitle: string;
  logoCaption: string;
}

interface LocalProjectsAccordionProps {
  yearsData: YearData[];
  labels: Labels;
  logoUrl: string | null;
}

export function LocalProjectsAccordion({ yearsData, labels, logoUrl }: LocalProjectsAccordionProps) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  const categoryConfig = {
    culture: { label: labels.culture, icon: Palette, color: 'text-purple-700' },
    mediu: { label: labels.environment, icon: TreePine, color: 'text-green-700' },
    sport: { label: labels.sport, icon: Trophy, color: 'text-amber-700' },
    social: { label: labels.social, icon: Users, color: 'text-blue-700' },
  };

  const getFileExtension = (url: string) => {
    const ext = url.split('.').pop()?.toUpperCase() || 'FILE';
    return ext.length > 4 ? 'FILE' : ext;
  };

  const DocumentLink = ({ doc }: { doc: Document }) => (
    <a
      href={doc.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 hover:underline py-0.5"
    >
      <Download className="w-3.5 h-3.5 shrink-0" />
      <span>{doc.title}</span>
    </a>
  );

  return (
    <div className="space-y-6">
      {yearsData.map((yearData) => {
        const isExpanded = expandedYears.has(yearData.year);
        const hasResults = yearData.results.culture.length > 0 || 
                          yearData.results.sport.length > 0 || 
                          yearData.results.mediu.length > 0;
        const hasGuides = yearData.guides.culture.length > 0 || 
                         yearData.guides.mediu.length > 0 || 
                         yearData.guides.sport.length > 0 ||
                         yearData.guides.social.length > 0;
        const hasExtraDocs = yearData.extraDocs.length > 0;
        const hasAnyContent = hasResults || hasGuides || hasExtraDocs;

        if (!hasAnyContent) return null;

        return (
          <div key={yearData.year} className="border-b border-gray-200 pb-6 last:border-0">
            {/* Year Header */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              {yearData.year}
            </h2>

            {/* Results Section */}
            {hasResults && (
              <div className="mb-4 space-y-1">
                {yearData.results.culture.map((doc) => (
                  <DocumentLink key={doc.id} doc={doc} />
                ))}
                {yearData.results.sport.map((doc) => (
                  <DocumentLink key={doc.id} doc={doc} />
                ))}
                {yearData.results.mediu.map((doc) => (
                  <DocumentLink key={doc.id} doc={doc} />
                ))}
              </div>
            )}

            {/* Guide Accordion */}
            {hasGuides && (
              <Card className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors py-3"
                  onClick={() => toggleYear(yearData.year)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-gray-700">
                      {labels.guideTitle} {yearData.year}
                    </CardTitle>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 text-gray-500 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <CardContent className="pt-0 pb-6">
                    {/* Logo */}
                    {logoUrl && (
                      <div className="text-center mb-6">
                        <div className="relative w-full max-w-md mx-auto aspect-[3/1.5]">
                          <Image
                            src={logoUrl}
                            alt="Logo proiecte Primăria Salonta"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-500 italic mt-2">
                          {labels.logoCaption}
                        </p>
                      </div>
                    )}

                    {/* Culture Section */}
                    {yearData.guides.culture.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Palette className="w-4 h-4 text-purple-600" />
                          {labels.culture}:
                        </h4>
                        <div className="space-y-1 pl-6">
                          {yearData.guides.culture.map((doc) => (
                            <DocumentLink key={doc.id} doc={doc} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Environment Section */}
                    {yearData.guides.mediu.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <TreePine className="w-4 h-4 text-green-600" />
                          {labels.environment}:
                        </h4>
                        <div className="space-y-1 pl-6">
                          {yearData.guides.mediu.map((doc) => (
                            <DocumentLink key={doc.id} doc={doc} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sport Section */}
                    {yearData.guides.sport.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-600" />
                          {labels.sport}:
                        </h4>
                        <div className="space-y-1 pl-6">
                          {yearData.guides.sport.map((doc) => (
                            <DocumentLink key={doc.id} doc={doc} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Section (for 2017) */}
                    {yearData.guides.social.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          {labels.social}:
                        </h4>
                        <div className="space-y-1 pl-6">
                          {yearData.guides.social.map((doc) => (
                            <DocumentLink key={doc.id} doc={doc} />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Extra Documents (standalone announcements) */}
            {hasExtraDocs && (
              <div className="mt-4 space-y-1">
                {yearData.extraDocs.map((doc) => (
                  <DocumentLink key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
