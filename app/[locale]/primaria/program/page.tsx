import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, MapPin, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PUBLIC_HOURS } from '@/lib/constants/public-hours';

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

          <div className="max-w-3xl mx-auto">
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

            {/* Temporary Location Notice */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">{t('temporaryNotice')}</h3>
                    <p className="text-sm text-blue-800">
                      {t('temporaryNoticeText')}
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
