import { getTranslations } from 'next-intl/server';
import { 
  Building,
  Download, 
  FileText,
  Palette,
  TreePine,
  Trophy,
  Calendar
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'proiecteLocale',
    locale: locale as Locale,
    path: '/programe/proiecte-locale',
  });
}

export default async function ProiecteLocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'proiecteLocalePage' });

  // Fetch local project documents grouped by year
  const projectDocs = await documents.getDocumentsByCategory('proiecte_locale', 200);
  
  // Group by year
  const years = await documents.getDocumentYears('proiecte_locale');
  
  const pageLabels = {
    ro: {
      description: 'Ghiduri și formulare pentru proiectele finanțate din bugetul local al Primăriei Municipiului Salonta.',
      noProjects: 'Nu există proiecte locale disponibile.',
      download: 'Descarcă',
      culture: 'Cultură',
      environment: 'Mediu',
      sport: 'Sport',
      results: 'Rezultate',
      forYear: 'pentru anul',
    },
    hu: {
      description: 'Útmutatók és nyomtatványok a Nagyszalonta Polgármesteri Hivatala helyi költségvetéséből finanszírozott projektekhez.',
      noProjects: 'Nincsenek elérhető helyi projektek.',
      download: 'Letöltés',
      culture: 'Kultúra',
      environment: 'Környezet',
      sport: 'Sport',
      results: 'Eredmények',
      forYear: 'az évre',
    },
    en: {
      description: 'Guides and forms for projects funded from the local budget of Salonta City Hall.',
      noProjects: 'No local projects available.',
      download: 'Download',
      culture: 'Culture',
      environment: 'Environment',
      sport: 'Sport',
      results: 'Results',
      forYear: 'for year',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Group documents by year and subcategory
  const groupedDocs = projectDocs.reduce((acc, doc) => {
    const year = doc.year || 0;
    const subcategory = doc.subcategory || 'altele';
    
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][subcategory]) {
      acc[year][subcategory] = [];
    }
    acc[year][subcategory].push(doc);
    return acc;
  }, {} as Record<number, Record<string, typeof projectDocs>>);

  const subcategoryLabels: Record<string, string> = {
    cultura: labels.culture,
    mediu: labels.environment,
    sport: labels.sport,
    rezultate: labels.results,
  };

  const subcategoryColors: Record<string, { bg: string; icon: typeof Palette }> = {
    cultura: { bg: 'bg-purple-100 text-purple-700', icon: Palette },
    mediu: { bg: 'bg-green-100 text-green-700', icon: TreePine },
    sport: { bg: 'bg-amber-100 text-amber-700', icon: Trophy },
    rezultate: { bg: 'bg-blue-100 text-blue-700', icon: FileText },
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('proiecteLocale') }
      ]} />
      <PageHeader titleKey="proiecteLocale" icon="building" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {years.length > 0 ? (
              <div className="space-y-8">
                {years.map((year) => (
                  <Card key={year}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        {year}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {groupedDocs[year] && Object.entries(groupedDocs[year]).map(([subcategory, docs]) => {
                        const config = subcategoryColors[subcategory] || subcategoryColors.rezultate;
                        const Icon = config.icon;
                        
                        return (
                          <div key={subcategory} className="mb-6 last:mb-0">
                            <h4 className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mb-3 ${config.bg}`}>
                              <Icon className="w-4 h-4" />
                              {subcategoryLabels[subcategory] || subcategory}
                            </h4>
                            <div className="space-y-2 pl-4">
                              {docs.map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 py-1 group"
                                >
                                  <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                  {doc.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
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
