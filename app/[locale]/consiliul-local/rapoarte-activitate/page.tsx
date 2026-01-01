'use client';

import { useTranslations } from 'next-intl';
import { FileText, Download, Users, User, Building } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for activity reports
interface YearReport {
  year: string;
  url: string;
}

interface CommitteeReport {
  type: 'committee';
  name: string;
  url: string;
}

interface CouncilorReport {
  type: 'councilor';
  name: string;
  note?: string; // e.g., "viceprimar"
  reports: YearReport[];
  fullMandateReport?: { label: string; url: string };
}

interface YearSection {
  year: string;
  committees: CommitteeReport[];
  councilors: CouncilorReport[];
}

interface MandateSection {
  id: string;
  mandate: string;
  years: YearSection[];
}

// Mock data - will be replaced with database content
const MANDATE_SECTIONS: MandateSection[] = [
  {
    id: '2024-2028',
    mandate: '2024-2028',
    years: [
      {
        year: '2024',
        committees: [
          { type: 'committee', name: 'Comisia de cultură', url: '#' },
          { type: 'committee', name: 'Comisia economică', url: '#' },
          { type: 'committee', name: 'Comisia juridică', url: '#' },
          { type: 'committee', name: 'Comisia de urbanism', url: '#' },
        ],
        councilors: [
          { type: 'councilor', name: 'Gáll Éva', reports: [{ year: '2024', url: '#' }] },
        ],
      },
    ],
  },
  {
    id: '2020-2024',
    mandate: '2020-2024',
    years: [
      {
        year: '2023',
        committees: [
          { type: 'committee', name: 'Comisia cultură', url: '#' },
          { type: 'committee', name: 'Comisia economică', url: '#' },
          { type: 'committee', name: 'Comisia juridică', url: '#' },
          { type: 'committee', name: 'Comisia de urbanism', url: '#' },
        ],
        councilors: [
          { type: 'councilor', name: 'Boiț Nicolae', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Buz Ramona', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Cseke Sándor', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Gáll Éva', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Horváth János', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Illyés Lajos', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Kiri Evelin', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Kiss Ernő', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Nagy Árpád', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Pirtea Mihai', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Sala Răzvan-Sergiu', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Szabó Sándor', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Szász Dénes', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Szíjjártó Szilárd', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Tolnai Angela', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Toma Cristian-Radu', reports: [{ year: '2023', url: '#' }] },
          { type: 'councilor', name: 'Vígh József', reports: [{ year: '2023', url: '#' }] },
        ],
      },
      {
        year: '2022',
        committees: [
          { type: 'committee', name: 'Comisia pentru amenajarea teritoriului şi urbanism, protecţia mediului şi turism', url: '#' },
          { type: 'committee', name: 'Comisia de agricultură', url: '#' },
          { type: 'committee', name: 'Comisia cultură', url: '#' },
          { type: 'committee', name: 'Comisia juridică', url: '#' },
        ],
        councilors: [
          { type: 'councilor', name: 'Boiț Nicolae Ioan', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Buz Ramona Angela', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Cseke Sándor', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Gali Éva', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Gáll Éva', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Horváth János', note: 'viceprimar', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Illyés Lajos', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Kiss Ernő', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Nagy Árpád', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Pirtea Mihai', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Sala Răzvan', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Szabó Sándor', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Szász Dénes-Albert', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Szíjjártó Szilárd', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Tolnai Angela', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Toma Cristian', reports: [{ year: '2022', url: '#' }] },
          { type: 'councilor', name: 'Vígh József', reports: [{ year: '2022', url: '#' }] },
        ],
      },
      {
        year: '2021',
        committees: [
          { type: 'committee', name: 'Comisia pentru amenajarea teritoriului şi urbanism, protecţia mediului şi turism', url: '#' },
        ],
        councilors: [
          { type: 'councilor', name: 'Boiț Nicolae', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Buz Ramona', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Cseke Sándor', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Gali Éva', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Gáll Éva', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Horváth János', note: 'viceprimar', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Illyés Lajos', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Kiss Ernő', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Nagy Árpád', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Pirtea Mihai-George', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Sala Răzvan', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Szabo Sandor', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Szász Dénes', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Szatmari Adrian', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Szíjjártó Szilárd', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Tolnai Angela', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Toma Cristian', reports: [{ year: '2021', url: '#' }] },
          { type: 'councilor', name: 'Vígh József', reports: [{ year: '2021', url: '#' }] },
        ],
      },
      {
        year: '2020',
        committees: [
          { type: 'committee', name: 'Comisia pentru amenajarea teritoriului şi urbanism, protecţia mediului şi turism', url: '#' },
          { type: 'committee', name: 'Comisia pentru activităţi social-culturale, culte, învăţământ, sănătate, familie, muncă, protecţie socială şi protecţia copilului', url: '#' },
          { type: 'committee', name: 'Comisia pentru agricultură şi activităţi economico-financiare', url: '#' },
        ],
        councilors: [
          { type: 'councilor', name: 'Buz Ramona – Angela', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Cseke Sándor', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Gáll Éva', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Horvath Janos', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Illyés Lajos', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Kiss Ernő', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Nagy Árpád – Ferencz', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Pirtea Mihai – George', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Szász Dénes – Albert', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Szíjjártó Szilárd', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Tolnai Angela', reports: [{ year: '2020', url: '#' }] },
          { type: 'councilor', name: 'Vigh József', reports: [{ year: '2020', url: '#' }] },
        ],
      },
    ],
  },
  {
    id: '2016-2020',
    mandate: '2016-2020',
    years: [
      {
        year: 'Comisii',
        committees: [
          { type: 'committee', name: 'Comisia pentru activităţi social-culturale, culte, învăţământ, sănătate, familie, muncă, protecţie socială şi protecţia copilului', url: '#' },
          { type: 'committee', name: 'Comisia de Urbanism', url: '#' },
          { type: 'committee', name: 'Comisia pentru agricultură şi activităţi economico-financiare', url: '#' },
        ],
        councilors: [],
      },
      {
        year: 'Consilieri',
        committees: [],
        councilors: [
          { 
            type: 'councilor', 
            name: 'Balogh Péter', 
            reports: [
              { year: '2016', url: '#' },
              { year: '2017', url: '#' },
              { year: '2018', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Buz Ramona-Angela', 
            reports: [],
            fullMandateReport: { label: 'Raport de activitate 2016-2020', url: '#' }
          },
          { 
            type: 'councilor', 
            name: 'Cseke Sándor', 
            reports: [
              { year: '2016', url: '#' },
              { year: '2018', url: '#' },
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Gáll Éva', 
            reports: [
              { year: '2016', url: '#' },
              { year: '2017', url: '#' },
              { year: '2018', url: '#' },
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Gyulai Sándor', 
            reports: [
              { year: '2017', url: '#' },
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Illyés Lajos', 
            reports: [
              { year: '2017', url: '#' },
              { year: '2018', url: '#' },
              { year: '2019', url: '#' },
              { year: '2020', url: '#' },
              { year: 'Comisia Urbanism', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Kiss Ernő', 
            reports: [
              { year: '2017', url: '#' },
              { year: '2018', url: '#' },
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Nagy Árpád', 
            reports: [
              { year: '2017', url: '#' },
              { year: '2018', url: '#' },
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Sala Răzvan-Sergiu', 
            reports: [],
            fullMandateReport: { label: 'Raport de activitate 2016-2020', url: '#' }
          },
          { 
            type: 'councilor', 
            name: 'Szabó Sándor', 
            reports: [
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Szász Dénes-Albert', 
            reports: [
              { year: '2017', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Szíjjártó Szilárd', 
            reports: [
              { year: '2019', url: '#' },
            ] 
          },
          { 
            type: 'councilor', 
            name: 'Tolnai Angela', 
            reports: [
              { year: '2019', url: '#' },
            ] 
          },
        ],
      },
    ],
  },
];

function CommitteeCard({ committee }: { committee: CommitteeReport }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-primary-600" />
        </div>
        <span className="font-medium text-gray-800 text-sm">{committee.name}</span>
      </div>
      <a
        href={committee.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors shrink-0"
      >
        <Download className="w-3 h-3" />
        Descarcă
      </a>
    </div>
  );
}

function CouncilorCard({ councilor }: { councilor: CouncilorReport }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 bg-white rounded-lg border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <span className="font-medium text-gray-800 text-sm">{councilor.name}</span>
          {councilor.note && (
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded ml-2">
              {councilor.note}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {councilor.reports.map((report, idx) => (
          <a
            key={idx}
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-3 h-3" />
            {report.year}
          </a>
        ))}
        {councilor.fullMandateReport && (
          <a
            href={councilor.fullMandateReport.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            <Download className="w-3 h-3" />
            {councilor.fullMandateReport.label}
          </a>
        )}
      </div>
    </div>
  );
}

function YearSectionComponent({ yearSection }: { yearSection: YearSection }) {
  const t = useTranslations('rapoarteActivitatePage');
  
  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary-500"></span>
        {yearSection.year.match(/^\d{4}$/) ? t('forYear', { year: yearSection.year }) : yearSection.year}
      </h4>
      
      {yearSection.committees.length > 0 && (
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">{t('committees')}</p>
          <div className="space-y-2">
            {yearSection.committees.map((committee, idx) => (
              <CommitteeCard key={idx} committee={committee} />
            ))}
          </div>
        </div>
      )}
      
      {yearSection.councilors.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">{t('councilors')}</p>
          <div className="space-y-2">
            {yearSection.councilors.map((councilor, idx) => (
              <CouncilorCard key={idx} councilor={councilor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MandateSectionComponent({ mandateSection }: { mandateSection: MandateSection }) {
  const t = useTranslations('rapoarteActivitatePage');
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary-50 px-5 py-4 border-b border-primary-100">
          <h3 className="font-bold text-primary-900 text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            {t('mandateTitle', { period: mandateSection.mandate })}
          </h3>
        </div>

        {/* Years */}
        <div className="p-5">
          {mandateSection.years.map((yearSection, idx) => (
            <YearSectionComponent key={idx} yearSection={yearSection} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RapoarteActivitatePage() {
  const t = useTranslations('navigation');
  const tr = useTranslations('rapoarteActivitatePage');

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('consiliulLocal'), href: '/consiliul-local' },
          { label: t('rapoarteActivitate') },
        ]}
      />
      <PageHeader titleKey="rapoarteActivitate" icon="barChart3" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-6 text-center">
              {tr('description')}
            </p>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-sm text-gray-600">{tr('committeeReports')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-600">{tr('councilorReports')}</span>
              </div>
            </div>

            <div className="space-y-6">
              {MANDATE_SECTIONS.map((mandateSection) => (
                <MandateSectionComponent key={mandateSection.id} mandateSection={mandateSection} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
