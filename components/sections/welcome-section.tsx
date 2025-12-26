'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { MapPin, Users, Building2, Landmark } from 'lucide-react';

export function WelcomeSection() {
  const t = useTranslations('welcome');

  return (
    <Section background="white" className="py-12 md:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Main Welcome */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('intro')}
            </p>
          </div>

          {/* Description Paragraphs */}
          <div className="prose prose-lg max-w-none text-gray-700 mb-10">
            <p>{t('paragraph1')}</p>
            <p>{t('paragraph2')}</p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('location')}</h3>
              <p className="text-sm text-gray-600">{t('locationDesc')}</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('community')}</h3>
              <p className="text-sm text-gray-600">{t('communityDesc')}</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('services')}</h3>
              <p className="text-sm text-gray-600">{t('servicesDesc')}</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Landmark className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('heritage')}</h3>
              <p className="text-sm text-gray-600">{t('heritageDesc')}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

