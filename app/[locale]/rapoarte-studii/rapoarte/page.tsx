import { getTranslations } from 'next-intl/server';
import { Download, ShieldCheck, Calendar } from 'lucide-react';
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
    pageKey: 'rapoarteAudit',
    locale: locale as Locale,
    path: '/rapoarte-studii/rapoarte',
  });
}

export default async function RapoartePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch audit reports from database
  const { data: auditReports } = await reports.getReports({ reportType: 'audit', limit: 100 });

  const pageLabels = {
    ro: {
      description: 'Rapoartele de audit realizate de Curtea de Conturi a României și alte organisme de control asupra activității Primăriei Municipiului Salonta.',
      noReports: 'Nu există rapoarte de audit disponibile.',
      download: 'Descarcă',
      year: 'Anul',
      period: 'Perioada',
    },
    hu: {
      description: 'A Romániai Számvevőszék és más ellenőrző szervek által készített ellenőrzési jelentések Nagyszalonta Polgármesteri Hivatalának tevékenységéről.',
      noReports: 'Nincsenek elérhető ellenőrzési jelentések.',
      download: 'Letöltés',
      year: 'Év',
      period: 'Időszak',
    },
    en: {
      description: 'Audit reports conducted by the Romanian Court of Accounts and other control bodies on the activity of Salonta City Hall.',
      noReports: 'No audit reports available.',
      download: 'Download',
      year: 'Year',
      period: 'Period',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('rapoarteStudii'), href: '/rapoarte-studii' },
          { label: t('rapoarteAudit') },
        ]}
      />
      <PageHeader titleKey="rapoarteAudit" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {auditReports.length > 0 ? (
              <div className="space-y-4">
                {auditReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-primary-700" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{report.title}</h3>
                            {report.year && (
                              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {labels.year} {report.year}
                              </p>
                            )}
                            {report.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</p>
                            )}
                          </div>
                        </div>
                        {report.file_url && (
                          <a
                            href={report.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
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
                {labels.noReports}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
