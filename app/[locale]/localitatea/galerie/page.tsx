import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'galerie',
    locale: locale as Locale,
    path: '/localitatea/galerie',
  });
}

const GALLERY_IMAGES = [
  { src: '/images/primaria-salonta-1.jpg', alt: 'Primăria Salonta' },
  { src: '/images/primaria-salonta-2.jpg', alt: 'Primăria Salonta' },
  { src: '/images/muzeu-salonta.jpg', alt: 'Complexul Muzeal Arany János' },
  { src: '/images/casa-de-cultura-salonta-1.jpg', alt: 'Casa de Cultură' },
  { src: '/images/casa-memoriala-salonta-1.jpg', alt: 'Casa Memorială' },
  { src: '/images/parc-salonta-1.jpg', alt: 'Parc Salonta' },
  { src: '/images/parc-salonta-2.jpg', alt: 'Parc Salonta' },
  { src: '/images/bazin-de-inot-salonta-1.jpeg', alt: 'Bazin de Înot' },
  { src: '/images/aquapark-salonta-1.jpg', alt: 'Aquapark Salonta' },
  { src: '/images/biserica-salonta-3.jpg', alt: 'Biserica Salonta' },
  { src: '/images/liceul-arany-janos-salonta-1.jpg', alt: 'Liceul Arany János' },
  { src: '/images/cladire-dropii-salonta-2.jpg', alt: 'Cuibul Dropiei' },
];

export default function GaleriePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('galerie') }
      ]} />
      <PageHeader titleKey="galerie" icon="image" />

      <Section background="white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <span className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

