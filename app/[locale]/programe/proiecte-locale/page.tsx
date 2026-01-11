import { getTranslations } from 'next-intl/server';
import { Download, Calendar, Palette, TreePine, Trophy, Users, ChevronDown, FileText, Image as ImageIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';
import * as pageImages from '@/lib/supabase/services/page-images';
import { LocalProjectsAccordion } from './local-projects-accordion';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'proiecteLocale',
    locale: locale as Locale,
    path: '/programe/proiecte-locale',
  });
}

// Define the year structure with categories
interface YearData {
  year: number;
  results: { culture?: string[]; sport?: string[]; mediu?: string[]; other?: string[] };
  hasGuide: boolean;
  extraDocs?: { title: string; docs: string[] }[];
}

export default async function ProiecteLocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch documents from database (need higher limit due to many duplicates per year)
  const allDocs = await documents.getDocumentsBySourceFolder('proiecte-locale-castigatoare-in-anul-curent', 800);
  
  // Fetch logo image
  const logoImages = await pageImages.getPageImages('proiecte-locale');
  const logoUrl = logoImages.length > 0 ? logoImages[0].image_url : null;

  // Group documents by description field (which should contain year_category)
  const docsByYearCategory = allDocs.reduce((acc, doc) => {
    const key = doc.description || 'other';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, typeof allDocs>);

  // Years structure based on old website
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  const pageLabels = {
    ro: {
      description: 'Ghiduri și formulare pentru proiectele finanțate din bugetul local al Primăriei Municipiului Salonta.',
      noProjects: 'Nu există documente disponibile.',
      culture: 'CULTURĂ',
      environment: 'MEDIU',
      sport: 'SPORT',
      social: 'SOCIAL',
      results: 'Rezultate',
      guideTitle: 'Ghidul proiectelor finanțate din bugetul local în',
      logoCaption: '(LOGO-ul pentru proiecte al Primăriei Mun. Salonta)',
      download: 'Descarcă',
    },
    hu: {
      description: 'Útmutatók és nyomtatványok a Nagyszalonta Polgármesteri Hivatala helyi költségvetéséből finanszírozott projektekhez.',
      noProjects: 'Nincsenek elérhető dokumentumok.',
      culture: 'KULTÚRA',
      environment: 'KÖRNYEZET',
      sport: 'SPORT',
      social: 'SZOCIÁLIS',
      results: 'Eredmények',
      guideTitle: 'A helyi költségvetésből finanszírozott projektek útmutatója',
      logoCaption: '(A Nagyszalonta Polgármesteri Hivatal projekt logója)',
      download: 'Letöltés',
    },
    en: {
      description: 'Guides and forms for projects funded from the local budget of Salonta City Hall.',
      noProjects: 'No documents available.',
      culture: 'CULTURE',
      environment: 'ENVIRONMENT',
      sport: 'SPORT',
      social: 'SOCIAL',
      results: 'Results',
      guideTitle: 'Guide for projects funded from the local budget in',
      logoCaption: '(Project logo of Salonta City Hall)',
      download: 'Download',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Prepare data for accordion
  const yearsData = years.map(year => ({
    year,
    results: {
      culture: docsByYearCategory[`${year}_rezultate_cultura`] || [],
      sport: docsByYearCategory[`${year}_rezultate_sport`] || [],
      mediu: docsByYearCategory[`${year}_rezultate_mediu`] || [],
    },
    guides: {
      culture: docsByYearCategory[`${year}_cultura`] || [],
      mediu: docsByYearCategory[`${year}_mediu`] || [],
      sport: docsByYearCategory[`${year}_sport`] || [],
      social: docsByYearCategory[`${year}_social`] || [],
    },
    extraDocs: docsByYearCategory[`${year}_extra`] || [],
  }));

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
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {allDocs.length > 0 ? (
              <LocalProjectsAccordion 
                yearsData={yearsData}
                labels={labels}
                logoUrl={logoUrl}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noProjects}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
