'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/components/ui/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatArticleDate } from '@/lib/utils/format-date';
import type { News } from '@/lib/types/database';

interface NewsSectionProps {
  news?: News[];
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  anunturi: { ro: 'Anunț', hu: 'Hirdetmény', en: 'Announcement' },
  stiri: { ro: 'Știre', hu: 'Hír', en: 'News' },
  comunicate: { ro: 'Comunicat', hu: 'Közlemény', en: 'Press Release' },
  proiecte: { ro: 'Proiect', hu: 'Projekt', en: 'Project' },
  consiliu: { ro: 'Consiliu Local', hu: 'Helyi Tanács', en: 'Local Council' },
};

export function NewsSection({ news = [] }: NewsSectionProps) {
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  // If no news provided, show empty state
  if (news.length === 0) {
    return (
      <Section background="gray">
        <Container>
          <SectionHeader title={t('latestNews')} />
          <div className="text-center py-12 text-gray-500">
            <p>Nu există știri recente.</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="gray">
      <Container>
        <SectionHeader title={t('latestNews')} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} hover className="overflow-hidden">
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
                    {formatArticleDate(item.published_at || item.created_at, locale)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {item.excerpt || ''}
                </p>
                <Link
                  href={`/stiri/${item.slug}`}
                  className="text-primary-700 font-medium text-sm hover:text-primary-900 inline-flex items-center gap-1 group"
                >
                  {tCommon('readMore')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/stiri" className="inline-flex items-center gap-2">
              {tCommon('seeAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
