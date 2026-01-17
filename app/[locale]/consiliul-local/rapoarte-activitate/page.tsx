import { getTranslations } from 'next-intl/server';
import { Users, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as reports from '@/lib/supabase/services/reports';
import { translateContentArray } from '@/lib/google-translate/cache';
import { MandateAccordion, type PageLabels } from './mandate-accordion';

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

  // Serializable labels (no functions) for client component
  const accordionLabels: Record<string, PageLabels> = {
    ro: {
      committees: 'COMISII',
      councilors: 'CONSILIERI',
      mandatePrefix: 'Mandatul ',
      mandateSuffix: '',
      yearPrefix: 'Anul ',
      yearSuffix: '',
      reportsText: 'rapoarte',
    },
    hu: {
      committees: 'BIZOTTSÁGOK',
      councilors: 'TANÁCSOSOK',
      mandatePrefix: '',
      mandateSuffix: ' mandátum',
      yearPrefix: '',
      yearSuffix: '. év',
      reportsText: 'jelentés',
    },
    en: {
      committees: 'COMMITTEES',
      councilors: 'COUNCILORS',
      mandatePrefix: 'Mandate ',
      mandateSuffix: '',
      yearPrefix: 'Year ',
      yearSuffix: '',
      reportsText: 'reports',
    },
  };

  // Page-level labels (used only in server component)
  const pageTextLabels: Record<string, { description: string; committeeReports: string; councilorReports: string; noReports: string }> = {
    ro: {
      description: 'Rapoartele de activitate ale comisiilor de specialitate și consilierilor locali din cadrul Consiliului Local al Municipiului Salonta.',
      committeeReports: 'Rapoarte comisii',
      councilorReports: 'Rapoarte consilieri',
      noReports: 'Nu există rapoarte de activitate disponibile.',
    },
    hu: {
      description: 'Nagyszalonta Helyi Tanácsának szakbizottságai és helyi tanácsosainak tevékenységi jelentései.',
      committeeReports: 'Bizottsági jelentések',
      councilorReports: 'Tanácsosi jelentések',
      noReports: 'Nincsenek elérhető tevékenységi jelentések.',
    },
    en: {
      description: 'Activity reports of the specialized committees and local councilors of the Local Council of Salonta Municipality.',
      committeeReports: 'Committee reports',
      councilorReports: 'Councilor reports',
      noReports: 'No activity reports available.',
    },
  };

  const labels = accordionLabels[locale] || accordionLabels.en;
  const pageText = pageTextLabels[locale] || pageTextLabels.en;

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
              {pageText.description}
            </p>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-sm text-gray-600">{pageText.committeeReports}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-600">{pageText.councilorReports}</span>
              </div>
            </div>

            {mandateSections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {pageText.noReports}
              </div>
            ) : (
              <MandateAccordion 
                mandateSections={mandateSections} 
                labels={labels}
              />
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
