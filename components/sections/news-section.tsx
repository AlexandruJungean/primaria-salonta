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

// Mock news data - will be replaced with Supabase data
const MOCK_NEWS = [
  {
    id: '1',
    slug: 'despre-violenta-domestica',
    image: '/images/primaria-salonta-1.webp',
    date: '2025-11-11',
    category: 'anunturi',
    translations: {
      ro: { title: 'Despre violența domestică', excerpt: 'Informare despre violența domestică și resurse de ajutor disponibile.' },
      hu: { title: 'A családon belüli erőszakról', excerpt: 'Tájékoztatás a családon belüli erőszakról és az elérhető segítő erőforrásokról.' },
      en: { title: 'About domestic violence', excerpt: 'Information about domestic violence and available help resources.' },
    },
  },
  {
    id: '2',
    slug: 'ajutor-incalzire-locuinta-2025',
    image: '/images/primaria-salonta-2.webp',
    date: '2025-10-31',
    category: 'anunturi',
    translations: {
      ro: { title: 'Ajutor pt. încălzirea locuinței – 2025', excerpt: 'Informare privind ajutorul de încălzire pentru sezonul rece 2025-2026.' },
      hu: { title: 'Lakásfűtési támogatás – 2025', excerpt: 'Tájékoztató a 2025-2026-os fűtési szezonra vonatkozó fűtési támogatásról.' },
      en: { title: 'Home heating assistance – 2025', excerpt: 'Information regarding heating assistance for the 2025-2026 cold season.' },
    },
  },
  {
    id: '3',
    slug: 'subventii-sociale-2026',
    image: '/images/sedinta-consiliu-salonta-1.webp',
    date: '2025-10-16',
    category: 'anunturi',
    translations: {
      ro: { title: 'Subvenții sociale pentru anul 2026', excerpt: 'Anunț de participare și regulament pentru subvențiile sociale.' },
      hu: { title: 'Szociális támogatások 2026-ra', excerpt: 'Részvételi felhívás és szabályzat a szociális támogatásokhoz.' },
      en: { title: 'Social subsidies for 2026', excerpt: 'Participation announcement and regulations for social subsidies.' },
    },
  },
];

export function NewsSection() {
  const t = useTranslations('homepage');
  const tNews = useTranslations('news');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  return (
    <Section background="gray">
      <Container>
        <SectionHeader title={t('latestNews')} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_NEWS.map((news) => (
            <Card key={news.id} hover className="overflow-hidden">
              <CardImage>
                <Image
                  src={news.image}
                  alt={news.translations[locale].title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </CardImage>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default">
                    {news.category === 'anunturi' ? 'Anunț' : news.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatArticleDate(news.date, locale)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {news.translations[locale].title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {news.translations[locale].excerpt}
                </p>
                <Link
                  href={`/stiri/${news.slug}`}
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

