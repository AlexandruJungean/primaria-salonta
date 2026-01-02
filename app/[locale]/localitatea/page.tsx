import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { MapPin, Clock, Palette, Map, Image as ImageIcon, Eye, Globe, Award, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'localitatea',
    locale: locale as Locale,
    path: '/localitatea',
  });
}

const CITY_SECTIONS = [
  { id: 'localizare', href: '/localitatea/localizare', icon: MapPin },
  { id: 'istoric', href: '/localitatea/istoric', icon: Clock },
  { id: 'cultura', href: '/localitatea/cultura', icon: Palette },
  { id: 'hartaDigitala', href: '/localitatea/harta-digitala', icon: Map },
  { id: 'galerie', href: '/localitatea/galerie', icon: ImageIcon },
  { id: 'excursieVirtuala', href: '/localitatea/excursie-virtuala', icon: Eye },
  { id: 'oraseInfratite', href: '/localitatea/orase-infratite', icon: Globe },
  { id: 'cetateniOnoare', href: '/localitatea/cetateni-de-onoare', icon: Award },
  { id: 'economie', href: '/localitatea/economie', icon: TrendingUp },
];

export default function LocalitateaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('localitatea') }]} />
      <PageHeader titleKey="localitatea" icon="mapPin" />

      <Section background="white">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITY_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.id} href={section.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{t(section.id)}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

