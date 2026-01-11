import { Clock, MapPin, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as officeHoursService from '@/lib/supabase/services/office-hours';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'program',
    locale: locale as Locale,
    path: '/primaria/program',
  });
}

// Fallback translations in case database is empty
const FALLBACK = {
  title: 'Program cu publicul',
  room: 'Camera',
  floor: 'Parter',
  temporaryNotice: 'Informație importantă',
  temporaryNoticeText: 'Pe durata lucrărilor de reabilitare a clădirii Primăriei, programul cu publicul poate suferi modificări.',
  noData: 'Nu există informații despre programul cu publicul momentan.',
};

// Breadcrumb translations
const NAV_TRANSLATIONS = {
  ro: { primaria: 'Primăria', program: 'Program' },
  hu: { primaria: 'Polgármesteri Hivatal', program: 'Ügyfélfogadás' },
  en: { primaria: 'City Hall', program: 'Public Hours' },
};

export default async function PublicHoursPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const currentLocale = (locale as 'ro' | 'hu' | 'en') || 'ro';
  
  // Fetch data from database
  const [officeHours, pageSettings] = await Promise.all([
    officeHoursService.getOfficeHours(),
    officeHoursService.getPageSettings('program'),
  ]);

  // Get content - from database if available, fallback otherwise
  const content = pageSettings?.content || FALLBACK;
  const nav = NAV_TRANSLATIONS[currentLocale];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: nav.primaria, href: '/primaria' },
          { label: nav.program },
        ]}
      />

      <Section background="white">
        <Container>
          <SectionHeader title={content.title || FALLBACK.title} />

          <div className="max-w-3xl mx-auto">
            {officeHours.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>{content.noData || FALLBACK.noData}</p>
              </div>
            ) : (
              <>
                {/* Office Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-600" />
                      {content.title || FALLBACK.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {officeHours.map((office) => (
                        <div
                          key={office.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                        >
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {office.name}
                            </h4>
                            {office.room && (
                              <p className="text-sm text-gray-500">
                                {content.room || FALLBACK.room} {office.room} - {content.floor || FALLBACK.floor}
                              </p>
                            )}
                            <div className="mt-1 space-y-0.5">
                              {(office.hours as officeHoursService.OfficeHourEntry[]).map((hours, idx) => (
                                <p key={idx} className="text-sm text-primary-700 font-medium">
                                  {hours.days}: {hours.from} - {hours.to}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Temporary Location Notice */}
                {content.temporaryNoticeText && (
                  <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1">
                            {content.temporaryNotice || FALLBACK.temporaryNotice}
                          </h3>
                          <p className="text-sm text-blue-800">
                            {content.temporaryNoticeText}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
