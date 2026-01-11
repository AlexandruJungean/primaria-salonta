'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { MapPin, Users, Landmark } from 'lucide-react';

export function AboutSection() {
  const t = useTranslations('about');

  const highlights = [
    { icon: MapPin, labelKey: 'location' },
    { icon: Users, labelKey: 'population' },
  ];

  return (
    <Section background="gray">
      <Container>
        {/* Content Grid - 35/65 split on desktop */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
          {/* Image - Left side */}
          <div className="relative mx-auto lg:mx-0">
            <div className="relative w-64 lg:w-[300px] aspect-[3/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/primaria-salonta-6.webp"
                alt="Primăria Municipiului Salonta"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 256px, 300px"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-600/10 rounded-full -z-10" />
          </div>

          {/* Text Content - Right side */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Landmark className="w-4 h-4" />
                {t('badge')}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t('title')}
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>
              <p>{t('paragraph3')}</p>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 mt-8">
              {highlights.map(({ icon: Icon, labelKey }) => (
                <div 
                  key={labelKey}
                  className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {t(`highlights.${labelKey}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
