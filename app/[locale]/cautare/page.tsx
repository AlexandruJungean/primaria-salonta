import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SearchResults } from './search-results';
import { generatePageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'search',
    locale: locale as Locale,
    path: '/cautare',
  });
}

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q: query } = await searchParams;
  const t = await getTranslations('search');

  return (
    <>
      <Breadcrumbs items={[{ label: t('title') }]} />
      
      <Section background="gray">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('title')}
            </h1>
            {query && (
              <p className="text-gray-600 mb-8">
                {t('resultsFor')}: <span className="font-semibold">"{query}"</span>
              </p>
            )}
            
            <SearchResults query={query || ''} locale={locale} />
          </div>
        </Container>
      </Section>
    </>
  );
}
