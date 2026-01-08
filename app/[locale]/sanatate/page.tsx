import { getTranslations } from 'next-intl/server';
import { Heart, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
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

async function getHealthInstitutions(): Promise<Institution[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('category', 'sanatate')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching health institutions:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'sanatate',
    locale: locale as Locale,
    path: '/sanatate',
  });
}

export default async function SanatatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'sanatatePage' });

  const institutions = await getHealthInstitutions();

  const pageLabels = {
    ro: {
      noInstitutions: 'Nu există instituții de sănătate disponibile.',
      emergencyTitle: 'Numere de urgență',
      emergency112: '112 - Număr unic de urgență',
      ambulance: '112 - Ambulanța',
    },
    hu: {
      noInstitutions: 'Nincsenek elérhető egészségügyi intézmények.',
      emergencyTitle: 'Vészhelyzeti számok',
      emergency112: '112 - Egységes segélyhívó szám',
      ambulance: '112 - Mentők',
    },
    en: {
      noInstitutions: 'No health institutions available.',
      emergencyTitle: 'Emergency numbers',
      emergency112: '112 - Single emergency number',
      ambulance: '112 - Ambulance',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('sanatate') }]} />
      <PageHeader titleKey="sanatate" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Emergency Numbers Card */}
            <Card className="mb-8 bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {labels.emergencyTitle}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-red-100">
                    <p className="font-bold text-2xl text-red-600">112</p>
                    <p className="text-sm text-gray-600">{labels.ambulance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {institutions.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {institutions.map((institution) => (
                  <Card key={institution.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                          <Heart className="w-6 h-6 text-rose-600" />
                        </div>
                        <CardTitle className="text-lg">{institution.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {institution.description && (
                        <p className="text-gray-600 text-sm mb-4">{institution.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {institution.address && (
                          <p className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            {institution.address}
                          </p>
                        )}
                        {institution.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${institution.phone}`} className="text-primary-600 hover:text-primary-800">
                              {institution.phone}
                            </a>
                          </p>
                        )}
                        {institution.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a href={`mailto:${institution.email}`} className="text-primary-600 hover:text-primary-800">
                              {institution.email}
                            </a>
                          </p>
                        )}
                        {institution.schedule && (
                          <p className="flex items-start gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            {institution.schedule}
                          </p>
                        )}
                        {institution.website && (
                          <a 
                            href={institution.website}
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
                {labels.noInstitutions}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
