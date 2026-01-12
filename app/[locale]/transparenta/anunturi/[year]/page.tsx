import { getTranslations } from 'next-intl/server';
import { Megaphone, Calendar, Download, MapPin, Users, FileText, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documentsService from '@/lib/supabase/services/documents';
import type { Document } from '@/lib/types/database';
import { notFound } from 'next/navigation';
import { translateContentArray } from '@/lib/google-translate/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; year: string }> }) {
  const { locale, year } = await params;
  return generatePageMetadata({
    pageKey: 'transparentaAnunturi',
    locale: locale as Locale,
    path: `/transparenta/anunturi/${year}`,
  });
}

// Determine announcement type from title
function getAnnouncementType(title: string): 'consultare' | 'puz' | 'dezbatere' | 'general' {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('puz') || lowerTitle.includes('plan urbanistic')) {
    return 'puz';
  }
  if (lowerTitle.includes('dezbatere') || lowerTitle.includes('minuta') || lowerTitle.includes('proces verbal')) {
    return 'dezbatere';
  }
  if (lowerTitle.includes('consultare') || lowerTitle.includes('proiect de hotărâre') || lowerTitle.includes('proiect de hotarare')) {
    return 'consultare';
  }
  return 'general';
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Users; color: string; bgColor: string }> = {
  consultare: { label: 'Consultare publică', icon: Users, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  puz: { label: 'Anunț PUZ', icon: MapPin, color: 'text-green-700', bgColor: 'bg-green-100' },
  dezbatere: { label: 'Dezbatere publică', icon: Users, color: 'text-orange-700', bgColor: 'bg-orange-100' },
  general: { label: 'Anunț general', icon: Megaphone, color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

function AnnouncementCard({ doc }: { doc: Document }) {
  const type = getAnnouncementType(doc.title);
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                {config.label}
              </span>
              {doc.document_date && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(doc.document_date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900 text-sm leading-snug mb-2">
              {doc.title}
            </h3>
            {doc.description && (
              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
            )}
            {doc.file_url && (
              <div className="flex flex-wrap gap-2 mt-2">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Descarcă document
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AnunturiYearPage({ params }: { params: Promise<{ locale: string; year: string }> }) {
  const { locale, year } = await params;
  const yearNum = parseInt(year, 10);
  
  // Validate year
  if (isNaN(yearNum) || yearNum < 2010 || yearNum > 2100) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'navigation' });
  const ta = await getTranslations({ locale, namespace: 'anunturiPage' });

  // Fetch announcements for this year
  const allDocumentsData = await documentsService.getDocumentsBySourceFolder('anunturi', 2000);
  const yearDocumentsData = allDocumentsData.filter(doc => doc.year === yearNum);
  
  // Translate document titles based on locale
  const yearDocuments = await translateContentArray(
    yearDocumentsData,
    ['title', 'description'],
    locale as 'ro' | 'hu' | 'en'
  );
  const allDocuments = allDocumentsData;

  // Get all years for navigation
  const yearCounts: Record<number, number> = {};
  allDocuments.forEach(doc => {
    const y = doc.year || new Date().getFullYear();
    yearCounts[y] = (yearCounts[y] || 0) + 1;
  });
  const sortedYears = Object.keys(yearCounts)
    .map(y => parseInt(y, 10))
    .sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('anunturi'), href: '/transparenta/anunturi' },
        { label: year.toString() }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Back link and year navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <Link
                href="/transparenta/anunturi"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800"
              >
                <ArrowLeft className="w-4 h-4" />
                {ta('backToYears')}
              </Link>
              
              {/* Year selector */}
              <div className="flex flex-wrap gap-2">
                {sortedYears.map((y) => (
                  <Link
                    key={y}
                    href={`/transparenta/anunturi/${y}`}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      y === yearNum
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            {/* Year header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{year}</h2>
              <p className="text-gray-500">
                {yearDocuments.length} {ta('announcements')}
              </p>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">{ta('legend')}</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${config.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-3 h-3 ${config.color}`} />
                      </div>
                      <span className="text-sm text-gray-600">{config.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Announcements */}
            {yearDocuments.length > 0 ? (
              <div className="space-y-3">
                {yearDocuments.map((doc) => (
                  <AnnouncementCard key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{ta('noAnnouncementsYear')}</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
