'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Video, ExternalLink, Play } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';

interface Webcam {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  stream_url: string | null;
  image_url: string | null;
}

function WebcamCard({ webcam }: { webcam: Webcam }) {
  const t = useTranslations('webcams');

  return (
    <Card className="overflow-hidden">
      <a
        href={webcam.stream_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video bg-gray-900 relative group"
        aria-label={`${webcam.name} - Click to watch live`}
      >
        {webcam.image_url ? (
          <Image
            src={webcam.image_url}
            alt={webcam.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-600" />
          </div>
        )}
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
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {t('openInNewTab')}
        </div>
      </a>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {webcam.name}
        </h3>
        {webcam.description && (
          <p className="text-gray-600 text-sm mb-3">
            {webcam.description}
          </p>
        )}
        {webcam.stream_url && (
          <a
            href={webcam.stream_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 font-medium text-sm hover:text-primary-900 inline-flex items-center gap-1"
          >
            {t('watchLive')}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}

interface WebcamsSectionProps {
  webcams: Webcam[];
}

export function WebcamsSection({ webcams }: WebcamsSectionProps) {
  const t = useTranslations('webcams');
  const tHomepage = useTranslations('homepage');

  if (webcams.length === 0) {
    return null;
  }

  return (
    <Section background="white">
      <Container>
        <SectionHeader title={tHomepage('liveWebcams')} subtitle={t('subtitle')} />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {webcams.map((webcam) => (
            <WebcamCard key={webcam.id} webcam={webcam} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
