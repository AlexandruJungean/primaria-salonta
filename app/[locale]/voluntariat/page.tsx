import { getTranslations } from 'next-intl/server';
import { Heart, Users, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { createAnonServerClient } from '@/lib/supabase/server';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  sort_order: number;
}

async function getVolunteerOpportunities(): Promise<VolunteerOpportunity[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('volunteer_opportunities')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching volunteer opportunities:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'voluntariat',
    locale: locale as Locale,
    path: '/voluntariat',
  });
}

export default async function VoluntariatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'voluntariatPage' });

  const opportunities = await getVolunteerOpportunities();

  const pageLabels = {
    ro: {
      noOpportunities: 'Nu există oportunități de voluntariat disponibile momentan.',
      contactTitle: 'Vrei să faci voluntariat?',
      contactText: 'Contactează-ne pentru mai multe informații despre oportunitățile de voluntariat.',
      contact: 'Contactează-ne',
      requirements: 'Cerințe',
      location: 'Locație',
      period: 'Perioada',
    },
    hu: {
      noOpportunities: 'Jelenleg nincsenek elérhető önkéntes lehetőségek.',
      contactTitle: 'Szeretnél önkéntes lenni?',
      contactText: 'Lépj kapcsolatba velünk az önkéntes lehetőségekről szóló további információkért.',
      contact: 'Kapcsolat',
      requirements: 'Követelmények',
      location: 'Helyszín',
      period: 'Időszak',
    },
    en: {
      noOpportunities: 'No volunteer opportunities available at the moment.',
      contactTitle: 'Want to volunteer?',
      contactText: 'Contact us for more information about volunteer opportunities.',
      contact: 'Contact us',
      requirements: 'Requirements',
      location: 'Location',
      period: 'Period',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <>
      <Breadcrumbs items={[{ label: t('voluntariat') }]} />
      <PageHeader titleKey="voluntariat" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {opportunities.length > 0 ? (
              <div className="space-y-6">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                          <Heart className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          {opportunity.location && (
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                              <MapPin className="w-4 h-4" />
                              {opportunity.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {opportunity.description && (
                        <div 
                          className="text-gray-600 mb-4 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: opportunity.description }}
                        />
                      )}
                      
                      {opportunity.requirements && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{labels.requirements}</h4>
                          <div 
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: opportunity.requirements }}
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {(opportunity.start_date || opportunity.end_date) && (
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(opportunity.start_date)} - {formatDate(opportunity.end_date) || '...'}
                          </span>
                        )}
                        {opportunity.contact_email && (
                          <a href={`mailto:${opportunity.contact_email}`} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-800">
                            <Mail className="w-4 h-4" />
                            {opportunity.contact_email}
                          </a>
                        )}
                        {opportunity.contact_phone && (
                          <a href={`tel:${opportunity.contact_phone}`} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-800">
                            <Phone className="w-4 h-4" />
                            {opportunity.contact_phone}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noOpportunities}
              </div>
            )}

            {/* Contact CTA */}
            <Card className="mt-8 bg-rose-50 border-rose-100">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{labels.contactTitle}</h3>
                <p className="text-gray-600 mb-4">{labels.contactText}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
                >
                  {labels.contact}
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
