'use client';

import { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Announcement {
  id: number;
  title: string;
  date: string;
  pdfUrl: string;
}

interface YearSectionProps {
  year: string;
  announcements: Announcement[];
  defaultOpen?: boolean;
}

function YearSection({ year, announcements, defaultOpen = false }: YearSectionProps) {
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
                  <span className="text-xs text-gray-500">({announcement.date})</span>
                </div>
              </div>
              <a
                href={announcement.pdfUrl}
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

// Mock data - will be replaced with database
const ANNOUNCEMENTS_2025: Announcement[] = [
  { id: 1, title: 'Anunț colectiv', date: '12.11.2025', pdfUrl: '#' },
  { id: 2, title: 'Anunț colectiv', date: '11.11.2025', pdfUrl: '#' },
  { id: 3, title: 'Anunț colectiv', date: '06.08.2025', pdfUrl: '#' },
  { id: 4, title: 'Anunț colectiv', date: '28.05.2025', pdfUrl: '#' },
  { id: 5, title: 'Anunț colectiv', date: '02.04.2025', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2024: Announcement[] = [
  { id: 6, title: 'Anunț colectiv', date: '13.12.2024', pdfUrl: '#' },
  { id: 7, title: 'Anunț colectiv', date: '11.12.2024', pdfUrl: '#' },
  { id: 8, title: 'Anunț colectiv', date: '10.09.2024', pdfUrl: '#' },
  { id: 9, title: 'Anunț colectiv', date: '08.08.2024', pdfUrl: '#' },
  { id: 10, title: 'Anunț colectiv', date: '07.06.2024', pdfUrl: '#' },
  { id: 11, title: 'Anunț colectiv', date: '13.05.2024', pdfUrl: '#' },
  { id: 12, title: 'Anunț colectiv', date: '11.04.2024', pdfUrl: '#' },
  { id: 13, title: 'Anunț colectiv', date: '05.03.2024', pdfUrl: '#' },
  { id: 14, title: 'Anunț colectiv', date: '08.02.2024', pdfUrl: '#' },
  { id: 15, title: 'Anunț colectiv', date: '05.01.2024', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2023: Announcement[] = [
  { id: 16, title: 'Anunț colectiv', date: '14.11.2023', pdfUrl: '#' },
  { id: 17, title: 'Anunț colectiv', date: '03.11.2023', pdfUrl: '#' },
  { id: 18, title: 'Anunț colectiv', date: '02.11.2023', pdfUrl: '#' },
  { id: 19, title: 'Anunț colectiv', date: '01.11.2023', pdfUrl: '#' },
  { id: 20, title: 'Anunț colectiv', date: '31.10.2023', pdfUrl: '#' },
  { id: 21, title: 'Anunț colectiv', date: '04.08.2023', pdfUrl: '#' },
  { id: 22, title: 'Anunț colectiv', date: '22.05.2023', pdfUrl: '#' },
  { id: 23, title: 'Anunț colectiv pentru comunicarea prin publicitate', date: '15.03.2023', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2022: Announcement[] = [
  { id: 24, title: 'Anunț colectiv', date: '22.11.2022', pdfUrl: '#' },
  { id: 25, title: 'Anunț colectiv', date: '09.11.2022', pdfUrl: '#' },
  { id: 26, title: 'Anunț colectiv', date: '20.10.2022', pdfUrl: '#' },
  { id: 27, title: 'Anunț colectiv', date: '21.06.2022', pdfUrl: '#' },
  { id: 28, title: 'Anunț colectiv', date: '26.05.2022', pdfUrl: '#' },
  { id: 29, title: 'Anunț colectiv', date: '11.04.2022', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2021: Announcement[] = [
  { id: 30, title: 'Anunț colectiv', date: '12.11.2021', pdfUrl: '#' },
  { id: 31, title: 'Anunț colectiv', date: '08.11.2021', pdfUrl: '#' },
  { id: 32, title: 'Anunț colectiv', date: '25.10.2021', pdfUrl: '#' },
  { id: 33, title: 'Anunț colectiv', date: '26.08.2021', pdfUrl: '#' },
  { id: 34, title: 'Anunț colectiv', date: '23.08.2021', pdfUrl: '#' },
  { id: 35, title: 'Anunț colectiv', date: '09.07.2021', pdfUrl: '#' },
  { id: 36, title: 'Anunț colectiv', date: '29.06.2021', pdfUrl: '#' },
  { id: 37, title: 'Anunț colectiv', date: '17.06.2021', pdfUrl: '#' },
  { id: 38, title: 'Anunț colectiv', date: '16.06.2021', pdfUrl: '#' },
  { id: 39, title: 'Anunț colectiv', date: '10.06.2021', pdfUrl: '#' },
  { id: 40, title: 'Anunț colectiv – somații', date: '16.03.2021', pdfUrl: '#' },
  { id: 41, title: 'Anunț colectiv persoane fizice', date: '11.03.2021', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2020: Announcement[] = [
  { id: 42, title: 'Anunț colectiv persoane fizice', date: '25.03.2020', pdfUrl: '#' },
  { id: 43, title: 'Anunț colectiv persoane juridice', date: '25.03.2020', pdfUrl: '#' },
  { id: 44, title: 'Anunț colectiv persoane fizice', date: '03.02.2020', pdfUrl: '#' },
  { id: 45, title: 'Anunț colectiv: Horvath Janos, Fechete Dacian', date: '17.01.2020', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2019: Announcement[] = [
  { id: 46, title: 'Anunț colectiv pers. fizice', date: '23.12.2019', pdfUrl: '#' },
  { id: 47, title: 'Anunț colectiv pers. fizice', date: '05.12.2019', pdfUrl: '#' },
  { id: 48, title: 'Anunț colectiv persoane fizice', date: '22.11.2019', pdfUrl: '#' },
  { id: 49, title: 'Anunț colectiv persoane fizice', date: '15.11.2019', pdfUrl: '#' },
  { id: 50, title: 'Anunț colectiv persoane fizice', date: '30.10.2019', pdfUrl: '#' },
  { id: 51, title: 'Somație: Kiss Klara-Maria', date: '17.09.2019', pdfUrl: '#' },
  { id: 52, title: 'Anunț colectiv persoane juridice', date: '12.09.2019', pdfUrl: '#' },
  { id: 53, title: 'Anunț colectiv persoane juridice', date: '03.09.2019', pdfUrl: '#' },
  { id: 54, title: 'Anunț colectiv persoane fizice', date: '28.08.2019', pdfUrl: '#' },
  { id: 55, title: 'Anunț colectiv persoane juridice', date: '07.08.2019', pdfUrl: '#' },
  { id: 56, title: 'Anunț colectiv persoane juridice', date: '23.07.2019', pdfUrl: '#' },
  { id: 57, title: 'Anunț colectiv persoane fizice', date: '09.07.2019', pdfUrl: '#' },
  { id: 58, title: 'Somație: Bar Ionut Nicolae', date: '27.06.2019', pdfUrl: '#' },
  { id: 59, title: 'Anunț colectiv persoane fizice', date: '06.06.2019', pdfUrl: '#' },
  { id: 60, title: 'Somație: Bar Ionut Nicolae', date: '31.05.2019', pdfUrl: '#' },
  { id: 61, title: 'Anunț colectiv persoane fizice', date: '03.05.2019', pdfUrl: '#' },
  { id: 62, title: 'Anunț colectiv persoane fizice', date: '24.04.2019', pdfUrl: '#' },
  { id: 63, title: 'Anunț colectiv persoane fizice', date: '17.04.2019', pdfUrl: '#' },
  { id: 64, title: 'Anunț colectiv pers. fizice', date: '26.03.2019', pdfUrl: '#' },
  { id: 65, title: 'Anunț colectiv pers. juridice', date: '26.03.2019', pdfUrl: '#' },
  { id: 66, title: 'Anunț colectiv persoane juridice 2019', date: '12.02.2019', pdfUrl: '#' },
  { id: 67, title: 'Anunț colectiv: Kovacs Tunde-Maria/Zoltan', date: '12.02.2019', pdfUrl: '#' },
  { id: 68, title: 'Somație: Kovacs Tunde Maria', date: '16.01.2019', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2018: Announcement[] = [
  { id: 69, title: 'Anunț colectiv persoane juridice 2018', date: '11.12.2018', pdfUrl: '#' },
  { id: 70, title: 'Somație: Spunei Lidia', date: '21.11.2018', pdfUrl: '#' },
  { id: 71, title: 'Anunț colectiv persoane juridice', date: '31.07.2018', pdfUrl: '#' },
  { id: 72, title: 'Anunț colectiv – pers. juridice', date: '12.04.2018', pdfUrl: '#' },
  { id: 73, title: 'Somație: Giovado SRL Salonta', date: '27.03.2018', pdfUrl: '#' },
  { id: 74, title: 'Anunț colectiv, pentru comunicarea prin publicitate', date: '21.03.2018', pdfUrl: '#' },
  { id: 75, title: 'Acte administrative fiscale emise pentru contribuabilul: Mândruț Tünde', date: '15.02.2018', pdfUrl: '#' },
  { id: 76, title: 'Anunț colectiv – Persoane fizice', date: '09.02.2018', pdfUrl: '#' },
];

const ANNOUNCEMENTS_2017: Announcement[] = [
  { id: 77, title: 'Anunț colectiv – Comunicat privind actele administrative fiscale emise pentru contribuabili', date: '29.12.2017', pdfUrl: '#' },
  { id: 78, title: 'Anunț colectiv – Comunicat privind actele administrative fiscale emise pentru contribuabili, pers. juridice', date: '24.11.2017', pdfUrl: '#' },
  { id: 79, title: 'Anunț colectiv – Comunicat privind actele administrative fiscale emise pentru contribuabili', date: '09.10.2017', pdfUrl: '#' },
];

const YEAR_SECTIONS = [
  { year: '2025', announcements: ANNOUNCEMENTS_2025 },
  { year: '2024', announcements: ANNOUNCEMENTS_2024 },
  { year: '2023', announcements: ANNOUNCEMENTS_2023 },
  { year: '2022', announcements: ANNOUNCEMENTS_2022 },
  { year: '2021', announcements: ANNOUNCEMENTS_2021 },
  { year: '2020', announcements: ANNOUNCEMENTS_2020 },
  { year: '2019', announcements: ANNOUNCEMENTS_2019 },
  { year: '2018', announcements: ANNOUNCEMENTS_2018 },
  { year: '2017', announcements: ANNOUNCEMENTS_2017 },
];

export function SomatiiCollapsibleYears() {
  return (
    <div className="space-y-4">
      {YEAR_SECTIONS.map((section, index) => (
        <YearSection
          key={section.year}
          year={section.year}
          announcements={section.announcements}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}

