'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Video, ExternalLink, Play, Info } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { WEBCAMS } from '@/lib/constants/webcams';

export default function WebcamsPage() {
  const t = useTranslations('webcams');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  return (
    <>
      <Breadcrumbs items={[{ label: t('title') }]} />

      <Section background="white">
        <Container>
          <SectionHeader title={t('title')} subtitle={t('subtitle')} />

          {/* Info Banner */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">{t('viewingInfo')}</p>
                <p>{t('viewingInfoDesc')}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {WEBCAMS.map((webcam) => (
              <Card key={webcam.id} className="overflow-hidden">
                {/* Webcam Thumbnail with Link */}
                <a
                  href={webcam.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-video bg-gray-900 relative group"
                  aria-label={`${webcam.translations[locale].title} - ${t('watchLive')}`}
                >
                  <Image
                    src={webcam.thumbnailUrl}
                    alt={webcam.translations[locale].title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-all group-hover:scale-110">
                      <Play className="w-10 h-10 text-primary-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white font-medium">
                    <Video className="w-5 h-5" />
                    <span>LIVE</span>
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4" />
                    {t('openInNewTab')}
                  </div>
                </a>

                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {webcam.translations[locale].title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {webcam.translations[locale].description}
                      </p>
                      <a
                        href={webcam.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-700 font-medium text-sm hover:text-primary-900 mt-3"
                      >
                        {t('watchLive')}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* VLC Note */}
          <div className="mt-8 text-center text-gray-600">
            <p>
              {t('vlcNote')}{' '}
              <a
                href="https://www.videolan.org/vlc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:underline"
              >
                {t('vlcLink')}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
