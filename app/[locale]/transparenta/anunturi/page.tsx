import { getTranslations } from 'next-intl/server';
import { Calendar, ChevronRight, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documentsService from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'transparentaAnunturi',
    locale: locale as Locale,
    path: '/transparenta/anunturi',
  });
}

export default async function AnunturiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const ta = await getTranslations({ locale, namespace: 'anunturiPage' });

  // Fetch all announcements to get year counts
  const allDocuments = await documentsService.getDocumentsBySourceFolder('anunturi');

  // Group by year and count
  const yearCounts: Record<number, number> = {};
  allDocuments.forEach(doc => {
    const year = doc.year || new Date().getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  // Sort years descending
  const sortedYears = Object.keys(yearCounts)
    .map(y => parseInt(y, 10))
    .sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('anunturi') }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 text-center mb-8">
              {ta('selectYear')}
            </p>

            {sortedYears.length > 0 ? (
              <div className="grid gap-4">
                {sortedYears.map((year) => (
                  <Link
                    key={year}
                    href={`/transparenta/anunturi/${year}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-all hover:border-primary-300 cursor-pointer group">
                      <CardContent className="py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {year}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {yearCounts[year]} {ta('announcements')}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{ta('noAnnouncements')}</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
