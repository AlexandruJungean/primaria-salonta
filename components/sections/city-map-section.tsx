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
          {/* Map Preview - using gradient pattern instead of heavy background image for performance */}
          <div className="relative h-[400px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
            {/* Decorative pattern overlay for visual interest */}
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }} />
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
