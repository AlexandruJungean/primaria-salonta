import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/components/ui/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Pagination, PaginationInfo } from './pagination';
import { formatArticleDate } from '@/lib/utils/format-date';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { getNews } from '@/lib/supabase/services';

const ITEMS_PER_PAGE = 12;

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  anunturi: { ro: 'Anunț', hu: 'Hirdetmény', en: 'Announcement' },
  stiri: { ro: 'Știre', hu: 'Hír', en: 'News' },
  comunicate: { ro: 'Comunicat', hu: 'Közlemény', en: 'Press Release' },
  proiecte: { ro: 'Proiecte', hu: 'Projektek', en: 'Projects' },
  consiliu: { ro: 'Consiliu Local', hu: 'Helyi Tanács', en: 'Local Council' },
};

const CATEGORY_COLORS: Record<string, string> = {
  anunturi: 'bg-amber-100 text-amber-800',
  stiri: 'bg-blue-100 text-blue-800',
  comunicate: 'bg-green-100 text-green-800',
  proiecte: 'bg-purple-100 text-purple-800',
  consiliu: 'bg-red-100 text-red-800',
};

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
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');
  
  // Parse page number
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  
  // Fetch news from database with pagination
  const { data: news, count, totalPages } = await getNews({ 
    page: currentPage, 
    limit: ITEMS_PER_PAGE,
    category: category as 'anunturi' | 'stiri' | 'comunicate' | 'proiecte' | 'consiliu' | undefined,
  });

  // Build base path for pagination links
  const basePath = category ? `/stiri?category=${category}` : '/stiri';

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

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link
              href="/stiri"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Toate
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([key, labels]) => (
              <Link
                key={key}
                href={`/stiri?category=${key}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === key 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {labels[locale] || labels.ro}
              </Link>
            ))}
          </div>

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
                  <Card key={item.id} hover className="overflow-hidden group">
                    <CardImage>
                      <Image
                        src={item.featured_image || '/images/primaria-salonta-1.webp'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </CardImage>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge 
                          variant="default"
                          className={CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-800'}
                        >
                          {CATEGORY_LABELS[item.category]?.[locale] || item.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatArticleDate(item.published_at || item.created_at, locale as 'ro' | 'hu' | 'en')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {item.excerpt || ''}
                      </p>
                      <Link
                        href={`/stiri/${item.slug}`}
                        className="text-primary-700 font-medium text-sm hover:text-primary-900 inline-flex items-center gap-1 group/link"
                      >
                        {tCommon('readMore')}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </CardContent>
                  </Card>
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
