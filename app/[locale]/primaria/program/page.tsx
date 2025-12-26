import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, Calendar, MapPin, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PUBLIC_HOURS } from '@/lib/constants/public-hours';
import { LEADERSHIP } from '@/lib/constants/leadership';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'publicHours' });
  return {
    title: t('title'),
  };
}

export default function PublicHoursPage() {
  const t = useTranslations('publicHours');
  const tNav = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  const translations = PUBLIC_HOURS.translations[locale];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tNav('primaria'), href: '/primaria' },
          { label: tNav('program') },
        ]}
      />

      <Section background="white">
        <Container>
          <SectionHeader title={translations.title} />

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  {translations.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PUBLIC_HOURS.offices.map((office) => (
                    <div
                      key={office.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {office.translations[locale].name}
                        </h4>
                        {office.room && (
                          <p className="text-sm text-gray-500">
                            {translations.room} {office.room} - {translations.floor}
                          </p>
                        )}
                        <div className="mt-1 space-y-0.5">
                          {office.hours.map((hours, idx) => (
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

            {/* Audience Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  {translations.audienceTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LEADERSHIP.map((leader) => (
                    <div
                      key={leader.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary-700 font-bold">
                          {leader.translations[locale].name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {leader.translations[locale].position}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {leader.translations[locale].name}
                        </p>
                        <p className="text-sm text-primary-700 font-medium mt-1">
                          {leader.translations[locale].audienceSchedule}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Registration Note */}
                <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      {translations.registrationNote}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

