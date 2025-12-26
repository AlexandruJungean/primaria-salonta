import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Video, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { WEBCAMS } from '@/lib/constants/webcams';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'webcams' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function WebcamsPage() {
  const t = useTranslations('webcams');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  return (
    <>
      <Breadcrumbs items={[{ label: t('title') }]} />

      <Section background="white">
        <Container>
          <SectionHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {WEBCAMS.map((webcam) => (
              <Card key={webcam.id} className="overflow-hidden">
                {/* Webcam Stream */}
                <div className="aspect-video bg-gray-900 relative">
                  <iframe
                    src={webcam.streamUrl}
                    title={webcam.translations[locale].title}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                  />
                </div>

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
                        Deschide în fereastră nouă
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

