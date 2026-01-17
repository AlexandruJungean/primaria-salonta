'use client';

import { useState } from 'react';
import { Download, Users, User, Building, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { MandateGroupedReports, YearGroupedReports, ActivityReportItem } from '@/lib/supabase/services/reports';

// Simple labels interface (no functions - can be serialized to client)
export interface PageLabels {
  committees: string;
  councilors: string;
  mandatePrefix: string;
  mandateSuffix: string;
  yearPrefix: string;
  yearSuffix: string;
  reportsText: string;
}

// Helper functions for formatting
function formatMandate(mandate: string, labels: PageLabels): string {
  return `${labels.mandatePrefix}${mandate}${labels.mandateSuffix}`;
}

function formatYear(year: number | string, labels: PageLabels): string {
  return `${labels.yearPrefix}${year}${labels.yearSuffix}`;
}

function formatReportsCount(count: number, labels: PageLabels): string {
  return `${count} ${labels.reportsText}`;
}

// ============================================
// REPORT CARD COMPONENTS
// ============================================

function CommitteeCard({ report }: { report: ActivityReportItem }) {
  if (!report.file_url) return null;
  
  return (
    <div className="flex items-center justify-between py-2.5 px-4 bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-primary-600" />
        </div>
        <span className="font-medium text-gray-800 text-sm">{report.title}</span>
      </div>
      <a
        href={report.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors shrink-0"
      >
        <Download className="w-3 h-3" />
        PDF
      </a>
    </div>
  );
}

function CouncilorCard({ report }: { report: ActivityReportItem }) {
  if (!report.file_url) return null;
  
  return (
    <div className="flex items-center justify-between py-2.5 px-4 bg-white rounded-lg border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <span className="font-medium text-gray-800 text-sm">{report.author || report.title}</span>
        </div>
      </div>
      <a
        href={report.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
      >
        <Download className="w-3 h-3" />
        PDF
      </a>
    </div>
  );
}

// ============================================
// YEAR SECTION (Collapsible)
// ============================================

function YearSection({ 
  yearSection, 
  labels,
  defaultOpen = false,
}: { 
  yearSection: YearGroupedReports; 
  labels: PageLabels;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const committeeCount = yearSection.committees.length;
  const councilorCount = yearSection.councilors.length;
  const totalCount = committeeCount + councilorCount;
  
  if (totalCount === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary-500"></span>
          <span className="font-semibold text-gray-900">
            {formatYear(yearSection.year, labels)}
          </span>
          <span className="text-sm text-gray-500">
            ({formatReportsCount(totalCount, labels)})
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-white space-y-4">
            {committeeCount > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
                  {labels.committees} ({committeeCount})
                </p>
                <div className="space-y-2">
                  {yearSection.committees.map((committee) => (
                    <CommitteeCard key={committee.id} report={committee} />
                  ))}
                </div>
              </div>
            )}
            
            {councilorCount > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
                  {labels.councilors} ({councilorCount})
                </p>
                <div className="space-y-2">
                  {yearSection.councilors.map((councilor) => (
                    <CouncilorCard key={councilor.id} report={councilor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MANDATE SECTION (Collapsible)
// ============================================

function MandateSection({ 
  mandateSection,
  labels,
  defaultOpen = false,
}: { 
  mandateSection: MandateGroupedReports;
  labels: PageLabels;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const totalReports = mandateSection.years.reduce(
    (acc, y) => acc + y.committees.length + y.councilors.length, 
    0
  );
  
  if (totalReports === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header - Clickable */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-primary-50 px-5 py-4 border-b border-primary-100 hover:bg-primary-100 transition-colors text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-primary-700" />
            <h3 className="font-bold text-primary-900 text-lg">
              {formatMandate(mandateSection.mandate, labels)}
            </h3>
            <span className="text-sm text-primary-600 font-medium">
              ({formatReportsCount(totalReports, labels)})
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-primary-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Years - Collapsible */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-5 space-y-3">
              {mandateSection.years.map((yearSection, idx) => (
                <YearSection 
                  key={`${mandateSection.mandate}-${yearSection.year}-${idx}`} 
                  yearSection={yearSection}
                  labels={labels}
                  defaultOpen={idx === 0} // First year is open by default
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN ACCORDION COMPONENT
// ============================================

interface MandateAccordionProps {
  mandateSections: MandateGroupedReports[];
  labels: PageLabels;
}

export function MandateAccordion({ mandateSections, labels }: MandateAccordionProps) {
  return (
    <div className="space-y-4">
      {mandateSections.map((mandateSection, idx) => (
        <MandateSection 
          key={mandateSection.mandate} 
          mandateSection={mandateSection}
          labels={labels}
          defaultOpen={idx === 0} // First mandate is open by default
        />
      ))}
    </div>
  );
}
