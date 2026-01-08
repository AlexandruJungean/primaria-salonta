import { getTranslations } from 'next-intl/server';
import { Bus, MapPin, Phone, Clock, ExternalLink, Train, Car } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { createAnonServerClient } from '@/lib/supabase/server';

interface Institution {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  schedule: string | null;
  category: string;
  is_active: boolean;
  sort_order: number;
}

async function getTransportInfo(): Promise<Institution[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('category', 'transport')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching transport info:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'transport',
    locale: locale as Locale,
    path: '/transport',
  });
}

export default async function TransportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'transportPage' });

  const transportInfo = await getTransportInfo();

  const pageLabels = {
    ro: {
      noInfo: 'Nu există informații de transport disponibile.',
      schedule: 'Program',
    },
    hu: {
      noInfo: 'Nincsenek elérhető közlekedési információk.',
      schedule: 'Menetrend',
    },
    en: {
      noInfo: 'No transport information available.',
      schedule: 'Schedule',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('transport') }]} />
      <PageHeader titleKey="transport" icon="bus" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {transportInfo.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {transportInfo.map((info) => (
                  <Card key={info.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Bus className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{info.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {info.description && (
                        <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {info.address && (
                          <p className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            {info.address}
                          </p>
                        )}
                        {info.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${info.phone}`} className="text-primary-600 hover:text-primary-800">
                              {info.phone}
                            </a>
                          </p>
                        )}
                        {info.schedule && (
                          <p className="flex items-start gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            {info.schedule}
                          </p>
                        )}
                        {info.website && (
                          <a 
                            href={info.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noInfo}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
