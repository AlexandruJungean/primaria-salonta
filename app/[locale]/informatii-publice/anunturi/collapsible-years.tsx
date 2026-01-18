'use client';

import { useState } from 'react';
import { ChevronDown, Download, Megaphone, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import type { Announcement } from '@/lib/supabase/services/documents';

interface YearSectionProps {
  year: number;
  announcements: Announcement[];
  defaultOpen?: boolean;
  locale: string;
}

function YearSection({ year, announcements, defaultOpen = false, locale }: YearSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tPage = useTranslations('anunturiPage');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'hu' ? 'hu-HU' : locale === 'en' ? 'en-GB' : 'ro-RO',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{year}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {announcements.length} {tPage('announcements')}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-3 p-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(announcement.date)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-3">{announcement.title}</h3>
                    
                    {/* Attachments */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {announcement.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
                          >
                            <Download className="w-4 h-4 text-primary-600" />
                            <span className="text-gray-700">{attachment.title}</span>
                            <span className="text-xs text-gray-400">({attachment.fileType})</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AnunturiCollapsibleYearsProps {
  groupedByYear: Record<number, Announcement[]>;
  years: number[];
  locale: string;
}

export function AnunturiCollapsibleYears({ groupedByYear, years, locale }: AnunturiCollapsibleYearsProps) {
  return (
    <div className="space-y-4">
      {years.map((year, index) => (
        <YearSection
          key={year}
          year={year}
          announcements={groupedByYear[year] || []}
          defaultOpen={index === 0}
          locale={locale}
        />
      ))}
    </div>
  );
}
