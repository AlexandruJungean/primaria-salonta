import { getTranslations } from 'next-intl/server';
import { Trophy, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
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

async function getSportInstitutions(): Promise<Institution[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('category', 'sport')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching sport institutions:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'sport',
    locale: locale as Locale,
    path: '/sport',
  });
}

export default async function SportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'sportPage' });

  const institutions = await getSportInstitutions();

  const pageLabels = {
    ro: {
      noInstitutions: 'Nu există instituții sportive disponibile.',
      schedule: 'Program',
      contact: 'Contact',
    },
    hu: {
      noInstitutions: 'Nincsenek elérhető sportintézmények.',
      schedule: 'Nyitvatartás',
      contact: 'Kapcsolat',
    },
    en: {
      noInstitutions: 'No sport institutions available.',
      schedule: 'Schedule',
      contact: 'Contact',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('sport') }]} />
      <PageHeader titleKey="sport" icon="trophy" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {institutions.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {institutions.map((institution) => (
                  <Card key={institution.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <Trophy className="w-6 h-6 text-amber-600" />
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
