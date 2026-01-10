import { getTranslations } from 'next-intl/server';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { getSessionsWithDecisionsCount } from '@/lib/supabase/services';

const ITEMS_PER_PAGE = 20;

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Pages on each side of current
    const pages: (number | 'ellipsis')[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis');
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis');
    }
    
    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Navigare pagini">
      {/* First page */}
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

      {/* Previous page */}
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

      {/* Page numbers */}
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

      {/* Next page */}
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

      {/* Last page */}
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

export default async function HotarariPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  
  const t = await getTranslations('navigation');
  const th = await getTranslations('hotarariPage');

  // Fetch paginated sessions with decisions count from database
  const { sessions, totalPages } = await getSessionsWithDecisionsCount({
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('hotarari') }
      ]} />
      <PageHeader titleKey="hotarari" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {th('description')}
            </p>

            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nu există ședințe disponibile momentan.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <Card key={session.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <Link
                          href={`/consiliul-local/hotarari/${session.slug}`}
                          className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                                <Calendar className="w-6 h-6 text-primary-700" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {formatDate(session.session_date, locale)}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {th('procesVerbal', { date: formatShortDate(session.session_date) })}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                  {session.decisions_count > 0 
                                    ? `${session.decisions_count} hotărâri adoptate`
                                    : 'Nu există hotărâri pentru această ședință'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm text-primary-700 font-medium hidden sm:block">
                                {th('continueReading')}
                              </span>
                              <ArrowRight className="w-5 h-5 text-primary-600" />
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  baseUrl={`/${locale}/consiliul-local/hotarari`}
                />
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
