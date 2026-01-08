import { getTranslations } from 'next-intl/server';
import { FileSearch, Download, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as reports from '@/lib/supabase/services/reports';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'studii',
    locale: locale as Locale,
    path: '/rapoarte-studii/studii',
  });
}

export default async function StudiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch studies from database
  const { data: studies } = await reports.getReports({ reportType: 'studiu', limit: 100 });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const pageLabels = {
    ro: {
      description: 'Studii de fezabilitate, analize și documentații tehnice realizate pentru proiectele și investițiile Primăriei Municipiului Salonta.',
      noStudies: 'Nu există studii disponibile.',
      download: 'Descarcă',
    },
    hu: {
      description: 'Megvalósíthatósági tanulmányok, elemzések és műszaki dokumentációk Nagyszalonta Polgármesteri Hivatalának projektjeihez és beruházásaihoz.',
      noStudies: 'Nincsenek elérhető tanulmányok.',
      download: 'Letöltés',
    },
    en: {
      description: 'Feasibility studies, analyses and technical documentation for projects and investments of Salonta City Hall.',
      noStudies: 'No studies available.',
      download: 'Download',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('rapoarteStudii'), href: '/rapoarte-studii' },
          { label: t('studii') },
        ]}
      />
      <PageHeader titleKey="studii" icon="fileSearch" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {studies.length > 0 ? (
              <div className="space-y-4">
                {studies.map((study) => (
                  <Card key={study.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <FileSearch className="w-6 h-6 text-emerald-700" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{study.title}</h3>
                            {study.report_date && (
                              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(study.report_date)}
                              </p>
                            )}
                            {study.summary && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{study.summary}</p>
                            )}
                          </div>
                        </div>
                        {study.file_url && (
                          <a
                            href={study.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
                          >
                            <Download className="w-4 h-4" />
                            {labels.download}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noStudies}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
