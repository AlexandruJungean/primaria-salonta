import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileCheck, Download, Users, Briefcase } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('declaratiiAvere') };
}

// Mock data - will be replaced with database content
// Aleși locali (Local elected officials)
const ELECTED_OFFICIALS = [
  {
    section: '2024, pt. începerea mandatului 2024-2028',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: '2024, pt. încheierea mandatului 2024-2028',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2024',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2023',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2022',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2021',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: '2020, pt. începerea mandatului 2020-2024',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: '2020, pt. încheierea mandatului 2016-2020',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2020',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2019',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
  {
    section: 'Declarații depuse în 2018',
    entries: [
      { name: 'Török László', avereUrl: '#', intereseUrl: '#' },
      { name: 'Horváth János', avereUrl: '#', intereseUrl: '#' },
    ]
  },
];

// Funcționari publici (Public servants)
const PUBLIC_SERVANTS = [
  {
    section: 'Declarații depuse în 2025',
    entries: [
      { name: 'Alb Ioana Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Bagosi Hajnalka', avereUrl: '#', intereseUrl: '#' },
      { name: 'Borze Laura Betty', avereUrl: '#', intereseUrl: '#' },
      { name: 'Buda Adrian Călin', avereUrl: '#', intereseUrl: '#' },
      { name: 'Budeanu Andreea Virginia', avereUrl: '#', intereseUrl: '#' },
      { name: 'Buraga Rizea Lenuța', avereUrl: '#', intereseUrl: '#' },
      { name: 'Caba Maria Florica', avereUrl: '#', intereseUrl: '#' },
      { name: 'Chirila Radu Mihaela Florentina', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia Edith', avereUrl: '#', intereseUrl: '#' },
      { name: 'Kis Anamaria', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2024',
    entries: [
      { name: 'Alb Ioana Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Bagosi Hajnalka', avereUrl: '#', intereseUrl: '#' },
      { name: 'Balogh Gábor Péter', avereUrl: '#', intereseUrl: '#' },
      { name: 'Balogh Zoltán', avereUrl: '#', intereseUrl: '#' },
      { name: 'Borze Laura Betty', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2023',
    entries: [
      { name: 'Alb Ioana Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Bagosi Hajnalka', avereUrl: '#', intereseUrl: '#' },
      { name: 'Balogh Gábor Péter', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia-Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2022',
    entries: [
      { name: 'Bagosi Hajnalka', avereUrl: '#', intereseUrl: '#' },
      { name: 'Balogh Zoltán', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia-Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2021',
    entries: [
      { name: 'Alb Ioana-Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia-Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2020',
    entries: [
      { name: 'Alb Ioana-Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia-Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2019',
    entries: [
      { name: 'Alb Ioana-Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia-Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
  {
    section: 'Declarații depuse în 2018',
    entries: [
      { name: 'Alb Ioana Simona', avereUrl: '#', intereseUrl: '#' },
      { name: 'Ivanciuc Patricia-Edith', avereUrl: '#', intereseUrl: '#' },
      // ... more entries from database
    ]
  },
];

interface DeclarationEntry {
  name: string;
  avereUrl?: string;
  intereseUrl?: string;
}

interface DeclarationSection {
  section: string;
  entries: DeclarationEntry[];
}

function DeclarationTable({ sections }: { sections: DeclarationSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 px-4 py-2 rounded-lg">
            {section.section}
          </h3>
          <div className="space-y-1">
            {section.entries.map((entry, eIdx) => (
              <div
                key={eIdx}
                className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded-lg group"
              >
                <span className="text-gray-900">{entry.name}</span>
                <div className="flex gap-2">
                  {entry.avereUrl ? (
                    <a
                      href={entry.avereUrl}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      av
                    </a>
                  ) : (
                    <span className="px-2 py-1 text-xs text-gray-400">-</span>
                  )}
                  {entry.intereseUrl ? (
                    <a
                      href={entry.intereseUrl}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      int
                    </a>
                  ) : (
                    <span className="px-2 py-1 text-xs text-gray-400">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DeclaratiiAverePage() {
  const t = useTranslations('navigation');
  const td = useTranslations('declaratiiPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('declaratiiAvere') }
      ]} />
      <PageHeader titleKey="declaratiiAvere" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* Aleși locali Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{td('electedOfficials')}</h2>
                    <p className="text-sm text-gray-500">{td('electedOfficialsSubtitle')}</p>
                  </div>
                </div>
                <DeclarationTable sections={ELECTED_OFFICIALS} />
              </CardContent>
            </Card>

            {/* Funcționari publici Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{td('publicServants')}</h2>
                    <p className="text-sm text-gray-500">{td('publicServantsSubtitle')}</p>
                  </div>
                </div>
                <DeclarationTable sections={PUBLIC_SERVANTS} />
              </CardContent>
            </Card>

            {/* Info Note */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">{td('infoTitle')}</h3>
              <p className="text-gray-600 text-sm">
                {td('infoText')}
              </p>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
