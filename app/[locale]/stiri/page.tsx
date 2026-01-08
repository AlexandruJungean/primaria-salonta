import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/components/ui/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { formatArticleDate } from '@/lib/utils/format-date';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { getNews } from '@/lib/supabase/services';

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  anunturi: { ro: 'Anunț', hu: 'Hirdetmény', en: 'Announcement' },
  stiri: { ro: 'Știre', hu: 'Hír', en: 'News' },
  comunicate: { ro: 'Comunicat', hu: 'Közlemény', en: 'Press Release' },
  proiecte: { ro: 'Proiecte', hu: 'Projektek', en: 'Projects' },
  consiliu: { ro: 'Consiliu Local', hu: 'Helyi Tanács', en: 'Local Council' },
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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');
  
  // Fetch news from database
  const { data: news } = await getNews({ limit: 20 });

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
            <div className="text-center py-12 text-gray-500">
              <p>Nu există știri disponibile momentan.</p>
            </div>
          ) : (
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
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default">
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
          )}
        </Container>
      </Section>
    </>
  );
}
