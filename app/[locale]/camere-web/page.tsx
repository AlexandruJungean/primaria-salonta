import { getTranslations } from 'next-intl/server';
import { Video, MapPin, RefreshCw, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { createAnonServerClient } from '@/lib/supabase/server';
import Image from 'next/image';

interface Webcam {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  stream_url: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

async function getWebcams(): Promise<Webcam[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('webcams')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching webcams:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'camereWeb',
    locale: locale as Locale,
    path: '/camere-web',
  });
}

export default async function CamereWebPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'camereWebPage' });

  const webcams = await getWebcams();

  const pageLabels = {
    ro: {
      noWebcams: 'Nu există camere web disponibile.',
      liveView: 'Vezi live',
      location: 'Locație',
    },
    hu: {
      noWebcams: 'Nincsenek elérhető webkamerák.',
      liveView: 'Élő közvetítés',
      location: 'Helyszín',
    },
    en: {
      noWebcams: 'No webcams available.',
      liveView: 'View live',
      location: 'Location',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('camereWeb') }]} />
      <PageHeader titleKey="camereWeb" icon="video" />

      <Section background="white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {webcams.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webcams.map((webcam) => (
                  <Card key={webcam.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Webcam Preview */}
                    <div className="relative aspect-video bg-gray-900">
                      {webcam.image_url ? (
                        <Image
                          src={webcam.image_url}
                          alt={webcam.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          LIVE
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{webcam.name}</h3>
                      {webcam.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                          <MapPin className="w-4 h-4" />
                          {webcam.location}
                        </p>
                      )}
                      {webcam.description && (
                        <p className="text-sm text-gray-600 mb-4">{webcam.description}</p>
                      )}
                      {webcam.stream_url && (
                        <a
                          href={webcam.stream_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {labels.liveView}
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noWebcams}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
