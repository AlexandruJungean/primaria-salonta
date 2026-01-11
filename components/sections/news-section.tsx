'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/components/ui/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatArticleDate } from '@/lib/utils/format-date';
import type { News } from '@/lib/types/database';

interface NewsSectionProps {
  news?: News[];
}

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
                      {formatArticleDate(item.published_at || item.created_at, locale)}
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
