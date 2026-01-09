import { getTranslations } from 'next-intl/server';
import { Megaphone, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';
import { AnunturiCollapsibleYears } from './collapsible-years';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'anunturi',
    locale: locale as Locale,
    path: '/informatii-publice/anunturi',
  });
}

export default async function AnunturiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'anunturiPage' });

  // Fetch announcements from database
  const announcements = await documents.getAnnouncements();

  // Group announcements by year
  const groupedByYear = announcements.reduce((acc, announcement) => {
    const year = new Date(announcement.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(announcement);
    return acc;
  }, {} as Record<number, documents.Announcement[]>);

  const years = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('anunturi') }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* No announcements message */}
            {announcements.length === 0 ? (
              <Card className="mb-8 bg-gray-50">
                <CardContent className="pt-6 text-center">
                  <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{tPage('noAnnouncements')}</p>
                </CardContent>
              </Card>
            ) : (
              <AnunturiCollapsibleYears 
                groupedByYear={groupedByYear} 
                years={years} 
                locale={locale} 
              />
            )}

            {/* Archive Note */}
            <Card className="bg-gray-50 border-gray-200 mt-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('archiveNote')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('archiveNoteDesc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
