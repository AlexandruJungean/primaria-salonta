'use client';

import { useTranslations } from 'next-intl';
import { FileCheck, Download, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for declarations
interface Declaration {
  name: string;
  note?: string; // e.g., "pt. încheierea mandatului de consilier local"
  wealthUrl?: string; // av - declarație de avere
  interestUrl?: string; // int - declarație de interese
}

interface DeclarationYear {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  declarations: Declaration[];
}

// Mock data - will be replaced with database content
const DECLARATION_YEARS: DeclarationYear[] = [
  {
    id: '2025',
    year: '2025',
    title: 'Declarații depuse în 2025',
    declarations: [
      { name: 'Blaj Cristian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Bondár Zsolt', wealthUrl: '#', interestUrl: '#' },
      { name: 'Galea Marcel', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiri Evelin', wealthUrl: '#', interestUrl: '#' },
      { name: 'Manciu Valentin', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferencz', note: 'pt. încheierea mandatului de consilier local', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferencz', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nan Sajti Daniel', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan Sergiu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szatmari Adrian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szőke Sorean Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tornai Melinda', note: 'pt. începerea mandatului de consilier local', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2024-start',
    year: '2024',
    title: '2024',
    subtitle: 'pt. începerea mandatului de consilier local',
    declarations: [
      { name: 'Blaj Cristian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Bondár Zsolt', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Galea Marcel Ioan', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiri Evelin', wealthUrl: '#', interestUrl: '#' },
      { name: 'Manciu Valentin-Iulian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferencz', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nan-Sajti Daniel', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan-Sergiu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szatmari Adrian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szőke Sorean Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vígh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2024-end',
    year: '2024',
    title: '2024',
    subtitle: 'pt. încheierea mandatului de consilier local',
    declarations: [
      { name: 'Boiț Nicolae', wealthUrl: '#', interestUrl: '#' },
      { name: 'Buz Ramona Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Illyés Lajos', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiri Evelin', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiss Ernő', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferencz', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan-Sergiu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szijjártó Szilárd', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tolnai Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Toma Cristian-Radu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vígh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2024',
    year: '2024',
    title: 'Declarații depuse în 2024',
    declarations: [
      { name: 'Boiț Nicolae', wealthUrl: '#', interestUrl: '#' },
      { name: 'Buz Ramona Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', note: 'declarație rectificativă', wealthUrl: '#' },
      { name: 'Illyés Lajos', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiri Evelin', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiss Ernő', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferencz', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan-Sergiu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szijjártó Szilárd', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tolnai Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Toma Cristian-Radu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vígh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2023-start',
    year: '2023',
    title: '2023',
    subtitle: 'pt. începerea mandatului de consilier local',
    declarations: [
      { name: 'Kiri Evelin', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2023',
    year: '2023',
    title: 'Declarații depuse în 2023',
    declarations: [
      { name: 'Boiț Nicolae', wealthUrl: '#', interestUrl: '#' },
      { name: 'Buz Ramona', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gali Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Illyés Lajos', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiri Evelin', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiss Ernő', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai-George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szijjártó Szilárd', wealthUrl: '#', interestUrl: '#' },
      { name: 'Toma Cristian-Radu', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tolnai Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vigh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2022-start',
    year: '2022',
    title: '2022',
    subtitle: 'pt. începerea mandatului de consilier local',
    declarations: [
      { name: 'Toma Cristian-Radu', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2022-end',
    year: '2022',
    title: '2022',
    subtitle: 'pt. încheierea mandatului de consilier local',
    declarations: [
      { name: 'Gali Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szatmari Adrian', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2022',
    year: '2022',
    title: 'Declarații depuse în 2022',
    declarations: [
      { name: 'Boiț Nicolae', wealthUrl: '#', interestUrl: '#' },
      { name: 'Buz Ramona', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gali Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gali Éva', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Illyés Lajos', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiss Ernő', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferenc', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai-George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai-George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szíjjártó Szilárd', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tolnai Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Toma Cristian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vigh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2021',
    year: '2021',
    title: 'Declarații depuse în 2021',
    declarations: [
      { name: 'Boiț Nicolae', wealthUrl: '#', interestUrl: '#' },
      { name: 'Buz Ramona', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gali Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Illyés Lajos', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiss Ernő', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferenc', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai-George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szatmari Adrian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szíjjártó Szilárd', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tolnai Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vigh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
  {
    id: '2020-start',
    year: '2020',
    title: '2020',
    subtitle: 'pt. începerea mandatului 2020-2024',
    declarations: [
      { name: 'Boiț Nicolae', wealthUrl: '#', interestUrl: '#' },
      { name: 'Buz Ramona', wealthUrl: '#', interestUrl: '#' },
      { name: 'Cseke Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gali Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Gáll Éva', wealthUrl: '#', interestUrl: '#' },
      { name: 'Illyés Lajos', wealthUrl: '#', interestUrl: '#' },
      { name: 'Kiss Ernő', wealthUrl: '#', interestUrl: '#' },
      { name: 'Nagy Árpád-Ferenc', wealthUrl: '#', interestUrl: '#' },
      { name: 'Pirtea Mihai-George', wealthUrl: '#', interestUrl: '#' },
      { name: 'Sala Răzvan', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szabó Sándor', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szatmari Adrian', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szász Dénes-Albert', wealthUrl: '#', interestUrl: '#' },
      { name: 'Szíjjártó Szilárd', wealthUrl: '#', interestUrl: '#' },
      { name: 'Tolnai Angela', wealthUrl: '#', interestUrl: '#' },
      { name: 'Vigh József', wealthUrl: '#', interestUrl: '#' },
    ],
  },
];

function DeclarationCard({ declaration }: { declaration: Declaration }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <span className="font-medium text-gray-800">{declaration.name}</span>
          {declaration.note && (
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded ml-2">
              {declaration.note}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {declaration.wealthUrl && (
          <a
            href={declaration.wealthUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            title="Declarație de avere"
          >
            <Download className="w-3 h-3" />
            av
          </a>
        )}
        {declaration.interestUrl && (
          <a
            href={declaration.interestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            title="Declarație de interese"
          >
            <Download className="w-3 h-3" />
            int
          </a>
        )}
      </div>
    </div>
  );
}

function YearSection({ yearData }: { yearData: DeclarationYear }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary-50 px-5 py-4 border-b border-primary-100">
          <h3 className="font-bold text-primary-900 text-lg">{yearData.title}</h3>
          {yearData.subtitle && (
            <p className="text-sm text-primary-700 mt-0.5">{yearData.subtitle}</p>
          )}
        </div>

        {/* Declarations List */}
        <div className="p-4 space-y-2">
          {yearData.declarations.map((declaration, idx) => (
            <DeclarationCard key={`${yearData.id}-${idx}`} declaration={declaration} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DeclaratiiAvereConsiliuPage() {
  const t = useTranslations('navigation');
  const td = useTranslations('declaratiiConsiliuPage');

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('consiliulLocal'), href: '/consiliul-local' },
          { label: t('declaratiiAvereConsiliu') },
        ]}
      />
      <PageHeader titleKey="declaratiiAvereConsiliu" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-6 text-center">
              {td('description')}
            </p>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded">av</span>
                <span className="text-sm text-gray-600">{td('wealthDeclaration')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded">int</span>
                <span className="text-sm text-gray-600">{td('interestDeclaration')}</span>
              </div>
            </div>

            {/* Info box */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800">
                {td('infoText')}
              </p>
            </div>

            <div className="space-y-6">
              {DECLARATION_YEARS.map((yearData) => (
                <YearSection key={yearData.id} yearData={yearData} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
