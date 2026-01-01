'use client';

import { useTranslations } from 'next-intl';
import { 
  Building,
  Download, 
  FileText,
  Palette,
  TreePine,
  Trophy,
  Award,
  ChevronDown,
  ChevronUp,
  Calendar,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types
interface DocumentLink {
  label: string;
  url: string;
  isNew?: boolean;
  notice?: string;
}

interface CategoryDocs {
  culture?: DocumentLink[];
  environment?: DocumentLink[];
  sport?: DocumentLink[];
}

interface YearData {
  year: number;
  resultsDate?: string;
  results?: {
    culture?: DocumentLink;
    sport?: DocumentLink;
    environment?: DocumentLink;
  };
  guideTitle?: string;
  guideDate?: string;
  logoUrl?: string;
  categories: CategoryDocs;
  specialAnnouncements?: DocumentLink[];
}

// Data for all years
const YEARS_DATA: YearData[] = [
  {
    year: 2025,
    resultsDate: '13.05.2025',
    results: {
      sport: { label: 'Rezultate – proiecte sport', url: '#' },
      culture: { label: 'Rezultate – proiecte cultură', url: '#' },
      environment: { label: 'Rezultate – proiecte mediu', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2025',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț de participare', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'ANEXA A – Cerere tip', url: '#' },
        { label: 'ANEXA B – Buget', url: '#' },
        { label: 'ANEXA C – Contract', url: '#' },
        { label: 'ANEXA D – Raportari finale', url: '#' },
        { label: 'ANEXA E – Criterii de evaluare', url: '#' },
        { label: 'ANEXA F – Anunț public', url: '#' },
        { label: 'ANEXA G – Declarație de parteneriat', url: '#' },
        { label: 'ANEXA H – Declarație GDPR', url: '#' },
        { label: 'ANEXA I – Declarație pe proprie răspundere', url: '#' },
        { label: 'Anexa J – Declarație imparțialitate', url: '#' },
      ],
      environment: [
        { label: 'Anunț de participare', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț de participare', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
  },
  {
    year: 2024,
    resultsDate: '16.05.2024',
    results: {
      culture: { label: 'Rezultate – proiecte cultură', url: '#' },
      sport: { label: 'Rezultate – proiecte sport', url: '#' },
      environment: { label: 'Rezultate – proiecte mediu', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2024',
    guideDate: '18.04.2024',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț de participare', url: '#' },
        { label: 'Ghidul solicitantului', url: '#', notice: 'Atenție! Ghidul este actualizat!' },
        { label: 'ANEXA A – Cerere tip', url: '#' },
        { label: 'ANEXA B – Buget', url: '#' },
        { label: 'ANEXA C – Contract', url: '#' },
        { label: 'ANEXA D – Raportari finale', url: '#' },
        { label: 'ANEXA E – Criterii de evaluare', url: '#' },
        { label: 'ANEXA F – Anunț public', url: '#' },
        { label: 'ANEXA G – Declarație de parteneriat', url: '#' },
        { label: 'ANEXA H – Declarație GDPR', url: '#' },
        { label: 'ANEXA I – Declarație pe proprie răspundere', url: '#' },
        { label: 'Anexa J – Declarație imparțialitate', url: '#' },
      ],
      environment: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
  },
  {
    year: 2023,
    resultsDate: '24.03.2023',
    results: {
      culture: { label: 'Rezultate – proiecte cultură', url: '#' },
      sport: { label: 'Rezultate – proiecte sport', url: '#' },
      environment: { label: 'Rezultate – proiecte mediu', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2023',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
  },
  {
    year: 2022,
    resultsDate: '15.04.2022',
    results: {
      culture: { label: 'Rezultate – proiecte cultură', url: '#' },
      sport: { label: 'Rezultate – proiecte sport', url: '#' },
      environment: { label: 'Rezultate – proiecte mediu', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2022',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
    specialAnnouncements: [
      { label: 'Anunț de participare – Acordarea de la bugetul local al mun. Salonta a unor subvenții asociațiilor, fundațiilor și cultelor, care înființează și administrează unități de asistență socială în mun. Salonta, în anul 2022', url: '#' },
      { label: 'Regulament subvenții sociale', url: '#' },
      { label: 'Cerere tip, anexa A și B', url: '#' },
      { label: 'Regulament Comisia de selectare', url: '#' },
      { label: 'Anexa 2C la Regulament Comisie', url: '#' },
    ],
  },
  {
    year: 2021,
    resultsDate: '22.09.2021',
    results: {
      culture: { label: 'Rezultate – proiecte cultură', url: '#' },
      sport: { label: 'Rezultate – proiecte sport', url: '#' },
      environment: { label: 'Rezultate – proiecte mediu', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2021',
    guideDate: '05.07.2020',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
  },
  {
    year: 2020,
    resultsDate: '19.05.2020',
    results: {
      culture: { label: 'Rezultate – proiecte cultură', url: '#' },
      sport: { label: 'Rezultate – proiecte sport', url: '#' },
      environment: { label: 'Rezultate – proiecte mediu', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2020',
    guideDate: '14.04.2020',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț cultură, mediu', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [
        { label: 'Anunț cultură, mediu', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț sport', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
    specialAnnouncements: [
      { label: 'Anunț privind activitatea comisiilor de evaluare a proiectelor de finanțare de la bugetul local', url: '#' },
    ],
  },
  {
    year: 2019,
    resultsDate: '14.05.2019',
    results: {
      environment: { label: 'Rezultate – proiecte de mediu', url: '#' },
      culture: { label: 'Rezultate – proiecte de cultură', url: '#' },
      sport: { label: 'Rezultate – proiecte de sport', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2019',
    guideDate: '09.05.2019',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț cultură', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [
        { label: 'Anunț mediu', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț sport', url: '#' },
        { label: 'Procedura finanțare sport Salonta', url: '#' },
        { label: 'Anexa PV Comisia evaluare', url: '#' },
        { label: 'Anexa Lista de verificare Comisie', url: '#' },
        { label: 'Declarație Imparțialitate membru Comisie', url: '#' },
        { label: 'Anexa Cerere de finanțare', url: '#' },
        { label: 'Anexa Raportări finanțare Sport', url: '#' },
        { label: 'Anexa D Criterii pt. comisie', url: '#' },
        { label: 'Anexa OPIS', url: '#' },
        { label: 'CV coordonator proiect sport', url: '#' },
        { label: 'Anexa Contract de finanțare sport', url: '#' },
      ],
    },
  },
  {
    year: 2018,
    resultsDate: '10.04.2018',
    results: {
      environment: { label: 'Rezultate proiecte de mediu/protecția animalelor', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2018',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț cultură', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [
        { label: 'Anunț mediu', url: '#' },
        { label: 'Ghidul solicitantului și formularele necesare', url: '#' },
      ],
      sport: [
        { label: 'Anunț sport', url: '#' },
        { label: 'Ghidul solicitantului + Erată', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
    },
    specialAnnouncements: [
      { label: 'Anunț de finanțare pentru proiecte de mediu/protecția animalelor (21.05.2018)', url: '#' },
      { label: 'Ghidul solicitantului în domeniul mediu/protecția animalelor', url: '#' },
      { label: 'Proiecte locale câștigătoare – 2018', url: '#' },
      { label: 'Rezultate proiecte mediu/protecția animalelor (29.06.2018)', url: '#' },
    ],
  },
  {
    year: 2017,
    results: {
      environment: { label: 'Rezultate proiecte mediu/protecția animalelor', url: '#' },
    },
    guideTitle: 'Ghidul proiectelor finanțate din bugetul local în 2017',
    logoUrl: '#',
    categories: {
      culture: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Criterii de evaluare', url: '#' },
        { label: 'Declarație de parteneriat', url: '#' },
        { label: 'Glosar termeni', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
      environment: [],
      sport: [
        { label: 'Anunț', url: '#' },
        { label: 'Ghidul solicitantului', url: '#' },
        { label: 'Cerere tip', url: '#' },
        { label: 'Buget', url: '#' },
        { label: 'Contract', url: '#' },
        { label: 'Raportări finale', url: '#' },
      ],
    },
    specialAnnouncements: [
      { label: 'Anunț de participare privind finanțările nerambursabile de la bugetul local ale programelor nonprofit de interes local în domeniul mediu/protecția animalelor (18.09.2017)', url: '#' },
      { label: 'Anunț de participare privind finanțările nerambursabile de la bugetul local ale programelor nonprofit de interes local în domeniul mediu/protecția animalelor (04.08.2017)', url: '#' },
      { label: 'Ghidul solicitantului privind regimul finanțărilor nerambursabile din fondurile bugetului local al mun. Salonta alocate pt. activități nonprofit de interes local, domeniul mediu/protecția animalelor', url: '#' },
      { label: 'Proiecte locale câștigătoare – 2017', url: '#' },
      { label: 'Anunț privind amânarea termenului de depunere a proiectelor cu finanțare din bugetul local (20.04.2017)', url: '#' },
    ],
  },
  {
    year: 2016,
    guideTitle: '',
    categories: {
      culture: [],
      environment: [],
      sport: [],
    },
    specialAnnouncements: [
      { label: 'Proiecte locale câștigătoare – 2016', url: '#' },
    ],
  },
];

// Add social programs section for 2017
const SOCIAL_PROGRAMS_2017 = [
  { label: 'Anunț', url: '#' },
  { label: 'Ghidul solicitantului', url: '#' },
  { label: 'Cerere tip', url: '#' },
  { label: 'Grilă de evaluare', url: '#' },
  { label: 'Contract', url: '#' },
];

// Document link component
function DocLink({ doc }: { doc: DocumentLink }) {
  return (
    <div className="flex flex-col">
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
      >
        <Download className="w-4 h-4 text-gray-500" />
        <span>{doc.label}</span>
        {doc.isNew && (
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-green-600 text-white">NOU</span>
        )}
      </a>
      {doc.notice && (
        <span className="flex items-center gap-1 text-xs text-amber-600 mt-1 ml-2">
          <AlertCircle className="w-3 h-3" />
          {doc.notice}
        </span>
      )}
    </div>
  );
}

// Category section component
function CategorySection({ 
  titleKey, 
  icon: Icon, 
  color, 
  documents,
  t
}: { 
  titleKey: 'culture' | 'environment' | 'sport' | 'socialPrograms'; 
  icon: typeof Palette; 
  color: string; 
  documents: DocumentLink[];
  t: (key: string) => string;
}) {
  if (!documents || documents.length === 0) return null;

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  };

  const classes = colorClasses[color] || colorClasses.purple;

  return (
    <div className={`p-4 rounded-xl border ${classes.border} ${classes.bg.replace('100', '50')}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${classes.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${classes.text}`} />
        </div>
        <h4 className={`font-semibold ${classes.text}`}>{t(titleKey)}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {documents.map((doc, idx) => (
          <DocLink key={idx} doc={doc} />
        ))}
      </div>
    </div>
  );
}

// Year section component
function YearSection({ data, t }: { data: YearData; t: (key: string) => string }) {
  const [isExpanded, setIsExpanded] = useState(data.year >= 2024);

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <CardTitle className="text-xl">{data.year}</CardTitle>
              {data.resultsDate && (
                <p className="text-sm text-gray-500">{t('results')}: {data.resultsDate}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* Results section */}
          {data.results && Object.keys(data.results).length > 0 && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">{t('results')}</h4>
                {data.resultsDate && (
                  <span className="text-xs text-blue-600">({data.resultsDate})</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.results.culture && <DocLink doc={data.results.culture} />}
                {data.results.sport && <DocLink doc={data.results.sport} />}
                {data.results.environment && <DocLink doc={data.results.environment} />}
              </div>
            </div>
          )}

          {/* Guide and Logo */}
          {data.guideTitle && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">{data.guideTitle}</span>
                  {data.guideDate && (
                    <span className="text-xs text-gray-500">({data.guideDate})</span>
                  )}
                </div>
              </div>
              {data.logoUrl && (
                <a
                  href={data.logoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-3 py-2 text-sm bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
                >
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  {t('projectsLogo')}
                </a>
              )}
            </div>
          )}

          {/* Categories */}
          <div className="space-y-4">
            <CategorySection
              titleKey="culture"
              icon={Palette}
              color="purple"
              documents={data.categories.culture || []}
              t={t}
            />
            <CategorySection
              titleKey="environment"
              icon={TreePine}
              color="green"
              documents={data.categories.environment || []}
              t={t}
            />
            <CategorySection
              titleKey="sport"
              icon={Trophy}
              color="orange"
              documents={data.categories.sport || []}
              t={t}
            />

            {/* Social programs for 2017 */}
            {data.year === 2017 && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-rose-700" />
                  </div>
                  <h4 className="font-semibold text-rose-700">{t('socialPrograms')}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PROGRAMS_2017.map((doc, idx) => (
                    <DocLink key={idx} doc={doc} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Special announcements */}
          {data.specialAnnouncements && data.specialAnnouncements.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800">{t('specialAnnouncements')}</h4>
              </div>
              <div className="space-y-2">
                {data.specialAnnouncements.map((doc, idx) => (
                  <DocLink key={idx} doc={doc} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function ProiecteLocalePage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('proiecteLocalePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('proiecteLocale') }
      ]} />
      <PageHeader titleKey="proiecteLocale" icon="building" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                {tp('description')}
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200" />
                <span className="text-sm text-gray-600">{tp('legendCulture')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                <span className="text-sm text-gray-600">{tp('legendEnvironment')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200" />
                <span className="text-sm text-gray-600">{tp('legendSport')}</span>
              </div>
            </div>

            {/* Years */}
            <div className="space-y-4">
              {YEARS_DATA.map((yearData) => (
                <YearSection key={yearData.year} data={yearData} t={tp} />
              ))}
            </div>

            {/* Info notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                {tp('infoNotice')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
