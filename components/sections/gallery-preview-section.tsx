'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';

const GALLERY_IMAGES = [
  { src: '/images/primaria-salonta-1.webp', alt: 'Primăria Salonta' },
  { src: '/images/muzeu-salonta.webp', alt: 'Complexul Muzeal Arany János' },
  { src: '/images/casa-de-cultura-salonta-1.webp', alt: 'Casa de Cultură' },
  { src: '/images/parc-salonta-1.webp', alt: 'Parc Salonta' },
  { src: '/images/bazin-de-inot-salonta-1.webp', alt: 'Bazin de Înot' },
  { src: '/images/biserica-salonta-3.webp', alt: 'Biserica Salonta' },
];

export function GalleryPreviewSection() {
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');

  return (
    <Section background="gray">
      <Container>
        <SectionHeader 
          title={t('photoGallery')} 
          subtitle={t('photoGallerySubtitle')} 
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {GALLERY_IMAGES.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/localitatea/galerie" className="inline-flex items-center gap-2">
              {tCommon('seeAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

