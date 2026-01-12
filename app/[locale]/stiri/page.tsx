import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/components/ui/link';
import { Calendar, Newspaper } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Pagination, PaginationInfo } from './pagination';
import { formatArticleDate } from '@/lib/utils/format-date';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { getNews } from '@/lib/supabase/services';
import { translateContentArray } from '@/lib/google-translate/cache';

const ITEMS_PER_PAGE = 12;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'stiri',
    locale: locale as Locale,
    path: '/stiri',
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const t = await getTranslations('news');
  
  // Parse page number
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  
  // Fetch news from database with pagination
  const { data: newsData, count, totalPages } = await getNews({ 
    page: currentPage, 
    limit: ITEMS_PER_PAGE,
  });

  // Translate news titles and excerpts based on locale
  const news = await translateContentArray(
    newsData,
    ['title', 'excerpt'],
    locale as 'ro' | 'hu' | 'en'
  );

  // Build base path for pagination links
  const basePath = '/stiri';

  return (
    <>
      <WebPageJsonLd
        title="Știri și Anunțuri"
        description="Știri și anunțuri de la Primăria Municipiului Salonta"
        url="/stiri"
      />
      <Breadcrumbs items={[{ label: t('title') }]} />

      <Section background="gray">
        <Container>
          <SectionHeader title={t('title')} subtitle={t('subtitle')} />

          {news.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nu există știri disponibile momentan.</p>
            </div>
          ) : (
            <>
              {/* Pagination info */}
              {count > ITEMS_PER_PAGE && (
                <PaginationInfo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={count}
                  itemsPerPage={ITEMS_PER_PAGE}
                  className="mb-6"
                />
              )}

              {/* News grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Link key={item.id} href={`/stiri/${item.slug}`} className="block">
                    <Card hover className="overflow-hidden group h-full">
                      {item.featured_image && (
                        <CardImage>
                          <Image
                            src={item.featured_image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </CardImage>
                      )}
                      <CardContent className={item.featured_image ? 'pt-4' : ''}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatArticleDate(item.published_at || item.created_at, locale as 'ro' | 'hu' | 'en')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={basePath}
                  className="mt-10"
                />
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
