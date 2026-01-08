import { getTranslations } from 'next-intl/server';
import { GraduationCap, MapPin, Phone, Mail, Clock, ExternalLink, Users } from 'lucide-react';
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
  subcategory: string | null;
  is_active: boolean;
  sort_order: number;
}

async function getEducationInstitutions(): Promise<Institution[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('category', 'educatie')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching education institutions:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'educatie',
    locale: locale as Locale,
    path: '/educatie',
  });
}

export default async function EducatiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'educatiePage' });

  const institutions = await getEducationInstitutions();

  // Group by subcategory
  const grouped = institutions.reduce((acc, inst) => {
    const sub = inst.subcategory || 'altele';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(inst);
    return acc;
  }, {} as Record<string, Institution[]>);

  const pageLabels = {
    ro: {
      noInstitutions: 'Nu există instituții de învățământ disponibile.',
      gradinite: 'Grădinițe',
      scoli: 'Școli',
      licee: 'Licee',
      altele: 'Alte instituții',
    },
    hu: {
      noInstitutions: 'Nincsenek elérhető oktatási intézmények.',
      gradinite: 'Óvodák',
      scoli: 'Iskolák',
      licee: 'Középiskolák',
      altele: 'Egyéb intézmények',
    },
    en: {
      noInstitutions: 'No educational institutions available.',
      gradinite: 'Kindergartens',
      scoli: 'Schools',
      licee: 'High schools',
      altele: 'Other institutions',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const subcategoryLabels: Record<string, string> = {
    gradinite: labels.gradinite,
    scoli: labels.scoli,
    licee: labels.licee,
    altele: labels.altele,
  };

  return (
    <>
      <Breadcrumbs items={[{ label: t('educatie') }]} />
      <PageHeader titleKey="educatie" icon="graduationCap" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {institutions.length > 0 ? (
              <div className="space-y-10">
                {Object.entries(grouped).map(([subcategory, insts]) => (
                  <div key={subcategory}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary-600" />
                      {subcategoryLabels[subcategory] || subcategory}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {insts.map((institution) => (
                        <Card key={institution.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{institution.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
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
                                  <a href={`mailto:${institution.email}`} className="text-primary-600 hover:text-primary-800 break-all">
                                    {institution.email}
                                  </a>
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
                  </div>
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
