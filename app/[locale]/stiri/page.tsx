import { useTranslations, useLocale } from 'next-intl';
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

// Mock news data - will be replaced with Supabase data
const MOCK_NEWS = [
  {
    id: '1',
    slug: 'despre-violenta-domestica',
    image: '/images/primaria-salonta-1.webp',
    date: '2025-11-11',
    category: 'anunturi',
    translations: {
      ro: { title: 'Despre violența domestică', excerpt: 'Informare despre violența domestică și resurse de ajutor disponibile pentru victimele acesteia.' },
      hu: { title: 'A családon belüli erőszakról', excerpt: 'Tájékoztatás a családon belüli erőszakról és az áldozatok számára elérhető segítő erőforrásokról.' },
      en: { title: 'About domestic violence', excerpt: 'Information about domestic violence and help resources available for victims.' },
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
      ro: { title: 'Subvenții sociale pentru anul 2026', excerpt: 'Anunț de participare și regulament pentru subvențiile sociale acordate de Primăria Municipiului Salonta.' },
      hu: { title: 'Szociális támogatások 2026-ra', excerpt: 'Részvételi felhívás és szabályzat a Nagyszalontai Polgármesteri Hivatal által nyújtott szociális támogatásokhoz.' },
      en: { title: 'Social subsidies for 2026', excerpt: 'Participation announcement and regulations for social subsidies granted by Salonta City Hall.' },
    },
  },
  {
    id: '4',
    slug: 'sedinta-consiliu-local-decembrie',
    image: '/images/sedinta-consiliu-salonta-2.webp',
    date: '2025-12-10',
    category: 'consiliu',
    translations: {
      ro: { title: 'Ședința Consiliului Local - Decembrie 2025', excerpt: 'Convocarea ședinței ordinare a Consiliului Local al Municipiului Salonta.' },
      hu: { title: 'Helyi Tanács ülése - 2025 december', excerpt: 'Nagyszalonta Helyi Tanácsának rendes ülésének összehívása.' },
      en: { title: 'Local Council Meeting - December 2025', excerpt: 'Convocation of the regular meeting of the Local Council of Salonta Municipality.' },
    },
  },
  {
    id: '5',
    slug: 'program-sarbatori-2025',
    image: '/images/primaria-salonta-1.webp',
    date: '2025-12-20',
    category: 'anunturi',
    translations: {
      ro: { title: 'Program în perioada sărbătorilor de iarnă', excerpt: 'Programul de funcționare al Primăriei Municipiului Salonta în perioada sărbătorilor.' },
      hu: { title: 'Téli ünnepek alatti nyitvatartás', excerpt: 'Nagyszalonta Polgármesteri Hivatalának nyitvatartása az ünnepek alatt.' },
      en: { title: 'Schedule during winter holidays', excerpt: 'Operating schedule of Salonta City Hall during the holiday season.' },
    },
  },
  {
    id: '6',
    slug: 'proiect-modernizare-parc',
    image: '/images/parc-salonta-1.webp',
    date: '2025-09-15',
    category: 'proiecte',
    translations: {
      ro: { title: 'Proiect de modernizare a parcului central', excerpt: 'Detalii despre proiectul de modernizare și reamenajare a parcului central.' },
      hu: { title: 'A központi park korszerűsítési projektje', excerpt: 'Részletek a központi park korszerűsítési és átrendezési projektjéről.' },
      en: { title: 'Central park modernization project', excerpt: 'Details about the modernization and redevelopment project of the central park.' },
    },
  },
];

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

export default function NewsPage() {
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  const categoryLabels: Record<string, Record<string, string>> = {
    anunturi: { ro: 'Anunț', hu: 'Hirdetmény', en: 'Announcement' },
    consiliu: { ro: 'Consiliu Local', hu: 'Helyi Tanács', en: 'Local Council' },
    proiecte: { ro: 'Proiecte', hu: 'Projektek', en: 'Projects' },
  };

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_NEWS.map((news) => (
              <Card key={news.id} hover className="overflow-hidden group">
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
                      {categoryLabels[news.category]?.[locale] || news.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatArticleDate(news.date, locale)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {news.translations[locale].title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {news.translations[locale].excerpt}
                  </p>
                  <Link
                    href={`/stiri/${news.slug}`}
                    className="text-primary-700 font-medium text-sm hover:text-primary-900 inline-flex items-center gap-1 group/link"
                  >
                    {tCommon('readMore')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

