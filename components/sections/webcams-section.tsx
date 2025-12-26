'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Video, ExternalLink, Play } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { WEBCAMS } from '@/lib/constants/webcams';

function WebcamCard({ webcam, locale }: { webcam: typeof WEBCAMS[0]; locale: 'ro' | 'hu' | 'en' }) {
  const t = useTranslations('webcams');
  const [showEmbed, setShowEmbed] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        {showEmbed && !hasError ? (
          <iframe
            src={webcam.embedUrl}
            title={webcam.translations[locale].title}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : (
          // Thumbnail with play button - click to load stream
          <button
            onClick={() => setShowEmbed(true)}
            className="w-full h-full relative group"
            aria-label={`${webcam.translations[locale].title} - Click to play`}
          >
            <Image
              src={webcam.thumbnailUrl}
              alt={webcam.translations[locale].title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-all group-hover:scale-110">
                <Play className="w-8 h-8 text-primary-900 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm font-medium">
              <Video className="w-4 h-4" />
              <span>LIVE</span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </button>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {webcam.translations[locale].title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {webcam.translations[locale].description}
        </p>
        <a
          href={webcam.streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 font-medium text-sm hover:text-primary-900 inline-flex items-center gap-1"
        >
          {t('vlcNote')} {t('vlcLink')}
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>
  );
}

export function WebcamsSection() {
  const t = useTranslations('webcams');
  const tHomepage = useTranslations('homepage');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  return (
    <Section background="white">
      <Container>
        <SectionHeader title={tHomepage('liveWebcams')} subtitle={t('subtitle')} />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {WEBCAMS.map((webcam) => (
            <WebcamCard key={webcam.id} webcam={webcam} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

