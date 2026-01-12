import { getTranslations } from 'next-intl/server';
import { FileText, Download, Users, User, Building } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as reports from '@/lib/supabase/services/reports';
import { translateContentArray } from '@/lib/google-translate/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'consiliulLocal',
    locale: locale as Locale,
    path: '/consiliul-local/rapoarte-activitate',
    customTitle: locale === 'ro' ? 'Rapoarte de Activitate' : 
                 locale === 'hu' ? 'Tevékenységi jelentések' : 'Activity Reports',
  });
}

// ============================================
// TYPES
// ============================================

interface PageLabels {
  description: string;
  committeeReports: string;
  councilorReports: string;
  mandateTitle: (period: string) => string;
  forYear: (year: string | number) => string;
  committees: string;
  councilors: string;
  download: string;
  noReports: string;
}

// ============================================
// SUB-COMPONENTS
// ============================================

function CommitteeCard({ report }: { report: reports.ActivityReportItem }) {
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
        Descarcă
      </a>
    </div>
  );
}

function CouncilorCard({ report, labels }: { report: reports.ActivityReportItem; labels: PageLabels }) {
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
        {report.year || labels.download}
      </a>
    </div>
  );
}

function YearSectionComponent({ 
  yearSection, 
  labels 
}: { 
  yearSection: reports.YearGroupedReports; 
  labels: PageLabels;
}) {
  const hasContent = yearSection.committees.length > 0 || yearSection.councilors.length > 0;
  if (!hasContent) return null;

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary-500"></span>
        {typeof yearSection.year === 'number' 
          ? labels.forYear(yearSection.year.toString())
          : yearSection.year
        }
      </h4>
      
      {yearSection.committees.length > 0 && (
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
            {labels.committees}
          </p>
          <div className="space-y-2">
            {yearSection.committees.map((committee) => (
              <CommitteeCard key={committee.id} report={committee} />
            ))}
          </div>
        </div>
      )}
      
      {yearSection.councilors.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
            {labels.councilors}
          </p>
          <div className="space-y-2">
            {yearSection.councilors.map((councilor) => (
              <CouncilorCard key={councilor.id} report={councilor} labels={labels} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MandateSectionComponent({ 
  mandateSection,
  labels
}: { 
  mandateSection: reports.MandateGroupedReports;
  labels: PageLabels;
}) {
  const hasContent = mandateSection.years.some(
    y => y.committees.length > 0 || y.councilors.length > 0
  );
  if (!hasContent) return null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary-50 px-5 py-4 border-b border-primary-100">
          <h3 className="font-bold text-primary-900 text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            {labels.mandateTitle(mandateSection.mandate)}
          </h3>
        </div>

        {/* Years */}
        <div className="p-5">
          {mandateSection.years.map((yearSection, idx) => (
            <YearSectionComponent 
              key={`${mandateSection.mandate}-${yearSection.year}-${idx}`} 
              yearSection={yearSection}
              labels={labels}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default async function RapoarteActivitatePage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch activity reports from database
  const mandateSectionsData = await reports.getActivityReportsGrouped();

  // Translate report titles within each mandate section (NOT author names - they are proper nouns)
  const mandateSections = await Promise.all(
    mandateSectionsData.map(async (mandate) => ({
      ...mandate,
      years: await Promise.all(
        mandate.years.map(async (year) => ({
          ...year,
          committees: await translateContentArray(year.committees, ['title'], locale as 'ro' | 'hu' | 'en'),
          councilors: await translateContentArray(year.councilors, ['title'], locale as 'ro' | 'hu' | 'en'),
        }))
      ),
    }))
  );

  const pageLabels: Record<string, PageLabels> = {
    ro: {
      description: 'Rapoartele de activitate ale comisiilor de specialitate și consilierilor locali din cadrul Consiliului Local al Municipiului Salonta.',
      committeeReports: 'Rapoarte comisii',
      councilorReports: 'Rapoarte consilieri',
      mandateTitle: (period: string) => `Mandatul ${period}`,
      forYear: (year: string | number) => `Pentru anul ${year}`,
      committees: 'COMISII',
      councilors: 'CONSILIERI',
      download: 'Descarcă',
      noReports: 'Nu există rapoarte de activitate disponibile.',
    },
    hu: {
      description: 'Nagyszalonta Helyi Tanácsának szakbizottságai és helyi tanácsosainak tevékenységi jelentései.',
      committeeReports: 'Bizottsági jelentések',
      councilorReports: 'Tanácsosi jelentések',
      mandateTitle: (period: string) => `${period} mandátum`,
      forYear: (year: string | number) => `${year}. év`,
      committees: 'BIZOTTSÁGOK',
      councilors: 'TANÁCSOSOK',
      download: 'Letöltés',
      noReports: 'Nincsenek elérhető tevékenységi jelentések.',
    },
    en: {
      description: 'Activity reports of the specialized committees and local councilors of the Local Council of Salonta Municipality.',
      committeeReports: 'Committee reports',
      councilorReports: 'Councilor reports',
      mandateTitle: (period: string) => `Mandate ${period}`,
      forYear: (year: string | number) => `For year ${year}`,
      committees: 'COMMITTEES',
      councilors: 'COUNCILORS',
      download: 'Download',
      noReports: 'No activity reports available.',
    },
  };

  const labels = pageLabels[locale] || pageLabels.en;

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
              {labels.description}
            </p>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-sm text-gray-600">{labels.committeeReports}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-600">{labels.councilorReports}</span>
              </div>
            </div>

            {mandateSections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {labels.noReports}
              </div>
            ) : (
              <div className="space-y-6">
                {mandateSections.map((mandateSection) => (
                  <MandateSectionComponent 
                    key={mandateSection.mandate} 
                    mandateSection={mandateSection}
                    labels={labels}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
