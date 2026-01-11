import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { ImageGallery } from '@/components/ui/image-gallery';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as pageImages from '@/lib/supabase/services/page-images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'galerie',
    locale: locale as Locale,
    path: '/localitatea/galerie',
  });
}

export default async function GaleriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch gallery images from database
  const images = await pageImages.getPageImages('galerie');

  const pageLabels = {
    ro: {
      noImages: 'Nu există imagini în galerie momentan.',
      description: 'Galerie foto cu imagini din Municipiul Salonta - clădiri istorice, parcuri, instituții și locuri de interes.',
    },
    hu: {
      noImages: 'Jelenleg nincsenek képek a galériában.',
      description: 'Fotógaléria Nagyszalonta településről - történelmi épületek, parkok, intézmények és látnivalók.',
    },
    en: {
      noImages: 'No images in the gallery at the moment.',
      description: 'Photo gallery with images from Salonta Municipality - historic buildings, parks, institutions and places of interest.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('galerie') }
      ]} />
      <PageHeader titleKey="galerie" icon="image" />

      <Section background="white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {images.length > 0 ? (
              <ImageGallery images={images} columns={4} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noImages}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
