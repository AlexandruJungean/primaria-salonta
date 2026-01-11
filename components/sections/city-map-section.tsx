'use client';

import { useTranslations } from 'next-intl';
import { Map, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

export function CityMapSection() {
  const t = useTranslations('homepage');

  return (
    <Section background="gradient">
      <Container>
        {/* Hero Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* Map Preview Image */}
          <div className="relative h-[400px] bg-gradient-to-br from-primary-600 to-primary-800">
            <div className="absolute inset-0 bg-[url('/images/primaria-salonta-1.webp')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <Map className="w-20 h-20 mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                {t('cityMap')}
              </h2>
              <p className="text-xl text-white/80 mb-8 text-center max-w-2xl">
                {t('cityMapSubtitle')}
              </p>
              <a 
                href="https://salonta-city.map2web.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg"
              >
                <ExternalLink className="w-6 h-6" />
                {t('openMap')}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
