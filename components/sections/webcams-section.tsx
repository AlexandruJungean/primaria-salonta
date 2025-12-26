'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Video, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { WEBCAMS } from '@/lib/constants/webcams';

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
            <Card key={webcam.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                {/* Webcam embed - using iframe */}
                <iframe
                  src={webcam.streamUrl}
                  title={webcam.translations[locale].title}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  loading="lazy"
                />
                {/* Overlay with camera icon for when stream is loading */}
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-0">
                  <Video className="w-12 h-12 text-white/50" />
                </div>
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
          ))}
        </div>
      </Container>
    </Section>
  );
}

