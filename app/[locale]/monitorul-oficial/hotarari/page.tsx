import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Gavel, FileText, Download, BookOpen, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'hotarari',
    locale: locale as Locale,
    path: '/monitorul-oficial/hotarari',
  });
}

// Link-uri principale
const MAIN_LINKS = [
  { id: 'hotarari-clms', href: '/consiliul-local/hotarari' },
  { id: 'hotarari-republicate', href: '/consiliul-local/hotarari-republicate' },
];

// Registre hotărâri adoptate - doar ani
const DECISION_REGISTERS = [
  { year: 2025, url: '#' },
  { year: 2024, url: '#' },
  { year: 2023, url: '#' },
  { year: 2022, url: '#' },
  { year: 2021, url: '#' },
  { year: '2020 (2020-2024)', url: '#' },
  { year: 2020, url: '#' },
  { year: 2019, url: '#' },
];

// Registre proiecte de hotărâri - doar ani
const PROJECT_REGISTERS = [
  { year: 2025, url: '#' },
  { year: 2024, url: '#' },
  { year: 2023, url: '#' },
  { year: 2022, url: '#' },
  { year: 2021, url: '#' },
  { year: 2020, url: '#' },
  { year: '2020 (2020-2024)', url: '#' },
];

export default function HotarariMolPage() {
  const t = useTranslations('navigation');
  const th = useTranslations('hotarariMolPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('hotarariMol') }
      ]} />
      <PageHeader titleKey="hotarariMol" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Link-uri principale */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{th('mainTitle')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {MAIN_LINKS.map((link) => (
                  <Link key={link.id} href={link.href}>
                    <Card className="hover:shadow-md transition-shadow h-full border-l-4 border-l-primary-600">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Gavel className="w-6 h-6 text-primary-700" />
                        </div>
                        <span className="font-semibold text-gray-900">{th(link.id)}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Registre hotărâri adoptate */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{th('registersTitle')}</h2>
                  <p className="text-sm text-gray-500">{th('registersSubtitle')}</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {DECISION_REGISTERS.map((reg) => (
                  <div key={reg.year} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        {th('registerYear', { year: reg.year })}
                      </span>
                    </div>
                    <Link
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Registre proiecte de hotărâri */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{th('projectsTitle')}</h2>
                  <p className="text-sm text-gray-500">{th('projectsSubtitle')}</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {PROJECT_REGISTERS.map((reg) => (
                  <div key={reg.year} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        {th('projectYear', { year: reg.year })}
                      </span>
                    </div>
                    <Link
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
