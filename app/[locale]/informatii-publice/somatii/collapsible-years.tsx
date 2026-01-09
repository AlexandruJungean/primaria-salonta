'use client';

import { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Announcement {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
}

interface YearSection {
  year: string;
  announcements: Announcement[];
}

interface YearSectionComponentProps {
  year: string;
  announcements: Announcement[];
  defaultOpen?: boolean;
}

function YearSectionComponent({ year, announcements, defaultOpen = false }: YearSectionComponentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tPage = useTranslations('somatiiPage');

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">{year}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {announcements.length} {tPage('documents')}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-2 p-4">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm text-gray-900 block truncate">{announcement.title}</span>
                  {announcement.date && (
                    <span className="text-xs text-gray-500">({announcement.date})</span>
                  )}
                </div>
              </div>
              <a
                href={announcement.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white hover:border-amber-300 transition-colors shrink-0"
              >
                <Download className="w-4 h-4 text-amber-600" />
                PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SomatiiCollapsibleYearsProps {
  yearSections: YearSection[];
}

export function SomatiiCollapsibleYears({ yearSections }: SomatiiCollapsibleYearsProps) {
  return (
    <div className="space-y-4">
      {yearSections.map((section, index) => (
        <YearSectionComponent
          key={section.year}
          year={section.year}
          announcements={section.announcements}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
