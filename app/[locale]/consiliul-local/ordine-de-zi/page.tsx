import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as council from '@/lib/supabase/services/council';
import { translateContentArray } from '@/lib/google-translate/cache';

const ITEMS_PER_PAGE = 20;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'ordineDeZi',
    locale: locale as Locale,
    path: '/consiliul-local/ordine-de-zi',
  });
}

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl 
}: { 
  currentPage: number; 
  totalPages: number;
  baseUrl: string;
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const pages: (number | 'ellipsis')[] = [];
    
    pages.push(1);
    
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    
    if (rangeStart > 2) {
      pages.push('ellipsis');
    }
    
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Navigare pagini">
      <Link
        href={currentPage > 1 ? `${baseUrl}?page=1` : '#'}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed pointer-events-none' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Prima pagină"
      >
        <ChevronsLeft className="w-5 h-5" />
      </Link>

      <Link
        href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed pointer-events-none' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Pagina anterioară"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="flex items-center gap-1 mx-2">
        {visiblePages.map((page, index) => 
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
          ) : (
            <Link
              key={page}
              href={`${baseUrl}?page=${page}`}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      <Link
        href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed pointer-events-none' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Pagina următoare"
      >
        <ChevronRight className="w-5 h-5" />
      </Link>

      <Link
        href={currentPage < totalPages ? `${baseUrl}?page=${totalPages}` : '#'}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed pointer-events-none' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Ultima pagină"
      >
        <ChevronsRight className="w-5 h-5" />
      </Link>
    </nav>
  );
}

export default async function OrdineDeZiPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch paginated session announcements (source = 'sedinte')
  const sessionsResponse = await council.getSessionAnnouncements({ 
    page: currentPage, 
    limit: ITEMS_PER_PAGE 
  });
  const sessionsData = sessionsResponse.data;
  const totalPages = Math.ceil(sessionsResponse.count / ITEMS_PER_PAGE);

  // Translate session titles based on locale
  const sessions = await translateContentArray(
    sessionsData,
    ['title'],
    locale as 'ro' | 'hu' | 'en'
  );

  const pageLabels = {
    ro: {
      description: 'Ordinele de zi pentru ședințele Consiliului Local al Municipiului Salonta.',
      noSessions: 'Nu există ședințe disponibile.',
      viewDetails: 'Vezi detalii ședință',
    },
    hu: {
      description: 'Nagyszalonta Helyi Tanácsa üléseinek napirendjei.',
      noSessions: 'Nincsenek elérhető ülések.',
      viewDetails: 'Ülés részletei',
    },
    en: {
      description: 'Agendas for the sessions of the Local Council of Salonta Municipality.',
      noSessions: 'No sessions available.',
      viewDetails: 'View session details',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('ordineDezi') }
      ]} />
      <PageHeader titleKey="ordineDezi" icon="calendar" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {/* Sessions List */}
            {sessions.length > 0 ? (
              <>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                              <Calendar className="w-6 h-6 text-primary-700" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {session.title || formatDate(session.session_date)}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(session.session_date)}
                                </span>
                                {session.start_time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatTime(session.start_time)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/consiliul-local/ordine-de-zi/${session.slug}`}
                              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              {labels.viewDetails}
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  baseUrl={`/${locale}/consiliul-local/ordine-de-zi`}
                />
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noSessions}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
